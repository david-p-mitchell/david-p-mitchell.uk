<template>
  
    <BubbleLogo
      :name="'Next.js'"
      :size="size"
      :link="link"
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
import { ref } from 'vue';
import BubbleLogo from '@/components/BubbleLogo.vue';
const props = defineProps({
  size: { type: [Number, String], default: 96 },
  link: { type: String, default: '/languages/next-js' },
  showName: { type: Boolean, default: true }
});

const hovering = ref(false);

function onMouseMove(e) {
  const rect = e.currentTarget.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const svgSize = 180;
  const scale = rect.width / svgSize;
  const cx = 90 * scale;
  const cy = 90 * scale;
  const r = 90 * scale;
  const dx = x - cx;
  const dy = y - cy;
  hovering.value = dx * dx + dy * dy <= r * r;
}

function onMouseLeave() {
  hovering.value = false;
}
</script>
