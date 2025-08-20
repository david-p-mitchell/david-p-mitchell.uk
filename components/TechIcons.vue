<!-- TechIcons.vue -->
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
import { defineProps, computed } from 'vue';

// Tech / Language icon imports
import Aws from './platforms/Aws.vue';
import Docker from './platforms/Docker.vue';
import DotNet from './platforms/DotNet.vue';
import DotNetCore from './platforms/DotNetCore.vue';
import Git from './platforms/Git.vue';

import Bash from './languages/Bash.vue';
import CSharp from './languages/CSharp.vue';
import Css from './languages/Css.vue';
import HtmlFive from './languages/HtmlFive.vue';
import Javascript from './languages/Javascript.vue';
import JQuery from './languages/JQuery.vue';
import Json from './languages/Json.vue';
import Markdown from './languages/Markdown.vue';
import NextJs from './languages/NextJs.vue';
import NodeJs from './languages/NodeJs.vue';
import Nuxt from './languages/Nuxt.vue';
import React from './languages/React.vue';
import RequireJs from './languages/RequireJs.vue';
import SQL from './languages/SQL.vue';
import Typescript from './languages/Typescript.vue';
import Vue from './languages/Vue.vue';
import XML from './languages/XML.vue';
import YAML from './languages/YAML.vue';
import { languageStore } from '~/stores/languageStore'

// Map string names to components
const iconMap: Record<string, any> = {
  Aws, Docker, DotNet, DotNetCore, Git,
  Bash, CSharp, Css, HtmlFive, Javascript, JQuery, Json, Markdown,
  NextJs, NodeJs, Nuxt, React, RequireJs, SQL, Typescript, Vue, XML, YAML
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
