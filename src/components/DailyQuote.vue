<script setup lang="ts">
import type { Quote } from "../data/quotes";

const props = defineProps<{
  quote: Quote;
}>();

</script>

<template>
  <section
    class="bg-card border border-border dark:border-gold/40 border-3 rounded-xl sm:rounded-lg lg:rounded-2xl py-2 px-4 flex flex-col gap-4 relative overflow-hidden"
  >
  
    <!-- Decorative large quote mark -->
    <span
      class="absolute top-3 right-5 font-serif text-7xl text-gold opacity-10 leading-none pointer-events-none select-none"
      aria-hidden="true"
    >
      ❝
    </span>

    <p class="font-mono text-xs uppercase tracking-widest text-gold-muted">
      Daily Quote
    </p>

    <div class="flex items-center gap-4 mx-6">
      <img
        v-if="quote.imgAuthor"
        :src="quote.imgAuthor"
        :alt="quote.author"
        class="w-16 h-16 rounded-full object-cover"
      />
      <blockquote
      class="font-serif italic text-lg leading-relaxed text-text-primary"
    >
      "{{ quote.text }}"
    </blockquote>
    </div>
    

    <cite
      class="font-mono not-italic text-xs tracking-wider text-gold mx-6"
    >
      — {{ quote.author + (quote.years ?" (" + quote.years + ")" : "" ) + (quote.source ? ", " + quote.source : "") }}
    </cite>
    <div v-if="quote.tags && quote.tags.length > 0" class="font-mono text-xs tracking-wider text-blue-200 mx-6">
       {{ quote.tags.map((tag) => `#${tag}`).join(" ") }}
    </div>
  </section>
</template>