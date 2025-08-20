<template>
        <p class="text-xs mx-2 mb-2">
            All company logos and images are the property of {{CompanyNameMap[company]}}. <br />
            They are used here for illustrative purposes to show past employment and projects.
        </p>  
</template> 
<script setup lang="ts">
import { CompanyNameMap } from '@/utils/companyNameMap';
defineProps<{
  company: 'VL' | 'Halliburton';
}>();



</script>