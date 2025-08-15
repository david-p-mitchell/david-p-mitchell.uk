<template>
    <div class="p-0">
        
    <ProjectComponent
        heading="Apollo Insights"
        subheading="A search marketing platform "
        summary="Maintaining and building a comprehensive platform with data and analytics dashboards for digital search data and providing actionable insights."
        dates="January 2017 - June 2023">
        <PlatformsAws :size="iconsize" :show-name="false" />
        <LanguagesCSharp :size="iconsize" :show-name="false" />
        <LanguagesCss :size="iconsize" :show-name="false" />
        <LanguagesHtmlFive :size="iconsize" :show-name="false" />
        <LanguagesJavascript :size="iconsize" :show-name="false" />
        <LanguagesJQuery :size="iconsize" :show-name="false" />
        <LanguagesJson :size="iconsize" :show-name="false" />
        <LanguagesBash :size="iconsize" :show-name="false" />
        <LanguagesRequireJs :size="iconsize" :show-name="false" />
        <LanguagesSQL :size="iconsize" :show-name="false" />
        <LanguagesNodeJs :size="iconsize" :show-name="false" />
        <LanguagesVue :size="iconsize" :show-name="false" />
        <PlatformsDotNet :size="iconsize" :show-name="false" />
        <PlatformsDotNetCore :size="iconsize" :show-name="false" />
        <PlatformsDocker :size="iconsize" :show-name="false" />
        <LanguagesXML :size="iconsize" :show-name="false" />
        
        
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