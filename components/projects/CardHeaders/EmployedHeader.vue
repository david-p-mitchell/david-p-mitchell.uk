<script setup lang="ts">
import VerticalLeap from '@/components/WorkTypeLogo/VerticalLeap.vue'
import HalliburtonLogo from '@/components/WorkTypeLogo/HalliburtonLogo.vue'

const props = defineProps<{
  type: 'VL' | 'Halliburton'
}>();

const componentMap = {
  VL: VerticalLeap,
  Halliburton: HalliburtonLogo
}
import { CompanyNameMap } from '@/utils/companyNameMap';
</script>

<template>  <div class="relative flex justify-between items-center w-full">
    <!-- Logo - positioned on left with lower z-index -->
    <div class="flex justify-center z-10 ml-1">
      <component :is="componentMap[type]" />
    </div>
    
    <!-- Badge - positioned on right with higher z-index -->
    <div class="bg-green-700 text-white text-xs rounded-md px-1 py-1 text-right z-20 whitespace-nowrap">
      Full time employed by {{CompanyNameMap[type]}}
    </div>
  </div>
      
</template>
