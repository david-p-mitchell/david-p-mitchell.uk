<template>
    <div>
        
    <ProjectComponent
        heading="Sperry Drilling (Halliburton)"
        subheading="MWD Tool Software Development"
        summary="Completed a software engineering placement at Halliburton’s Sperry Drilling division, contributing to the development and testing of high-performance Measurement While Drilling (MWD) tools for extreme downhole environments."
        dates="September 2014 - August 2015">
        
        <LanguagesCSharp :size="size" :show-name="false" />
        <LanguagesSQL :size="size" :show-name="false" />
        <PlatformsDotNet :size="size" :show-name="false" />
        <div class="absolute pt-1  pl-1 left-1 top-1">
          <HalliburtonLogo />
        </div>
        <div class="absolute pt-1  pl-1 right-1 top-1 bg-green-500 text-white rounded-md pr-2 text-sm">
          Full time employed by Halliburton
        </div>
        <p class="text-xs">
            All company logos and images are the property of Halliburton. They are used here for illustrative purposes to show past employment and projects.
        </p>
        </ProjectComponent>
        </div>
</template>

<script setup lang="ts">
import HalliburtonLogo from '../WorkTypeLogo/HalliburtonLogo.vue';
import ProjectComponent from './ProjectComponent.vue';
const size = 35;
</script>