<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import type { ContentItem } from "../data/movies";

const props = defineProps<{
  content: ContentItem[];
}>();

const sortMode = ref<"name" | "duration-asc" | "duration-desc">("name");
const open = ref<string | null>(null);
const activeTags = ref<string[]>([]);
const activeTypes = ref<("movie" | "docuseries" | "documentary")[]>([]);
const freeOnly = ref(false);

// Mobile filter drawer state
const filterDrawerOpen = ref(false);

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
const allDurationMinutes = computed(() => {
  const mins: number[] = [];
  for (const item of props.content) {
    if (item.type === "movie" || item.type === "documentary") {
      mins.push(parseDurationMinutes(item.duration));
    } else if (item.type === "docuseries") {
      for (const ep of item.episodes) {
        mins.push(parseDurationMinutes(ep.duration));
      }
    }
  }
  return mins;
});

const sliderMin = computed(() => Math.floor(Math.min(...allDurationMinutes.value)));
const sliderMax = computed(() => Math.ceil(Math.max(...allDurationMinutes.value)));

const rangeMin = ref(0);
const rangeMax = ref(9999);

function getItemDurationMinutes(item: ContentItem): number {
  if (item.type === "movie" || item.type === "documentary") return parseDurationMinutes(item.duration);
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

// ── Custom dual-thumb slider (touch-safe) ─────────────────────
// One ref shared — both desktop & drawer sliders use the same state,
// only one is visible at a time so a single ref is fine.
const sliderTrackRef = ref<HTMLElement | null>(null);
const mobileSliderTrackRef = ref<HTMLElement | null>(null);
type DragThumb = "min" | "max" | null;
const dragging = ref<DragThumb>(null);

function getValueFromClientX(clientX: number, track: HTMLElement): number {
  const { left, width } = track.getBoundingClientRect();
  const ratio = Math.max(0, Math.min(1, (clientX - left) / width));
  return Math.round(sliderMin.value + ratio * (sliderMax.value - sliderMin.value));
}

function startDrag(thumb: DragThumb, e: MouseEvent | TouchEvent) {
  e.preventDefault();
  e.stopPropagation();
  dragging.value = thumb;
}

function onDragMove(e: MouseEvent | TouchEvent, track: HTMLElement | null) {
  if (!dragging.value || !track) return;
  e.preventDefault();
  const clientX = "touches" in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
  const v = getValueFromClientX(clientX, track);
  if (dragging.value === "min" && v <= rangeMax.value - 5) rangeMin.value = v;
  if (dragging.value === "max" && v >= rangeMin.value + 5) rangeMax.value = v;
}

function stopDrag() {
  dragging.value = null;
}

const fillLeft = computed(() =>
  ((rangeMin.value - sliderMin.value) / (sliderMax.value - sliderMin.value)) * 100
);
const fillRight = computed(() =>
  100 - ((rangeMax.value - sliderMin.value) / (sliderMax.value - sliderMin.value)) * 100
);

const durationPresets = [
  { label: "< 30m", max: 30 },
  { label: "< 90m", max: 90 },
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
  if (item.type === "movie" || item.type === "documentary") return item.tags;
  return [...item.tags, ...item.episodes.flatMap(ep => ep.tags ?? [])];
}

function filterEpisodes(item: ContentItem) {
  if (item.type === "movie" || item.type === "documentary") return [];
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

  const matchesFree =
    !freeOnly.value ||
    item.cost === "Free" ||
    (item.type === "docuseries" && item.episodes.some(ep => ep.cost === "Free"));

  let matchesDuration = true;
  if (durationFilterActive.value) {
    if (item.type === "movie" || item.type === "documentary") {
      const mins = parseDurationMinutes(item.duration);
      matchesDuration = mins >= rangeMin.value && mins <= rangeMax.value;
    } else {
      matchesDuration = item.episodes.some(ep => {
        const mins = parseDurationMinutes(ep.duration);
        return mins >= rangeMin.value && mins <= rangeMax.value;
      });
    }
  }

  return matchesTags && matchesTypes && matchesFree && matchesDuration;
}

const filtered = computed(() => {
  const items = props.content.filter(item => item.show ?? true).filter(matchesItem);
  return items.sort((a, b) => {
    if (sortMode.value === "name") return a.name.localeCompare(b.name);
    const aDur = getItemDurationMinutes(a);
    const bDur = getItemDurationMinutes(b);
    if (sortMode.value === "duration-asc") return aDur - bDur;
    if (sortMode.value === "duration-desc") return bDur - aDur;
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

function toggleType(type: "movie" | "docuseries" | "documentary") {
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
  <div class="min-h-screen bg-neutral-950 text-neutral-200 font-sans">

    <!-- ── DESKTOP LAYOUT (md+) ────────────────────────────────── -->
    <div class="hidden md:flex gap-8 p-8">

      <!-- Desktop Sidebar -->
      <aside class="w-56 shrink-0 sticky top-8 self-start flex flex-col gap-6">
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
            @click="toggleType('documentary')"
            :class="[
              'flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all text-left',
              activeTypes.includes('documentary')
                ? 'bg-violet-950 border-violet-700 text-violet-400'
                : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'
            ]"
          >
            <svg class="w-3.5 h-3.5 shrink-0" viewBox="0 0 14 14" fill="none">
              <rect x="1" y="2.5" width="12" height="9" rx="1.5" stroke="currentColor" stroke-width="1.3"/>
              <path d="M5.5 5L9.5 7L5.5 9V5Z" fill="currentColor"/>
            </svg>
            Documentaries
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

        <!-- Duration (desktop) -->
        <div class="flex flex-col gap-3">
          <div class="flex items-center justify-between">
            <p class="text-[11px] font-medium tracking-wider uppercase text-neutral-500 m-0">Duration</p>
            <button v-if="durationFilterActive" @click="resetDuration" class="text-[10px] text-neutral-500 hover:text-neutral-300 transition-colors">Reset</button>
          </div>
          <div class="flex items-center justify-between text-xs tabular-nums">
            <span :class="durationFilterActive ? 'text-violet-400' : 'text-neutral-500'">{{ formatMinutes(rangeMin) }}</span>
            <span :class="durationFilterActive ? 'text-violet-400' : 'text-neutral-500'">{{ formatMinutes(rangeMax) }}</span>
          </div>

          <!-- Custom dual-thumb track (desktop) -->
          <div
            ref="sliderTrackRef"
            class="relative h-6 flex items-center select-none touch-none"
            @mousemove="onDragMove($event, sliderTrackRef)"
            @mouseup="stopDrag"
            @mouseleave="stopDrag"
            @touchmove.prevent="onDragMove($event, sliderTrackRef)"
            @touchend="stopDrag"
            @touchcancel="stopDrag"
          >
            <div class="absolute inset-x-0 h-1 bg-neutral-800 rounded-full pointer-events-none">
              <div
                class="absolute h-full rounded-full transition-colors"
                :class="durationFilterActive ? 'bg-violet-600' : 'bg-neutral-600'"
                :style="{ left: fillLeft + '%', right: fillRight + '%' }"
              />
            </div>
            <div
              class="absolute w-4 h-4 rounded-full bg-violet-600 border-2 border-violet-900 shadow cursor-grab active:cursor-grabbing -translate-x-1/2 z-10"
              :style="{ left: fillLeft + '%' }"
              @mousedown.stop="startDrag('min', $event)"
              @touchstart.prevent.stop="startDrag('min', $event)"
            />
            <div
              class="absolute w-4 h-4 rounded-full bg-violet-600 border-2 border-violet-900 shadow cursor-grab active:cursor-grabbing -translate-x-1/2 z-10"
              :style="{ left: (100 - fillRight) + '%' }"
              @mousedown.stop="startDrag('max', $event)"
              @touchstart.prevent.stop="startDrag('max', $event)"
            />
          </div>

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
            >{{ p.label }}</button>
          </div>
          <p class="text-[10px] text-neutral-600 m-0 leading-relaxed">Filters series by individual episode length.</p>
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
            >{{ tag }}</button>
          </div>
        </div>
      </aside>

      <!-- Desktop Main -->
      <main class="flex-1 flex flex-col gap-4 min-w-0">
        <div class="flex gap-2 items-center">
          <p class="text-[11px] uppercase text-neutral-500">Sort</p>
          <button @click="sortMode = 'name'" :class="[sortMode === 'name' ? 'p-1 bg-white text-blue-900 border border-blue-700 rounded-lg' : 'bg-neutral-900 text-neutral-500 px-2 py-1 rounded-lg']">Name</button>
          <button @click="sortMode = 'duration-asc'" :class="[sortMode === 'duration-asc' ? 'p-1 bg-white text-violet-400 border border-violet-700 rounded-lg' : 'bg-neutral-900 text-neutral-500 px-2 py-1 rounded-lg']">Shortest</button>
          <button @click="sortMode = 'duration-desc'" :class="[sortMode === 'duration-desc' ? 'p-1 bg-white text-violet-400 border border-violet-700 rounded-lg' : 'bg-neutral-900 text-neutral-500 px-2 py-1 rounded-lg']">Longest</button>
        </div>
        <div class="flex items-center pb-3 border-b border-neutral-900">
          <span class="text-xs text-neutral-600 tracking-wide">{{ filtered.length }} title{{ filtered.length !== 1 ? 's' : '' }}</span>
        </div>

        <div v-if="filtered.length === 0" class="flex flex-col items-center justify-center py-20 gap-4 text-neutral-600">
          <p class="text-sm">No titles match your filters.</p>
          <button @click="clearAll" class="text-sm border border-neutral-800 rounded-lg px-4 py-2 hover:text-neutral-200 hover:border-neutral-700 transition-all">Clear filters</button>
        </div>

        <div class="flex flex-col gap-2">
          <article
            v-for="item in filtered"
            :key="key(item)"
            :class="['rounded-xl border border-5 transition-colors overflow-hidden', isOpen(item) ? 'border-blue-700' : 'border-blue-950 hover:border-neutral-800']"
          >
            <div class="bg-blue-50/95 dark:bg-neutral-900 px-3 py-2">
              <div class="flex items-center gap-2 mb-3">
                <span :class="['text-[10px] font-medium tracking-widest uppercase px-2 py-0.5 rounded', item.type === 'movie' ? 'bg-amber-950 text-amber-500 border border-amber-900' : item.type === 'documentary' ? 'bg-violet-950 text-violet-200 border border-violet-800' : 'bg-blue-950 text-blue-400 border border-blue-900']">
                  {{ item.type === 'movie' ? 'Film' : item.type === 'documentary' ? 'Documentary' : 'Series' }}
                </span>
                <span v-if="item.cost === 'Free'" class="text-[10px] font-medium tracking-widest uppercase px-2 py-0.5 rounded bg-green-950 text-green-500 border border-green-900">Free</span>
                <span v-else-if="item.cost === 'Partial Free'" class="text-[10px] font-medium tracking-widests uppercase px-2 py-0.5 rounded bg-yellow-500 text-yellow-950 border border-yellow-950">Partial Free</span>
                <span class="ml-auto flex items-center gap-1 text-xs text-neutral-500 tabular-nums">
                  <svg class="w-3 h-3 shrink-0" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="4.5" stroke="currentColor" stroke-width="1.2"/><path d="M6 3.5V6L7.5 7.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>
                  <template v-if="item.type === 'movie' || item.type === 'documentary'">{{ displayDuration(item.duration) }}</template>
                  <template v-else>{{ item.episodes.length }} ep &middot; {{ formatMinutes(seriesTotalMinutes(item)) }} total</template>
                </span>
              </div>
              <div class="flex">
                <h2 class="font-serif text-lg font-medium text-neutral-900 dark:text-neutral-100 leading-snug mb-1">{{ item.name }}</h2>
                <p class="ml-2 text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed mb-3">- {{ item.description }}</p>
              </div>
              <div class="flex">
                <div class="flex flex-wrap gap-1.5">
                  <button
                    v-for="tag in item.tags"
                    :key="tag"
                    @click="toggleTag(tag)"
                    :class="['text-[11px] px-2.5 py-0.5 rounded-full border transition-all', activeTags.includes(tag) ? 'bg-amber-950/50 text-amber-400 border-amber-800' : 'text-[10px] px-2 py-0.5 rounded-full bg-blue-950 dark:bg-blue-50 text-blue-50 dark:text-blue-500 border border-blue-900/50']"
                  >{{ tag }}</button>
                </div>
                <div class="ml-auto flex items-center gap-3">
                  <a v-if="item.type === 'movie' || item.type === 'documentary' || (item.type === 'docuseries' && item.url)" :href="item.url" target="_blank" class="inline-flex items-center gap-2 text-sm font-medium text-amber-500 hover:gap-3 transition-all">
                    Watch now
                    <svg class="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none"><path d="M2.5 7H11.5M7.5 3L11.5 7L7.5 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  </a>
                  <button v-if="item.type === 'docuseries'" @click="toggle(item)" class="inline-flex items-center gap-2 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors">
                    <svg class="w-3.5 h-3.5 transition-transform duration-200" :class="{ 'rotate-180': isOpen(item) }" viewBox="0 0 14 14" fill="none"><path d="M3 5L7 9L11 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    {{ isOpen(item) ? 'Hide episodes' : `${item.episodes.length} episodes` }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Episodes panel -->
            <div v-if="item.type === 'docuseries' && isOpen(item)" class="border-t border-neutral-800 bg-neutral-950">
              <div
                v-for="ep in filterEpisodes(item)"
                :key="ep.url"
                class="flex items-center justify-between gap-4 px-5 py-3 border-b border-neutral-900 last:border-b-0 hover:bg-neutral-900/40 transition-colors"
              >
                <div class="flex flex-col gap-1.5 min-w-0">
                  <div>
                    <span class="text-sm font-medium text-neutral-300 truncate">{{ ep.title }}</span>
                    <span v-if="ep.cost === 'Free'" class="ml-2 text-[10px] font-medium tracking-widest uppercase px-2 py-0.5 rounded bg-green-950 text-green-500 border border-green-900">Free</span>
                  </div>
                  <div class="flex flex-wrap gap-1">
                    <span v-for="t in ep.tags ?? []" :key="t" class="text-[10px] px-2 py-0.5 rounded-full bg-blue-950/50 text-blue-500 border border-blue-900/50">{{ t }}</span>
                  </div>
                </div>
                <div class="flex items-center gap-3 shrink-0">
                  <span class="flex items-center gap-1 text-xs text-neutral-600 tabular-nums">
                    <svg class="w-3 h-3 shrink-0" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="4.5" stroke="currentColor" stroke-width="1.1"/><path d="M6 3.5V6L7.5 7.5" stroke="currentColor" stroke-width="1.1" stroke-linecap="round"/></svg>
                    {{ ep.duration }}
                  </span>
                  <a :href="ep.url" target="_blank" class="text-xs font-medium text-blue-400 border border-blue-900/60 rounded-md px-2.5 py-1 hover:bg-blue-950/40 hover:text-blue-300 transition-all">Watch</a>
                </div>
              </div>
            </div>
          </article>
        </div>
      </main>
    </div>

    <!-- ── MOBILE LAYOUT (< md) ────────────────────────────────── -->
    <div class="flex flex-col md:hidden min-h-screen">

      <!-- Mobile sticky top bar -->
      <header class="sticky top-0 z-20 bg-neutral-950/95 backdrop-blur border-b border-neutral-900 px-4 py-3 flex items-center justify-between gap-3">
        <div class="flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
          <button @click="sortMode = 'name'" :class="['shrink-0 text-xs px-3 py-1.5 rounded-full border transition-all', sortMode === 'name' ? 'bg-blue-950 border-blue-700 text-blue-300' : 'bg-neutral-900 border-neutral-800 text-neutral-500']">A–Z</button>
          <button @click="sortMode = 'duration-asc'" :class="['shrink-0 text-xs px-3 py-1.5 rounded-full border transition-all', sortMode === 'duration-asc' ? 'bg-violet-950 border-violet-700 text-violet-300' : 'bg-neutral-900 border-neutral-800 text-neutral-500']">Shortest</button>
          <button @click="sortMode = 'duration-desc'" :class="['shrink-0 text-xs px-3 py-1.5 rounded-full border transition-all', sortMode === 'duration-desc' ? 'bg-violet-950 border-violet-700 text-violet-300' : 'bg-neutral-900 border-neutral-800 text-neutral-500']">Longest</button>
        </div>
        <button
          @click="filterDrawerOpen = true"
          class="shrink-0 flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-neutral-800 bg-neutral-900 text-neutral-400 active:bg-neutral-800 transition-colors"
        >
          <svg class="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none"><path d="M1.5 3.5h11M3.5 7h7M5.5 10.5h3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
          Filters
          <span v-if="activeFilterCount > 0" class="bg-blue-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold">{{ activeFilterCount }}</span>
        </button>
      </header>

      <!-- Active filter chips -->
      <div v-if="activeFilterCount > 0" class="px-4 pt-3 pb-1 flex gap-2 overflow-x-auto scrollbar-hide">
        <button v-for="tag in activeTags" :key="tag" @click="toggleTag(tag)" class="shrink-0 flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full bg-amber-950/60 text-amber-400 border border-amber-800">
          {{ tag }}<svg class="w-3 h-3" viewBox="0 0 12 12" fill="none"><path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
        </button>
        <button v-if="activeTypes.includes('movie')" @click="toggleType('movie')" class="shrink-0 flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full bg-amber-950/60 text-amber-400 border border-amber-800">
          Films<svg class="w-3 h-3" viewBox="0 0 12 12" fill="none"><path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
        </button>
        <button v-if="activeTypes.includes('documentary')" @click="toggleType('documentary')" class="shrink-0 flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full bg-violet-950/60 text-violet-400 border border-violet-800">
          Documentaries<svg class="w-3 h-3" viewBox="0 0 12 12" fill="none"><path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
        </button>
        <button v-if="activeTypes.includes('docuseries')" @click="toggleType('docuseries')" class="shrink-0 flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full bg-blue-950/60 text-blue-400 border border-blue-800">
          Series<svg class="w-3 h-3" viewBox="0 0 12 12" fill="none"><path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
        </button>
        <button v-if="freeOnly" @click="freeOnly = false" class="shrink-0 flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full bg-green-950/60 text-green-400 border border-green-800">
          Free<svg class="w-3 h-3" viewBox="0 0 12 12" fill="none"><path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
        </button>
        <button v-if="durationFilterActive" @click="resetDuration" class="shrink-0 flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full bg-violet-950/60 text-violet-400 border border-violet-800">
          {{ formatMinutes(rangeMin) }}–{{ formatMinutes(rangeMax) }}<svg class="w-3 h-3" viewBox="0 0 12 12" fill="none"><path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
        </button>
      </div>

      <!-- Result count -->
      <div class="px-4 py-2 border-b border-neutral-900">
        <span class="text-xs text-neutral-600">{{ filtered.length }} title{{ filtered.length !== 1 ? 's' : '' }}</span>
      </div>

      <!-- Mobile content list -->
      <main class="flex-1 flex flex-col gap-2 p-3 pb-24">
        <div v-if="filtered.length === 0" class="flex flex-col items-center justify-center py-20 gap-4 text-neutral-600">
          <p class="text-sm">No titles match your filters.</p>
          <button @click="clearAll" class="text-sm border border-neutral-800 rounded-lg px-4 py-2 hover:text-neutral-200 hover:border-neutral-700 transition-all">Clear filters</button>
        </div>

        <article
          v-for="item in filtered"
          :key="key(item)"
          :class="['rounded-xl border transition-colors overflow-hidden', isOpen(item) ? 'border-blue-700' : 'border-blue-950']"
        >
          <div class="bg-neutral-900 px-4 py-3">
            <div class="flex items-center gap-2 mb-2">
              <span :class="['text-[10px] font-medium tracking-widest uppercase px-2 py-0.5 rounded', item.type === 'movie' ? 'bg-amber-950 text-amber-500 border border-amber-900' : item.type === 'documentary' ? 'bg-violet-950 text-violet-400 border border-violet-800' : 'bg-blue-950 text-blue-400 border border-blue-900']">
                {{ item.type === 'movie' ? 'Film' : item.type === 'documentary' ? 'Documentary' : 'Series' }}
              </span>
              <span v-if="item.cost === 'Free'" class="text-[10px] font-medium tracking-widest uppercase px-2 py-0.5 rounded bg-green-950 text-green-500 border border-green-900">Free</span>
              <span v-else-if="item.cost === 'Partial Free'" class="text-[10px] font-medium tracking-widest uppercase px-2 py-0.5 rounded bg-yellow-500 text-yellow-950">Partial</span>
              <span class="ml-auto flex items-center gap-1 text-xs text-neutral-500 tabular-nums">
                <svg class="w-3 h-3" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="4.5" stroke="currentColor" stroke-width="1.2"/><path d="M6 3.5V6L7.5 7.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>
                <template v-if="item.type === 'movie' || item.type === 'documentary'">{{ displayDuration(item.duration) }}</template>
                <template v-else>{{ item.episodes.length }} ep</template>
              </span>
            </div>
            <h2 class="font-serif text-base font-medium text-neutral-100 leading-snug mb-1">{{ item.name }}</h2>
            <p class="text-sm text-neutral-500 leading-relaxed mb-3">{{ item.description }}</p>
            <div class="flex flex-wrap gap-1.5 mb-3">
              <button
                v-for="tag in item.tags"
                :key="tag"
                @click="toggleTag(tag)"
                :class="['text-[11px] px-2.5 py-0.5 rounded-full border transition-all', activeTags.includes(tag) ? 'bg-amber-950/50 text-amber-400 border-amber-800' : 'bg-blue-950 text-blue-400 border border-blue-900/50']"
              >{{ tag }}</button>
            </div>
            <div class="flex items-center justify-end gap-4">
              <a v-if="item.type === 'movie' || item.type === 'documentary' || (item.type === 'docuseries' && item.url)" :href="item.url" target="_blank" class="inline-flex items-center gap-1.5 text-sm font-medium text-amber-500">
                Watch now
                <svg class="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none"><path d="M2.5 7H11.5M7.5 3L11.5 7L7.5 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </a>
              <button v-if="item.type === 'docuseries'" @click="toggle(item)" class="inline-flex items-center gap-1.5 text-sm font-medium text-blue-400">
                <svg class="w-3.5 h-3.5 transition-transform duration-200" :class="{ 'rotate-180': isOpen(item) }" viewBox="0 0 14 14" fill="none"><path d="M3 5L7 9L11 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                {{ isOpen(item) ? 'Hide' : `${item.episodes.length} episodes` }}
              </button>
            </div>
          </div>

          <!-- Episodes panel -->
          <div v-if="item.type === 'docuseries' && isOpen(item)" class="border-t border-neutral-800 bg-neutral-950">
            <div
              v-for="ep in filterEpisodes(item)"
              :key="ep.url"
              class="flex items-start justify-between gap-3 px-4 py-3 border-b border-neutral-900 last:border-b-0"
            >
              <div class="flex flex-col gap-1.5 min-w-0">
                <div class="flex flex-wrap items-center gap-1.5">
                  <span class="text-sm font-medium text-neutral-300">{{ ep.title }}</span>
                  <span v-if="ep.cost === 'Free'" class="text-[10px] font-medium tracking-widest uppercase px-1.5 py-px rounded bg-green-950 text-green-500 border border-green-900">Free</span>
                </div>
                <div class="flex flex-wrap gap-1">
                  <span v-for="t in ep.tags ?? []" :key="t" class="text-[10px] px-2 py-0.5 rounded-full bg-blue-950/50 text-blue-500 border border-blue-900/50">{{ t }}</span>
                </div>
              </div>
              <div class="flex flex-col items-end gap-2 shrink-0">
                <span class="flex items-center gap-1 text-xs text-neutral-600 tabular-nums">
                  <svg class="w-3 h-3" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="4.5" stroke="currentColor" stroke-width="1.1"/><path d="M6 3.5V6L7.5 7.5" stroke="currentColor" stroke-width="1.1" stroke-linecap="round"/></svg>
                  {{ ep.duration }}
                </span>
                <a :href="ep.url" target="_blank" class="text-xs font-medium text-blue-400 border border-blue-900/60 rounded-md px-2.5 py-1.5 bg-blue-950/20">Watch</a>
              </div>
            </div>
          </div>
        </article>
      </main>

      <!-- ── MOBILE FILTER DRAWER ── -->
      <Transition name="fade">
        <div v-if="filterDrawerOpen" @click="filterDrawerOpen = false" class="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm" />
      </Transition>

      <Transition name="slide-up">
        <div v-if="filterDrawerOpen" class="fixed bottom-0 inset-x-0 z-40 bg-neutral-950 border-t border-neutral-800 rounded-t-2xl max-h-[85vh] flex flex-col">
          <div class="flex flex-col items-center pt-3 pb-2 px-5 border-b border-neutral-900">
            <div class="w-10 h-1 rounded-full bg-neutral-700 mb-3" />
            <div class="w-full flex items-center justify-between">
              <span class="text-sm font-medium text-neutral-200">Filters</span>
              <div class="flex items-center gap-3">
                <button v-if="activeFilterCount > 0" @click="clearAll" class="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-neutral-200 transition-colors">
                  Clear all
                  <span class="bg-neutral-800 rounded-full px-1.5 py-px text-[10px]">{{ activeFilterCount }}</span>
                </button>
                <button @click="filterDrawerOpen = false" class="text-neutral-500 hover:text-neutral-200 transition-colors p-1">
                  <svg class="w-4 h-4" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
                </button>
              </div>
            </div>
          </div>

          <div class="overflow-y-auto flex-1 px-5 py-4 flex flex-col gap-6">

            <!-- Availability -->
            <div class="flex flex-col gap-3">
              <p class="text-[11px] font-medium tracking-wider uppercase text-neutral-500 m-0">Availability</p>
              <button
                @click="freeOnly = !freeOnly"
                :class="['flex items-center gap-3 px-4 py-3 rounded-xl border text-sm transition-all text-left', freeOnly ? 'bg-green-950 border-green-700 text-green-400' : 'bg-neutral-900 border-neutral-800 text-neutral-400']"
              >
                <span :class="['w-2.5 h-2.5 rounded-full shrink-0', freeOnly ? 'bg-green-400' : 'bg-neutral-700']" />
                Free to watch
              </button>
            </div>

            <!-- Format -->
            <div class="flex flex-col gap-3">
              <p class="text-[11px] font-medium tracking-wider uppercase text-neutral-500 m-0">Format</p>
              <div class="grid grid-cols-2 gap-2">
                <button @click="toggleType('movie')" :class="['flex items-center gap-2 px-4 py-3 rounded-xl border text-sm transition-all', activeTypes.includes('movie') ? 'bg-amber-950 border-amber-700 text-amber-400' : 'bg-neutral-900 border-neutral-800 text-neutral-400']">
                  <svg class="w-4 h-4 shrink-0" viewBox="0 0 14 14" fill="none"><rect x="1" y="2.5" width="12" height="9" rx="1.5" stroke="currentColor" stroke-width="1.3"/><path d="M5.5 5L9.5 7L5.5 9V5Z" fill="currentColor"/></svg>
                  Films
                </button>
                <button @click="toggleType('documentary')" :class="['flex items-center gap-2 px-4 py-3 rounded-xl border text-sm transition-all', activeTypes.includes('documentary') ? 'bg-violet-950 border-violet-700 text-violet-400' : 'bg-neutral-900 border-neutral-800 text-neutral-400']">
                  <svg class="w-4 h-4 shrink-0" viewBox="0 0 14 14" fill="none"><rect x="1" y="2.5" width="12" height="9" rx="1.5" stroke="currentColor" stroke-width="1.3"/><path d="M5.5 5L9.5 7L5.5 9V5Z" fill="currentColor"/></svg>
                  Docs
                </button>
                <button @click="toggleType('docuseries')" :class="['flex items-center col-span-2 gap-2 px-4 py-3 rounded-xl border text-sm transition-all', activeTypes.includes('docuseries') ? 'bg-blue-950 border-blue-700 text-blue-400' : 'bg-neutral-900 border-neutral-800 text-neutral-400']">
                  <svg class="w-4 h-4 shrink-0" viewBox="0 0 14 14" fill="none"><rect x="1" y="1" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.3"/><rect x="8" y="1" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.3"/><rect x="1" y="8" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.3"/><rect x="8" y="8" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.3"/></svg>
                  Series
                </button>
              </div>
            </div>

            <!-- Duration (mobile drawer) — custom touch-safe slider -->
            <div class="flex flex-col gap-3">
              <div class="flex items-center justify-between">
                <p class="text-[11px] font-medium tracking-wider uppercase text-neutral-500 m-0">Duration</p>
                <button v-if="durationFilterActive" @click="resetDuration" class="text-[11px] text-neutral-500 hover:text-neutral-300 transition-colors">Reset</button>
              </div>
              <div class="flex items-center justify-between text-sm tabular-nums">
                <span :class="durationFilterActive ? 'text-violet-400' : 'text-neutral-500'">{{ formatMinutes(rangeMin) }}</span>
                <span :class="durationFilterActive ? 'text-violet-400' : 'text-neutral-500'">{{ formatMinutes(rangeMax) }}</span>
              </div>

              <!-- Custom dual-thumb track (mobile) -->
              <div
                ref="mobileSliderTrackRef"
                class="relative h-8 flex items-center select-none touch-none"
                @mousemove="onDragMove($event, mobileSliderTrackRef)"
                @mouseup="stopDrag"
                @mouseleave="stopDrag"
                @touchmove.prevent="onDragMove($event, mobileSliderTrackRef)"
                @touchend="stopDrag"
                @touchcancel="stopDrag"
              >
                <div class="absolute inset-x-0 h-1.5 bg-neutral-800 rounded-full pointer-events-none">
                  <div class="absolute h-full rounded-full" :class="durationFilterActive ? 'bg-violet-600' : 'bg-neutral-600'" :style="{ left: fillLeft + '%', right: fillRight + '%' }" />
                </div>
                <!-- Min thumb -->
                <div
                  class="absolute w-6 h-6 rounded-full bg-violet-600 border-2 border-violet-900 shadow-lg cursor-grab active:cursor-grabbing -translate-x-1/2 z-10"
                  :style="{ left: fillLeft + '%' }"
                  @mousedown.stop="startDrag('min', $event)"
                  @touchstart.prevent.stop="startDrag('min', $event)"
                />
                <!-- Max thumb -->
                <div
                  class="absolute w-6 h-6 rounded-full bg-violet-600 border-2 border-violet-900 shadow-lg cursor-grab active:cursor-grabbing -translate-x-1/2 z-10"
                  :style="{ left: (100 - fillRight) + '%' }"
                  @mousedown.stop="startDrag('max', $event)"
                  @touchstart.prevent.stop="startDrag('max', $event)"
                />
              </div>

              <div class="flex gap-2">
                <button
                  v-for="p in durationPresets"
                  :key="p.label"
                  @click="applyPreset(p.max)"
                  :class="['flex-1 text-xs py-2 rounded-lg border transition-all', rangeMax === Math.min(p.max, sliderMax) && rangeMin === sliderMin ? 'bg-violet-950 border-violet-700 text-violet-400' : 'bg-neutral-900 border-neutral-800 text-neutral-500']"
                >{{ p.label }}</button>
              </div>
            </div>

            <!-- Topics -->
            <div class="flex flex-col gap-3">
              <p class="text-[11px] font-medium tracking-wider uppercase text-neutral-500 m-0">Topics</p>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="tag in allTags"
                  :key="tag"
                  @click="toggleTag(tag)"
                  :class="['text-sm px-3 py-2 rounded-lg border transition-all', activeTags.includes(tag) ? 'bg-amber-950/60 text-amber-400 border-amber-800' : 'bg-neutral-900 border-neutral-800 text-neutral-500']"
                >{{ tag }}</button>
              </div>
            </div>
          </div>

          <div class="px-5 py-4 border-t border-neutral-900">
            <button
              @click="filterDrawerOpen = false"
              class="w-full py-3.5 rounded-xl bg-blue-700 text-white text-sm font-medium active:bg-blue-800 transition-colors"
            >
              Show {{ filtered.length }} title{{ filtered.length !== 1 ? 's' : '' }}
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
/* Drawer transitions */
.fade-enter-active, .fade-leave-active { transition: opacity 0.25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-up-enter-active, .slide-up-leave-active { transition: transform 0.3s cubic-bezier(0.32, 0.72, 0, 1); }
.slide-up-enter-from, .slide-up-leave-to { transform: translateY(100%); }

.scrollbar-hide { scrollbar-width: none; -ms-overflow-style: none; }
.scrollbar-hide::-webkit-scrollbar { display: none; }
</style>