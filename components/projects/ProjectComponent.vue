<template>
    <div class="flex justify-center mt-4 max-w-sm">
          <div class="flex flex-wrap justify-center gap-4">
            <div class="bg-white p-6 rounded-lg shadow-md text-center transform transition-transform duration-300 hover:scale-105">
            
            <h2 class="text-xl font-semibold mb-2">{{ heading }}</h2>
            <p class="text-gray-600 text-lg">{{ subheading }}</p>
            <p class="text-black-600 text-sm p-2 m-4">{{ summary }}</p>
            <slot/>
          </div>
        </div>    
          </div>    
</template>

<script setup>
defineProps({
  heading: {
    type: String,
    default: 70
  },
    subheading: {
        type: String,
        default: 'Some Projects I have worked on:'
    },
    summary: {
        type: String,
        default: 'Styled with Tailwind CSS for a modern look.'
    }
})
</script>

