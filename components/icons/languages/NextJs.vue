<template>
  
    <BubbleLogo
      :name="'Next.js'"
      :size="size"
      :isSearchIcon="isSearchIcon"
      :showName="showName">
      <g transform="translate(-20,-30) scale(0.5) translate(70,45)">
            <path
              d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z"
              fill="url(#paint0)"
            />
            <rect x="115" y="54" width="12" height="72" fill="url(#paint1)" />
          </g>
    <defs>
          <linearGradient id="paint0" x1="109" y1="116.5" x2="144.5" y2="160.5" gradientUnits="userSpaceOnUse">
            <stop stop-color="white" />
            <stop offset="1" stop-color="white" stop-opacity="0" />
          </linearGradient>
          <linearGradient id="paint1" x1="121" y1="54" x2="120.799" y2="106.875" gradientUnits="userSpaceOnUse">
            <stop stop-color="white" />
            <stop offset="1" stop-color="white" stop-opacity="0" />
          </linearGradient>
        </defs>
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
