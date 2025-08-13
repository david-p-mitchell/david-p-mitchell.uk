
<script setup lang="ts">
defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }, toggleMenu: {
    type: Function,
    required: true
  }
})
import MenuIcon from './MenuIcon.vue'
</script>

<template> 
    <div class="md:hidden">
        <button
        @click="(e) => toggleMenu(e)"
        class="text-white hover:text-blue-300 focus:outline-none focus:text-blue-300 transition-colors duration-200"
        aria-label="Toggle menu"
        >
        <template v-if="isOpen">
            <!-- X icon -->
            <svg
            class="h-6 w-6"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            >
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
        </template>
        <template v-else>
            <!-- Menu icon -->
            <MenuIcon />
        </template>
        </button>
    </div>
</template>