<script setup lang="ts">
import DurationSlider from "./DurationSlider.vue";
import { formatMinutes, type ContentType } from "../../composables/useContentFilters";


defineProps<{
  freeOnly: boolean;
  activeTypes: ContentType[];
  activeTags: string[];
  allTags: string[];
  sliderMin: number;
  sliderMax: number;
  rangeMin: number;
  rangeMax: number;
  durationPresets: { label: string; max: number }[];
}>();

const emit = defineEmits<{
  "update:freeOnly": [value: boolean];
  toggleType: [type: ContentType];
  toggleTag: [tag: string];
  "update:rangeMin": [value: number];
  "update:rangeMax": [value: number];
  applyPreset: [max: number];
  resetDuration: [];
}>();

const formats = [
  { type: "movie", label: "Films", activeClass: "bg-amber-950 border-amber-700 text-amber-400" },
  { type: "documentary", label: "Documentaries", activeClass: "bg-violet-950 border-violet-700 text-violet-400" },
  { type: "docuseries", label: "Series", activeClass: "bg-blue-950 border-blue-700 text-blue-400" },
] as const;
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- Availability -->
    <div class="flex flex-col gap-2">
      <p class="text-[11px] font-medium tracking-wider uppercase text-neutral-500 m-0">Availability</p>
      <button
        @click="emit('update:freeOnly', !freeOnly)"
        :class="[
          'flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all text-left',
          freeOnly ? 'bg-green-950 border-green-700 text-green-400' : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200',
        ]"
      >
        <span :class="['w-2 h-2 rounded-full shrink-0', freeOnly ? 'bg-green-400' : 'bg-neutral-700']" />
        Free to watch
      </button>
    </div>

    <!-- Format -->
    <div class="flex flex-col gap-2">
      <p class="text-[11px] font-medium tracking-wider uppercase text-neutral-500 m-0">Format</p>
      <div class="grid grid-cols-2 gap-2 md:flex md:flex-col">
        <button
          v-for="f in formats"
          :key="f.type"
          @click="emit('toggleType', f.type)"
          :class="[
            'flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all text-left',
            f.type === 'docuseries' ? 'col-span-2 md:col-span-1' : '',
            activeTypes.includes(f.type) ? f.activeClass : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200',
          ]"
        >
          <svg v-if="f.type !== 'docuseries'" class="w-3.5 h-3.5 shrink-0" viewBox="0 0 14 14" fill="none">
            <rect x="1" y="2.5" width="12" height="9" rx="1.5" stroke="currentColor" stroke-width="1.3" />
            <path d="M5.5 5L9.5 7L5.5 9V5Z" fill="currentColor" />
          </svg>
          <svg v-else class="w-3.5 h-3.5 shrink-0" viewBox="0 0 14 14" fill="none">
            <rect x="1" y="1" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.3" />
            <rect x="8" y="1" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.3" />
            <rect x="1" y="8" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.3" />
            <rect x="8" y="8" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.3" />
          </svg>
          {{ f.label }}
        </button>
      </div>
    </div>

    <!-- Duration -->
    <div class="flex flex-col gap-3">
      <div class="flex items-center justify-between">
        <p class="text-[11px] font-medium tracking-wider uppercase text-neutral-500 m-0">Duration</p>
        <button v-if="rangeMin > sliderMin || rangeMax < sliderMax" @click="emit('resetDuration')" class="text-[11px] text-neutral-500 hover:text-neutral-300">Reset</button>
      </div>
      <div class="flex items-center justify-between text-xs tabular-nums text-neutral-500">
        <span>{{ formatMinutes(rangeMin) }}</span>
        <span>{{ formatMinutes(rangeMax) }}</span>
      </div>
      <DurationSlider
        :min="sliderMin"
        :max="sliderMax"
        :range-min="rangeMin"
        :range-max="rangeMax"
        @update:range-min="emit('update:rangeMin', $event)"
        @update:range-max="emit('update:rangeMax', $event)"
      />
      <div class="flex gap-1.5 flex-wrap">
        <button
          v-for="p in durationPresets"
          :key="p.label"
          @click="emit('applyPreset', p.max)"
          :class="[
            'text-[11px] px-2 py-1 rounded border transition-all',
            rangeMax === Math.min(p.max, sliderMax) && rangeMin === sliderMin
              ? 'bg-violet-950 border-violet-700 text-violet-400'
              : 'bg-neutral-900 border-neutral-800 text-neutral-500 hover:border-neutral-700 hover:text-neutral-200',
          ]"
        >
          {{ p.label }}
        </button>
      </div>
    </div>

    <!-- Topics -->
    <div class="flex flex-col gap-2">
      <p class="text-[11px] font-medium tracking-wider uppercase text-neutral-500 m-0">Topics</p>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="tag in allTags"
          :key="tag"
          @click="emit('toggleTag', tag)"
          :class="[
            'text-sm px-3 py-1.5 rounded-lg border transition-all',
            activeTags.includes(tag) ? 'bg-amber-950/60 text-amber-400 border-amber-800' : 'bg-neutral-900 border-neutral-800 text-neutral-500',
          ]"
        >
          {{ tag }}
        </button>
      </div>
    </div>
  </div>
</template>