<script setup lang="ts">
import ApolloInsights from './ApolloInsights.vue';
import Halliburton from './Halliburton.vue';
import HalliburtonProjectComponent from './HalliburtonProjectComponent.vue';
import VLDevOps from './VLDevOps.vue';
import VLProjectComponent from './VLProjectComponent.vue';
const size = 70; // Default size for icons, can be adjusted as needed
const loadsize = 40; // Default size for icons, can be adjusted as needed
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