<template>
  <SideBar />
  <main
    class="h-screen max-h-screen bg-true-gray-900 w-auto overflow-y-scroll"
  ></main>
</template>

<script lang="ts">
import SideBar from '@/components/Chat/SideBar.vue'
import { defineComponent } from '@vue/runtime-core'
export default defineComponent({
  name: 'Chat',
  components: {
    SideBar
  }
})
</script>
