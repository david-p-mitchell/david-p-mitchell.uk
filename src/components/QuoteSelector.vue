<script setup lang="ts">
import { computed } from "vue";
import DailyQuote from "./DailyQuote.vue";
import type { Quote } from "../data/quotes";

const props = defineProps<{
  quotes: Quote[];
}>();

function hashDate(date: Date): number {
  const dateString = date.toISOString().slice(0, 10);

  let hash = 0;

  for (let i = 0; i < dateString.length; i++) {
    hash = ((hash << 5) - hash) + dateString.charCodeAt(i);
    hash |= 0;
  }

  return Math.abs(hash);
}

const quote = computed(() => {
  if (props.quotes.length === 0) {
    return null;
  }

  const index = hashDate(new Date()) % props.quotes.length;
  return props.quotes[index];
});
</script>

<template>
  <DailyQuote
    v-if="quote"
    :quote="quote"
  />
</template>