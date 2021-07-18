<template>
  <router-view />
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
      { name: 'Chat', to: { name: 'VueChat' } }
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

nav .router-link-active {
  @apply !bg-white text-[#2b1055];
}
</style>
