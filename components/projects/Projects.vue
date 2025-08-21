<script setup lang="ts">
import { languageStore } from '~/stores/languageStore'
import ProjectCards from './Cards/ProjectCards.vue';
import { projects } from './projectData'; // adjust the path
import { ref } from 'vue';

const maxNumProjects = ref(4);
const moreProjects = () => {
  maxNumProjects.value += 4;
  console.log(maxNumProjects.value);
}
const filteredProjects = computed(() => {
  if (!languageStore.selectedLanguage) {
    return projects.filter(p=> p.toShow).slice(0, maxNumProjects.value)
  }
  return projects.filter(p =>
    p.tech.includes(languageStore.selectedLanguage as string) && p.toShow
  ).slice(0, maxNumProjects.value)
})
const maxedProjects = computed(() => {
  if (!languageStore.selectedLanguage) return maxNumProjects.value >= projects.length;
  else {
    let projCount = projects.filter(p =>
    p.tech.includes(languageStore.selectedLanguage as string) && p.toShow
  ).length
  console.log(projCount, maxNumProjects.value);
    return maxNumProjects.value > projCount;
  }
})

</script>

<template>
  
  <SectionHeader id="projects" text="Projects I have contributed to:" />
    
<div :class="[
    'grid gap-4 p-4 justify-items-center ',
    filteredProjects.length === 1 ? 'md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1' :
    filteredProjects.length === 2 ? 'md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 max-w-3xl mx-auto' :
    filteredProjects.length === 3 ? 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 max-w-5xl mx-auto' :
    'md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 mx-1 mb-2 lg:mx-auto xl:mx-0'
  ]" >
    <ProjectCards
      v-for="p in filteredProjects"
      :key="p.name"
      :heading="p.heading"
      :summary="p.summary"
      :tech="p.tech"
      :dates="p.dates"
      :subheading="p.subheading"
      :company="p.company"
      :employed="p.employed"
      :iconsize="p.iconSize"
    />
    </div>
    
    <div class="p-5">
    <button v-if="!maxedProjects" type="button" @click="moreProjects" class="text-white bg-gradient-to-r from-blue-950 via-blue-900 to-blue-950 hover:scale-125 focus:outline-none transform transition-transform duration-200 ease-in-out shadow-lg shadow-blue-950/100 dark:shadow-lg font-medium rounded-xl text-sm px-5 py-2.5 text-center me-2 mb-2">
      See more Projects</button>
    </div>
    <p class="text-xs mx-1 mb-2">
            All company names, logos, and images are the property of their respective owners and are used here for illustrative purposes only. <br />
            They are used here for illustrative purposes to show past employment and projects.
        </p>
        
</template>