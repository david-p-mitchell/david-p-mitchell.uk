<script setup>
defineProps({
  dropdownItems: Array,
  isActive: Boolean,
})

</script>

<template>
  <div
    class="absolute left-0 w-48 bg-white rounded-md shadow-lg py-1 z-10 transition-all duration-200"
    :class="{
      'opacity-100 visible': isActive,
      'opacity-0 invisible': !isActive,
    }"
  >
    <a
      v-for="(dropItem, idx) in dropdownItems"
      :key="idx"
      :href="dropItem.href"
      class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors duration-200"
    >
      {{ dropItem.name }}
    </a>
  </div>
</template>
