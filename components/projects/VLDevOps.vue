<template>
    <div class="p-0">
        
    <ProjectComponent
        heading="Dev Ops"
        subheading="Infrastructure and DevOps"
        summary="Created and oversaw infrastructure for the new tools platforms, including CI/CD pipelines, monitoring, and deployment strategies."
        dates="June 2023- January 2024">
        <PlatformsAws :size="iconsize" :show-name="false" />
        <LanguagesMarkdown :size="iconsize" :show-name="false" />
        <LanguagesYAML :size="iconsize" :show-name="false" />
        <LanguagesBash :size="iconsize" :show-name="false" />
        
        
        <p class="text-xs">
            All company logos and images are the property of Vertical Leap / GAIN. They are used here for illustrative purposes to show past employment and projects.
        </p>
        </ProjectComponent>
        </div>
</template>

<script setup lang="ts">
import VerticalLeap from '../WorkTypeLogo/VerticalLeap.vue';
import ProjectComponent from './ProjectComponent.vue';


defineProps({
  iconsize: {
    type: Number,
    default: 35
  }
});

</script>