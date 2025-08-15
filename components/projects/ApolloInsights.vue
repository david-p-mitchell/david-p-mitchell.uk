<template>
    <div>
    <ProjectComponent
        heading="Apollo Insights"
        subheading="A Search Marketing platform "
        summary="This project involved building a comprehensive analytics dashboard for monitoring GraphQL performance and usage metrics.">
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
        <LanguagesXML :size="size" :show-name="false" />
        </ProjectComponent>
        </div>
</template>

<script setup lang="ts">
import ProjectComponent from './ProjectComponent.vue';
const size = 35;
</script>