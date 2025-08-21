<script setup>
import { ref } from 'vue'

const props = defineProps({
  menuItems: Array,
  activeDropdown: Number,
  toggleDropdown: Function,
  closeMenu: Function, // new prop to close the menu
})

</script>

<template>
  <div class="md:hidden transition-all duration-300 ease-in-out overflow-hidden"
    :class="{
      'max-h-96 opacity-100': true,
    }"
  >
    <div class="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
      <div v-for="(item, index) in menuItems" :key="index">
        <template v-if="item.dropdown">
          <button
            @click="toggleDropdown(index)"
            class="w-full text-left text-gray-700 hover:text-blue-600 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium flex items-center justify-between transition-colors duration-200"
          >
            {{ item.name }}
            <svg
              class="h-4 w-4 transition-transform duration-200"
              :class="{ 'rotate-180': activeDropdown === index }"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
          <div
            class="transition-all duration-200 overflow-hidden"
            :class="{
              'max-h-48 opacity-100': activeDropdown === index,
              'max-h-0 opacity-0': activeDropdown !== index,
            }"
          >
            <div class="pl-6 space-y-1">
              <a
                v-for="(dropItem, dropIndex) in item.dropdown"
                :key="dropIndex"
                :href="dropItem.href"
                class="text-gray-600 hover:text-blue-600 hover:bg-gray-50 block px-3 py-2 rounded-md text-sm transition-colors duration-200"
                @click="props.closeMenu && props.closeMenu()"
              >
                {{ dropItem.name }}
              </a>
            </div>
          </div>
        </template>
        <template v-else>
          <a
            :href="item.href"
            class="text-gray-700 hover:text-blue-600 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
            @click="props.closeMenu && props.closeMenu()"
          >
            {{ item.name }}
          </a>
        </template>
      </div>
    </div>
  </div>
</template>
