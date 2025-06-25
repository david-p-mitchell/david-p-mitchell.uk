<script setup>
defineProps({
  menuItems: Array,
  activeDropdown: Number
})
defineEmits(['update:activeDropdown'])
</script>

<template>
  <div class="hidden md:block">
    <div class="ml-10 flex items-baseline space-x-4">
      <div
        v-for="(item, index) in menuItems"
        :key="index"
        class="relative group"
        @mouseenter="$emit('update:activeDropdown', index)"
        @mouseleave="$emit('update:activeDropdown', null)"
      >
        <template v-if="item.dropdown">
          <button
            class="text-white hover:text-blue-300 px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors duration-200"
            @click.prevent
          >
            {{ item.name }}
            <svg class="ml-1 h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div
            class="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 transition-all duration-200"
            :class="{
              'opacity-100 visible': activeDropdown === index,
              'opacity-0 invisible': activeDropdown !== index
            }"
          >
            <a
              v-for="(dropItem, dropIndex) in item.dropdown"
              :key="dropIndex"
              :href="dropItem.href"
              class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors duration-200"
            >
              {{ dropItem.name }}
            </a>
          </div>
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
    </div>
  </div>
</template>
