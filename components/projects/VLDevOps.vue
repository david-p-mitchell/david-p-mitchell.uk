<template>
    <div class="p-0">
        
    <ProjectComponent
        heading="VL Dev Ops"
        subheading="Infrastructure and DevOps"
        summary="Created and oversaw infrastructure for the new tools platforms, including CI/CD pipelines, monitoring, and deployment strategies."
        dates="June 2023- January 2024">
        <PlatformsAws :size="iconsize" :show-name="false" />
        <LanguagesMarkdown :size="iconsize" :show-name="false" />
        <LanguagesYAML :size="iconsize" :show-name="false" />
        <LanguagesBash :size="iconsize" :show-name="false" />
        <PlatformsDocker :size="iconsize" :show-name="false" />
        </ProjectComponent>
        </div>
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