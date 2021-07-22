<template>
  <aside
    class="
      flex flex-col
      min-h-screen
      bg-gray-800
      pt-5
      float-left
      relative
      items-center
      justify-between
      lg:w-xs
    "
  >
    <div class="flex w-full items-center justify-between lg:mb-7 lg:px-7">
      <img
        :src="user.photoURL"
        alt="avatar"
        class="rounded-full bg-red-500 lg:w-10 lg:h-10"
      />
      <h1 class="font-bold text-white lg:text-xl select-none">Vue-Chat</h1>
      <button
        class="bg-transparent border-none cursor-pointer outline-none"
        @click.prevent="creatingNewChannel = true"
      >
        <Icon name="comment-plus" class="fill-light-200 lg:w-4 lg:h-4" />
      </button>
      <form
        class="
          rounded-lg
          flex flex-col
          bg-gray-700
          transform
          top-1/2
          left-1/2
          -translate-x-1/2 -translate-y-1/2
          fixed
          lg:w-lg lg:min-h-50 lg:px-8 lg:py-7
        "
        v-show="creatingNewChannel"
      >
        <Icon
          role="button"
          name="close"
          class="cursor-pointer fill-white top-4 right-6 absolute lg:w-6 lg:h-6"
          @click.prevent="creatingNewChannel = false"
        />
        <span class="font-bold text-white lg:text-xl">Create New Channel</span>
        <input
          type="text"
          class="
            bg-transparent
            border-solid
            outline-none
            border-0 border-b-1 border-gray-400
            text-base text-white
            leading-loose
            w-full
            lg:my-6
          "
          v-focus
          v-model="newChannelName"
          placeholder="Enter your channel name..."
        />
        <p
          class="font-semibold text-base text-red-600"
          v-if="createChannelError.length > 0"
        >
          {{ createChannelError }}
        </p>
        <button
          @click.prevent="createChannel"
          class="
            border-none
            rounded-md
            cursor-pointer
            font-semibold
            ml-auto
            outline-none
            bg-[#7597de]
            mr-0
            text-base text-white
            py-2
            px-4
            lg:w-min
            whitespace-nowrap
            disabled:bg-gray-400
          "
          :disabled="newChannelName.length === 0"
        >
          Create
        </button>
      </form>
    </div>
    <div
      class="
        border-solid
        h-full
        border-0 border-t-1 border-b-1 border-gray-500
        flex-1
        w-full
        overflow-y-scroll
      "
    >
      <ul class="list-none w-full pl-0" v-if="channelList.length > 0">
        <li
          class="
            cursor-pointer
            text-white text-center
            w-full
            lg:text-lg
            overflow-hidden overflow-ellipsis
            hover:bg-gray-700
            lg:py-4 lg:px-4
            line-clamp-1
          "
          :class="{
            '!bg-gray-700': currentChannel && currentChannel.id === channel.id
          }"
          v-for="channel in channelList"
          :key="channel.id"
          @click.prevent="toggleChannel(channel)"
        >
          {{ channel.name }}
        </li>
      </ul>
    </div>
    <button
      class="
        bg-transparent
        border-none
        cursor-pointer
        font-font-bold
        outline-none
        text-white text-lg
        w-full
        hover:bg-gray-600
        lg:h-16
      "
    >
      Logout
    </button>
  </aside>
</template>

<script lang="ts">
import { key } from '@/store'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import { Store } from '@/store'
import {
  computed,
  defineComponent,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref
} from 'vue'
import { useStore } from 'vuex'
import { MutationTypes } from '@/store/mutations'
import { useRouter } from 'vue-router'
import Icon from '@/components/Icon.vue'

export default defineComponent({
  name: 'Chat-SideBar',
  directives: {
    focus: {
      mounted(el: HTMLInputElement) {
        el.focus()
      }
    }
  },
  setup() {
    const store: Store = useStore(key)
    const router = useRouter()
    const logout = () => {
      firebase.auth().signOut()
      ;(store as Store).commit(MutationTypes.SET_USER, null)
      router.push({ name: 'VueChat' })
    }

    const user = computed(() => store.getters['GET_USER'])

    const creatingNewChannel = ref(false)
    const channelRef = firebase.database().ref('channel')
    const newChannelName = ref('')
    const createChannelError = ref('')

    const createChannel = () => {
      const key = channelRef.push().key as string
      const newChannel = { id: key, name: newChannelName.value }
      channelRef
        .child(key)
        .update(newChannel)
        .then(() => {
          creatingNewChannel.value = false
          createChannelError.value = ''
        })
        .catch((error: { message: string }) => {
          createChannelError.value = error.message
        })
    }

    const channelList = reactive<firebase.database.DataSnapshot[]>([])
    const currentChannel = computed(() => store.getters['GET_CURRENT_CHANNEL'])

    const channelChildListener = () => {
      channelRef.on('child_added', dataSnapShot => {
        channelList.push(dataSnapShot.val())

        if (!currentChannel.value) {
          toggleChannel(channelList[0])
        }
      })
    }

    const toggleChannel = (channel: firebase.database.DataSnapshot) => {
      store.commit(MutationTypes.SET_CURRENT_CHANNEL, channel)
    }

    onMounted(() => {
      channelChildListener()
    })

    onBeforeUnmount(() => {
      channelRef.off()
    })

    return {
      logout,
      user,
      newChannelName,
      createChannel,
      createChannelError,
      creatingNewChannel,
      channelList,
      currentChannel,
      toggleChannel
    }
  },
  components: {
    Icon
  }
})
</script>
