<template>
  
        <h2 class="text-xl font-semibold ">{{ heading }}</h2>
        <p class="text-gray-600 text-md p-0 mb-4">{{ dates }}</p>
        <p class="text-gray-600 text-lg p-0">{{ subheading }}</p>
        <p class="text-black-600 text-sm p-0 mt-2 mx-1 mb-1">{{ summary }}</p>
        <slot/>
  
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
    },
    dates: {
        type: String,
        default: ''
    }
})
</script>

