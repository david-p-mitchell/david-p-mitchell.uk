<template>
  <div class="flex flex-col justify-center mt-4 max-w-sm">
    <div class="flex justify-center gap-4 flex-nowrap">
      <div class="relative bg-white rounded-lg shadow-md text-center transform transition-transform duration-300 hover:scale-105 overflow-hidden">
        
        <EmployedHeaders v-if="employed" :type="company!" />
        <VolunteerHeader v-else />

        <h2 class="text-xl font-semibold p-2 whitespace-nowrap overflow-hidden text-ellipsis">{{ heading }}</h2>
        <p class="text-gray-600 text-md p-0 mb-4 whitespace-nowrap overflow-hidden text-ellipsis">{{ dates }}</p>
        <p class="text-gray-600 text-lg p-2 whitespace-nowrap overflow-hidden text-ellipsis">{{ subheading }}</p>
        <p class="text-black-600 text-sm px-2 mt-2 mx-1 mb-1 whitespace-nowrap overflow-hidden text-wrap flex items-center justify-center">{{ summary }}</p>

        <div class="h-[125px] flex items-center justify-center  whitespace-nowrap overflow-hidden">
          <TechIcons
            v-if="tech && tech.length"
            :tech="tech"
            :iconsize="iconsize"
            :isSearchIcon="false"
            class="py-2"
          />
        </div>

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