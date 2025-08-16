<script setup lang="ts">
import ApolloInsights from './ApolloInsights.vue';
import Halliburton from './Halliburton.vue';
import HalliburtonProjectComponent from './templates/HalliburtonProjectComponent.vue';
import VLDevOps from './VLDevOps.vue';
import VLProjectComponent from './templates/VLProjectComponent.vue';
const size = 70; 
const loadsize = 40; 
</script>

<template>
    <div class="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 flex-col items-center justify-center p-4 gap-6">
        <VLProjectComponent>
            <VLDevOps :iconsize="size" />
        </VLProjectComponent>
        <VLProjectComponent>
            <ApolloInsights :iconsize="loadsize" />
        </VLProjectComponent>
        <HalliburtonProjectComponent>
            <Halliburton :iconsize="size" />
        </HalliburtonProjectComponent>
    </div>
</template>