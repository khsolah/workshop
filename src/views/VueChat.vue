<template>
  <main
    class="
      bg-gradient-to-b bg-center
      flex flex-col
      min-h-screen
      justify-center
      items-center
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
    <router-link
      :to="{ hash: '#login' }"
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
    >
      Start now!
    </router-link>
  </main>
  <Login />
</template>

<script lang="ts">
import Login from '@/components/Login.vue'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ChatIndex',
  components: {
    Login
  }
})
</script>
