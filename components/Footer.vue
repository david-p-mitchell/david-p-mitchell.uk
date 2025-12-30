<template>
    <div>
    <SectionHeader id="footer" text="This site has been built using Nuxt 4, Vue 3 and Tailwind CSS." />
    
    <div class="text-center">
        
    <Nuxt :show-name="false" :size="size" />
    <Vue :show-name="false" :size="size"/>
    <TailwindCss :show-name="false" :size="size"/>
    </div>
    <footer class="py-1 bg-blue-950 text-white px-4 ">
        <div class="flex items-center justify-between">
  <p>© {{ new Date().getFullYear() }} David Mitchell. All rights reserved.</p>
  <Logos />
</div>
    </footer>
    </div>
</template>

<script setup>
import Logos from '@/components/Logos.vue'
import SectionHeader from './SectionHeader.vue';
import Nuxt from './icons/languages/Nuxt.vue';
import Vue from './icons/languages/Vue.vue';
import TailwindCss from './icons/languages/TailwindCss.vue';
const size = 60;
</script>