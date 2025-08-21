<template>
    <BubbleLogo
      :name="'.Net'"
      :size="size"
      :showName="showName"
      codeName="'dotnet'"
      :isSearchIcon="isSearchIcon">
      <text x="60" y="50" text-anchor="middle" fill="#fff" font-family="Arial, sans-serif" font-size="32" font-weight="bold">.NET</text>
    </BubbleLogo>
</template>

<script setup>
import BubbleLogo from '@/components/icons/BubbleLogo.vue';
const props = defineProps({ 
  size: { type: [Number, String], default: 96 },
  showName: { type: Boolean, default: true },
  isSearchIcon: { type: Boolean, default: false}
});

</script>
