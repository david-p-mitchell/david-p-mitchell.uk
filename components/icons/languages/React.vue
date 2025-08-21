<template>
    <BubbleLogo
      :name="'React'"
      :size="size"
      :isSearchIcon="isSearchIcon">
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
import BubbleLogo from '@/components/icons/BubbleLogo.vue';
const props = defineProps({
  size: { type: [Number, String], default: 96 },
  showName: { type: Boolean, default: true},
  isSearchIcon: { type: Boolean, default: false}
});
</script>
