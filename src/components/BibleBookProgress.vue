<script setup>
import { ref, computed, watch } from 'vue';
import { bibleBookReadingTimes } from '../data/bibleBookData.ts';

// --- Sort Order state ---
const sortOrder = ref('biblical'); // 'biblical' | 'shortest' | 'longest'

// Dynamically sorted book list for the dropdown select options
const sortedBibleBookReadingTimes = computed(() => {
  const books = [...bibleBookReadingTimes];
  if (sortOrder.value === 'shortest') {
    return books.sort((a, b) => a.readingTimeMinutes - b.readingTimeMinutes);
  }
  if (sortOrder.value === 'longest') {
    return books.sort((a, b) => b.readingTimeMinutes - a.readingTimeMinutes);
  }
  // Default: original biblical order (preserves initial array order / id order)
  return books.sort((a, b) => a.id - b.id);
});

// --- Book selection ---
const selectedBookId = ref(1); // Genesis by default

const selectedBook = computed(() =>
  bibleBookReadingTimes.find((b) => b.id === selectedBookId.value)
);

const totalChapters = computed(() => selectedBook.value.verses.length);

const totalVerses = computed(() =>
  selectedBook.value.verses.reduce((sum, v) => sum + v, 0)
);

function versesInChapter(chapterNum) {
  return selectedBook.value.verses[chapterNum - 1] ?? 1;
}

// Verses in all chapters strictly before this one
function versesBeforeChapter(chapterNum) {
  return selectedBook.value.verses
    .slice(0, chapterNum - 1)
    .reduce((sum, v) => sum + v, 0);
}

// --- Chapter + verse range ---
const fromChapter = ref(1);
const fromVerse = ref(1);
const toChapter = ref(1);
const toVerse = ref(versesInChapter(1));

// Reset range whenever the book changes
function onBookChange() {
  fromChapter.value = 1;
  fromVerse.value = 1;
  toChapter.value = 1;
  toVerse.value = versesInChapter(1);
}

// Keep chapters in range and verses within their chapter's bounds
function clampChapters() {
  const max = totalChapters.value;
  fromChapter.value = Math.min(Math.max(1, fromChapter.value || 1), max);
  toChapter.value = Math.min(Math.max(1, toChapter.value || 1), max);
  clampVerses();
  ensureFromNotAfterTo();
}

function clampVerses() {
  fromVerse.value = Math.min(
    Math.max(1, fromVerse.value || 1),
    versesInChapter(fromChapter.value)
  );
  toVerse.value = Math.min(
    Math.max(1, toVerse.value || 1),
    versesInChapter(toChapter.value)
  );
  ensureFromNotAfterTo();
}

// If "from" ends up later than "to", pull "to" up to match
function ensureFromNotAfterTo() {
  if (fromAbsolute.value > toAbsolute.value) {
    toChapter.value = fromChapter.value;
    toVerse.value = fromVerse.value;
  }
}

// When the from/to chapter changes, snap the verse to a sensible default
watch(fromChapter, () => {
  fromVerse.value = 1;
});
watch(toChapter, () => {
  toVerse.value = versesInChapter(toChapter.value);
});

// --- Absolute verse positions (1-indexed, book-wide) ---
const fromAbsolute = computed(
  () => versesBeforeChapter(fromChapter.value) + fromVerse.value
);
const toAbsolute = computed(
  () => versesBeforeChapter(toChapter.value) + toVerse.value
);

const versesInRange = computed(
  () => toAbsolute.value - fromAbsolute.value + 1
);

function roundTo(num, precision) {
  const factor = Math.pow(10, precision);
  return Math.round(num * factor) / factor;
}

const percentComplete = computed(() =>
  totalVerses.value === 0
    ? 0
    : roundTo((toAbsolute.value / totalVerses.value) * 100.0, 1)
);

const percentInRange = computed(() =>
  totalVerses.value === 0
    ? 0
    : roundTo((versesInRange.value / totalVerses.value) * 100.0, 1)
);

// --- Per-chapter layout for the scrollable bar ---
const chapterSegments = computed(() =>
  selectedBook.value.verses.map((verseCount, idx) => {
    const chapter = idx + 1;
    const chapterStartAbs = versesBeforeChapter(chapter) + 1;
    const chapterEndAbs = versesBeforeChapter(chapter) + verseCount;

    const overlapStart = Math.max(chapterStartAbs, fromAbsolute.value);
    const overlapEnd = Math.min(chapterEndAbs, toAbsolute.value);
    const coveredVerses = Math.max(0, overlapEnd - overlapStart + 1);
    const fillFraction = verseCount === 0 ? 0 : coveredVerses / verseCount;

    return {
      chapter,
      verseCount,
      widthPercent: roundTo((verseCount / totalVerses.value) * 100.0, 1),
      fillFraction,
    };
  })
);

function onSegmentClick(seg, event) {
  const rect = event.currentTarget.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  const ratio = Math.min(1, Math.max(0, clickX / rect.width));
  const approxVerse = Math.min(
    seg.verseCount,
    Math.max(1, Math.round(ratio * seg.verseCount))
  );

  if (event.shiftKey) {
    fromChapter.value = seg.chapter;
    fromVerse.value = approxVerse;
  } else {
    toChapter.value = seg.chapter;
    toVerse.value = approxVerse;
  }
  ensureFromNotAfterTo();
  toggleTooltip(seg.chapter);
}

const activeTooltip = ref(null);
function toggleTooltip(chapterNum) {
  activeTooltip.value = activeTooltip.value === chapterNum ? null : chapterNum;
}
</script>

<template>
  <div class="w-full max-w-3xl mx-auto p-4 sm:p-6 dark:bg-card dark:text-white rounded-2xl shadow-sm border border-slate-700 dark:border-gold">
    <h2 class="text-lg font-semibold text-slate-900 dark:text-slate-200 mb-4">Bible Reading Progress</h2>

    <!-- Book & Sort controls -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
      <div class="flex flex-col gap-1 sm:col-span-2">
        <label for="book-select" class="text-sm font-medium text-slate-900 dark:text-slate-300">Book</label>
        <select
          id="book-select"
          v-model.number="selectedBookId"
          @change="onBookChange"
          class="rounded-lg border border-slate-400 dark:!border bg-white dark:bg-card px-3 py-2 text-sm text-slate-900 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option v-for="book in sortedBibleBookReadingTimes" :key="book.id" :value="book.id">
            {{ book.bookName + " (" + book.readingTime + " mins)" }}
          </option>
        </select>
      </div>

      <div class="flex flex-col gap-1">
        <label for="sort-select" class="text-sm font-medium text-slate-900 dark:text-slate-300">Sort By</label>
        <select
          id="sort-select"
          v-model="sortOrder"
          class="rounded-lg border border-slate-400 dark:!border bg-white dark:bg-card px-3 py-2 text-sm text-slate-900 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="biblical">Biblical Order</option>
          <option value="shortest">Time (Shortest to Longest)</option>
          <option value="longest">Time (Longest to Shortest)</option>
        </select>
      </div>
    </div>

    <!-- From / To chapter + verse controls -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      <div class="flex flex-col gap-1">
        <label for="from-chapter" class="text-sm font-medium text-slate-900 dark:text-slate-300">
          From chapter
        </label>
        <input
          id="from-chapter"
          type="number"
          v-model.number="fromChapter"
          :min="1"
          :max="totalChapters"
          @change="clampChapters"
          class="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 dark:text-slate-200 dark:bg-card focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div class="flex flex-col gap-1">
        <label for="from-verse" class="text-sm font-medium text-slate-900 dark:text-slate-300">
          From verse
        </label>
        <input
          id="from-verse"
          type="number"
          v-model.number="fromVerse"
          :min="1"
          :max="versesInChapter(fromChapter)"
          @change="clampVerses"
          class="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 dark:text-slate-200 dark:bg-card focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div class="flex flex-col gap-1">
        <label for="to-chapter" class="text-sm font-medium text-slate-900 dark:text-slate-300">
          To chapter
        </label>
        <input
          id="to-chapter"
          type="number"
          v-model.number="toChapter"
          :min="1"
          :max="totalChapters"
          @change="clampChapters"
          class="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 dark:text-slate-200 dark:bg-card focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div class="flex flex-col gap-1">
        <label for="to-verse" class="text-sm font-medium text-slate-900 dark:text-slate-300">
          To verse
        </label>
        <input
          id="to-verse"
          type="number"
          v-model.number="toVerse"
          :min="1"
          :max="versesInChapter(toChapter)"
          @change="clampVerses"
          class="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 dark:text-slate-200 dark:bg-card focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>

    <!-- Summary -->
    <div class="flex flex-wrap items-baseline justify-between gap-2 mb-2">
      <p class="text-sm text-slate-400">
        {{ selectedBook.bookName }} {{ fromChapter }}:{{ fromVerse }}–{{ toChapter }}:{{ toVerse }}
        <span class="text-slate-900 dark:text-slate-300">
          ({{ versesInRange }} of {{ totalVerses }} verses)
        </span>
      </p>
      <p class="text-sm font-medium text-slate-900 dark:text-slate-300">
        {{ percentComplete }}% through {{ selectedBook.bookName }}
      </p>
    </div>

    <!-- Overall progress bar (through "to" verse) -->
    <div class="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden mb-4">
      <div
        class="h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-300"
        :style="{ width: percentComplete + '%' }"
      ></div>
    </div>

    <!-- Chapter-by-chapter scrollable bar -->
    <div class="mb-2 flex items-center justify-between">
      <span class="text-xs font-medium text-slate-900 dark:text-slate-400">
        Chapters (tap sets "to" verse, shift+tap sets "from" verse)
      </span>
      <span class="text-xs text-slate-900 dark:text-slate-300">{{ totalChapters }} chapters</span>
    </div>

    <div class="w-full overflow-x-auto pb-2">
      <div class="flex h-8 min-w-full rounded-lg overflow-hidden border border-slate-200">
        <button
          v-for="seg in chapterSegments"
          :key="seg.chapter"
          type="button"
          class="relative h-full border-r border-white/40 last:border-r-0 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:z-10 overflow-hidden"
          :style="{ width: seg.widthPercent + '%', minWidth: '6px' }"
          :aria-label="`${selectedBook.bookName} chapter ${seg.chapter}, ${seg.verseCount} verses, ${Math.round(seg.fillFraction * 100)}% selected`"
          @click="(e) => onSegmentClick(seg, e)"
        >
          <span
            class="absolute inset-y-0 left-0 bg-blue-600 transition-all duration-150"
            :style="{ width: (seg.fillFraction * 100) + '%' }"
          ></span>

          <span
            v-if="activeTooltip === seg.chapter"
            class="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-slate-900 text-white text-xs px-2 py-1 z-20"
          >
            Ch {{ seg.chapter }} ({{ seg.verseCount }}v)
          </span>
        </button>
      </div>
    </div>

    <p class="text-xs text-slate-900 dark:text-slate-300 mt-3">
      {{ percentInRange }}% of {{ selectedBook.bookName }} is covered by the selected range.
    </p>
  </div>
</template>