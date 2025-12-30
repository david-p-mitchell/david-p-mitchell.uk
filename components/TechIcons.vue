
<template>
  <div class="flex flex-wrap justify-center items-center">
    <component
      v-for="t in techToRender"
      :key="t"
      :is="iconMap[t]"
      :size="iconsize"
      :show-name="showName"
      :isSearchIcon="isSearchIcon"
      :codeName="iconMap[t].codeName || t.toLowerCase()"
      @click="selectLanguage(t)"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

// Tech / Language icon imports
import Aws from './icons/platforms/Aws.vue';
import Docker from './icons/platforms/Docker.vue';
import DotNet from './icons/platforms/DotNet.vue';
import DotNetCore from './icons/platforms/DotNetCore.vue';
import Git from './icons/platforms/Git.vue';
import GithubActions from './icons/platforms/GithubActions.vue';
import TFS from './icons/platforms/TFS.vue';

import Astro from './icons/languages/Astro.vue';
import Bash from './icons/languages/Bash.vue';
import Bootstrap from './icons/languages/Bootstrap.vue';
import CSharp from './icons/languages/CSharp.vue';
import Css from './icons/languages/Css.vue';
import HtmlFive from './icons/languages/HtmlFive.vue';
import Javascript from './icons/languages/Javascript.vue';
import JQuery from './icons/languages/JQuery.vue';
import Json from './icons/languages/Json.vue';
import Markdown from './icons/languages/Markdown.vue';
import NextJs from './icons/languages/NextJs.vue';
import NodeJs from './icons/languages/NodeJs.vue';
import Nuxt from './icons/languages/Nuxt.vue';
import React from './icons/languages/React.vue';
import RequireJs from './icons/languages/RequireJs.vue';
import SQL from './icons/languages/SQL.vue';
import TailwindCss from './icons/languages/TailwindCss.vue';
import Typescript from './icons/languages/Typescript.vue';
import Vue from './icons/languages/Vue.vue';
import XML from './icons/languages/XML.vue';
import YAML from './icons/languages/YAML.vue';
import { languageStore } from '~/stores/languageStore'

// Map string names to components
const iconMap: Record<string, any> = {
  Aws, Docker, DotNet, DotNetCore, Git, GithubActions, TFS,
  Astro, Bash, Bootstrap, CSharp, Css, HtmlFive, Javascript, JQuery, Json, Markdown,
  NextJs, NodeJs, Nuxt, React, RequireJs, SQL, TailwindCss, Typescript, Vue, XML, YAML
};

// Props
const props = defineProps({
  iconsize: { type: Number, default: 35 },
  tech: { type: Array as () => string[] }, // optional now
  showName: { type: Boolean, default: false },
  isSearchIcon: { type: Boolean, default: false }
});

// If no array is passed, render all icons
const techToRender = computed(() => props.tech?.length ? props.tech : Object.keys(iconMap));

const selectLanguage = (lang: string | null) => {
  if(!props.isSearchIcon) return;
  if(lang=== languageStore.selectedLanguage) languageStore.selectedLanguage = null;
  else languageStore.selectedLanguage = lang
}
</script>

<style scoped>
 
</style>
