<template>
  <tr :class="['align-top', isOpen ? 'bg-neutral-900/60' : 'hover:bg-neutral-900/30']">
    <td class="px-3 py-2">
      <div class="flex">
        <div class="min-w-[20px]">
          <button v-if="item.type === 'docuseries'" @click="emit('toggleOpen')" class="text-blue-400">
            <svg class="w-3.5 h-3.5 transition-transform" :class="{ 'rotate-180': isOpen }" viewBox="0 0 14 14" fill="none">
              <path d="M3 5L7 9L11 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
        </div>
        <div>
          <div class="font-serif text-sm text-neutral-100 leading-snug">{{ item.name }}</div>
          <div v-if="item.briefDescription" class="text-xs text-neutral-500 leading-relaxed line-clamp-2">{{ item.briefDescription }}</div>
          <div v-if="item.director?.length" class="text-[11px] text-neutral-600 mt-0.5">Dir. {{ item.director.join(", ") }}</div>
          <div v-if="item.hint" class="mt-1 inline-block bg-yellow-300/60 text-[11px] text-neutral-900 rounded-md px-1.5 py-0.5">{{ item.hint }}</div>
          <div v-if="item.disclaimer" class="mt-1 text-[11px] text-red-300 border border-red-800 bg-red-900/40 rounded px-1.5 py-0.5">{{ item.disclaimer }}</div>
        </div>
      </div>
    </td>

    <td class="px-3 py-2 max-w-xs">
      <span :class="['text-[10px] font-medium tracking-widest uppercase px-2 py-0.5 rounded border whitespace-nowrap', typeClass[item.type]]">
        {{ typeLabel[item.type] }}
      </span>
    </td>

    <td class="px-3 py-2 max-w-xs">
      <span v-if="item.cost" :class="['text-[10px] font-medium tracking-widest uppercase px-2 py-0.5 rounded border whitespace-nowrap', costClass[item.cost as keyof typeof costClass]]">
        {{ item.cost }}
      </span>
    </td>

    <td class="px-3 py-2 hidden">
      <div class="flex flex-wrap gap-1 ">
        <a
          v-for="p in item.platform ?? []"
          :key="p.name"
          :href="p.url"
          target="_blank"
          class="text-[11px] px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300 border border-neutral-700"
        >
          {{ p.name }}
        </a>
      </div>
    </td>

    <td class="px-3 py-2 text-xs text-neutral-700 dark:text-neutral-300 tabular-nums whitespace-nowrap max-w-xs">
      {{ item.type === "docuseries" ? `${item.episodes.length} ep · ${formatMinutes(seriesTotalMinutes(item))}` : displayDuration(item.duration) }}
    </td>

    <!-- <td class="px-3 py-2">
      <div class="flex flex-wrap gap-1 max-w-[180px]">
        <button
          v-for="tag in item.tags"
          :key="tag"
          @click="emit('toggleTag', tag)"
          :class="['text-[11px] px-2 py-0.5 rounded-full border transition-all', activeTags.includes(tag) ? 'bg-amber-950/50 text-amber-400 border-amber-800' : 'bg-blue-950 dark:bg-gold text-blue-400 dark:text-blue-950 border-blue-900/50']"
        >
          {{ tag }}
        </button>
      </div>
    </td> -->

    <td class="px-3 py-2 text-right whitespace-nowrap max-w-2xs">
  <div class="flex items-center justify-end gap-2 md:flex-col">
    <!-- Download Link -->
    <a 
      v-if="item.downloadFrom" 
      :href="item.downloadFrom" 
      target="_blank" 
      rel="noopener noreferrer"
      class="text-xs font-medium text-blue-500 border-2 rounded-lg px-2 py-1 border-blue-500 hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors"
    >
      Download...
    </a>

    <!-- Watch Link -->
    <a 
      v-if="item.type !== 'docuseries' || item.url" 
      :href="item.url" 
      target="_blank" 
      rel="noopener noreferrer"
      class="text-sm font-medium text-amber-500 dark:text-gold hover:underline"
    >
      Watch
    </a>
  </div>
</td>
  </tr>

  <!-- Episode rows, siblings in the same table, same columns -->
  <tr
    v-for="ep in item.type === 'docuseries' && isOpen ? episodes : []"
    :key="ep.url"
    class="border-t border-neutral-900/60 bg-neutral-950/40"
  >
    <td class="pl-8 pr-3 py-2">
      <div class="text-sm text-neutral-300">{{ ep.title }}</div>
      <div class="flex flex-wrap gap-1 mt-1">
        <span v-for="t in ep.tags ?? []" :key="t" class="text-[10px] px-2 py-0.5 rounded-full bg-blue-950/50 text-blue-500 border border-blue-900/50">{{ t }}</span>
      </div>
    </td>
    <td colspan="2"></td>
    <td class="px-3 py-2">
      <span v-if="ep.cost" :class="['text-[10px] px-2 py-0.5 rounded border', costClass[ep.cost as keyof typeof costClass]]">{{ ep.cost }}</span>
    </td>
    <td class="px-3 py-2 text-xs text-neutral-600 tabular-nums whitespace-nowrap">{{ ep.duration }}</td>
    <td></td>
    <td class="px-3 py-2 text-right whitespace-nowrap">
      <a :href="ep.url" target="_blank" class="text-xs font-medium text-blue-400 border border-blue-900/60 rounded-md px-2.5 py-1.5 bg-blue-950/20">Watch</a>
    </td>
  </tr>
</template>

<script setup lang="ts">
import type { ContentItem, Episode } from "../../data/movies";
import { displayDuration, formatMinutes, seriesTotalMinutes } from "../../composables/useContentFilters";

const props = defineProps<{
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