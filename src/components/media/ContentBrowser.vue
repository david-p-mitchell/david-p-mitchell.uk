<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from "vue";
import type { ContentItem } from "../../data/movies.ts";
import { useContentFilters, itemKey, formatMinutes } from "../../composables/useContentFilters";
import FilterPanel from "./FilterPanel.vue";
import ContentCard from "./ContentCard.vue";
import ContentTable from "./ContentTable.vue";

const props = defineProps<{ content: ContentItem[] }>();
const drawerOpen = ref(false);
const filterCollapsed = ref(false);

const {
  sortMode, activeTags, activeTypes, freeOnly,
  sliderMin, sliderMax, rangeMin, rangeMax, durationFilterActive,
  durationPresets, applyPreset, resetDuration, filterEpisodes,
  filtered, allTags, activeFilterCount,
  toggleTag, toggleType, clearAll, isOpen, toggle,
} = useContentFilters(() => props.content);
type ShowMode = "table" | "card";

const isDesktop = ref(typeof window !== "undefined" ? window.matchMedia("(min-width: 768px)").matches : true);
const showMode = ref<ShowMode>(isDesktop.value ? "table" : "card");

let mql: MediaQueryList;
function handleMqlChange(e: MediaQueryListEvent) {
  isDesktop.value = e.matches;
}

onMounted(() => {
  mql = window.matchMedia("(min-width: 768px)");
  isDesktop.value = mql.matches;
  showMode.value = isDesktop.value ? "table" : "card";
  mql.addEventListener("change", handleMqlChange);
});
onUnmounted(() => mql?.removeEventListener("change", handleMqlChange));

// Force card mode any time we drop below desktop width
watch(isDesktop, (desktop) => {
  if (!desktop) showMode.value = "card";
});

const showOptions = [
  { value: "table", label: "Table" },
  { value: "card", label: "Card" }
] as const;

const sortOptions = [
  { value: "name", label: "A–Z" },
  { value: "duration-asc", label: "Shortest" },
  { value: "duration-desc", label: "Longest" },
] as const;

function durationToSeconds(durationStr: string): number {
  const parts = durationStr.split(":").map(Number);
  
  if (parts.length === 3) {
    const [hours, minutes, seconds] = parts;
    return hours * 3600 + minutes * 60 + seconds;
  } else if (parts.length === 2) {
    const [minutes, seconds] = parts;
    return minutes * 60 + seconds;
  }
  
  return 0;
}

function formatDisplaySeconds(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `(${hours} hours ${minutes} minutes ${seconds} seconds)`;
}

// Main logic to calculate total duration
const getTotalDuration = (items: ContentItem[]): string => {
  // 1. Flatten all durations into a single array of strings
  const durations: string[] = items.flatMap((item) => {
    if (item.type === "docuseries") {
      return item.episodes.map((episode) => episode.duration);
    }
    return item.duration;
  });

  // 2. Sum up total seconds using reduce
  const totalSeconds = durations.reduce(
    (acc, duration) => acc + durationToSeconds(duration),
    0
  );

  // 3. Format total back to HH:MM:SS
  return formatDisplaySeconds(totalSeconds);
};
</script>

<template>
  <div class="min-h-screen dark:bg-card text-neutral-200 font-sans p-4 md:p-2">
    <div class="flex flex-col md:flex-row gap-1 md:gap-2">
      <!-- Filters: always-visible sidebar on desktop, hidden on mobile (drawer below instead) -->
      <aside
        :class="[
          'hidden md:flex md:flex-col shrink-0 sticky top-8 self-start transition-all duration-200 overflow-hidden',
          filterCollapsed ? 'md:w-10 md:gap-0' : 'md:w-56 md:gap-2 md:pl-4'
        ]"
      >
        <div class="flex items-center justify-between">
          <span v-if="!filterCollapsed" class="text-[11px] font-medium tracking-widest uppercase text-neutral-500">Filter</span>
          <button
            @click="filterCollapsed = !filterCollapsed"
            class="flex items-center justify-center w-6 h-6 rounded-md border border-neutral-800 text-neutral-500 hover:text-neutral-200 hover:border-neutral-700 shrink-0"
            :aria-label="filterCollapsed ? 'Expand filters' : 'Collapse filters'"
          >
            <svg class="w-3 h-3 transition-transform" :class="{ 'rotate-180': filterCollapsed }" viewBox="0 0 14 14" fill="none">
              <path d="M9 3L5 7L9 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
          <button v-if="!filterCollapsed && activeFilterCount > 0" @click="clearAll" class="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-neutral-100">
            Clear <span class="bg-neutral-800 rounded-full px-1.5 py-px text-[10px]">{{ activeFilterCount }}</span>
          </button>
        </div>

        <FilterPanel
          v-if="!filterCollapsed"
          :free-only="freeOnly" :active-types="activeTypes" :active-tags="activeTags" :all-tags="allTags"
          :slider-min="sliderMin" :slider-max="sliderMax" :range-min="rangeMin" :range-max="rangeMax"
          :duration-presets="durationPresets"
          @update:free-only="freeOnly = $event" @toggle-type="toggleType" @toggle-tag="toggleTag"
          @update:range-min="rangeMin = $event" @update:range-max="rangeMax = $event"
          @apply-preset="applyPreset" @reset-duration="resetDuration"
        />
      </aside>

      <main class="flex-1 flex flex-col gap-4 min-w-0">
        <div class="flex items-center gap-2">
          <button
            v-for="opt in showOptions" :key="opt.value" @click="showMode = opt.value"
            :class="[
              'text-xs px-3 py-1.5 rounded-full border transition-all',
              opt.value === 'table' ? 'hidden md:inline-flex' : '',
              showMode === opt.value ? 'bg-blue-950 border-blue-700 text-blue-300' : 'bg-neutral-900 border-neutral-800 dark:text-neutral-300'
            ]"
          >
            {{ opt.label }}
          </button>

          <button
            v-for="opt in sortOptions" :key="opt.value" @click="sortMode = opt.value"
            :class="['text-xs px-3 py-1.5 rounded-full border transition-all', sortMode === opt.value ? 'bg-blue-950 border-blue-700 text-blue-300' : 'bg-neutral-900 border-neutral-800 dark:text-neutral-300']"
          >
            {{ opt.label }}
          </button>

          <button
            @click="drawerOpen = true"
            class="md:hidden ml-auto flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-neutral-800 bg-neutral-900 text-neutral-400"
          >
            Filters
            <span v-if="activeFilterCount > 0" class="bg-blue-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold">{{ activeFilterCount }}</span>
          </button>
        </div>

        <!-- Active filter chips (mobile only - desktop sidebar shows selection state inline) -->
        <div v-if="activeFilterCount > 0" class="md:hidden flex gap-2 overflow-x-auto">
          <button v-for="tag in activeTags" :key="tag" @click="toggleTag(tag)" class="shrink-0 text-[11px] px-2.5 py-1 rounded-full bg-amber-950/60 text-amber-400 border border-amber-800">{{ tag }} ✕</button>
          <button v-for="type in activeTypes" :key="type" @click="toggleType(type)" class="shrink-0 text-[11px] px-2.5 py-1 rounded-full bg-blue-950/60 text-blue-400 border border-blue-800 capitalize">{{ type }} ✕</button>
          <button v-if="freeOnly" @click="freeOnly = false" class="shrink-0 text-[11px] px-2.5 py-1 rounded-full bg-green-950/60 text-green-400 border border-green-800">Free ✕</button>
          <button v-if="durationFilterActive" @click="resetDuration" class="shrink-0 text-[11px] px-2.5 py-1 rounded-full bg-violet-950/60 text-violet-400 border border-violet-800">
            {{ formatMinutes(rangeMin) }}–{{ formatMinutes(rangeMax) }} ✕
          </button>
        </div>

        <div class="flex items-center pb-3 border-b border-neutral-900">
          <span class="text-xs text-neutral-600 tracking-wide">{{ filtered.length }} title{{ filtered.length !== 1 ? "s" : "" }} {{ getTotalDuration(filtered) }}</span>
        </div>

        <div v-if="filtered.length === 0" class="flex flex-col items-center justify-center py-20 gap-4 text-neutral-600">
          <p class="text-sm">No titles match your filters.</p>
          <button @click="clearAll" class="text-sm border border-neutral-800 rounded-lg px-4 py-2 hover:text-neutral-200 hover:border-neutral-700">Clear filters</button>
        </div>

        <div class="flex flex-col gap-2">
          <table v-if="showMode === 'table'" class="w-full border-separate border-spacing-y-1">
            <thead>
              <tr class="text-left text-[10px] uppercase tracking-widest text-neutral-500">
                <th class="px-3 py-1 font-medium">Title</th>
                <th class="px-3 py-1 font-medium">Type</th>
                <th class="px-3 py-1 font-medium">Cost</th>
                <th class="px-3 py-1 font-medium hidden">Platform</th>
                <th class="px-3 py-1 font-medium max-w-xs">Duration</th>
                <th class="px-3 py-1 font-medium text-right max-w-xs">Watch</th>
              </tr>
            </thead>
            <tbody>
              <ContentTable
                v-for="item in filtered" :key="itemKey(item)" :item="item" :is-open="isOpen(item)"
                :active-tags="activeTags" :episodes="filterEpisodes(item)"
                @toggle-tag="toggleTag" @toggle-open="toggle(item)"
              />
            </tbody>
          </table>

          <ContentCard
            v-if="showMode === 'card'"
            v-for="item in filtered" :key="itemKey(item)" :item="item" :is-open="isOpen(item)"
            :active-tags="activeTags" :episodes="filterEpisodes(item)"
            @toggle-tag="toggleTag" @toggle-open="toggle(item)"
          />
        </div>
      </main>
    </div>

    <!-- Mobile filter drawer -->
    <Transition name="fade">
      <div v-if="drawerOpen" @click="drawerOpen = false" class="md:hidden fixed inset-0 z-30 bg-black/60 backdrop-blur-sm" />
    </Transition>
    <Transition name="slide-up">
      <div v-if="drawerOpen" class="md:hidden fixed bottom-0 inset-x-0 z-40 bg-neutral-950 border-t border-neutral-800 rounded-t-2xl max-h-[85vh] flex flex-col">
        <div class="flex items-center justify-between px-5 py-4 border-b border-neutral-900">
          <span class="text-sm font-medium text-neutral-200">Filters</span>
          <div class="flex items-center gap-3">
            <button v-if="activeFilterCount > 0" @click="clearAll" class="text-xs text-neutral-400">Clear all</button>
            <button @click="drawerOpen = false" class="text-neutral-500 p-1">✕</button>
          </div>
        </div>
        <div class="overflow-y-auto flex-1 px-5 py-4">
          <FilterPanel
            :free-only="freeOnly" :active-types="activeTypes" :active-tags="activeTags" :all-tags="allTags"
            :slider-min="sliderMin" :slider-max="sliderMax" :range-min="rangeMin" :range-max="rangeMax"
            :duration-presets="durationPresets"
            @update:free-only="freeOnly = $event" @toggle-type="toggleType" @toggle-tag="toggleTag"
            @update:range-min="rangeMin = $event" @update:range-max="rangeMax = $event"
            @apply-preset="applyPreset" @reset-duration="resetDuration"
          />
        </div>
        <div class="px-5 py-4 border-t border-neutral-900">
          <button @click="drawerOpen = false" class="w-full py-3.5 rounded-xl bg-blue-700 text-white text-sm font-medium">
            Show {{ filtered.length }} title{{ filtered.length !== 1 ? "s" : "" }}
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.slide-up-enter-active, .slide-up-leave-active { transition: transform 0.3s cubic-bezier(0.32, 0.72, 0, 1); }
.slide-up-enter-from, .slide-up-leave-to { transform: translateY(100%); }
</style>