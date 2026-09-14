<!-- components/QuoteSection.vue -->
<template>
  <CollapsibleSection title="Quote Content" :default-open="true">
    <div class="space-y-4">
      <div>
        <label class="block text-xs font-medium text-slate-600 mb-1">Quote or Scripture</label>
        <textarea
          :value="quoteText"
          @input="$emit('update:quoteText', $event.target.value)"
          rows="3"
          class="w-full rounded-lg border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-none transition resize-none"
          placeholder="Enter quote text..."
        ></textarea>
      </div>

      <div>
        <label class="block text-xs font-medium text-slate-600 mb-1">Person / Author</label>
        <input
          :value="author"
          @input="$emit('update:author', $event.target.value)"
          type="text"
          class="w-full rounded-lg border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-none transition"
          placeholder="e.g. John Flavel or Psalm 46:1"
        />
      </div>

      <div>
        <div class="flex">
        <input
            type="checkbox"
            :checked="showQuoteSource"
            @change="$emit('update:showQuoteSource', $event.target.checked)"
            class="rounded border-slate-300 text-blue-600 focus:ring-blue-500 mr-2"
          /><label class="block text-xs font-medium text-slate-600 mb-1">Source / Reference</label>
          </div>
        <div class="flex items-center gap-2">
          
          <input
            :value="quoteSource"
            @input="$emit('update:quoteSource', $event.target.value)"
            type="text"
            class="w-full rounded-lg border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-none transition"
            placeholder="e.g. Years person alive or book title"
          />
        </div>
      
      </div>

      <button
        @click="$emit('loadRandomQuote')"
        type="button"
        class="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition"
      >
        🎲 Load Random Quote Preset
      </button>
    </div>
  </CollapsibleSection>
</template>

<script setup>
import CollapsibleSection from '../../CollapsibleSection.vue'

defineProps({
  quoteText: String,
  author: String,
  quoteSource: String,
  showQuoteSource: Boolean
})

defineEmits(['update:quoteText', 'update:author', 'update:quoteSource', 'update:showQuoteSource', 'loadRandomQuote'])
</script>