<template>
    <div class="flex justify-center mt-4 max-w-sm">
    <div class="flex flex-wrap justify-center gap-4">
      <div class="relative bg-white rounded-lg shadow-md text-center transform transition-transform duration-300 hover:scale-105">
    <EmployedHeaders v-if="employed" :type="company!" />
    <VolunteerHeader v-else />

    <h2 class="text-xl font-semibold ">{{ heading }}</h2>
    <p class="text-gray-600 text-md p-0 mb-4">{{ dates }}</p>
    <p class="text-gray-600 text-lg p-0">{{ subheading }}</p>
    <p class="text-black-600 text-sm p-0 mt-2 mx-1 mb-1">{{ summary }}</p>

    <TechIcons v-if="tech && tech.length" :tech="tech" :iconsize="iconsize" :isSearchIcon="false" />
    <Disclaimer v-if="employed" :company="company!" />

    </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import EmployedHeaders from '../CardHeaders/EmployedHeader.vue';
import VolunteerHeader from '../CardHeaders/VolunteerHeader.vue';
import Disclaimer from '../disclaimers/Disclaimer.vue';

defineProps({
  heading: {
    type: String,
    default: '',
    required: true
  },
  employed: { type: Boolean, default: true},
  company: { type: String as () => 'VL' | 'Halliburton' | null |undefined, required: true },
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