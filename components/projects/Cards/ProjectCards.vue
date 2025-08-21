<template>
  <div class="flex flex-col justify-center mt-4 max-w-sm p-1">
    <div class="flex flex-wrap justify-center gap-6">
      <div
        class="relative justify-center bg-white rounded-lg shadow-md text-center transform transition-transform duration-300 hover:scale-105"
      >
        <EmployedHeaders v-if="employed" :type="company!" />
        <VolunteerHeader v-else />

        <h2 class="text-xl font-semibold pt-1">{{ heading }}</h2>
        <p class="text-gray-600 text-sm p-0">({{ dates }})</p>
        <p class="text-gray-600 text-lg p-2">{{ subheading }}</p>
        <p class="text-black-600 text-sm px-2 mt-2 mx-1 mb-1">{{ summary }}</p>

        <TechIcons
          v-if="tech && tech.length"
          :tech="tech"
          :iconsize="iconsize"
          :isSearchIcon="false"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import EmployedHeaders from "../CardHeaders/EmployedHeader.vue";
import VolunteerHeader from "../CardHeaders/VolunteerHeader.vue";
import type { ProjectCompany } from "@/types/Project"; // adjust path

// ✅ Use TS interface instead of runtime options
const props = defineProps<{
  heading: string;
  employed: boolean;
  company: ProjectCompany;
  subheading: string;
  summary: string;
  dates: string;
  tech: string[];
  iconsize: number;
}>();
</script>
