<template>
    <div style="display: inline-block; position: relative;">
        <BubbleLogo
            :name="'C#'"
            :size="size"
            :showName="false"
            :link="link">
        <text x="50%" y="50%" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-size="40" font-weight="bold">
            C#
        </text>
        </BubbleLogo>
    </div>
</template>

<script setup>
import BubbleLogo from '@/components/BubbleLogo.vue';
const props = defineProps({
    size: {
        type: [Number, String],
        default: 96
    },
    link: {
        type: String,
        default: '/languages/c-sharp'
    }
});
</script>
