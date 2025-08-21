<template>
  <div class="inline-block relative">
    <LogoSvg
      :size="size"
      :name="name"
      :showName="showName"
      :codeName ="codeName"
      :isSearchIcon="isSearchIcon"
    >
      <slot />
    </LogoSvg>
  </div>
</template>

<script setup>
import LogoSvg from './LogoSvg.vue'

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  codeName: {
    type: String
  },
  showName: {
    type: Boolean,
    default: true
  },
  size: {
    type: [Number, String],
    default: 96
  },
  isSearchIcon: {
    type: Boolean,
    default: false
  }
})


</script>
