<!-- components/QuoteSection.vue -->
<template>
  <CollapsibleSection title="Quote Content" :default-open="true">
    
    <div class="space-y-4">
      <div>
        <p class="text-black">
        {{ quoteTextSections.length > 1 ? 'Quote Sections' : 'Quote Section' }}
        </p>
        <label class="block text-xs font-medium text-slate-600 mb-1">Quote or Scripture</label>
        <div v-for="(section, index) in quoteTextSections" :key="index" class="mb-2">
          <div class="flex">
        <textarea 
          :value="section.text"
          @input="$emit('update:quoteTextSections', quoteTextSections.map((s, i) => i === index ? { ...s, text: $event.target.value } : s))"
          rows="3"
          class="w-full rounded-lg border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-none transition resize-none"
          placeholder="Enter quote text..."
        ></textarea>
        <button
          v-if="quoteTextSections.length > 1"
          @click="quoteTextSections[index].bold = !quoteTextSections[index].bold; $emit('update:quoteTextSections', quoteTextSections)"
          type="button"
          class="ml-2 py-1 px-2 hover:bg-red-200 text-black border border-slate-300 text-xs font-medium rounded-lg transition">
          Bold
        </button>
        <button
          v-if="quoteTextSections.length > 1"
          @click="quoteTextSections[index].fontSizeDifference += 1; $emit('update:quoteTextSections', quoteTextSections)"
          type="button"
          class="ml-2 py-1 px-2 hover:bg-red-200 text-black border border-slate-300 text-xs font-medium rounded-lg transition">
          Up
        </button>
        <button
          v-if="quoteTextSections.length > 1"
          @click="quoteTextSections[index].fontSizeDifference -= 1; $emit('update:quoteTextSections', quoteTextSections)"
          type="button"
          class="ml-2 py-1 px-2 hover:bg-red-200 text-black border border-slate-300 text-xs font-medium rounded-lg transition">
          Down
        </button>
        </div>
        <button
          v-if="quoteTextSections.length > 1 && index === quoteTextSections.length - 1"
          @click="quoteTextSections.splice(index, 1); $emit('update:quoteTextSections', quoteTextSections)"
          type="button"
          class="mt-2 py-1 px-2 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-medium rounded-lg transition"
        >
          ❌ Remove Section
        </button>
        </div>
        <button
          @click="$emit('addQuoteSection', '')"
          type="button"
          class="mt-2 py-1 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition"
        >
          ➕ Add Another Section
        </button>
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
  quoteTextSections: Array,
  author: String,
  quoteSource: String,
  showQuoteSource: Boolean
})

defineEmits(['update:quoteTextSections', 'update:author', 'update:quoteSource', 'update:showQuoteSource', 'loadRandomQuote', 'removeQuoteSection'])
</script>