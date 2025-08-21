<template>   
        <BubbleLogo
            :name="'C#'"
            :size="size"
            :showName="false"
            :codeName="'csharp'"
            :isSearchIcon="isSearchIcon">
        <text x="50%" y="50" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="40" font-weight="bold">
            C#
        </text>
        </BubbleLogo>
    
</template>

<script setup>
import BubbleLogo from '@/components/icons/BubbleLogo.vue';
const props = defineProps({
    size: { type: [Number, String], default: 96 },
    isSearchIcon: { type: Boolean, default: false }
});
</script>
