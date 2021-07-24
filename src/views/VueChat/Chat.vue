<template>
  <SideBar />
  <Message />
</template>

<script lang="ts">
import Message from '@/components/Chat/Message.vue'
import SideBar from '@/components/Chat/SideBar.vue'
import { defineComponent } from '@vue/runtime-core'
export default defineComponent({
  name: 'Chat',
  components: {
    Message,
    SideBar
  }
})
</script>
