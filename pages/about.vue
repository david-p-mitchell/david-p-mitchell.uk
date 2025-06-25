<template>
  <div>
    Hi ABout!
  </div>
  <button @click="isOpen = !isOpen">Toggle {{ isOpen }}</button>
</template>


<script setup>
import { ref } from 'vue'


// Reactive state
const isOpen = ref(false);
</script>
