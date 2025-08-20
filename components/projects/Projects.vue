<script setup lang="ts">
import { languageStore } from '~/stores/languageStore'
import ProjectCards from './Cards/ProjectCards.vue';
import { projects } from './projectData'; // adjust the path

const filteredProjects = computed(() => {
  if (!languageStore.selectedLanguage) return projects.filter(p=> p.toShow)
  return projects.filter(p =>
    p.tech.includes(languageStore.selectedLanguage as string) && p.toShow
  )
})
const maxCols = { md: 2, lg: 3, xl: 4 };


const size = 70; 
const loadsize = 40; 
</script>

<template>
    
<div :class="[
    'grid gap-6 p-4 justify-center',
    filteredProjects.length === 1 ? 'md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1' :
    filteredProjects.length === 2 ? 'md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2' :
    filteredProjects.length === 3 ? 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3' :
    'md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4'
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
    
</template>