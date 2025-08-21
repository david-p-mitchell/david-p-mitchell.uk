<template>
  <div>
    <NavBar />
    <main>
      <slot />
    </main>
  </div>
</template>

<script setup>
import NavBar from '~/components/nav/NavBar.vue'
</script>