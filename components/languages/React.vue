<template>
  
    <BubbleLogo
      :name="'React'"
      :size="size"
      :link="link">
        <g transform="translate(60,45) ">
            <circle r="6" fill="#fff" />
            <g stroke="#fff" stroke-width="2" fill="none">
                <ellipse rx="25" ry="10" />
                <ellipse rx="25" ry="10" transform="rotate(60)" />
                <ellipse rx="25" ry="10" transform="rotate(120)" />
            </g>
        </g>
    </BubbleLogo>
  
</template>

<script setup>
import { ref } from 'vue';
import BubbleLogo from '@/components/BubbleLogo.vue';
const props = defineProps({
  size: { type: [Number, String], default: 96 },
  link: { type: String, default: '/languages/react' }
});

const hovering = ref(false);

function onMouseMove(e) {
  const rect = e.currentTarget.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const svgSize = 120;
  const scale = rect.width / svgSize;
  const cx = 60 * scale;
  const cy = 60 * scale;
  const r = 55 * scale;
  const dx = x - cx;
  const dy = y - cy;
  hovering.value = dx * dx + dy * dy <= r * r;
}

function onMouseLeave() {
  hovering.value = false;
}
</script>
