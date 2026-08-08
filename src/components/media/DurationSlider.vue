<script setup lang="ts">
import { ref, computed } from "vue";

const props = defineProps<{
  min: number;
  max: number;
  rangeMin: number;
  rangeMax: number;
}>();

const emit = defineEmits<{
  "update:rangeMin": [value: number];
  "update:rangeMax": [value: number];
}>();

const trackRef = ref<HTMLElement | null>(null);
const dragging = ref<"min" | "max" | null>(null);

function valueFromClientX(clientX: number): number {
  const { left, width } = trackRef.value!.getBoundingClientRect();
  const ratio = Math.max(0, Math.min(1, (clientX - left) / width));
  return Math.round(props.min + ratio * (props.max - props.min));
}

function startDrag(thumb: "min" | "max", e: MouseEvent | TouchEvent) {
  e.preventDefault();
  e.stopPropagation();
  dragging.value = thumb;
}

function onDragMove(e: MouseEvent | TouchEvent) {
  if (!dragging.value || !trackRef.value) return;
  e.preventDefault();
  const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
  const v = valueFromClientX(clientX);
  if (dragging.value === "min" && v <= props.rangeMax - 5) emit("update:rangeMin", v);
  if (dragging.value === "max" && v >= props.rangeMin + 5) emit("update:rangeMax", v);
}

const fillLeft = computed(() => ((props.rangeMin - props.min) / (props.max - props.min)) * 100);
const fillRight = computed(() => 100 - ((props.rangeMax - props.min) / (props.max - props.min)) * 100);
</script>

<template>
  <div
    ref="trackRef"
    class="relative h-6 flex items-center select-none touch-none"
    @mousemove="onDragMove"
    @mouseup="dragging = null"
    @mouseleave="dragging = null"
    @touchmove.prevent="onDragMove"
    @touchend="dragging = null"
  >
    <div class="absolute inset-x-0 h-1 bg-neutral-800 rounded-full pointer-events-none">
      <div class="absolute h-full rounded-full bg-violet-600" :style="{ left: fillLeft + '%', right: fillRight + '%' }" />
    </div>
    <div
      class="absolute w-4 h-4 rounded-full bg-violet-600 border-2 border-violet-900 shadow cursor-grab -translate-x-1/2 z-10"
      :style="{ left: fillLeft + '%' }"
      @mousedown.stop="startDrag('min', $event)"
      @touchstart.prevent.stop="startDrag('min', $event)"
    />
    <div
      class="absolute w-4 h-4 rounded-full bg-violet-600 border-2 border-violet-900 shadow cursor-grab -translate-x-1/2 z-10"
      :style="{ left: (100 - fillRight) + '%' }"
      @mousedown.stop="startDrag('max', $event)"
      @touchstart.prevent.stop="startDrag('max', $event)"
    />
  </div>
</template>