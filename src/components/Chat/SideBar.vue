<template>
  <aside
    class="
      flex flex-col
      min-h-screen
      max-h-screen
      bg-gray-800
      pt-5
      float-left
      relative
      items-center
      justify-between
      overflow-y-scroll
      lg:w-xs
    "
  >
    <div
      class="
        border-solid
        flex
        border-0 border-b-1 border-b-gray-500
        w-full
        items-center
        justify-between
        lg:pb-7 lg:px-7
      "
      v-if="currentUser"
    >
      <img
        :src="currentUser.photoURL"
        alt="avatar"
        class="rounded-full bg-gray-700 lg:w-10 lg:h-10"
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
    <div class="h-full w-full">
      <div
        class="
          flex
          text-white text-lg
          py-4
          px-4
          justify-evenly
          select-none
          items-center
        "
      >
        <span>Channels</span>
      </div>
      <ul
        class="
          border-solid
          h-full
          list-none
          border-0 border-b-1 border-b-gray-500
          w-full
          pl-0
          transition transition-all
          duration-300
          overflow-hidden
        "
        v-if="channelList.length > 0"
      >
        <li
          class="
            cursor-pointer
            flex
            text-white
            w-full
            select-none
            lg:text-base
            overflow-hidden overflow-ellipsis
            hover:bg-gray-700
            lg:py-4 lg:px-4
          "
          :class="{
            '!bg-gray-700': currentChannel && currentChannel.id === channel.id
          }"
          v-for="channel in channelList"
          :key="channel.id"
          @click.prevent="toggleChannel(channel)"
        >
          <span
            class="w-full overflow-hidden overflow-ellipsis line-clamp-1 !block"
            :class="{
              'mr-4': getNotifications(channel.id)
            }"
          >
            {{ channel.name }}
          </span>
          <span
            v-show="
              channel.id !== currentChannel.id &&
              getNotifications(channel.id) > 0
            "
            class="ml-auto mr-0"
            >{{ getNotifications(channel.id) }}</span
          >
        </li>
      </ul>
    </div>
    <div class="h-full w-full">
      <div
        class="
          flex
          text-white text-lg
          select-none
          justify-center
          items-center
          lg:px-4 lg:py-4
        "
      >
        <span>Users</span>
      </div>
      <ul class="list-none w-full pl-0">
        <li
          class="
            cursor-pointer
            flex
            text-white
            w-full
            inter
            relative
            items-center
            select-none
            overflow-hidden overflow-ellipsis
            lg:text-lg
            hover:bg-gray-700
            lg:py-4 lg:px-4
          "
          :class="{
            '!bg-gray-700':
              currentChannel &&
              currentChannel.id === getPrivateChannelId(user.uid)
          }"
          v-for="user in usersList"
          :key="user.uid"
          @click.prevent="toggleToPrivateChannel(user)"
        >
          <div class="relative lg:mr-5">
            <img
              :src="user.avatar"
              alt="avatar"
              class="rounded-full lg:w-8 lg:h-8"
            />
            <div
              class="
                rounded-full
                bg-gray-700
                right-1
                bottom-2
                absolute
                lg:w-3 lg:h-3
              "
            >
              <span
                class="
                  rounded-full
                  bg-gray-300
                  transform
                  top-1/2
                  left-1/2
                  -translate-x-1/2 -translate-y-1/2
                  absolute
                  lg:w-7px lg:h-7px
                "
                :class="{ '!bg-green-600': user.status === 'online' }"
              />
            </div>
          </div>
          <span
            class="
              cursor-pointer
              min-w-0
              overflow-hidden overflow-ellipsis
              line-clamp-1
            "
            :class="{
              'mr-4': getPrivateNotifications(user)
            }"
            >{{ user.name }}</span
          >
          <span
            v-show="
              getPrivateNotifications(user.uid) !== currentChannel.id &&
              getPrivateNotifications(user) > 0
            "
            class="ml-auto mr-0"
            >{{ getPrivateNotifications(user) }}</span
          >
        </li>
      </ul>
    </div>
    <button
      class="
        bg-transparent
        border-solid
        cursor-pointer
        font-font-bold
        mt-auto
        outline-none
        border-0 border-t-1 border-t-gray-500
        flex-shrink-0
        text-white text-lg
        mb-0
        w-full
        hover:bg-gray-600
        lg:h-16
      "
      @click.prevent="logout"
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
import { Channel, User } from '@/@types/chat'

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
    const presenceRef = firebase.database().ref('presence')
    const logout = () => {
      firebase.auth().signOut()
      presenceRef.child(currentUser.value!.uid).remove()
      ;(store as Store).commit(MutationTypes.SET_USER, null)
      router.push({ name: 'VueChat' })
    }

    const currentUser = computed(() => store.getters['GET_USER'])

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

    const channelList = reactive<Channel[]>([])
    const currentChannel = computed(() => store.getters['GET_CURRENT_CHANNEL'])

    const channelChildListener = () => {
      channelRef.on('child_added', snapshot => {
        channelList.push(snapshot.val())

        if (!currentChannel.value) {
          toggleChannel(channelList[0])
        }

        addNotificationListener(snapshot.key as string)
      })
    }

    const toggleChannel = ({ id, name }: Channel) => {
      resetNotifications()
      store.commit(MutationTypes.SET_CURRENT_CHANNEL, {
        id,
        name,
        isPrivate: false
      })
      resetNotifications()
    }

    const toggleToPrivateChannel = ({ uid, name }: User) => {
      const id = getPrivateChannelId(uid)
      resetNotifications()
      ;(store as Store).commit(MutationTypes.SET_CURRENT_CHANNEL, {
        id,
        name,
        isPrivate: true
      })
      resetNotifications()
    }

    const getPrivateChannelId = (uid: string) => {
      return uid > currentUser.value!.uid
        ? `${currentUser.value!.uid}/${uid}`
        : `${uid}/${currentUser.value!.uid}`
    }

    const userRef = firebase.database().ref('user')
    const usersList = reactive<User[]>([])
    const connectedRef = firebase.database().ref('.info/connected')
    // store all users in users list and add listener to set user status (online or offline)
    const setUserListener = () => {
      userRef.on('child_added', snapshot => {
        if (snapshot.key !== currentUser.value!.uid) {
          usersList.push({
            ...snapshot.val(),
            uid: snapshot.key,
            status: 'offline'
          })
        }
      })

      connectedRef.on('value', snapshot => {
        if (snapshot.val() === true) {
          const userPresenceRef = presenceRef.child(currentUser.value!.uid)
          userPresenceRef.set(true)
          userPresenceRef.onDisconnect().remove()
        }
      })

      // presenceRef child_added
      presenceRef.on('child_added', snapshot => {
        if (currentUser.value!.uid !== snapshot.key) {
          modifyUserStatus(snapshot.key as string, 'online')
        }

        const channelId = getPrivateChannelId(snapshot.key as string)
        privateMessageRef.child(channelId).on('value', snapshot => {
          handleNotifications({
            id: channelId,
            snapshot
          })
        })
      })

      presenceRef.on('child_removed', snapshot => {
        if (currentUser.value!.uid !== snapshot.key) {
          modifyUserStatus(snapshot.key as string, 'offline')

          privateMessageRef
            .child(getPrivateChannelId(snapshot.key as string))
            .off()
        }
      })
    }

    const modifyUserStatus = (id: string, status: 'online' | 'offline') => {
      const index = usersList.findIndex(user => user.uid === id)
      if (index === -1) return
      usersList[index].status = status
    }

    // notifications
    const messageRef = firebase.database().ref('message')
    const privateMessageRef = firebase.database().ref('privateMessage')
    const notificationsList = reactive<{
      [key: string]:
        | {
            id: string
            total: number
            lastKnownTotal: number
            notifications: number
          }
        | undefined
    }>({})

    const addNotificationListener = (id: string) => {
      messageRef.child(id).on('value', snapshot => {
        handleNotifications({ id, snapshot })
      })
    }

    const handleNotifications = ({
      id,
      snapshot
    }: {
      id: string
      snapshot: firebase.database.DataSnapshot
    }) => {
      const notification = notificationsList[id]

      if (!notification) {
        notificationsList[id] = {
          id: id,
          total: snapshot.numChildren(),
          lastKnownTotal: snapshot.numChildren(),
          notifications: 0
        }
      } else if (currentChannel.value!.id !== id) {
        notification.notifications = snapshot.numChildren() - notification.total
        notification.lastKnownTotal = snapshot.numChildren()
      }
    }

    // reset currnt channel's notification
    const resetNotifications = () => {
      if (!currentChannel.value) return
      const notification = notificationsList[currentChannel.value.id]!
      notification.total = notification.lastKnownTotal
      notification.notifications = 0
    }

    const getNotifications = (id: string) =>
      notificationsList[id] ? notificationsList[id]!.notifications : 0

    const getPrivateNotifications = (user: User) => {
      return getNotifications(getPrivateChannelId(user.uid))
    }

    onMounted(() => {
      channelChildListener()
      setUserListener()
    })

    onBeforeUnmount(() => {
      channelRef.off()
      userRef.off()
      connectedRef.off()
      presenceRef.off()
    })

    return {
      logout,
      currentUser,
      usersList,
      newChannelName,
      createChannel,
      createChannelError,
      creatingNewChannel,
      channelList,
      currentChannel,
      toggleChannel,
      toggleToPrivateChannel,
      getPrivateChannelId,
      notificationsList,
      getNotifications,
      getPrivateNotifications
    }
  },
  components: {
    Icon
  }
})
</script>
