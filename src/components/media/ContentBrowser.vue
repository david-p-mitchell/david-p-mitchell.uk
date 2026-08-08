<script setup lang="ts">
import { ref } from "vue";
import type { ContentItem } from "../../data/movies.ts";
import { useContentFilters, itemKey, formatMinutes } from "../../composables/useContentFilters";
import FilterPanel from "./FilterPanel.vue";
import ContentCard from "./ContentCard.vue";

const props = defineProps<{ content: ContentItem[] }>();
const drawerOpen = ref(false);

const {
  sortMode, activeTags, activeTypes, freeOnly,
  sliderMin, sliderMax, rangeMin, rangeMax, durationFilterActive,
  durationPresets, applyPreset, resetDuration, filterEpisodes,
  filtered, allTags, activeFilterCount,
  toggleTag, toggleType, clearAll, isOpen, toggle,
} = useContentFilters(() => props.content);

const sortOptions = [
  { value: "name", label: "A–Z" },
  { value: "duration-asc", label: "Shortest" },
  { value: "duration-desc", label: "Longest" },
] as const;
</script>

<template>
  <div class="min-h-screen dark:bg-card text-neutral-200 font-sans p-4 md:p-8">
    <div class="flex flex-col md:flex-row gap-6 md:gap-8">
      <!-- Filters: always-visible sidebar on desktop, hidden on mobile (drawer below instead) -->
      <aside class="hidden md:flex md:flex-col md:gap-4 w-56 shrink-0 sticky top-8 self-start">
        <div class="flex items-center justify-between">
          <span class="text-[11px] font-medium tracking-widest uppercase text-neutral-500">Filter</span>
          <button v-if="activeFilterCount > 0" @click="clearAll" class="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-neutral-100">
            Clear <span class="bg-neutral-800 rounded-full px-1.5 py-px text-[10px]">{{ activeFilterCount }}</span>
          </button>
        </div>
        <FilterPanel
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
            v-for="opt in sortOptions" :key="opt.value" @click="sortMode = opt.value"
            :class="['text-xs px-3 py-1.5 rounded-full border transition-all', sortMode === opt.value ? 'bg-blue-950 border-blue-700 text-blue-300' : 'bg-neutral-900 border-neutral-800 text-neutral-500']"
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
          <span class="text-xs text-neutral-600 tracking-wide">{{ filtered.length }} title{{ filtered.length !== 1 ? "s" : "" }}</span>
        </div>

        <div v-if="filtered.length === 0" class="flex flex-col items-center justify-center py-20 gap-4 text-neutral-600">
          <p class="text-sm">No titles match your filters.</p>
          <button @click="clearAll" class="text-sm border border-neutral-800 rounded-lg px-4 py-2 hover:text-neutral-200 hover:border-neutral-700">Clear filters</button>
        </div>

        <div class="flex flex-col gap-2">
          <ContentCard
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