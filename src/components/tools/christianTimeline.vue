<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import type { Map as LeafletMap } from 'leaflet'
import { eras, people, type EraId, type Person } from '../../data/timelinePeople'
import { relations, relationLabels, solidTypes, type RelationType } from '../../data/timelineRelations'
import { journeys } from '../../data/timelineJourneys'

const MIN_YEAR = -2100
const MAX_YEAR = 1950
const LANE_HEIGHT = 32
const AXIS_HEIGHT = 32
const SIDE_PADDING = 24

const zoom = ref(1.2) // pixels per year
const activeEras = ref<EraId[]>(eras.map((e) => e.id))
const selectedId = ref<string>('abraham')
const tab = ref<'about' | 'journey'>('about')

const eraById = Object.fromEntries(eras.map((e) => [e.id, e])) as Record<EraId, (typeof eras)[number]>
const peopleById = Object.fromEntries(people.map((p) => [p.id, p])) as Record<string, Person>

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

const placedById = computed(() => new Map(placed.value.map((p) => [p.person.id, p])))

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

const selected = computed(() => peopleById[selectedId.value] ?? null)

// Relations for the selected person
interface RelatedItem {
  person: Person
  label: string
  type: RelationType
  note?: string
}

const related = computed<RelatedItem[]>(() => {
  const id = selectedId.value
  const items: RelatedItem[] = []
  for (const r of relations) {
    if (r.from === id && peopleById[r.to]) {
      items.push({ person: peopleById[r.to], label: relationLabels[r.type][0], type: r.type, note: r.note })
    } else if (r.to === id && peopleById[r.from]) {
      items.push({ person: peopleById[r.from], label: relationLabels[r.type][1], type: r.type, note: r.note })
    }
  }
  return items
})

const relatedIds = computed(() => new Set(related.value.map((r) => r.person.id)))

// Curved lines on the timeline from the selected person to their relations
const relationLines = computed(() => {
  const from = placedById.value.get(selectedId.value)
  if (!from) return []
  const x1 = from.left + from.barWidth / 2
  const y1 = from.top + 12
  return related.value.flatMap((r) => {
    const to = placedById.value.get(r.person.id)
    if (!to) return []
    const x2 = to.left + to.barWidth / 2
    const y2 = to.top + 12
    const mid = Math.abs(y2 - y1) < 1 ? y1 - 24 : (y1 + y2) / 2
    return [
      {
        key: `${r.person.id}-${r.type}`,
        d: `M ${x1} ${y1} C ${x1} ${mid}, ${x2} ${mid}, ${x2} ${y2}`,
        dashed: !solidTypes.includes(r.type),
      },
    ]
  })
})

// Journey map (Leaflet is loaded only when the Journey tab is opened)
const journey = computed(() => journeys[selectedId.value] ?? null)
const mapEl = ref<HTMLDivElement | null>(null)
let map: LeafletMap | null = null
let drawToken = 0

function destroyMap() {
  if (map) {
    map.remove()
    map = null
  }
}

async function drawMap() {
  const token = ++drawToken
  destroyMap()

  if (!journey.value) {
    tab.value = 'about'
    return
  }
  if (tab.value !== 'journey') return

  const stops = journey.value
  await nextTick()
  if (!mapEl.value) return

  const L = (await import('leaflet')).default
  await import('leaflet/dist/leaflet.css')
  if (token !== drawToken || !mapEl.value) return

  const instance = L.map(mapEl.value, { scrollWheelZoom: false })
  map = instance
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(instance)

  const points = stops.map((s) => [s.lat, s.lng] as [number, number])
  L.polyline(points, { color: '#4f46e5', weight: 3, dashArray: '6 6' }).addTo(instance)

  stops.forEach((s, i) => {
    const icon = L.divIcon({
      className: '',
      iconSize: [24, 24],
      iconAnchor: [12, 12],
      html: `<div class="flex size-6 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white ring-2 ring-white">${i + 1}</div>`,
    })
    const popup = document.createElement('div')
    const title = document.createElement('strong')
    title.textContent = `${i + 1}. ${s.place}`
    const body = document.createElement('p')
    body.textContent = s.note
    popup.append(title, body)
    L.marker([s.lat, s.lng], { icon }).bindPopup(popup).addTo(instance)
  })

  instance.fitBounds(points, { padding: [30, 30] })
}

watch([selectedId, tab], drawMap)
onBeforeUnmount(destroyMap)
</script>

<template>
  <section class="mx-auto w-full max-w-6xl px-4 py-8">
    <header class="mb-6">
      <h2 class="text-2xl font-bold text-slate-900 dark:text-slate-100">
        From Abraham to Spurgeon
      </h2>
      <p class="mt-1 text-sm text-slate-600 dark:text-slate-400">
        Lifespans drawn to scale. Select anyone to see how they connect to others, and, where available, their journeys on a map.
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

        <!-- Relation lines (behind the bars) -->
        <svg
          class="pointer-events-none absolute inset-0 text-slate-500 dark:text-slate-400"
          :width="trackWidth"
          :height="trackHeight"
          aria-hidden="true"
        >
          <path
            v-for="line in relationLines"
            :key="line.key"
            :d="line.d"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            :stroke-dasharray="line.dashed ? '5 4' : undefined"
          />
        </svg>

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
                : relatedIds.has(item.person.id)
                  ? 'ring-2 ring-slate-400 ring-offset-1 dark:ring-slate-500 dark:ring-offset-slate-900'
                  : 'opacity-80 hover:opacity-100',
            ]"
            :style="{ width: `${item.barWidth}px` }"
          />
          <span
            class="whitespace-nowrap text-sm"
            :class="
              selectedId === item.person.id
                ? 'font-semibold text-slate-900 dark:text-slate-100'
                : relatedIds.has(item.person.id)
                  ? 'font-medium text-slate-900 dark:text-slate-100'
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

    <p class="mt-2 text-xs text-slate-500 dark:text-slate-400">
      Solid lines show family, descent and succession. Dashed lines show teaching, influence and partnership.
    </p>

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

      <!-- Tabs (only when a journey exists) -->
      <div v-if="journey" class="mt-4 flex gap-2" role="group" aria-label="Detail view">
        <button
          type="button"
          :aria-pressed="tab === 'about'"
          class="rounded-full border px-3 py-1 text-sm font-medium transition-colors"
          :class="
            tab === 'about'
              ? 'border-slate-900 bg-slate-900 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900'
              : 'border-slate-300 text-slate-600 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-400 dark:hover:bg-slate-700'
          "
          @click="tab = 'about'"
        >
          About
        </button>
        <button
          type="button"
          :aria-pressed="tab === 'journey'"
          class="rounded-full border px-3 py-1 text-sm font-medium transition-colors"
          :class="
            tab === 'journey'
              ? 'border-slate-900 bg-slate-900 text-white dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900'
              : 'border-slate-300 text-slate-600 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-400 dark:hover:bg-slate-700'
          "
          @click="tab = 'journey'"
        >
          Journey ({{ journey.length }} stops)
        </button>
      </div>

      <!-- About + relations -->
      <div v-if="tab === 'about'">
        <p class="mt-3 leading-relaxed text-slate-700 dark:text-slate-300">
          {{ selected.summary }}
        </p>

        <div v-if="related.length" class="mt-5">
          <h4 class="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Connections
          </h4>
          <ul class="mt-2 divide-y divide-slate-200 dark:divide-slate-700">
            <li v-for="r in related" :key="`${r.person.id}-${r.type}-${r.label}`" class="py-2">
              <div class="flex flex-wrap items-baseline gap-x-2">
                <span class="text-sm text-slate-500 dark:text-slate-400">{{ r.label }}</span>
                <button
                  type="button"
                  class="text-sm font-semibold text-indigo-600 underline-offset-2 hover:underline dark:text-indigo-400"
                  @click="selectedId = r.person.id"
                >
                  {{ r.person.name }}
                </button>
              </div>
              <p v-if="r.note" class="mt-0.5 text-sm text-slate-600 dark:text-slate-400">
                {{ r.note }}
              </p>
            </li>
          </ul>
        </div>
      </div>

      <!-- Journey -->
      <div v-else-if="journey" class="mt-4">
        <div
          ref="mapEl"
          class="relative isolate z-0 h-80 w-full overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700"
        />
        <ol class="mt-4 space-y-2">
          <li v-for="(stop, i) in journey" :key="`${stop.place}-${i}`" class="flex gap-3 text-sm">
            <span
              class="flex size-6 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white"
            >
              {{ i + 1 }}
            </span>
            <span class="text-slate-700 dark:text-slate-300">
              <span class="font-semibold text-slate-900 dark:text-slate-100">{{ stop.place }}</span>
              <span v-if="stop.when" class="text-slate-500 dark:text-slate-400"> ({{ stop.when }})</span>
              &ndash; {{ stop.note }}
            </span>
          </li>
        </ol>
        <p class="mt-3 text-xs text-slate-500 dark:text-slate-400">
          The map shows modern borders and coastlines, and some ancient sites are traditional or debated identifications.
        </p>
      </div>
    </article>
  </section>
</template>