<template>
    <BubbleLogo
      :name="'AWS'"
      :size="size"
      :showName="showName"
      :isSearchIcon="isSearchIcon"
      >
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
</template>

<script setup>
import BubbleLogo from '@/components/icons/BubbleLogo.vue';
const props = defineProps({
  size: { type: [Number, String], default: 96 },
  showName: { type: Boolean, default: true },
  isSearchIcon: { type: Boolean, default: false}
});
</script>
