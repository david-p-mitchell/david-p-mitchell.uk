<!-- components/TypographyLayoutSection.vue -->
<template>
  <CollapsibleSection title="Typography & Layout" :default-open="false">
    <div class="space-y-3">
      <div>
        <div class="flex justify-between items-center text-xs text-slate-600 mb-1">
          <label class="flex items-center gap-2 text-xs font-medium text-slate-700 select-none">
            Font
          </label>

          <div class="flex items-center gap-2">
            <span class="text-[11px] text-slate-500">Color:</span>
            <input
              type="color"
              :value="fontColor || '#FFFFFF'"
              @input="$emit('update:fontColor', $event.target.value)"
              class="w-8 h-6 p-0 border border-slate-300 rounded cursor-pointer bg-transparent"
            />
          </div>
        </div>
        <div class="flex justify-between text-xs text-slate-600 mb-1">
          <span>Font Size</span>
          <span>{{ fontSize }}px</span>
        </div>
        <input
          :value="fontSize"
          @input="$emit('update:fontSize', Number($event.target.value))"
          type="range"
          min="16"
          max="40"
          class="w-full accent-blue-600"
        />
      </div>

      <div>
        <div class="flex justify-between text-xs text-slate-600 mb-1">
          <span>Box Max Width</span>
          <span>{{ boxWidth }}%</span>
        </div>
        <input
          :value="boxWidth"
          @input="$emit('update:boxWidth', Number($event.target.value))"
          type="range"
          min="40"
          max="100"
          class="w-full accent-blue-600"
        />
      </div>

      <div class="flex justify-between items-center text-xs text-slate-500 pt-1 border-t border-slate-200/60">
        <span>Drag box in preview to move</span>
        <button
          type="button"
          @click="$emit('resetTextLayout')"
          class="text-blue-600 hover:underline text-[11px] font-medium"
        >
          Reset Box & Position
        </button>
      </div>
    </div>
  </CollapsibleSection>
</template>

<script setup>
import CollapsibleSection from '../../CollapsibleSection.vue'

defineProps({
  fontColor: String,
  fontSize: Number,
  boxWidth: Number
})

defineEmits(['update:fontColor', 'update:fontSize', 'update:boxWidth', 'resetTextLayout'])
</script>