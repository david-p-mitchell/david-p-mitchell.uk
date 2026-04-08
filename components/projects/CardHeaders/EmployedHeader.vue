<script setup lang="ts">

const props = defineProps<{
  type: 'VerticalLeap' | 'Halliburton' | 'VerticalLeap / Gain' | 'GoalsFootball'
}>();

const componentMap = {
  'VerticalLeap': VerticalLeapLogo,
  Halliburton: HalliburtonLogo,
  'VerticalLeap / Gain': VerticalLeapGain,
  GoalsFootball: GoalsFootballLogo
}
import { CompanyNameMap } from '@/utils/companyNameMap';
import HalliburtonLogo from '~/components/WorkTypeLogo/HalliburtonLogo.vue';
import VerticalLeapLogo from '~/components/WorkTypeLogo/VerticalLeapLogo.vue';
import VerticalLeapGain from '~/components/WorkTypeLogo/VerticalLeapGain.vue';
import GoalsFootballLogo from '~/components/WorkTypeLogo/GoalsFootballLogo.vue';
</script>

<template>  
<div class="bg-green-700 text-white text-sm  text-center z-20 rounded-md py-1">
      Full time employed
    </div>
    <!-- Logo - positioned on left with lower z-index -->
    <div class="flex justify-center z-10 ml-1 pt-4 ">
      <component :is="componentMap[type]" />
    </div>
    

    
    <!-- Badge - positioned on right with higher z-index -->
    
  
      
</template>
