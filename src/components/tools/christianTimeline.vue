<script setup lang="ts">
import { computed, ref } from 'vue'
import { eras, people, type EraId, type Person } from '../../data/timelinePeople'

const MIN_YEAR = -2100
const MAX_YEAR = 1950
const LANE_HEIGHT = 32
const AXIS_HEIGHT = 32
const SIDE_PADDING = 24

const zoom = ref(1.2) // pixels per year
const activeEras = ref<EraId[]>(eras.map((e) => e.id))
const selectedId = ref<string>('abraham')

const eraById = Object.fromEntries(eras.map((e) => [e.id, e])) as Record<EraId, (typeof eras)[number]>

function toX(year: number) {
  return SIDE_PADDING + (year - MIN_YEAR) * zoom.value
}
    
function formatYear(year: number) {
  return year < 0 ? `${-year} BC` : `AD ${year}`
}

function formatRange(p: Person) {
  const prefix = p.approx ? 'c. ' : ''
  return `${prefix}${formatYear(p.start)} \u2013 ${prefix}${formatYear(p.end)}`
}

function toggleEra(id: EraId) {
  activeEras.value = activeEras.value.includes(id)
    ? activeEras.value.filter((e) => e !== id)
    : [...activeEras.value, id]
}

const visiblePeople = computed(() =>
  people.filter((p) => activeEras.value.includes(p.era)).sort((a, b) => a.start - b.start),
)

// Greedy lane packing: each person occupies their bar plus their label.
const placed = computed(() => {
  const laneEnds: number[] = []
  return visiblePeople.value.map((p) => {
    const left = toX(p.start)
    const barWidth = Math.max((p.end - p.start) * zoom.value, 10)
    const labelWidth = p.name.length * 7 + 24
    const extent = left + barWidth + labelWidth
    let lane = laneEnds.findIndex((end) => end + 8 <= left)
    if (lane === -1) {
      lane = laneEnds.length
      laneEnds.push(extent)
    } else {
      laneEnds[lane] = extent
    }
    return { person: p, left, barWidth, top: AXIS_HEIGHT + lane * LANE_HEIGHT + 4 }
  })
})

const trackWidth = computed(() => toX(MAX_YEAR) + SIDE_PADDING)
const trackHeight = computed(() => {
  const lanes = Math.max(...placed.value.map((p) => (p.top - AXIS_HEIGHT - 4) / LANE_HEIGHT + 1), 1)
  return AXIS_HEIGHT + lanes * LANE_HEIGHT + 8
})

const ticks = computed(() => {
  const result: { year: number; x: number; label: string }[] = []
  for (let y = -2000; y <= 1500; y += 500) {
    result.push({ year: y, x: toX(y), label: y === 0 ? 'AD 1' : formatYear(y) })
  }
  result.push({ year: 1900, x: toX(1900), label: 'AD 1900' })
  return result
})

const selected = computed(() => people.find((p) => p.id === selectedId.value) ?? null)
</script>

<template>
  <section class="mx-auto w-full max-w-6xl px-4 py-8">
    <header class="mb-6">
      <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-100">
        From Adam to Spurgeon
      </h2>
      <p class="mt-1 text-sm text-slate-600 dark:text-slate-400">
        Lifespans drawn to scale. Select anyone for details, filter by era, or zoom in on a period.
      </p>
    </header>

    <!-- Inline filters -->
    <div class="mb-4 flex flex-wrap items-center gap-2" role="group" aria-label="Filter by era">
      <button
        v-for="era in eras"
        :key="era.id"
        type="button"
        :aria-pressed="activeEras.includes(era.id)"
        class="rounded-full border px-3 py-1 text-sm font-medium transition-colors"
        :class="
          activeEras.includes(era.id)
            ? era.chipOn
            : 'border-slate-300 bg-transparent text-slate-600 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-400 dark:hover:bg-slate-800'
        "
        @click="toggleEra(era.id)"
      >
        {{ era.label }}
      </button>
    </div>

    <!-- Zoom -->
    <div class="mb-3 flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
      <label for="timeline-zoom" class="font-medium">Zoom</label>
      <input
        id="timeline-zoom"
        v-model.number="zoom"
        type="range"
        min="0.5"
        max="4"
        step="0.1"
        class="w-48 accent-indigo-500"
      />
    </div>

    <!-- Timeline track -->
    <div
      class="overflow-x-auto rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900"
    >
      <div class="relative" :style="{ width: `${trackWidth}px`, height: `${trackHeight}px` }">
        <!-- Axis ticks and gridlines -->
        <div
          v-for="tick in ticks"
          :key="tick.year"
          class="absolute inset-y-0 border-l border-slate-200 dark:border-slate-700"
          :style="{ left: `${tick.x}px` }"
        >
          <span class="absolute left-1 top-1 whitespace-nowrap text-xs text-slate-500 dark:text-slate-400">
            {{ tick.label }}
          </span>
        </div>

        <!-- People -->
        <button
          v-for="item in placed"
          :key="item.person.id"
          type="button"
          class="absolute flex h-6 items-center gap-2 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          :style="{ left: `${item.left}px`, top: `${item.top}px` }"
          :aria-label="`${item.person.name}, ${formatRange(item.person)}`"
          :aria-current="selectedId === item.person.id"
          @click="selectedId = item.person.id"
        >
          <span
            class="block h-4 rounded-full transition-all"
            :class="[
              eraById[item.person.era].bar,
              selectedId === item.person.id
                ? 'ring-2 ring-slate-900 ring-offset-2 dark:ring-slate-100 dark:ring-offset-slate-900'
                : 'opacity-80 hover:opacity-100',
            ]"
            :style="{ width: `${item.barWidth}px` }"
          />
          <span
            class="whitespace-nowrap text-sm"
            :class="
              selectedId === item.person.id
                ? 'font-semibold text-slate-900 dark:text-slate-100'
                : 'text-slate-700 dark:text-slate-300'
            "
          >
            {{ item.person.name }}
          </span>
        </button>

        <p
          v-if="placed.length === 0"
          class="absolute inset-x-0 top-16 text-center text-sm text-slate-500 dark:text-slate-400"
        >
          No eras selected.
        </p>
      </div>
    </div>

    <!-- Detail panel -->
    <article
      v-if="selected"
      class="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-800"
      aria-live="polite"
    >
      <div class="flex flex-wrap items-baseline justify-between gap-2">
        <h3 class="text-xl font-semibold text-slate-900 dark:text-slate-100">
          {{ selected.name }}
        </h3>
        <span class="text-sm text-slate-500 dark:text-slate-400">{{ formatRange(selected) }}</span>
      </div>
      <p class="mt-1 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
        <span class="inline-block size-2.5 rounded-full" :class="eraById[selected.era].bar" />
        {{ selected.role }} &middot; {{ eraById[selected.era].label }}
      </p>
      <p class="mt-3 leading-relaxed text-slate-700 dark:text-slate-300">
        {{ selected.summary }}
      </p>
    </article>
  </section>
</template>