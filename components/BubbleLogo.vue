<template>
  <div class="inline-block relative">
    <NuxtLink
      :to="computedLink"
      class="block no-underline"
    >
      <svg
        :width="size"
        :height="size"
        viewBox="0 0 120 120"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Logo"
        :class="[
          'block transform transition-transform duration-200 ease-in-out mx-0.5 my-0.5',
          hovering ? 'scale-125' : 'scale-100'
        ]"
        @mousemove="onMouseMove"
        @mouseleave="onMouseLeave"
      >
      <defs>
    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="rgba(0,0,0,0.5)" />
    </filter>
  </defs>
        <circle
          cx="60"
          cy="60"
          r="55"
          fill="#172554"
          :alt="name"
          filter="url(#shadow)"
        />
        
        <g :transform="showName ? 'translate(0,0)' : 'translate(0,20)'">
        <slot />
        </g>

        <text
          v-if="showName"
          x="60"
          y="90"
          text-anchor="middle"
          fill="#ffffff"
          class="font-bold"
          font-family="Arial, sans-serif"
          font-size="16"
        >
          {{ name }}
        </text>
      </svg>
    </NuxtLink>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  name: {
    type: String,
    default: 'Nuxt',
    required: true
  },
  showName: {
    type: Boolean,
    default: true
  },
  size: {
    type: [Number, String],
    default: 96
  },
  link: {
    type: String,
    default: ''
  }
})

const computedLink = computed(() => {
  return props.link || `/languages/${props.name}`
})

const hovering = ref(false)

function onMouseMove(e) {
  const rect = e.currentTarget.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  const svgSize = 120
  const scale = rect.width / svgSize
  const cx = 60 * scale
  const cy = 60 * scale
  const r = 55 * scale
  const dx = x - cx
  const dy = y - cy
  hovering.value = (dx * dx + dy * dy) <= (r * r)
}

function onMouseLeave() {
  hovering.value = false
}
</script>
