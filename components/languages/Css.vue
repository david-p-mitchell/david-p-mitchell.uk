<template>
  
    <BubbleLogo
      :name="'CSS'"
      :size="size"
      :link="link"
      :showName="showName" >
    <g transform="translate(-20,-30) scale(0.8) translate(40,35)">
        <path
          d="M36.5 30h47l-4.3 48.4-19.2 5.3-19.2-5.3L36.5 30zm0 0"
          fill="none"
          stroke="#ffffff"
          stroke-width="3"
        />
        <path
          d="M46 44h28l-.9 10H46l.4 4.5h19.5l-.5 5.4-6.2 1.7-6.2-1.7-.4-4.5H48l.8 9.2 10.6 3 10.6-3 1.5-16.4"
          fill="none"
          stroke="#ffffff"
          stroke-width="3"
        />
        </g>
    </BubbleLogo>
  
</template>

<script setup>
import { ref } from 'vue';
import BubbleLogo from '@/components/BubbleLogo.vue';
const props = defineProps({
  size: { type: [Number, String], default: 96 },
  link: { type: String, default: '/languages/css' },
  showName: { type: Boolean, default: true }
});

const hovering = ref(false);

function onMouseMove(e) {
  const rect = e.currentTarget.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const scale = rect.width / 120;
  hovering.value =
    (x - 60 * scale) ** 2 + (y - 60 * scale) ** 2 <= (55 * scale) ** 2;
}

function onMouseLeave() {
  hovering.value = false;
}
</script>
