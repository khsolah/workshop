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
        :key="`${message.content}-${message.timestamp} by ${message.user.id}`"
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
          <p class="text-white text-lg leading-none break-all">
            {{ message.content }}
          </p>
        </div>
      </div>
    </div>
    <form
      class="flex items-center relative lg:mx-5 lg:h-14"
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
      <button
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
        <Icon name="paperclip" class="fill-white lg:w-6 lg:h-6" />
      </button>
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
import moment from 'moment'
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
        console.log('[child_added]', snapshot)
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

    onBeforeUnmount(() => {
      messageRef.off()
      privateMessageRef.off()
    })

    return {
      currentChannel,
      message,
      error,
      sendMessage,
      messagesList,
      transformTimestampFromNow
    }
  },
  components: {
    Icon
  }
})
</script>
