<template>
  <div style="display: inline-block; position: relative;">
    <BubbleLogo
      :name="'Vue.js'"
      :size="size"
      :link="link"
      :showName="showName">
        <g transform="translate(60,45) scale(0.2) translate(-130.5,-108.5)">
            <path fill="#FFF" d="M0 0l130.88 226.69L261.76 0h-53.25L130.88 113.35 53.25 0H0z"/>
            <path fill="#777" d="M53.25 0l77.63 113.35L208.51 0h-45.28l-29.35 43.09L104.53 0H53.25z"/>
        </g>
    </BubbleLogo>
  </div>
</template>

<script setup>
import BubbleLogo from '@/components/BubbleLogo.vue';
const props = defineProps({ size: { type: [Number, String], default: 96 }, link: { type: String, default: '/languages/vue' }, showName: { type: Boolean, default: true }   });
</script>
