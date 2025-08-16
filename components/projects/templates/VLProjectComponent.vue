<template>
  <div class="flex justify-center mt-4 max-w-sm">
    <div class="flex flex-wrap justify-center gap-4">
      <div class="relative bg-white rounded-lg shadow-md text-center transform transition-transform duration-300 hover:scale-105">

        
  

  <div class="relative flex justify-between items-center w-full">
    <!-- Logo - positioned on left with lower z-index -->
    <div class="flex justify-center z-10 ">
      <VerticalLeap />
    </div>
    
    <!-- Badge - positioned on right with higher z-index -->
    <div class="bg-green-700 text-white text-xs rounded-md px-1 py-1 text-right z-20 whitespace-nowrap mb-4">
      Full time employed by Vertical Leap
    </div>
  </div>
        <slot/>
      <p class="text-xs mx-2 mb-2">
            All company logos and images are the property of Vertical Leap. <br />
            They are used here for illustrative purposes to show past employment and projects.
        </p>  
      </div>
      
    </div>
    
  </div>
</template>

<script setup>
import VerticalLeap from '../../WorkTypeLogo/VerticalLeap.vue';
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

