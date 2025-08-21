<template>
    <div class="flex flex-col justify-center mt-4 max-w-sm p-1">
    <div class="flex flex-wrap justify-center gap-6">
      <div class="relative justify-center bg-white rounded-lg shadow-md text-center transform transition-transform duration-300 hover:scale-105">
    <EmployedHeaders v-if="employed" :type="company!" />
    <VolunteerHeader v-else />

    <h2 class="text-xl font-semibold pt-1">{{ heading }}</h2>
    <p class="text-gray-600 text-sm p-0">{{ '(' + dates + ')' }}</p>
    <p class="text-gray-600 text-lg p-2">{{ subheading }}</p>
    <p class="text-black-600 text-sm px-2 mt-2 mx-1 mb-1">{{ summary }}</p>
    
    <TechIcons v-if="tech && tech.length" :tech="tech" :iconsize="iconsize" :isSearchIcon="false" />
    </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import EmployedHeaders from '../CardHeaders/EmployedHeader.vue';
import VolunteerHeader from '../CardHeaders/VolunteerHeader.vue';

defineProps({
  heading: {
    type: String,
    default: '',
    required: true
  },
  employed: { type: Boolean, default: true},
  company: { type: String as () => 'VL' | 'Halliburton' | 'VLGain' | null |undefined, required: true },
    subheading: {
        type: String,
        default: 'Some Projects I have worked on:',
        required: true
    },
    summary: {
        type: String,
        default: 'Styled with Tailwind CSS for a modern look.',
        required: true
    },
    dates: {
        type: String,
        default: '',
        required: true
    },
    tech: { type: Array as () => string[], default: () => [] }, // add this
    iconsize: { type: Number, default: 35 } // add this
})
</script>