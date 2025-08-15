<template>
    <div class="body">
      <div class="container mx-auto px-4 py-4">
        <div class="text-center mb-2">
          <h1 class="text-5xl font-bold text-gray-800 mb-3 py-0 my-0">David Mitchell</h1>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto py-0 mb-0">Software Developer</p>
        </div>
      </div>
      <About />
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
      <div class="text-center mt-12 mb-6">
        Projects I have contributed to::
        <div class="flex justify-center mt-4">
        <Projects />  
        </div>    
      </div>
      
      <footer class="mt-12">
        <Footer />
      </footer>
  </div>
</template>

<script setup>
import { useHead } from '@vueuse/head';
import Footer from '@/components/Footer.vue';
import About from '@/components/About.vue';
import Projects from '~/components/projects/Projects.vue';
const size = 70;

useHead({
  title: 'David Mitchell',
  meta: [
    { name: 'description', content: 'David Mitchell, Software Developer, working in .net, C#, Vue.js and Reactjs' }
  ]
})
</script>