<template>
    <div>
        
    <ProjectComponent
        heading="Sperry Drilling (Halliburton)"
        subheading="MWD Tool Software Development"
        summary="Completed a software engineering placement at Halliburton’s Sperry Drilling division, contributing to the development and testing of high-performance Measurement While Drilling (MWD) tools for extreme downhole environments."
        dates="September 2014 - August 2015">
        
        <LanguagesCSharp :size="iconsize" :show-name="false" />
        <LanguagesSQL :size="iconsize" :show-name="false" />
        <PlatformsDotNet :size="iconsize" :show-name="false" />
        
        <p class="text-xs">
            All company logos and images are the property of Halliburton. They are used here for illustrative purposes to show past employment and projects.
        </p>
        </ProjectComponent>
        </div>
</template>

<script setup lang="ts">
import HalliburtonLogo from '../WorkTypeLogo/HalliburtonLogo.vue';
import ProjectComponent from './ProjectComponent.vue';
defineProps({
  iconsize: {
    type: Number,
    default: 35
  }
});
</script>