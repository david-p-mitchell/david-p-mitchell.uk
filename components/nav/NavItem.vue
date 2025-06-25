<script setup>
import { ref } from 'vue'
import NavDropdown from './NavDropdown.vue'

const props = defineProps({
  item: Object,
  index: Number,
  activeDropdown: Number,
  setActiveDropdown: Function,
})

const onMouseEnter = () => {
  props.setActiveDropdown(props.index)
}

const onMouseLeave = () => {
  props.setActiveDropdown(null)
}

</script>

<template>
  <div
    class="relative group"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    <template v-if="item.dropdown">
      <button
        class="text-white hover:text-blue-300 px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors duration-200"
        @click.prevent
      >
        {{ item.name }}
        <svg
          class="ml-1 h-4 w-4"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>

      <NavDropdown
        :dropdownItems="item.dropdown"
        :isActive="props.activeDropdown === props.index"
      />
    </template>

    <template v-else>
      <a
        :href="item.href"
        class="text-white hover:text-blue-300 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
      >
        {{ item.name }}
      </a>
    </template>
  </div>
</template>
