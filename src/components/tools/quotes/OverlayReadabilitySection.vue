<!-- components/OverlayReadabilitySection.vue -->
<template>
  <CollapsibleSection title="Readability & Overlay" :default-open="false">
    <div class="space-y-4">
      <!-- Overlay presets (only applicable in photo mode) -->
      <div v-if="bgMode === 'photo'">
        <label class="block text-xs font-medium text-slate-600 mb-1.5">Text Readability Overlay</label>
        <div class="grid grid-cols-3 gap-2">
          <button
            v-for="o in overlayStyles"
            :key="o.id"
            type="button"
            @click="$emit('update:selectedOverlay', o.id)"
            :class="[
              selectedOverlay === o.id ? 'border-blue-600 ring-2 ring-blue-100' : 'border-slate-200 hover:border-slate-300',
              'py-2 px-3 border rounded-lg text-xs font-medium text-slate-700 bg-white transition'
            ]"
          >
            {{ o.name }}
          </button>
        </div>
      </div>

      <!-- Text Panel Box Background Controls -->
      <div class="space-y-3 p-3 bg-slate-50 border border-slate-100 rounded-xl">
        <div class="flex items-center justify-between">
          <label class="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer select-none">
            <input
              type="checkbox"
              :checked="enableTextBoxBg"
              @change="$emit('update:enableTextBoxBg', $event.target.checked)"
              class="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            Text Box Background Panel
          </label>
          
          <div v-if="enableTextBoxBg" class="flex items-center gap-2">
            <span class="text-[11px] text-slate-500">Color:</span>
            <input 
              type="color" 
              :value="textBoxBgColor" 
              @input="$emit('update:textBoxBgColor', $event.target.value)"
              class="w-6 h-6 rounded cursor-pointer border border-slate-300 bg-transparent p-0 overflow-hidden"
            />
          </div>
        </div>

        <div v-if="enableTextBoxBg">
          <div class="flex justify-between text-xs text-slate-600 mb-1">
            <span>Box Background Opacity</span>
            <span>{{ textBoxOpacity }}%</span>
          </div>
          <input
            :value="textBoxOpacity"
            @input="$emit('update:textBoxOpacity', Number($event.target.value))"
            type="range"
            min="0"
            max="100"
            class="w-full accent-blue-600"
          />
        </div>
      </div>
    </div>
  </CollapsibleSection>
</template>

<script setup>
import CollapsibleSection from '../../CollapsibleSection.vue'

defineProps({
  bgMode: String,
  overlayStyles: Array,
  selectedOverlay: String,
  enableTextBoxBg: Boolean,
  textBoxBgColor: String,
  textBoxOpacity: Number
})

defineEmits([
  'update:selectedOverlay',
  'update:enableTextBoxBg',
  'update:textBoxBgColor',
  'update:textBoxOpacity'
])
</script>