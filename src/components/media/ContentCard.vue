<script setup lang="ts">
import type { ContentItem, Episode } from "../../data/movies";
import { displayDuration, formatMinutes, seriesTotalMinutes } from "../../composables/useContentFilters";

defineProps<{
  item: ContentItem;
  isOpen: boolean;
  activeTags: string[];
  episodes: Episode[];
}>();

const emit = defineEmits<{
  toggleTag: [tag: string];
  toggleOpen: [];
}>();

const typeLabel = { movie: "Film", documentary: "Documentary", docuseries: "Series" } as const;
const typeClass = {
  movie: "bg-amber-950 text-amber-500 border-amber-900",
  documentary: "bg-violet-950 text-violet-400 border-violet-800",
  docuseries: "bg-blue-950 text-blue-400 border-blue-900",
} as const;
const costClass = {
  Free: "bg-green-950 text-green-500 border-green-900",
  "Partial Free": "bg-yellow-500 text-yellow-950 border-yellow-950",
  Paid: "bg-yellow-900 text-yellow-300 border-yellow-900",
} as const;
</script>

<template>
  <article :class="['rounded-xl border transition-colors overflow-hidden border-3', isOpen ? 'border-blue-700' : 'border-gold/40 hover:border-gold']">
    <div class="bg-neutral-900 px-4 py-3">
      <div class="flex items-center gap-2 mb-2 flex-wrap">
        <span :class="['text-[10px] font-medium tracking-widest uppercase px-2 py-0.5 rounded border', typeClass[item.type]]">{{ typeLabel[item.type] }}</span>
        <span v-if="item.cost" :class="['text-[10px] font-medium tracking-widest uppercase px-2 py-0.5 rounded border', costClass[item.cost as keyof typeof costClass]]">{{ item.cost }}</span>
        <span class="ml-auto flex items-center gap-1 text-xs text-neutral-500 tabular-nums">
          <svg class="w-3 h-3" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="4.5" stroke="currentColor" stroke-width="1.2" /><path d="M6 3.5V6L7.5 7.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" /></svg>
          <template v-if="item.type === 'docuseries'">{{ item.episodes.length }} ep &middot; {{ formatMinutes(seriesTotalMinutes(item)) }}</template>
          <template v-else>{{ displayDuration(item.duration) }}</template>
        </span>
      </div>

      <h2 class="font-serif text-base md:text-lg font-medium text-neutral-100 leading-snug">{{ item.name }}</h2>
      <p class="text-sm text-neutral-500 leading-relaxed mb-2">{{ item.briefDescription }}</p>
      <p v-if="item.hint" class="bg-yellow-300/60 text-sm text-neutral-900 leading-relaxed mb-3 rounded-xl py-1 px-2 mt-6">{{ item.hint }}</p>
      <div v-if="item.disclaimer" class="p-2 mb-3 bg-red-700/80 text-red-100 text-xs rounded-lg border border-red-700">{{ item.disclaimer }}</div>
      <div class="flex flex-wrap items-center justify-between gap-1.5">
  <!-- Left Side: Wrap tags in a single container -->
  <div class="flex flex-wrap items-center gap-1.5">
    <button
      v-for="tag in item.tags"
      :key="tag"
      @click="emit('toggleTag', tag)"
      :class="['text-[11px] px-2.5 py-0.5 rounded-full border transition-all', activeTags.includes(tag) ? 'bg-amber-950/50 text-amber-400 border-amber-800' : 'bg-blue-950 dark:bg-gold text-blue-400 dark:text-blue-950 border-blue-900/50']"
    >
      {{ tag }}
    </button>
  </div>

  <!-- Right Side: Watch now / Episodes -->
  <div class="flex items-center justify-end gap-4 ml-auto">
    <a
      v-if="item.type !== 'docuseries' || item.url"
      :href="item.url"
      target="_blank"
      class="inline-flex items-center gap-1.5 text-sm font-medium text-amber-500 dark:text-gold"
    >
      Watch now
      <svg class="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none"><path d="M2.5 7H11.5M7.5 3L11.5 7L7.5 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /></svg>
    </a>
    <button v-if="item.type === 'docuseries'" @click="emit('toggleOpen')" class="inline-flex items-center gap-1.5 text-sm font-medium text-blue-400">
      <svg class="w-3.5 h-3.5 transition-transform" :class="{ 'rotate-180': isOpen }" viewBox="0 0 14 14" fill="none"><path d="M3 5L7 9L11 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /></svg>
      {{ isOpen ? "Hide" : `${item.episodes.length} episodes` }}
    </button>
  </div>
</div>

      

      
    </div>

    <!-- Episodes -->
    <div v-if="item.type === 'docuseries' && isOpen" class="border-t border-neutral-800 bg-neutral-950">
      <div v-for="ep in episodes" :key="ep.url" class="flex items-start justify-between gap-3 px-4 py-3 border-b border-neutral-900 last:border-b-0">
        <div class="flex flex-col gap-1.5 min-w-0">
          <div class="flex flex-wrap items-center gap-1.5">
            <span class="text-sm font-medium text-neutral-300">{{ ep.title }}</span>
            <span v-if="ep.cost" :class="['text-[10px] font-medium tracking-widest uppercase px-1.5 py-px rounded border', costClass[ep.cost as keyof typeof costClass]]">{{ ep.cost }}</span>
          </div>
          <div class="flex flex-wrap gap-1">
            <span v-for="t in ep.tags ?? []" :key="t" class="text-[10px] px-2 py-0.5 rounded-full bg-blue-950/50 text-blue-500 border border-blue-900/50">{{ t }}</span>
          </div>
        </div>
        <div class="flex flex-col items-end gap-2 shrink-0">
          <span class="flex items-center gap-1 text-xs text-neutral-600 tabular-nums">
            <svg class="w-3 h-3" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="4.5" stroke="currentColor" stroke-width="1.1" /><path d="M6 3.5V6L7.5 7.5" stroke="currentColor" stroke-width="1.1" stroke-linecap="round" /></svg>
            {{ ep.duration }}
          </span>
          <a :href="ep.url" target="_blank" class="text-xs font-medium text-blue-400 border border-blue-900/60 rounded-md px-2.5 py-1.5 bg-blue-950/20">Watch</a>
        </div>
      </div>
    </div>
  </article>
</template>