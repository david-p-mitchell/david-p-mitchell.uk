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
        <label class="block text-xs font-medium text-slate-600 mb-1">Attribution / Reference</label>
        <input
          :value="author"
          @input="$emit('update:author', $event.target.value)"
          type="text"
          class="w-full rounded-lg border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-none transition"
          placeholder="e.g. John Flavel or Psalm 46:1"
        />
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
  author: String
})

defineEmits(['update:quoteText', 'update:author', 'loadRandomQuote'])
</script>