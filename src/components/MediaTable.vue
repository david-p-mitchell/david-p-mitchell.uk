<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import type { ContentItem } from "../data/movies";

const props = defineProps<{
  content: ContentItem[];
}>();

const sortMode = ref<"name" | "duration-asc" | "duration-desc">("name");
const open = ref<string | null>(null);
const activeTags = ref<string[]>([]);
const activeTypes = ref<("movie" | "docuseries")[]>([]);
const freeOnly = ref(false);

// ── Duration helpers ──────────────────────────────────────────
function parseDurationMinutes(duration: string): number {
  const parts = duration.split(":").map(Number);
  if (parts.length === 3) return parts[0] * 60 + parts[1] + parts[2] / 60;
  if (parts.length === 2) return parts[0] + parts[1] / 60;
  return 0;
}

function formatMinutes(mins: number): string {
  if (mins < 60) return `${Math.round(mins)}m`;
  const h = Math.floor(mins / 60);
  const m = Math.round(mins % 60);
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

function displayDuration(duration: string): string {
  return formatMinutes(parseDurationMinutes(duration));
}

function seriesTotalMinutes(item: ContentItem): number {
  if (item.type !== "docuseries") return 0;
  return item.episodes.reduce((acc, ep) => acc + parseDurationMinutes(ep.duration), 0);
}

// ── Slider setup ──────────────────────────────────────────────
// Collect ALL durations: movie runtimes + individual episode durations
const allDurationMinutes = computed(() => {
  const mins: number[] = [];
  for (const item of props.content) {
    if (item.type === "movie") {
      mins.push(parseDurationMinutes(item.duration));
    } else {
      for (const ep of item.episodes) {
        mins.push(parseDurationMinutes(ep.duration));
      }
    }
  }
  return mins;
});

// Floor min, ceil max so no content is accidentally clipped at the edges
const sliderMin = computed(() => Math.floor(Math.min(...allDurationMinutes.value)));
const sliderMax = computed(() => Math.ceil(Math.max(...allDurationMinutes.value)));

const rangeMin = ref(0);
const rangeMax = ref(9999);

function getItemDurationMinutes(item: ContentItem): number {
  if (item.type === "movie") {
    return parseDurationMinutes(item.duration);
  }
  return seriesTotalMinutes(item);
}

onMounted(() => {
  rangeMin.value = sliderMin.value;
  rangeMax.value = sliderMax.value;
});
watch(sliderMin, v => { if (rangeMin.value === 0) rangeMin.value = v; });
watch(sliderMax, v => { if (rangeMax.value === 9999) rangeMax.value = v; });

const durationFilterActive = computed(
  () => rangeMin.value > sliderMin.value || rangeMax.value < sliderMax.value
);

function onMinInput(e: Event) {
  const v = Number((e.target as HTMLInputElement).value);
  if (v <= rangeMax.value - 5) rangeMin.value = v;
}
function onMaxInput(e: Event) {
  const v = Number((e.target as HTMLInputElement).value);
  if (v >= rangeMin.value + 5) rangeMax.value = v;
}

const fillLeft = computed(() =>
  ((rangeMin.value - sliderMin.value) / (sliderMax.value - sliderMin.value)) * 100
);
const fillRight = computed(() =>
  100 - ((rangeMax.value - sliderMin.value) / (sliderMax.value - sliderMin.value)) * 100
);

const durationPresets = [
  { label: "< 30m", max: 30  },
  { label: "< 90m", max: 90  },
  { label: "< 2h",  max: 120 },
];

function applyPreset(maxVal: number) {
  rangeMin.value = sliderMin.value;
  rangeMax.value = Math.min(maxVal, sliderMax.value);
}

function resetDuration() {
  rangeMin.value = sliderMin.value;
  rangeMax.value = sliderMax.value;
}

// ── Core filter logic ─────────────────────────────────────────
function key(item: ContentItem) {
  return `${item.type}:${item.name}`;
}

function getAllTags(item: ContentItem): string[] {
  if (item.type === "movie") return item.tags;
  return [...item.tags, ...item.episodes.flatMap(ep => ep.tags ?? [])];
}

// Episodes that pass both tag filter AND duration range
function filterEpisodes(item: ContentItem) {
  if (item.type === "movie") return [];

  let episodes = item.episodes;

  if (activeTags.value.length) {
    episodes = episodes.filter(ep =>
      activeTags.value.every(tag =>
        (ep.tags ?? []).includes(tag) || item.tags.includes(tag)
      )
    );
  }

  if (durationFilterActive.value) {
    episodes = episodes.filter(ep => {
      const mins = parseDurationMinutes(ep.duration);
      return mins >= rangeMin.value && mins <= rangeMax.value;
    });
  }

  return episodes;
}

function matchesItem(item: ContentItem) {
  const allItemTags = getAllTags(item);

  const matchesTags =
    !activeTags.value.length ||
    activeTags.value.every(tag => allItemTags.includes(tag));

  const matchesTypes =
    !activeTypes.value.length || activeTypes.value.includes(item.type);

  const matchesFree = !freeOnly.value || item.cost === "Free" || (item.type === "docuseries" && item.episodes.some(ep => ep.cost === "Free"));

  let matchesDuration = true;
  if (durationFilterActive.value) {
    if (item.type === "movie") {
      // Movie: filter by its own runtime
      const mins = parseDurationMinutes(item.duration);
      matchesDuration = mins >= rangeMin.value && mins <= rangeMax.value;
    } else {
      // Series: passes if at least one episode is within the range
      matchesDuration = item.episodes.some(ep => {
        const mins = parseDurationMinutes(ep.duration);
        return mins >= rangeMin.value && mins <= rangeMax.value;
      });
    }
  }

  return matchesTags && matchesTypes && matchesFree && matchesDuration;
}

const filtered = computed(() => {
  const items = props.content.filter(matchesItem);

  return items.sort((a, b) => {
    if (sortMode.value === "name") {
      return a.name.localeCompare(b.name);
    }

    const aDur = getItemDurationMinutes(a);
    const bDur = getItemDurationMinutes(b);

    if (sortMode.value === "duration-asc") {
      return aDur - bDur;
    }

    if (sortMode.value === "duration-desc") {
      return bDur - aDur;
    }

    return 0;
  });
});

const allTags = computed(() => {
  const tags = props.content.flatMap(item => getAllTags(item));
  return [...new Set(tags)].sort();
});

const activeFilterCount = computed(
  () =>
    activeTags.value.length +
    activeTypes.value.length +
    (freeOnly.value ? 1 : 0) +
    (durationFilterActive.value ? 1 : 0)
);

// ── Toggles ───────────────────────────────────────────────────
function toggleTag(tag: string) {
  activeTags.value = activeTags.value.includes(tag)
    ? activeTags.value.filter(t => t !== tag)
    : [...activeTags.value, tag];
}

function toggleType(type: "movie" | "docuseries") {
  activeTypes.value = activeTypes.value.includes(type)
    ? activeTypes.value.filter(t => t !== type)
    : [...activeTypes.value, type];
}

function clearAll() {
  activeTags.value = [];
  activeTypes.value = [];
  freeOnly.value = false;
  resetDuration();
}

function isFiltering() {
  return (
    activeTags.value.length > 0 ||
    activeTypes.value.length > 0 ||
    freeOnly.value ||
    durationFilterActive.value
  );
}

function isOpen(item: ContentItem) {
  if (isFiltering()) {
    return (
      item.type === "docuseries" &&
      matchesItem(item) &&
      filterEpisodes(item).length > 0
    );
  }
  return open.value === key(item);
}

function toggle(item: ContentItem) {
  if (isFiltering()) return;
  const k = key(item);
  open.value = open.value === k ? null : k;
}
</script>

<template>
  <div class="flex gap-8 min-h-screen bg-neutral-950 text-neutral-200 p-8 font-sans">

    <!-- ── SIDEBAR ── -->
    <aside class="w-56 shrink-0 sticky top-8 self-start flex flex-col gap-6">

      <!-- Header -->
      <div class="flex items-center justify-between">
        <span class="text-[11px] font-medium tracking-widest uppercase text-neutral-500">Filter</span>
        <button
          v-if="activeFilterCount > 0"
          @click="clearAll"
          class="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-neutral-100 transition-colors"
        >
          Clear
          <span class="bg-neutral-800 rounded-full px-1.5 py-px text-[10px]">{{ activeFilterCount }}</span>
        </button>
      </div>

      <!-- Availability -->
      <div class="flex flex-col gap-2">
        <p class="text-[11px] font-medium tracking-wider uppercase text-neutral-500 m-0">Availability</p>
        <button
          @click="freeOnly = !freeOnly"
          :class="[
            'flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all text-left',
            freeOnly
              ? 'bg-green-950 border-green-700 text-green-400'
              : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'
          ]"
        >
          <span :class="['w-2 h-2 rounded-full shrink-0 transition-colors', freeOnly ? 'bg-green-400' : 'bg-neutral-700']" />
          Free to watch
        </button>
      </div>

      <!-- Format -->
      <div class="flex flex-col gap-2">
        <p class="text-[11px] font-medium tracking-wider uppercase text-neutral-500 m-0">Format</p>
        <button
          @click="toggleType('movie')"
          :class="[
            'flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all text-left',
            activeTypes.includes('movie')
              ? 'bg-amber-950 border-amber-700 text-amber-400'
              : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'
          ]"
        >
          <svg class="w-3.5 h-3.5 shrink-0" viewBox="0 0 14 14" fill="none">
            <rect x="1" y="2.5" width="12" height="9" rx="1.5" stroke="currentColor" stroke-width="1.3"/>
            <path d="M5.5 5L9.5 7L5.5 9V5Z" fill="currentColor"/>
          </svg>
          Films
        </button>
        <button
          @click="toggleType('docuseries')"
          :class="[
            'flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all text-left',
            activeTypes.includes('docuseries')
              ? 'bg-blue-950 border-blue-700 text-blue-400'
              : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'
          ]"
        >
          <svg class="w-3.5 h-3.5 shrink-0" viewBox="0 0 14 14" fill="none">
            <rect x="1" y="1" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.3"/>
            <rect x="8" y="1" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.3"/>
            <rect x="1" y="8" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.3"/>
            <rect x="8" y="8" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.3"/>
          </svg>
          Series
        </button>
      </div>

      <!-- Duration -->
      <div class="flex flex-col gap-3">
        <div class="flex items-center justify-between">
          <p class="text-[11px] font-medium tracking-wider uppercase text-neutral-500 m-0">Duration</p>
          <button
            v-if="durationFilterActive"
            @click="resetDuration"
            class="text-[10px] text-neutral-500 hover:text-neutral-300 transition-colors"
          >
            Reset
          </button>
        </div>

        <!-- Range readout -->
        <div class="flex items-center justify-between text-xs tabular-nums">
          <span :class="durationFilterActive ? 'text-violet-400' : 'text-neutral-500'">
            {{ formatMinutes(rangeMin) }}
          </span>
          <span :class="durationFilterActive ? 'text-violet-400' : 'text-neutral-500'">
            {{ formatMinutes(rangeMax) }}
          </span>
        </div>

        <!-- Two-thumb slider -->
        <div class="relative h-5 flex items-center">
          <div class="absolute inset-x-0 h-1 bg-neutral-800 rounded-full">
            <div
              class="absolute h-full rounded-full transition-colors"
              :class="durationFilterActive ? 'bg-violet-600' : 'bg-neutral-600'"
              :style="{ left: fillLeft + '%', right: fillRight + '%' }"
            />
          </div>
          <input
            type="range"
            :min="sliderMin"
            :max="sliderMax"
            :value="rangeMin"
            @input="onMinInput"
            class="absolute inset-0 w-full appearance-none bg-transparent cursor-pointer range-thumb"
          />
          <input
            type="range"
            :min="sliderMin"
            :max="sliderMax"
            :value="rangeMax"
            @input="onMaxInput"
            class="absolute inset-0 w-full appearance-none bg-transparent cursor-pointer range-thumb"
          />
        </div>

        <!-- Presets -->
        <div class="flex gap-1.5 flex-wrap">
          <button
            v-for="p in durationPresets"
            :key="p.label"
            @click="applyPreset(p.max)"
            :class="[
              'text-[11px] px-2 py-1 rounded border transition-all',
              rangeMax === Math.min(p.max, sliderMax) && rangeMin === sliderMin
                ? 'bg-violet-950 border-violet-700 text-violet-400'
                : 'bg-neutral-900 border-neutral-800 text-neutral-500 hover:border-neutral-700 hover:text-neutral-200'
            ]"
          >
            {{ p.label }}
          </button>
        </div>

        <p class="text-[10px] text-neutral-600 m-0 leading-relaxed">
          Filters series by individual episode length.
        </p>
      </div>

      <!-- Topics -->
      <div class="flex flex-col gap-2">
        <p class="text-[11px] font-medium tracking-wider uppercase text-neutral-500 m-0">Topics</p>
        <div class="flex flex-col gap-0.5 max-h-72 overflow-y-auto">
          <button
            v-for="tag in allTags"
            :key="tag"
            @click="toggleTag(tag)"
            :class="[
              'text-left text-sm px-2 py-1.5 rounded-md transition-all',
              activeTags.includes(tag)
                ? 'text-amber-400 bg-amber-950/50'
                : 'text-neutral-500 hover:text-neutral-200 hover:bg-neutral-900'
            ]"
          >
            {{ tag }}
          </button>
        </div>
      </div>
    </aside>

    <!-- ── MAIN ── -->
    <main class="flex-1 flex flex-col gap-4 min-w-0">
      <div class="flex gap-2">
        <p class="text-[11px] uppercase text-neutral-500">Sort</p>

        <button @click="sortMode = 'name'" :class="[sortMode == 'name' ? 'p-1 bg-white text-blue-900 border border-blue-700 rounded-lg' : 'bg-neutral-900 text-neutral-500']">Name</button>
        <button @click="sortMode = 'duration-asc'" :class="[sortMode == 'duration-asc' ? 'p-1 bg-white text-violet-400 border border-violet-700 rounded-lg' : 'bg-neutral-900 text-neutral-500']">Shortest</button>
        <button @click="sortMode = 'duration-desc'" :class="[sortMode == 'duration-desc' ? 'p-1 bg-white text-violet-400 border border-violet-700 rounded-lg' : 'bg-neutral-900 text-neutral-500']">Longest</button>
      </div>
      <div class="flex items-center pb-3 border-b border-neutral-900">
        <span class="text-xs text-neutral-600 tracking-wide">
          {{ filtered.length }} title{{ filtered.length !== 1 ? 's' : '' }}
        </span>
      </div>

      <div v-if="filtered.length === 0" class="flex flex-col items-center justify-center py-20 gap-4 text-neutral-600">
        <p class="text-sm">No titles match your filters.</p>
        <button @click="clearAll" class="text-sm border border-neutral-800 rounded-lg px-4 py-2 hover:text-neutral-200 hover:border-neutral-700 transition-all">
          Clear filters
        </button>
      </div>

      <div class="flex flex-col gap-2">
        <article
          v-for="item in filtered"
          :key="key(item)"
          :class="[
            'rounded-xl border border-5 transition-colors overflow-hidden',
            isOpen(item) ? 'border-blue-700' : 'border-blue-950 hover:border-neutral-800'
          ]"
        >
          <div class="bg-white dark:bg-neutral-900 px-3 py-2">

            <!-- Badges + duration -->
            <div class="flex items-center gap-2 mb-3">
              <span :class="[
                'text-[10px] font-medium tracking-widest uppercase px-2 py-0.5 rounded',
                item.type === 'movie'
                  ? 'bg-amber-950 text-amber-500 border border-amber-900'
                  : 'bg-blue-950 text-blue-400 border border-blue-900'
              ]">
                {{ item.type === 'movie' ? 'Film' : 'Series' }}
              </span>
              <span v-if="item.cost === 'Free'" class="text-[10px] font-medium tracking-widest uppercase px-2 py-0.5 rounded bg-green-950 text-green-500 border border-green-900">
                Free
              </span>
              <span v-else-if="item.cost === 'Partial Free'" class="text-[10px] font-medium tracking-widest uppercase px-2 py-0.5 rounded bg-yellow-500 text-yellow-950 border border-yellow-950">
                Partial Free
              </span>
              <span class="ml-auto flex items-center gap-1 text-xs text-neutral-500 tabular-nums">
                <svg class="w-3 h-3 shrink-0" viewBox="0 0 12 12" fill="none">
                  <circle cx="6" cy="6" r="4.5" stroke="currentColor" stroke-width="1.2"/>
                  <path d="M6 3.5V6L7.5 7.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
                </svg>
                <template v-if="item.type === 'movie'">
                  {{ displayDuration(item.duration) }}
                </template>
                <template v-else>
                  {{ item.episodes.length }} ep &middot; {{ formatMinutes(seriesTotalMinutes(item)) }} total
                </template>
              </span>
            </div>
            <div class="flex">
            <h2 class="font-serif text-lg font-medium text-neutral-100 leading-snug mb-1">
              {{ item.name }}
            </h2>
            <p class="ml-2 text-sm text-neutral-500 leading-relaxed mb-3">
              - {{ item.description }}
            </p>
            </div>
            <div class="flex">
            <div class="flex flex-wrap gap-1.5">
              <button
                v-for="tag in item.tags"
                :key="tag"
                @click="toggleTag(tag)"
                :class="[
                  'text-[11px] px-2.5 py-0.5 rounded-full border transition-all',
                  activeTags.includes(tag)
                    ? 'bg-amber-950/50 text-amber-400 border-amber-800'
                    : 'text-[10px] px-2 py-0.5 rounded-full bg-blue-950/50 text-blue-500 border border-blue-900/50'
                ]"
              >
                {{ tag }}
              </button>
            </div>
            <div class="ml-auto flex">
              <div class="flex items-center">
              <a
                v-if="item.type === 'movie'"
                :href="item.url"
                target="_blank"
                class="inline-flex items-center gap-2 text-sm font-medium text-amber-500 hover:gap-3 transition-all"
              >
                Watch now
                <svg class="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none">
                  <path d="M2.5 7H11.5M7.5 3L11.5 7L7.5 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </a>
              <button
                v-if="item.type === 'docuseries'"
                @click="toggle(item)"
                class="inline-flex items-center gap-2 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
              >
                <svg
                  class="w-3.5 h-3.5 transition-transform duration-200"
                  :class="{ 'rotate-180': isOpen(item) }"
                  viewBox="0 0 14 14" fill="none"
                >
                  <path d="M3 5L7 9L11 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                {{ isOpen(item) ? 'Hide episodes' : `${item.episodes.length} episodes` }}
              </button>
            </div>
            </div>
            </div>

            
          </div>

          <!-- Episodes panel -->
          <div
            v-if="item.type === 'docuseries' && isOpen(item)"
            class="border-t border-neutral-800 bg-neutral-950"
          >
            <div
              v-for="ep in filterEpisodes(item)"
              :key="ep.url"
              class="flex items-center justify-between gap-4 px-5 py-3 border-b border-neutral-900 last:border-b-0 hover:bg-neutral-900/40 transition-colors"
            >
              <div class="flex flex-col gap-1.5 min-w-0">
                <div>
                <span class="text-sm font-medium text-neutral-300 truncate">{{ ep.title }}
                  
                </span>
                <span v-if="ep.cost === 'Free'" class=" ml-2 mb-6 text-[10px] font-medium tracking-widest uppercase px-2 py-0.5 rounded bg-green-950 text-green-500 border border-green-900">
                    Free
                  </span>
                </div>
                
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="t in ep.tags ?? []"
                    :key="t"
                    class="text-[10px] px-2 py-0.5 rounded-full bg-blue-950/50 text-blue-500 border border-blue-900/50"
                  >
                    {{ t }}
                  </span>
                </div>
              </div>
              <div class="flex items-center gap-3 shrink-0">
                <span class="flex items-center gap-1 text-xs text-neutral-600 tabular-nums">
                  <svg class="w-3 h-3 shrink-0" viewBox="0 0 12 12" fill="none">
                    <circle cx="6" cy="6" r="4.5" stroke="currentColor" stroke-width="1.1"/>
                    <path d="M6 3.5V6L7.5 7.5" stroke="currentColor" stroke-width="1.1" stroke-linecap="round"/>
                  </svg>
                  {{ ep.duration }}
                </span>
                <a
                  :href="ep.url"
                  target="_blank"
                  class="text-xs font-medium text-blue-400 border border-blue-900/60 rounded-md px-2.5 py-1 hover:bg-blue-950/40 hover:text-blue-300 transition-all"
                >
                  Watch
                </a>
              </div>
            </div>
          </div>

        </article>
      </div>
    </main>
  </div>
</template>

<style scoped>
.range-thumb {
  pointer-events: none;
}
.range-thumb::-webkit-slider-thumb {
  pointer-events: all;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #7c3aed;
  border: 2px solid #4c1d95;
  cursor: pointer;
  transition: background 0.15s, transform 0.1s;
}
.range-thumb::-webkit-slider-thumb:hover {
  background: #8b5cf6;
  transform: scale(1.15);
}
.range-thumb::-moz-range-thumb {
  pointer-events: all;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #7c3aed;
  border: 2px solid #4c1d95;
  cursor: pointer;
}
.range-thumb::-webkit-slider-runnable-track { background: transparent; }
.range-thumb::-moz-range-track { background: transparent; }
</style>