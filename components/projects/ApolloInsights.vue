<template>
    <div>
        
    <ProjectComponent
        heading="Apollo Insights"
        subheading="A search marketing platform "
        summary="Maintaining and building a comprehensive data and analytics dashboards for digital search data and providing actionable insights."
        dates="January 2017 - June 2023">
        <PlatformsAws :size="size" :show-name="false" />
        <LanguagesCSharp :size="size" :show-name="false" />
        <LanguagesCss :size="size" :show-name="false" />
        <LanguagesHtmlFive :size="size" :show-name="false" />
        <LanguagesJavascript :size="size" :show-name="false" />
        <LanguagesJQuery :size="size" :show-name="false" />
        <LanguagesJson :size="size" :show-name="false" />
        <LanguagesBash :size="size" :show-name="false" />
        <LanguagesRequireJs :size="size" :show-name="false" />
        <LanguagesSQL :size="size" :show-name="false" />
        <LanguagesNodeJs :size="size" :show-name="false" />
        <LanguagesVue :size="size" :show-name="false" />
        <PlatformsDotNet :size="size" :show-name="false" />
        <PlatformsDotNetCore :size="size" :show-name="false" />
        <PlatformsDocker :size="size" :show-name="false" />
        <LanguagesXML :size="size" :show-name="false" />
        <div class="absolute pt-1  pl-1 left-1 top-1">
          <VerticalLeap />
        </div>
        <div class="absolute pt-1  pl-1 right-1 top-1 bg-green-500 text-white rounded-md pr-2 text-sm">
          Full time employed by Vertical Leap
        </div>
        <p class="text-xs">
            All company logos and images are the property of Vertical Leap / GAIN. They are used here for illustrative purposes to show past employment and projects.
        </p>
        </ProjectComponent>
        </div>
</template>

<script setup lang="ts">
import VerticalLeap from '../WorkTypeLogo/VerticalLeap.vue';
import ProjectComponent from './ProjectComponent.vue';
const size = 35;
</script>