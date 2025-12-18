
<template>
  <div class="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 mx-1 mb-2 cursor-pointer">
    <component
        v-for="c in mappedCompanies"
        :key="c.codeName"
        :is="c.component"
        :iconScale="iconScale"
        :showName="showName"
        :showTime="showTime"
        :showTitle="showTitle"
        :isFilterable="isSearchIcon"
        :codeName="c.codeName"
        @click="selectCompany(c)"
        class="mx-6 my-2"
/>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

// Tech / Language icon imports
import GoalsFootballLogo from './WorkTypeLogo/GoalsFootballLogo.vue';
import { companyStore } from '~/stores/companyStore'
import VerticalLeapLogo from './WorkTypeLogo/VerticalLeapLogo.vue';
import GainLogo from './WorkTypeLogo/GainLogo.vue';
import HalliburtonLogo from './WorkTypeLogo/HalliburtonLogo.vue';

// Map string names to components
const iconMap: Record<string, any> = {
    GoalsFootballLogo,GainLogo,VerticalLeapLogo, HalliburtonLogo
};

// Props
const props = defineProps({
  iconScale: { type: Number, default: 2 },
  companies: { type: Array as () => string[] }, // optional now
  showName: { type: Boolean, default: false },
    showTime: { type: Boolean, default: false },
    showTitle: { type: Boolean, default: false },
  isSearchIcon: { type: Boolean, default: false }
});

// If no array is passed, render all icons
const companyToRender = computed(() => props.companies?.length ? props.companies : Object.keys(iconMap));

const selectCompany = (company: { component: Component, codeName: string } | null) => {
  if (!props.isSearchIcon || !company) return;
  if (companyStore.selectedCompany === company.codeName) {
    companyStore.selectedCompany = null;
  } else {
    companyStore.selectedCompany = company.codeName;
  }
};

const mappedCompanies = computed(() => {
  return companyToRender.value
    .map(c => {
      const component = iconMap[c];
      if (!component) return null;
      const codeName = c.replace(/Logo$/, '').toLowerCase();
      return { component, codeName };
    })
    .filter((c): c is { component: any; codeName: string } => c !== null);
});
</script>

<style scoped>
 
</style>
