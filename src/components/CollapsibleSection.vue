<!-- components/CollapsibleSection.vue -->

<template>
  <div class="border border-slate-200 rounded-xl overflow-hidden bg-white transition-all">
    <div
      class="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100/80 flex items-center justify-between text-left transition select-none"
    >
      <!-- Checkbox + title -->
      <div class="flex items-center gap-3">
        <input
          v-if="showCheckbox"
          type="checkbox"
          :checked="active"
          @click.stop
          @change="onActiveChange"
          class="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
        />

        <div
          class="flex items-center gap-2 cursor-pointer"
          @click="isOpen = !isOpen"
        >
          <span class="text-xs font-semibold text-slate-800 uppercase tracking-wider">
            {{ title }}
          </span>

          <span
            v-if="badge"
            class="text-[10px] px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-medium"
          >
            {{ badge }}
          </span>
        </div>
      </div>

      <!-- Collapse toggle -->
      <button
        type="button"
        @click="isOpen = !isOpen"
        class="p-1 rounded hover:bg-slate-200/60 transition"
        :aria-expanded="isOpen"
        :aria-label="isOpen ? `Collapse ${title}` : `Expand ${title}`"
      >
        <svg
          class="w-4 h-4 text-slate-500 transition-transform duration-200"
          :class="{ 'rotate-180': isOpen }"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
    </div>

    <div
      v-show="isOpen"
      class="p-4 border-t border-slate-100 space-y-4"
    >
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  title: string
  badge?: string
  defaultOpen?: boolean
  active?: boolean
  showCheckbox?: boolean
}>()

const emit = defineEmits<{
  'update:active': [value: boolean]
}>()

const isOpen = ref(props.defaultOpen ?? true)

const active = props.active ?? true
const showCheckbox = props.showCheckbox ?? false

const onActiveChange = (event: Event) => {
  const checked = (event.target as HTMLInputElement).checked
  emit('update:active', checked)
}
</script>