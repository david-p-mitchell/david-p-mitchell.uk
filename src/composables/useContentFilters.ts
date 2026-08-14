import { ref, computed, onMounted, watch } from "vue";
// Adjust this import to wherever your ContentItem type actually lives.
import type { ContentItem } from "../data/movies";

export type SortMode = "name" | "duration-asc" | "duration-desc";
export type ContentType = "movie" | "docuseries" | "documentary";

export function parseDurationMinutes(duration: string): number {
  const parts = duration.split(":").map(Number);
  if (parts.length === 3) return parts[0] * 60 + parts[1] + parts[2] / 60;
  if (parts.length === 2) return parts[0] + parts[1] / 60;
  return 0;
}

export function formatMinutes(mins: number): string {
  if (mins < 60) return `${Math.round(mins)}m`;
  const h = Math.floor(mins / 60);
  const m = Math.round(mins % 60);
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

export function displayDuration(duration: string): string {
  return formatMinutes(parseDurationMinutes(duration));
}

export function seriesTotalMinutes(item: ContentItem): number {
  if (item.type !== "docuseries") return 0;
  return item.episodes.reduce((acc, ep) => acc + parseDurationMinutes(ep.duration), 0);
}

export function itemKey(item: ContentItem): string {
  return `${item.type}:${item.name}`;
}

export function useContentFilters(content: () => ContentItem[]) {
  const sortMode = ref<SortMode>("name");
  const open = ref<string | null>(null);
  const activeTags = ref<string[]>([]);
  const activeTypes = ref<ContentType[]>([]);
  const freeOnly = ref(false);

  const allDurationMinutes = computed(() => {
    const mins: number[] = [];
    for (const item of content()) {
      if (item.type === "movie" || item.type === "documentary") {
        mins.push(parseDurationMinutes(item.duration));
      } else {
        for (const ep of item.episodes) mins.push(parseDurationMinutes(ep.duration));
      }
    }
    return mins;
  });

  const sliderMin = computed(() => Math.floor(Math.min(...allDurationMinutes.value)));
  const sliderMax = computed(() => Math.ceil(Math.max(...allDurationMinutes.value)));

  const rangeMin = ref(0);
  const rangeMax = ref(9999);

  onMounted(() => {
    rangeMin.value = sliderMin.value;
    rangeMax.value = sliderMax.value;
  });
  watch(sliderMin, v => { if (rangeMin.value === 0) rangeMin.value = v; });
  watch(sliderMax, v => { if (rangeMax.value === 9999) rangeMax.value = v; });

  const durationFilterActive = computed(
    () => rangeMin.value > sliderMin.value || rangeMax.value < sliderMax.value
  );

  const durationPresets = [
    { label: "< 30m", max: 30 },
    { label: "< 90m", max: 90 },
    { label: "< 2h", max: 120 },
  ];

  function applyPreset(maxVal: number) {
    rangeMin.value = sliderMin.value;
    rangeMax.value = Math.min(maxVal, sliderMax.value);
  }

  function resetDuration() {
    rangeMin.value = sliderMin.value;
    rangeMax.value = sliderMax.value;
  }

  function getAllTags(item: ContentItem): string[] {
    if (item.show === false) return [];
    if (item.type === "movie" || item.type === "documentary") return item.tags;
    return [...item.tags, ...item.episodes.flatMap(ep => ep.tags ?? [])];
  }

  function filterEpisodes(item: ContentItem) {
    if (item.type !== "docuseries") return [];
    let episodes = item.episodes;

    if (activeTags.value.length) {
      episodes = episodes.filter(ep =>
        activeTags.value.every(tag => (ep.tags ?? []).includes(tag) || item.tags.includes(tag))
      );
    }
    if (durationFilterActive.value) {
      episodes = episodes.filter(ep => {
        const mins = parseDurationMinutes(ep.duration);
        return mins >= rangeMin.value && mins <= rangeMax.value;
      });
    }
    return freeOnly.value ? episodes.filter(ep => ep.cost === "Free") : episodes;
  }

  function matchesItem(item: ContentItem) {
    const allItemTags = getAllTags(item);
    const matchesTags = !activeTags.value.length || activeTags.value.every(t => allItemTags.includes(t));
    const matchesTypes = !activeTypes.value.length || activeTypes.value.includes(item.type);
    const matchesFree =
      !freeOnly.value ||
      item.cost === "Free" ||
      (item.type === "docuseries" && item.episodes.some(ep => ep.cost === "Free"));

    let matchesDuration = true;
    if (durationFilterActive.value) {
      const inRange = (mins: number) => mins >= rangeMin.value && mins <= rangeMax.value;
      matchesDuration =
        item.type === "docuseries"
          ? item.episodes.some(ep => inRange(parseDurationMinutes(ep.duration)))
          : inRange(parseDurationMinutes(item.duration));
    }

    return matchesTags && matchesTypes && matchesFree && matchesDuration;
  }

  const filtered = computed(() => {
    const durationOf = (item: ContentItem) =>
      item.type === "docuseries" ? seriesTotalMinutes(item) : parseDurationMinutes(item.duration);

    return content()
      .filter(item => (item.show ?? true) && matchesItem(item))
      .sort((a, b) =>
        sortMode.value === "name"
          ? a.name.localeCompare(b.name)
          : (durationOf(a) - durationOf(b)) * (sortMode.value === "duration-desc" ? -1 : 1)
      );
  });

  const allTags = computed(() => [...new Set(content().flatMap(getAllTags))].sort());

  const activeFilterCount = computed(
    () =>
      activeTags.value.length +
      activeTypes.value.length +
      (freeOnly.value ? 1 : 0) +
      (durationFilterActive.value ? 1 : 0)
  );

  function toggleTag(tag: string) {
    activeTags.value = activeTags.value.includes(tag)
      ? activeTags.value.filter(t => t !== tag)
      : [...activeTags.value, tag];
  }

  function toggleType(type: ContentType) {
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

  function isNonCostFiltering() {
    return activeTags.value.length > 0 || activeTypes.value.length > 0 || durationFilterActive.value;
  }

  function isOpen(item: ContentItem) {
    if (isNonCostFiltering()) return item.type === "docuseries" && matchesItem(item) && filterEpisodes(item).length > 0;
    return open.value === itemKey(item);
  }

  function toggle(item: ContentItem) {
    open.value = open.value === itemKey(item) ? null : itemKey(item);
  }

  return {
    sortMode, activeTags, activeTypes, freeOnly,
    sliderMin, sliderMax, rangeMin, rangeMax, durationFilterActive, durationPresets,
    applyPreset, resetDuration, filterEpisodes,
    filtered, allTags, activeFilterCount,
    toggleTag, toggleType, clearAll, isOpen, toggle,
  };
}