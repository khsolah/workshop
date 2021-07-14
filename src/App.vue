<template>
  <header
    class="
      bg-transparent
      flex
      bg-opacity-80
      h-20
      w-full
      top-0
      right-0
      left-0
      z-99
      fixed
      items-center
      lg:px-10
      xl:px-15
    "
  >
    <router-link
      :to="{ name: 'Index' }"
      class="
        font-bold
        text-white text-base text-3xl
        no-underline
        uppercase
        !bg-transparent
      "
      >logo</router-link
    >
    <nav class="flex h-full ml-auto mr-0 items-center">
      <ul class="flex list-none h-10 pl-0 items-center">
        <li
          class="h-full text-white ml-5"
          v-for="item in navData"
          :key="item.name"
        >
          <router-link
            :to="item.to"
            class="
              no-underline
              rounded-full
              flex
              font-semibold
              h-full
              px-6
              text-white
              active:bg-white
              items-center
              justify-center
            "
            >{{ item.name }}</router-link
          >
        </li>
      </ul>
    </nav>
  </header>
  <router-view />
  <footer></footer>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { RouteLocation } from 'vue-router'

interface Nav {
  name: string
  to: Partial<RouteLocation>
}

export default defineComponent({
  name: 'App',
  setup() {
    const navData: Nav[] = [
      { name: 'Home', to: { name: 'Index' } },
      { name: 'Chat', to: { name: 'Chat' } }
    ]

    return { navData }
  }
})
</script>

<style lang="postcss">
* {
  // font-family: Avenir, Helvetica, Arial, sans-serif;
  font-family: 'Poppins', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
}

body {
  min-height: 100vh;
  // background-image: linear-gradient(#2b1055, #7597de);
  background-image: linear-gradient(#2b1055, #2b1055);
  scroll-behavior: smooth;
}

nav .router-link-exact-active {
  @apply !bg-white text-[#2b1055];
}
</style>
