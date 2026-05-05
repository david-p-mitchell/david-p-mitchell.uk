<script setup lang="ts">
import { ref, computed } from "vue";
import type { ContentItem } from "../data/movies";

const props = defineProps<{
  content: ContentItem[];
}>();

const open = ref<string | null>(null);
const activeTags = ref<string[]>([]);
const activeTypes = ref<("movie" | "docuseries")[]>([]);

/* -------------------------
   KEY
--------------------------*/
function key(item: ContentItem) {
  return `${item.type}:${item.name}`;
}

/* -------------------------
   TAGS
--------------------------*/
const allTags = computed(() =>
  [...new Set(props.content.flatMap(c => c.tags))]
);

function toggleTag(tag: string) {
  activeTags.value = activeTags.value.includes(tag)
    ? activeTags.value.filter(t => t !== tag)
    : [...activeTags.value, tag];
}

/* -------------------------
   TYPES
--------------------------*/
function toggleType(type: "movie" | "docuseries") {
  activeTypes.value = activeTypes.value.includes(type)
    ? activeTypes.value.filter(t => t !== type)
    : [...activeTypes.value, type];
}

/* -------------------------
   FILTERED DATA
--------------------------*/
const filtered = computed(() => {
  return props.content.filter(item => {
    const matchesTags =
      !activeTags.value.length ||
      activeTags.value.every(tag => item.tags.includes(tag));

    const matchesTypes =
      !activeTypes.value.length ||
      activeTypes.value.includes(item.type);

    return matchesTags && matchesTypes;
  });
});

/* -------------------------
   TOGGLE DOCUSERIES
--------------------------*/
function toggle(item: ContentItem) {
  const k = key(item);
  open.value = open.value === k ? null : k;
}

function isOpen(item: ContentItem) {
  return open.value === key(item);
}
</script>

<template>
  <!-- FILTER BAR -->
  <div class="mb-6 space-y-3">

    <!-- TYPE FILTER -->
    <div class="flex gap-2">
      <button
        @click="toggleType('movie')"
        :class="[
          'px-3 py-1 text-sm rounded border',
          activeTypes.includes('movie')
            ? 'bg-black text-white'
            : 'bg-white'
        ]"
      >
        Movies
      </button>

      <button
        @click="toggleType('docuseries')"
        :class="[
          'px-3 py-1 text-sm rounded border',
          activeTypes.includes('docuseries')
            ? 'bg-black text-white'
            : 'bg-white'
        ]"
      >
        Docuseries
      </button>
    </div>

    <!-- TAG FILTERS -->
    <div class="flex flex-wrap gap-2">
      <button
        v-for="tag in allTags"
        :key="tag"
        @click="toggleTag(tag)"
        :class="[
          'px-2 py-1 text-xs rounded-full border',
          activeTags.includes(tag)
            ? 'bg-black text-white'
            : 'bg-gray-100'
        ]"
      >
        {{ tag }}
      </button>
    </div>
  </div>

  <!-- TABLE -->
  <div class="overflow-x-auto border rounded-lg">
    <table class="min-w-full text-sm">

      <!-- HEADER -->
      <thead class="bg-gray-50 text-left">
        <tr>
          <th class="p-3">Title</th>
          <th class="p-3">Description</th>
          <th class="p-3">Tags</th>
          <th class="p-3">Type</th>
          <th class="p-3"></th>
        </tr>
      </thead>

      <tbody>
        <template v-for="item in filtered" :key="key(item)">

          <!-- MAIN ROW -->
          <tr class="border-t align-top">

            <td class="p-3 font-medium">
              {{ item.name }}

              <!-- expand toggle for docuseries -->
              <button
                v-if="item.type === 'docuseries'"
                class="block mt-1 text-xs text-blue-600"
                @click="toggle(item)"
              >
                {{ isOpen(item) ? "Hide episodes" : "View episodes" }}
              </button>
            </td>

            <td class="p-3 text-gray-600">
              {{ item.description }}
            </td>

            <td class="p-3">
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="tag in item.tags"
                  :key="tag"
                  class="text-[10px] bg-gray-100 px-2 py-0.5 rounded-full"
                >
                  {{ tag }}
                </span>
              </div>
            </td>

            <td class="p-3 uppercase text-xs text-gray-400">
              {{ item.type }}
            </td>

            <td class="p-3 text-right">
              <a
                v-if="item.type === 'movie'"
                :href="item.url"
                target="_blank"
                class="text-blue-600"
              >
                Watch →
              </a>

              <span v-else class="text-gray-400 text-xs">
                {{ item.episodes.length }} episodes
              </span>
            </td>
          </tr>

          <!-- DOCUSERIES EXPANDED ROW -->
          <tr v-if="item.type === 'docuseries' && isOpen(item)">
            <td colspan="5" class="p-4 bg-gray-50">
              <div
                v-for="ep in item.episodes"
                :key="ep.url"
                class="flex justify-between items-start py-2 border-b last:border-b-0"
              >

                <!-- LEFT: TITLE + TAGS -->
                <div class="flex">
                  <div class="font-medium">
                    {{ ep.title }}
                  </div>

                  <div class="flex gap-1 mt-1 flex-wrap">
                    <span
                      v-for="t in ep.tags"
                      :key="t"
                      class="text-[10px] bg-blue-100 px-2 rounded-full"
                    >
                      {{ t }}
                    </span>
                  </div>
                </div>

                <!-- RIGHT: DURATION + ACTION -->
                <div class="flex items-center gap-4 text-right">

                  <span class="text-xs text-gray-400 whitespace-nowrap">
                    {{ ep.duration }}
                  </span>

                  <a
                    :href="ep.url"
                    target="_blank"
                    class="text-blue-600 whitespace-nowrap"
                  >
                    Watch →
                  </a>

                </div>

              </div>

            </td>
          </tr>

        </template>
      </tbody>

    </table>
  </div>
</template>