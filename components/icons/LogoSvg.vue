<template>
<svg
        :width="size"
        :height="size"
        viewBox="0 0 120 140"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Logo"
        :class="[
          'block transform transition-transform duration-200 ease-in-out mx-0.5 my-0.5',
          hovering ? 'scale-150' : 'scale-100',
          hovering && props.isSearchIcon ? 'cursor-pointer' : 'cursor-default'
        ]"
        @mousemove="onMouseMove"
        @mouseleave="onMouseLeave"
      >
      <defs>
    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="6" stdDeviation="4" flood-color="rgba(0,0,0,0.5)" />
    </filter>
  </defs>
        <circle
          cx="60"
          cy="60"
          r="55"
          :fill="circleFillColor"
          filter="url(#shadow)"
        />
        
        <g :transform="showName ? 'translate(0,0)' : 'translate(0,20)'">
        <slot />
        </g>

        <text
          v-if="showName"
          x="60"
          y="85"
          text-anchor="middle"
          :fill="textColor"
          class="font-bold"
          font-family="Arial, sans-serif"
          font-size="14"
        >
          {{ name }}
        </text>
      </svg>

</template> 
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { languageStore } from '~/stores/languageStore'
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
  codeName: {
    type: String
  },
  isSearchIcon: {
    type: Boolean,
    default: false
  }
})

const isActive = computed(() => {
  if (!languageStore.selectedLanguage) return false
  return (
    props.isSearchIcon &&
    codeNameVal.value.toLowerCase() === languageStore.selectedLanguage.toLowerCase()
  )
})

const circleFillColor = computed(() => (isActive.value ? '#C7DCFB' : '#172554'))
const textColor = computed(() => (isActive.value ? '#172554' : '#ffffff'))

onMounted(() => {
  if (!languageStore.selectedLanguage) {
    languageStore.selectedLanguage = null // pick a safe default
  }
})

const hovering = ref(false)
const codeNameVal = computed(() => {
  return props.codeName ? `${props.codeName}` : `${props.name.toLowerCase()}`
})
function onMouseMove(e : any) {
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