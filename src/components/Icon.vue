<template>
  <i class="block">
    <svg class="w-full h-full" :fill="fill">
      <use :href="`${require('../assets/icon/gen/index.svg')}#${name}`" />
    </svg>
  </i>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Icon',
  props: {
    fill: String,
    name: String
  }
})
</script>
