<template>
  <div style="display: inline-block; position: relative;">
    
    <BubbleLogo
      :name="'AWS'"
      :size="size"
      :link="link"
      :showName="showName">
<g transform="translate(0,-20) scale(0.8) translate(15,15)">
      <text
          x="60"
          y="58"
          text-anchor="middle"
          dominant-baseline="middle"
          fill="#ffffff"
          font-family="Verdana, Arial, sans-serif"
          font-weight="bold"
          font-size="28"
        >
          AWS
        </text>
      <path
          d="M30 78 C50 100, 70 100, 90 78"
          fill="none"
          stroke="#CCC"
          stroke-width="4"
          stroke-linecap="round"
        />
        </g>
    </BubbleLogo>
  </div>
</template>

<script setup>
import BubbleLogo from '@/components/BubbleLogo.vue';
const props = defineProps({
  size: { type: [Number, String], default: 96 },
  link: { type: String, default: '/languages/aws' },
  showName: { type: Boolean, default: true }
});
</script>
