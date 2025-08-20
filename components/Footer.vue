<template>
    <div class="text-center font-bold">
        This site has been built using Nuxt 4, Vue 3 and Tailwind CSS.
    </div>
    <div class="text-center">
        
    <LanguagesNuxt :show-name="false" :size="size" />
    <LanguagesVue :show-name="false" :size="size"/>
    </div>
    <footer class="py-1 bg-blue-950 text-white">
        <Logos />
    </footer>
</template>

<script setup>
import Logos from '@/components/Logos.vue'
const size = 60;
</script>