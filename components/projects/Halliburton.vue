<template>
  <ProjectComponent
      heading="Sperry Drilling (Halliburton)"
      subheading="MWD Tool Software Development"
      summary="Completed a software engineering placement at Halliburton’s Sperry Drilling division, contributing to the development and testing of high-performance Measurement While Drilling (MWD) tools for extreme downhole environments."
      dates="September 2014 - August 2015">
      
      <LanguagesCSharp :size="iconsize" :show-name="false" />
      <LanguagesSQL :size="iconsize" :show-name="false" />
      <PlatformsDotNet :size="iconsize" :show-name="false" />
    </ProjectComponent>
</template>

<script setup lang="ts">
import ProjectComponent from './templates/ProjectComponent.vue';
defineProps({
  iconsize: {
    type: Number,
    default: 35
  }
});
</script>