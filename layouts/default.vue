<template>
  <div>
    <NavBar />
    <main>
      <slot />
    </main>
  </div>
</template>

<script setup>
import NavBar from '~/Components/nav/NavBar.vue'
// You can add layout-specific logic here if needed
</script>