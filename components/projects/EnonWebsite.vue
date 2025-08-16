<template>
    
        
    <ProjectComponent
        heading="Enon Baptist Church"
        subheading="New Church Website"
        summary="Initiated and developed a new website for Enon Baptist Church, focusing on modern and responsive design, continuous development and improving user experience."
        dates="September 2024 - Present">
        
        <LanguagesNuxt :size="size" :show-name="false"/>
        <LanguagesCss :size="size" :show-name="false"/>
        <LanguagesHtmlFive :size="size" :show-name="false" />
        <LanguagesMarkdown :size="size" :show-name="false" />
        <LanguagesTypescript :size="size" :show-name="false" />
        <LanguagesVue :size="size" :show-name="false" />
        <PlatformsGit :size="size" :show-name="false" />
    </ProjectComponent>
        
</template>

<script setup lang="ts">
import { LanguagesCss, LanguagesHtmlFive, LanguagesMarkdown, LanguagesNuxt, LanguagesTypescript, LanguagesVue, PlatformsGit } from '#components';
import ProjectComponent from './templates/ProjectComponent.vue';
const size = 50;
</script>