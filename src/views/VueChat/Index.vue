<template>
  <Header />
  <main
    class="
      bg-gradient-to-b bg-center
      flex flex-col
      min-h-screen
      justify-center
      items-center
      bg-gray-900
    "
  >
    <img
      src="@/assets/logo.png"
      alt="Logo"
      class="object-center object-cover lg:h-35 lg:w-35 lg:mb-8"
    />
    <h1 class="font-semibold text-light-700 lg:text-5xl lg:mb-4">Vue Chat</h1>
    <h2 class="font-medium text-gray-400 lg:text-2xl">
      Chat with your friends!
    </h2>
    <a
      class="
        no-underline
        bg-white
        rounded-full
        cursor-pointer
        flex
        font-semibold
        text-xl text-[#2b1055]
        inline-flex
        justify-center
        items-center
        lg:w-40 lg:h-13 lg:mt-12
      "
      @click.prevent="handleDirect"
    >
      Start now!
    </a>
  </main>
  <Login />
</template>

<script lang="ts">
import Header from '@/components/Header.vue'
import Login from '@/components/Login.vue'
import { key, Store } from '@/store'
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'ChatIndex',
  setup() {
    const store = useStore(key)
    const router = useRouter()
    const handleDirect = () => {
      if ((store as Store).getters['GET_USER']) {
        // have user data, direct to chat page
        router.push({ name: 'VueChat-chat' })
      } else {
        // user data is empty, show login modal
        router.replace({ hash: '#login' })
      }
    }

    return { handleDirect }
  },
  components: {
    Header,
    Login
  }
})
</script>
