<template>
  <p class="text-md text-center text-gray-800 p-3">
    Here are some of the technologies I have worked with:
  </p>
<div class="flex flex-wrap justify-center items-center"> 
        <LanguagesBash :size="size" />
        <LanguagesCSharp :size="size" />
        <LanguagesCss :size="size" />
        <LanguagesNuxt :size="size"/>
        <LanguagesNextJs :size="size"/>
        <LanguagesHtmlFive :size="size"/>
        <LanguagesJQuery :size="size"/>
        <LanguagesJson :size="size"/>
        <LanguagesMarkdown :size="size"/>
        <LanguagesNodeJs :size="size"/>
        <LanguagesRequireJs :size="size"/>
        <LanguagesReact :size="size"/>
        <LanguagesSQL :size="size"/>
        <LanguagesJavascript :size="size"/>
        <LanguagesTypescript :size="size"/>
        <LanguagesVue :size="size"/>
        <LanguagesXML :size="size"/>
        <LanguagesYAML :size="size"/>
        
        
        <PlatformsAws :size="size" />
        <PlatformsDocker :size="size" />
        <PlatformsDotNetCore :size="size" />
        <PlatformsDotNet :size="size" />
        <PlatformsGit :size="size" />      
      </div> 
</template>

<script setup>
const size = 70;
</script>