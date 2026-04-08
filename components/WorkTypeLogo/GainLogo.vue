<template>
    <div class="text-center">
    <div
      class="inline-block transition-transform duration-200 ease-in-out"
      :class="hovering && isFilterable ? 'scale-150 cursor-pointer' : 'scale-100 cursor-default'"
      @mouseenter="hovering = true"
      @mouseleave="hovering = false"
    >
      <svg
        class="block mx-auto"
        :class="isFilterable ? 'min-h-[110px]' : ''"
        preserveAspectRatio="xMidYMid meet"
        viewBox="585.83 429.99 748.34 220"
        xmlns="http://www.w3.org/2000/svg"
        role="presentation"
        aria-hidden="true"
        :width="50 * iconScale"
        :height="30 * iconScale"
      >
        <g>
          <path d="M752.7 575.16c.31 0 .51.34.35.61-3.72 6.2-9.01 11.18-15.8 14.86-9.15 4.96-20.79 7.47-34.58 7.47-17.39 0-31.98-5.44-42.2-15.73-10.21-10.28-15.6-24.93-15.6-42.37s5.39-32.09 15.6-42.37c10.22-10.29 24.81-15.73 42.2-15.73 26.45 0 44.81 10.03 51.75 28.24.06.16.21.26.38.25l58.78-2.51c.25-.01.43-.24.38-.49-5.01-23.08-18.01-42.53-37.61-56.27-19.73-13.83-45.21-21.13-73.68-21.13-16.6 0-32.31 2.72-46.7 8.07-14.1 5.25-26.57 12.89-37.06 22.71-10.52 9.86-18.72 21.6-24.36 34.9-5.78 13.64-8.72 28.55-8.72 44.32s2.93 30.68 8.72 44.32c5.64 13.3 13.84 25.04 24.36 34.9 10.48 9.82 22.95 17.46 37.06 22.71 14.39 5.36 30.1 8.07 46.7 8.07 37.5 0 68.21-11.72 88.81-33.9 20-21.53 29.17-51.76 26.53-87.43l-.29-3.86a.403.403 0 0 0-.4-.37H703.55c-.22 0-.4.18-.4.4v49.92c0 .22.18.4.4.4h49.15Z"/>
          <path d="M881.55 590.6h82.37c.16 0 .31.1.37.25l21.18 52.96c.06.15.21.25.37.25h116.63c.22 0 .4-.18.4-.4V436.34c0-.22-.18-.4-.4-.4h-57.05c-.22 0-.4.18-.4.4v197.08c0 .43-.59.55-.76.16l-84.85-197.4a.39.39 0 0 0-.37-.24h-72.61c-.16 0-.3.09-.37.24L796.94 643.5c-.11.26.08.56.37.56h62.32c.16 0 .31-.1.37-.25l21.18-52.96c.06-.15.21-.25.37-.25m19.64-50.07 21.17-52.8c.13-.33.61-.33.74 0l21.17 52.8c.1.26-.09.55-.37.55h-42.33c-.28 0-.47-.28-.37-.55Z"/>
          <path d="M1120.1 436.34v207.32c0 .22.18.4.4.4h56.75c.22 0 .4-.18.4-.4V495.68c0-.44.6-.55.77-.15l62.03 148.29c.06.15.21.24.37.24h92.95c.22 0 .4-.18.4-.4V436.34c0-.22-.18-.4-.4-.4h-56.75c-.22 0-.4.18-.4.4v147.99c0 .44-.6.55-.77.15l-62.03-148.29a.39.39 0 0 0-.37-.24h-92.95c-.22 0-.4.18-.4.4Z"/>
        </g>
      </svg>
    </div>  
      <p v-if="showName" class="text-center text-md font-medium">GAIN</p>
    <p v-if="showTime" class="text-center text-sm text-gray-500">Software Engineer</p>
    <p v-if="showTime" class="text-center text-xs text-gray-500">March 2025 - June 2025</p>
    
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