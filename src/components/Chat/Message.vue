<template>
  <main
    class="
      flex flex-col
      h-screen
      max-h-screen
      bg-true-gray-900
      w-auto
      overflow-y-scroll
      justify-between
    "
  >
    <div class="flex-1 lg:px-5 lg:py-5">
      <div
        v-for="message in messagesList"
        :key="`${message.user.id} - ${message.timestamp}`"
        class="flex mb-5"
      >
        <img
          :src="message.user.avatar"
          alt="user avatar"
          class="lg:w-14 lg:h-14"
        />
        <div class="flex flex-col justify-between lg:ml-3">
          <h6 class="text-white text-base">
            <a href="#" class="text-light-blue-400 no-underline">{{
              message.user.name
            }}</a>
            <span
              >&nbsp; - &nbsp;{{
                transformTimestampFromNow(message.timestamp)
              }}</span
            >
          </h6>
          <p
            class="text-white text-lg leading-none break-all"
            v-if="message.content"
          >
            {{ message.content }}
          </p>
          <img :src="message.image" alt="image" v-else class="w-full" />
        </div>
      </div>
    </div>
    <div class="w-full relative lg:px-5" v-show="uploadStatus === 'uploading'">
      <progress
        :value="uploadProgress"
        max="100"
        min="0"
        class="w-full progress h-5"
      />
      <span
        class="
          transform
          top-1/2
          left-1/2
          -translate-x-1/2 -translate-y-1/2
          absolute
          text-sm text-white
          font-bold
        "
        >{{ uploadStatusText }}</span
      >
    </div>
    <form
      class="flex flex-wrap items-center relative lg:mx-5 lg:h-14"
      @submit.prevent.enter="sendMessage"
    >
      <input
        v-model.trim="message"
        type="text"
        class="
          border-none
          rounded-full
          flex-grow
          outline-none
          bg-gray-800
          text-white
          w-full
          lg:text-lg lg:h-10 lg:pl-5 lg:pr-24
        "
        placeholder="type message..."
      />
      <div
        class="
          bg-transparent
          border-none
          cursor-pointer
          outline-none
          transform
          top-1/2
          right-15
          -translate-y-1/2
          absolute
        "
      >
        <label
          for="file"
          class="cursor-pointer h-full w-full block"
          @click="clicked"
        >
          <Icon name="paperclip" class="fill-white lg:w-6 lg:h-6" />
        </label>
        <input
          type="file"
          name="file"
          id="file"
          accept=".jpg, .png"
          class="h-0 w-0 absolute overflow-hidden"
          @change="uploadFile"
          :disabled="uploadStatus === 'uploading'"
        />
      </div>
      <button
        class="
          bg-transparent
          border-none
          cursor-pointer
          outline-none
          transform
          top-1/2
          right-5
          -translate-y-1/2
          absolute
        "
        @click.prevent="sendMessage"
      >
        <Icon name="send" class="fill-white lg:w-6 lg:h-6" />
      </button>
    </form>
  </main>
</template>

<script lang="ts">
import Icon from '@/components/Icon.vue'
import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/storage'
import moment from 'moment'
import { v4 } from 'uuid'
import { key, Store } from '@/store'
import {
  computed,
  defineComponent,
  nextTick,
  onBeforeUnmount,
  reactive,
  ref,
  watch
} from 'vue'
import { useStore } from 'vuex'
import { Message } from '@/@types/chat'

export default defineComponent({
  name: 'Chat-Message',
  setup() {
    const store: Store = useStore(key)

    const user = computed(() => store.getters['GET_USER'])
    const currentChannel = computed(() => store.getters['GET_CURRENT_CHANNEL'])

    // send new message
    const message = ref('')
    const error = reactive([])
    const messageRef = firebase.database().ref('message')
    const privateMessageRef = firebase.database().ref('privateMessage')

    // send string message
    const sendMessage = () => {
      if (currentChannel.value === null || message.value.length === 0) return
      const newMessage: Message = {
        content: message.value,
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        user: {
          id: user.value!.uid,
          name: user.value!.displayName,
          avatar: user.value!.photoURL
        }
      }

      getMessageRef()
        .child(currentChannel.value.id)
        .push()
        .set(newMessage)
        .then(() => {
          nextTick(() => {
            window.scrollTo({
              behavior: 'smooth',
              top: document.documentElement.scrollHeight,
              left: 0
            })
          })
        })
        .catch(error => {
          console.log('[error]: ', error)
          error.value = error
        })

      message.value = ''
    }

    // send image message
    const sendImage = (fileURL: string) => {
      const newMessage = {
        image: fileURL,
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        user: {
          id: user.value!.uid,
          avatar: user.value!.photoURL,
          name: user.value!.displayName
        }
      }

      getMessageRef()
        .child(currentChannel.value!.id)
        .push()
        .set(newMessage)
        .then(() => {
          nextTick(() => {
            window.scrollTo({
              behavior: 'smooth',
              top: document.documentElement.scrollHeight,
              left: 0
            })
          })
        })
        .catch(error => {
          console.log('[error]: ', error)
        })
    }

    const getMessageRef = () =>
      currentChannel.value!.isPrivate ? privateMessageRef : messageRef

    // detect new message
    const messagesList = reactive<Message[]>([])
    let prevMessageListener: {
      id: string
      ref: firebase.database.Reference
    } | null = null
    const messageListener = () => {
      if (!currentChannel.value) return
      messagesList.length = 0

      const ref = getMessageRef()
      ref.child(currentChannel.value.id).on('child_added', snapshot => {
        messagesList.push({ ...snapshot.val(), id: snapshot.key })
      })
    }

    watch(
      () => currentChannel.value,
      () => {
        // clear previous message listener
        prevMessageListener?.ref
          .child(prevMessageListener.id)
          .off('child_added')

        // add message listener
        messageListener()
      }
    )

    const transformTimestampFromNow = (timestamp: string) =>
      moment(timestamp).fromNow()

    // upload file
    const uploadProgress = ref('0')
    const uploadStatus = ref<'uploading' | 'error' | 'finished'>('finished')
    let uploadTask: firebase.storage.UploadTask | null = null
    const uploadFile = (event: Event) => {
      if (uploadStatus.value === 'uploading') return
      uploadStatus.value = 'uploading'
      const file = (event.target as EventTarget & { files: FileList }).files[0]
      console.log('[file]', file)
      const filePath = `chat/${
        currentChannel.value!.isPrivate
          ? `private/${currentChannel.value!.id}`
          : 'public'
      }/${v4()}`
      uploadProgress.value = '0'
      uploadTask = firebase.storage().ref().child(filePath).put(file)
      uploadTask.on(
        'state_changed',
        ({ bytesTransferred, totalBytes }) => {
          // uploading...
          uploadProgress.value = (
            (bytesTransferred / totalBytes) *
            100
          ).toFixed(0)
        },
        error => {
          // upload failed...
          uploadStatus.value = 'error'
          console.log('[upload error]', error)
          ;(event.target as HTMLInputElement).value = ''
        },
        () => {
          // upload finished
          uploadStatus.value = 'finished'
          ;(event.target as HTMLInputElement).value = ''
          uploadTask!.snapshot.ref.getDownloadURL().then(fileURL => {
            sendImage(fileURL)
          })
          uploadTask = null
        }
      )
    }

    const uploadStatusText = computed(() => {
      switch (uploadStatus.value) {
        case 'uploading':
          return 'Uploading...'
        case 'error':
          return 'An error has occurred'
        case 'finished':
          return 'Upload finished'
        default:
          return ''
      }
    })

    onBeforeUnmount(() => {
      messageRef.off()
      privateMessageRef.off()
      if (uploadTask) {
        uploadTask.cancel()
      }
    })

    return {
      currentChannel,
      message,
      error,
      sendMessage,
      messagesList,
      transformTimestampFromNow,
      uploadFile,
      uploadProgress,
      uploadStatus,
      uploadStatusText
    }
  },
  components: {
    Icon
  }
})
</script>

<style scoped>
@-webkit-keyframes animate-stripes {
  100% {
    background-position: -100% 0px;
  }
}

@keyframes animate-stripes {
  100% {
    background-position: -100% 0px;
  }
}

progress[value] {
  /* Reset the default appearance */
  -webkit-appearance: none;
  appearance: none;
  transition-duration: 300ms;
}

progress[value]::-webkit-progress-bar {
  background-color: #555;
  border-radius: 2px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.25) inset;
}

progress[value]::-webkit-progress-value {
  background-image: -webkit-linear-gradient(
      -45deg,
      transparent 33%,
      rgba(0, 0, 0, 0.1) 33%,
      rgba(0, 0, 0, 0.1) 66%,
      transparent 66%
    ),
    -webkit-linear-gradient(top, rgba(255, 255, 255, 0.25), rgba(0, 0, 0, 0.25)),
    -webkit-linear-gradient(left, rgb(96, 158, 26), rgb(62, 160, 42));

  border-radius: 2px;
  background-size: 35px 20px, 100% 100%, 100% 100%;
  background-position: 0 0;

  -webkit-animation: animate-stripes 2.5s linear infinite;
  animation: animate-stripes 2.5s linear infinite;
}
</style>
