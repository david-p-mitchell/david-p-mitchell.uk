<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

type Verse = { book: string; chapter: number; verse: number; text: string }

const reference = ref('Psalm 23')
const hideCommon = ref(true)
const merge = ref(true)
const grouped = ref(true)
const loading = ref(false)
const error = ref('')
const verses = ref<Verse[]>([])
const loadedRef = ref('')

const hovered = ref<string | null>(null)
const pinned = ref<string | null>(null)
const activeTheme = ref<string | null>(null) // pinned by click
const hoveredTheme = ref<string | null>(null) // from legend / group headings
const themeMode = ref(true) // hovering a word lights up its whole theme
const active = computed(() => hovered.value ?? pinned.value)

// Follow the site's dark mode (prefers-color-scheme) so colours stay readable
const isDark = ref(false)
onMounted(() => {
  const mq = window.matchMedia('(prefers-color-scheme: dark)')
  isDark.value = mq.matches
  mq.addEventListener('change', (e) => (isDark.value = e.matches))
})

/* ---------- Word forms (very light KJV-aware stemmer) ---------- */
const IRREG: Record<string, string> = {
  led: 'lead', gave: 'give', given: 'give', saw: 'see', seen: 'see', went: 'go', gone: 'go',
  came: 'come', took: 'take', taken: 'take', spake: 'speak', spoke: 'speak', spoken: 'speak',
  knew: 'know', known: 'know', brought: 'bring', sought: 'seek', heard: 'hear',
  died: 'die', dieth: 'die', dying: 'die', life: 'live', lives: 'live',
  men: 'man', children: 'child', fed: 'feed',
}
function stem(raw: string) {
  raw = raw.replace(/'s?$/, '')
  let w = IRREG[raw] ?? raw
  for (const suf of ['eth', 'est', 'ing', 'ed', 'es', 's']) {
    if (w.endsWith(suf) && w.length - suf.length >= 3) {
      if (suf === 's' && /(ss|us|is)$/.test(w)) break
      w = w.slice(0, -suf.length)
      break
    }
  }
  if (w.endsWith('e') && w.length > 3) w = w.slice(0, -1)
  return w
}

/* ---------- Themes: edit these freely ---------- */
const THEMES = [
  { id: 'guidance', label: 'Guidance & following', hue: 210,
    words: 'lead guide follow path way walk shepherd direct teach instruct steps journey wander wilderness' },
  { id: 'provision', label: 'Provision & rest', hue: 140,
    words: 'rest peace green pasture still water bread feed restore supply fill cup table anoint abundance sleep' },
  { id: 'comfort', label: 'Fear & comfort', hue: 28,
    words: 'fear afraid dread trouble comfort courage strong strength refuge shield shadow rod staff protect deliver save help hide strengthen' },
  { id: 'love', label: 'Love & mercy', hue: 335,
    words: 'love mercy grace kindness goodness favour compassion pity forgive pardon charity faithful' },
  { id: 'sin', label: 'Sin & judgment', hue: 0,
    words: 'sin iniquity transgression evil wicked wrath anger judgment judge condemn curse punish vengeance abomination ungodly unrighteous enemy enemies' },
  { id: 'worship', label: 'Worship & praise', hue: 270,
    words: 'praise worship bless sing glory thanks honour holy hallow magnify rejoice joy psalm prayer pray cry name' },
  { id: 'faith', label: 'Faith & trust', hue: 185,
    words: 'faith believe trust hope truth promise wait obey covenant word commandment law statute testimony' },
  { id: 'life', label: 'Life & death', hue: 45,
    words: 'life live death die dead grave resurrection eternal everlasting soul spirit blood rise' },
  { id: 'creation', label: 'Creation & world', hue: 95,
    words: 'earth heaven sea sky mountain hill field tree river sun moon star light darkness day night world' },
]
const THEME_BY_STEM = new Map<string, (typeof THEMES)[number]>()
for (const t of THEMES) for (const w of t.words.split(/\s+/)) {
  const s = stem(w)
  if (!THEME_BY_STEM.has(s)) THEME_BY_STEM.set(s, t)
}
const themeById = (id: string) => THEMES.find((t) => t.id === id)

const STOPWORDS = new Set(
  `a an and are as at be but by for from had has have he her him his i if in into is it its me my
  not o of on or our out she shall so that the their them then there these they this those thee thou
  thy thine thyself to unto up us was we were what when which who whom will with ye you your yet
  hath doth art wilt shalt didst hast saith said say also all am no nor than upon`.split(/\s+/)
)

/* ---------- Loading ---------- */
async function load() {
  error.value = ''
  loading.value = true
  hovered.value = pinned.value = activeTheme.value = null
  try {
    const url = `https://bible-api.com/${encodeURIComponent(reference.value.trim())}?translation=kjv`
    const res = await fetch(url)
    if (!res.ok) throw new Error('Passage not found. Try something like "Romans 8" or "John 3:1-21".')
    const data = await res.json()
    loadedRef.value = data.reference
    verses.value = data.verses.map((v: any) => ({
      book: v.book_name,
      chapter: v.chapter,
      verse: v.verse,
      text: v.text.trim().replace(/\s+/g, ' '),
    }))
  } catch (e: any) {
    error.value = e.message ?? 'Something went wrong.'
    verses.value = []
  } finally {
    loading.value = false
  }
}

/* ---------- Derived data ---------- */
const keyOf = (raw: string) => (merge.value ? stem(raw) : raw)
const themeOfKey = (key: string) => THEME_BY_STEM.get(merge.value ? key : stem(key))

// `initial` marks the first word of a verse or sentence, so its capital letter isn't treated as meaningful
const tokenised = computed(() =>
  verses.value.map((v) => {
    let initial = true
    const tokens = v.text.split(/([A-Za-z']+)/).filter(Boolean).map((t) => {
      if (!/^[A-Za-z']+$/.test(t)) {
        if (/[.!?]/.test(t)) initial = true
        return { t, key: null as string | null, theme: undefined as string | undefined, initial: false }
      }
      const key = keyOf(t.toLowerCase())
      const tok = { t, key: key as string | null, theme: themeOfKey(key)?.id as string | undefined, initial }
      initial = false
      return tok
    })
    return { ...v, tokens }
  })
)

// n = occurrences; cap/low/up = mid-sentence occurrences that are Capitalised / lowercase / ALL CAPS
type FormStat = { n: number; cap: number; low: number; up: number }

const index = computed(() => {
  const idx = new Map<string, Map<number, number>>()
  const forms = new Map<string, Map<string, FormStat>>()
  for (const v of tokenised.value) for (const tok of v.tokens) {
    if (!tok.key) continue
    const m = idx.get(tok.key) ?? new Map<number, number>()
    m.set(v.verse, (m.get(v.verse) ?? 0) + 1)
    idx.set(tok.key, m)
    const f = forms.get(tok.key) ?? new Map<string, FormStat>()
    const raw = tok.t.toLowerCase()
    const s = f.get(raw) ?? { n: 0, cap: 0, low: 0, up: 0 }
    s.n++
    if (!tok.initial) {
      if (/^[A-Z]/.test(tok.t)) {
        s.cap++
        if (tok.t.length > 1 && tok.t === tok.t.toUpperCase()) s.up++
      } else s.low++
    }
    f.set(raw, s)
    forms.set(tok.key, f)
  }
  return { idx, forms }
})

const totalFor = (key: string) => [...(index.value.idx.get(key)?.values() ?? [])].reduce((a, b) => a + b, 0)
// Show a word capitalised (or ALL CAPS) only if that's how it mostly appears mid-sentence, e.g. God, Lord
const display = (w: string, s: FormStat) =>
  s.cap > s.low ? (s.up > s.cap / 2 ? w.toUpperCase() : w[0].toUpperCase() + w.slice(1)) : w
const formsFor = (key: string) =>
  [...(index.value.forms.get(key)?.entries() ?? [])]
    .sort((a, b) => b[1].n - a[1].n || a[0].localeCompare(b[0]))
    .map(([w, s]) => display(w, s))
const labelFor = (key: string) => formsFor(key)[0] ?? key

const cloudWords = computed(() => {
  const entries = [...index.value.idx.keys()]
    .filter((k) => {
      const forms = formsFor(k)
      if (labelFor(k).length < 2) return false
      return !(hideCommon.value && forms.every((f) => STOPWORDS.has(f.toLowerCase())))
    })
    .map((key) => ({ key, label: labelFor(key), count: totalFor(key), theme: themeOfKey(key) }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
    .slice(0, 100)
  if (!entries.length) return []
  const max = entries[0].count
  const min = entries[entries.length - 1].count
  const factor = grouped.value ? 0.7 : 1
  return entries.map((e) => {
    const t = max === min ? 0.5 : (e.count - min) / (max - min)
    return { ...e, size: (1.15 + Math.sqrt(t) * 3.3) * factor }
  })
})

const layout = computed(() => {
  const words = cloudWords.value
  if (!grouped.value) {
    return [{ id: 'all', label: '', hue: 0, total: 0, heading: false, words }]
  }
  const groups = new Map<string, typeof words>()
  for (const w of words) {
    const id = w.theme?.id ?? 'other'
    groups.set(id, [...(groups.get(id) ?? []), w])
  }
  return [...groups.entries()]
    .map(([id, ws]) => ({
      id,
      label: themeById(id)?.label ?? 'Other words',
      hue: themeById(id)?.hue ?? 220,
      total: ws.reduce((a, w) => a + w.count, 0),
      heading: true,
      words: ws,
    }))
    .sort((a, b) => (a.id === 'other' ? 1 : b.id === 'other' ? -1 : b.total - a.total))
})

const info = computed(() => {
  const key = active.value
  if (!key) return null
  const m = index.value.idx.get(key)
  if (!m) return null
  return {
    label: labelFor(key),
    forms: formsFor(key),
    theme: themeOfKey(key),
    count: totalFor(key),
    verses: [...m.entries()].map(([verse, n]) => ({ verse, n })),
  }
})

/* ---------- Helpers ---------- */
const colour = (hue: number | undefined, a = 1) =>
  hue === undefined
    ? `hsl(220 12% ${isDark.value ? 72 : 38}% / ${a})`
    : `hsl(${hue} ${isDark.value ? 75 : 70}% ${isDark.value ? 72 : 34}% / ${a})`

// The theme currently lit up: legend/heading hover, else the hovered/pinned word's theme, else a pinned theme
const currentTheme = computed<string | null>(() => {
  if (hoveredTheme.value) return hoveredTheme.value
  if (themeMode.value && active.value) {
    const t = themeOfKey(active.value)
    if (t) return t.id
  }
  return activeTheme.value
})

const dimmed = (w: { key: string; theme?: { id: string } }) =>
  currentTheme.value
    ? (w.theme?.id ?? 'other') !== currentTheme.value
    : !!active.value && active.value !== w.key

const legend = computed(() => {
  const totals = new Map<string, number>()
  for (const w of cloudWords.value) if (w.theme) totals.set(w.theme.id, (totals.get(w.theme.id) ?? 0) + w.count)
  return [...totals.entries()]
    .map(([id, total]) => ({ id, total, label: themeById(id)!.label, hue: themeById(id)!.hue }))
    .sort((a, b) => b.total - a.total)
})

const togglePin = (k: string) => (pinned.value = pinned.value === k ? null : k)
const toggleTheme = (id: string) => (activeTheme.value = activeTheme.value === id ? null : id)
const jumpTo = (verse: number) =>
  document.getElementById(`bwc-v-${verse}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
</script>

<template>
  <div class="w-full space-y-4 text-gray-900 dark:text-gray-100">
    <form class="flex flex-wrap items-center gap-3" @submit.prevent="load">
      <input
        v-model="reference"
        type="text"
        placeholder="e.g. Romans 8 or John 3:1-21"
        class="min-w-0 flex-1 rounded border border-gray-300 bg-white px-3 py-2 text-black"
      />
      <button type="submit" :disabled="loading" class="rounded bg-indigo-600 px-4 py-2 text-white disabled:opacity-50">
        {{ loading ? 'Loading…' : 'Generate' }}
      </button>
      <label class="flex items-center gap-2 text-sm"><input v-model="hideCommon" type="checkbox" /> Hide common words</label>
      <label class="flex items-center gap-2 text-sm"><input v-model="merge" type="checkbox" /> Merge word forms</label>
      <label class="flex items-center gap-2 text-sm"><input v-model="grouped" type="checkbox" /> Group by theme</label>
      <label class="flex items-center gap-2 text-sm"><input v-model="themeMode" type="checkbox" /> Highlight whole theme</label>
    </form>

    <p v-if="error" class="text-red-600 dark:text-red-400">{{ error }}</p>

    <div v-if="cloudWords.length" class="grid gap-4 lg:grid-cols-[1fr_16rem]">
      <div class="min-w-0 space-y-4">
        <h2 class="text-xl font-semibold">{{ loadedRef }} (KJV)</h2>

        <!-- Theme legend (grouped mode uses the group headings instead) -->
        <div v-if="!grouped" class="flex flex-wrap gap-2">
          <button
            v-for="c in legend"
            :key="c.id"
            type="button"
            class="rounded-full border px-3 py-1 text-xs font-semibold transition-opacity"
            :class="currentTheme && currentTheme !== c.id ? 'opacity-40' : ''"
            :style="{
              color: colour(c.hue),
              borderColor: colour(c.hue, 0.6),
              backgroundColor: activeTheme === c.id ? colour(c.hue, 0.2) : undefined,
            }"
            @mouseenter="hoveredTheme = c.id"
            @mouseleave="hoveredTheme = null"
            @click="toggleTheme(c.id)"
          >
            {{ c.label }} · {{ c.total }}
          </button>
        </div>

        <!-- Cloud -->
        <div
          class="flex flex-wrap items-stretch justify-center gap-4 rounded-xl border border-gray-300 bg-white p-6 dark:border-gray-700 dark:bg-gray-900"
          style="min-height: 22rem"
          @mouseleave="hovered = null"
        >
          <div
            v-for="g in layout"
            :key="g.id"
            :class="g.heading ? 'min-w-[14rem] flex-1 rounded-lg border p-3 transition-opacity' : 'flex w-full flex-col justify-center'"
            :style="g.heading ? { borderColor: colour(g.id === 'other' ? undefined : g.hue, 0.5), opacity: currentTheme && currentTheme !== g.id ? 0.35 : 1 } : {}"
          >
            <button
              v-if="g.heading"
              type="button"
              class="mb-2 text-xs font-bold uppercase tracking-wider"
              :style="{ color: colour(g.id === 'other' ? undefined : g.hue) }"
              @mouseenter="hoveredTheme = g.id"
              @mouseleave="hoveredTheme = null"
              @click="toggleTheme(g.id)"
            >
              {{ g.label }} · {{ g.total }}
            </button>
            <div class="flex flex-wrap items-baseline justify-center gap-x-4 gap-y-1">
              <span
                v-for="w in g.words"
                :key="w.key"
                class="cursor-pointer font-semibold leading-tight transition-opacity"
                :class="[dimmed(w) ? 'opacity-25' : '', active === w.key ? 'underline' : '']"
                :style="{ fontSize: w.size + 'rem', color: colour(w.theme?.hue) }"
                @mouseenter="hovered = w.key"
                @click="togglePin(w.key)"
              >
                {{ w.label }}
              </span>
            </div>
          </div>
        </div>

        <!-- Passage -->
        <div
          class="space-y-2 rounded-xl border border-gray-300 bg-white p-5 font-serif text-lg leading-relaxed text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
          @mouseleave="hovered = null"
        >
          <p v-for="v in tokenised" :id="`bwc-v-${v.verse}`" :key="v.verse">
            <sup class="mr-1 text-xs font-bold text-gray-500 dark:text-gray-400">{{ v.verse }}</sup>
            <template v-for="(tok, i) in v.tokens" :key="i">
              <span
                v-if="tok.key"
                class="cursor-pointer rounded px-0.5 transition-opacity"
                :class="[
                  active === tok.key ? 'bg-yellow-300' : 'hover:bg-gray-200 dark:hover:bg-gray-700',
                  currentTheme && (tok.theme ?? 'other') !== currentTheme ? 'opacity-30' : '',
                  currentTheme && (tok.theme ?? 'other') === currentTheme ? 'font-semibold' : '',
                ]"
                :style="{
                  color: active === tok.key ? '#111827' : tok.theme ? colour(themeById(tok.theme)?.hue) : undefined,
                  backgroundColor:
                    currentTheme && active !== tok.key && tok.theme && tok.theme === currentTheme
                      ? colour(themeById(tok.theme)?.hue, 0.25)
                      : undefined,
                }"
                @mouseenter="hovered = tok.key"
                @click="togglePin(tok.key)"
                >{{ tok.t }}</span
              >
              <template v-else>{{ tok.t }}</template>
            </template>
          </p>
        </div>
      </div>

      <!-- Info panel -->
      <aside class="h-fit rounded-xl border border-gray-300 bg-white p-4 dark:border-gray-700 dark:bg-gray-900 lg:sticky lg:top-20">
        <template v-if="info">
          <div class="flex items-baseline justify-between">
            <h3 class="text-xl font-bold">{{ info.label }}</h3>
            <span v-if="pinned === active" class="text-xs text-indigo-600 dark:text-indigo-400">pinned</span>
          </div>
          <p v-if="info.theme" class="text-xs font-semibold uppercase tracking-wide" :style="{ color: colour(info.theme.hue) }">
            {{ info.theme.label }}
          </p>
          <p class="mt-1 text-sm text-gray-600 dark:text-gray-300">
            {{ info.count }} occurrence{{ info.count === 1 ? '' : 's' }} in {{ info.verses.length }} verse{{ info.verses.length === 1 ? '' : 's' }}
          </p>
          <p v-if="info.forms.length > 1" class="mt-1 text-sm italic text-gray-500 dark:text-gray-400">
            Forms: {{ info.forms.join(', ') }}
          </p>
          <div class="mt-3 flex flex-wrap gap-1">
            <button
              v-for="v in info.verses"
              :key="v.verse"
              type="button"
              class="rounded bg-gray-200 px-2 py-0.5 text-xs text-gray-900 hover:bg-yellow-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:text-gray-900"
              @click="jumpTo(v.verse)"
            >
              v{{ v.verse }}<span v-if="v.n > 1"> ×{{ v.n }}</span>
            </button>
          </div>
        </template>
        <p v-else class="text-sm text-gray-500 dark:text-gray-400">
          Hover a word to light up its whole theme in the cloud and passage. Click a word to pin it, or hover and click a theme heading or legend chip to pin a theme.
        </p>
      </aside>
    </div>
  </div>
</template>