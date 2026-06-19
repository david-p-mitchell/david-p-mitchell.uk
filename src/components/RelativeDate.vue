<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  date: string | Date;
}>();

const formatted = computed(() => {
  const date = new Date(props.date);
  const now = new Date();

  const diffDays = Math.round(
    (new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() -
      new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()) /
      86400000
  );

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;

  return date.toLocaleDateString();
});
</script>

<template>
  <span>{{ formatted }}</span>
</template>