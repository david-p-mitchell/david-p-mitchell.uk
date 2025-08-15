<template>
    <BubbleLogo
      :name="'.Net'"
      :size="size"
      :link="link"
      :showName="showName">
      <text x="60" y="50" text-anchor="middle" fill="#fff" font-family="Arial, sans-serif" font-size="32" font-weight="bold">.NET</text>
    </BubbleLogo>
</template>

<script setup>
import { ref } from 'vue';
import BubbleLogo from '@/components/BubbleLogo.vue';
const props = defineProps({ size: { type: [Number, String], default: 96 }, link: { type: String, default: '/languages/dotnet' }, showName: { type: Boolean, default: true } });

</script>
