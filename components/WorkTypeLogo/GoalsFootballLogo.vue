<template>
    <div class="text-center">
    <div
      class="inline-block transition-transform duration-200 ease-in-out"
      :class="hovering && isFilterable ? 'scale-125 cursor-pointer' : 'scale-100 cursor-default'"
      @mouseenter="hovering = true"
      @mouseleave="hovering = false"
    >
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 581 219" :width="80 * iconScale" :height="40 * iconScale" :class="isFilterable ? 'min-h-[110px]' : ''">
    <!-- Black “border” background larger than logo area -->
    <rect x="-20" y="-20" width="621" height="259" fill="#000000" rx="10" ry="10"/>
    <g transform="scale(0.9) translate(35,15)">
    <!-- Logo paths -->
    <path d="M0,0 L377,0 L378,1 L378,27 L0,27 Z " fill="#FFFFFF" transform="translate(102,192)"/>
    <path d="M0,0 L378,0 L378,26 L377,27 L0,27 Z " fill="#FFFFFF" transform="translate(102,0)"/>
    <path d="M0,0 L66,0 L79,13 L79,135 L52,135 L52,87 L14,87 L14,135 L-13,135 L-13,12 L-5,5 Z M14,27 L14,60 L52,60 L52,27 Z " fill="#FFFFFF" transform="translate(271,42)"/>
    <path d="M0,0 L67,0 L79,12 L79,49 L52,49 L52,27 L15,27 L15,108 L52,108 L51,86 L43,78 L36,70 L28,62 L28,60 L79,60 L79,123 L67,135 L0,135 L-12,123 L-12,12 Z " fill="#FFFFFF" transform="translate(55,42)"/>
    <path d="M0,0 L66,0 L77,11 L79,12 L79,123 L71,130 L66,135 L0,135 L-13,122 L-13,13 Z M14,27 L14,108 L52,108 L52,27 Z " fill="#FFFFFF" transform="translate(163,42)"/>
    <path d="M0,0 L65,0 L75,9 L79,14 L79,42 L78,43 L51,43 L51,27 L13,27 L14,40 L35,52 L59,66 L78,77 L79,79 L79,122 L66,135 L-1,135 L-13,123 L-13,94 L13,94 L13,108 L51,108 L50,95 L21,78 L-6,62 L-13,58 L-13,12 L-5,5 Z " fill="#FFFFFF" transform="translate(460,42)"/>
    <path d="M0,0 L77,0 L77,219 L0,219 L0,193 L1,192 L50,192 L50,27 L1,27 L0,26 Z " fill="#FFFFFF" transform="translate(504,0)"/>
    <path d="M0,0 L77,0 L77,26 L76,27 L27,27 L27,192 L76,192 L77,193 L77,219 L0,219 Z " fill="#FFFFFF" transform="translate(0,0)"/>
    <path d="M0,0 L27,0 L27,108 L68,108 L68,135 L13,135 L10,133 L10,131 L6,129 L0,123 Z " fill="#FFFFFF" transform="translate(366,42)"/>
    </g>
  </svg>
  </div>
  <p v-if="showName" class="text-center text-md font-medium">Goals Football</p>
    <p v-if="showTime" class="text-center text-sm text-gray-500">Software Developer</p>
    <p v-if="showTime" class="text-center text-xs text-gray-500">November 2025 - Present</p>
</div>
</template>

<script setup lang="ts">
    import { ref } from 'vue';

const hovering = ref(false);
    defineProps({
        iconScale: { type: Number, default: 1 },
        showName: { type: Boolean, default: false },
        showTime: { type: Boolean, default: false },
        showTitle: { type: Boolean, default: false },
        isFilterable: { type: Boolean, default: false }
    });
</script>
