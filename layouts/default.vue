<template>
  <div>
    <UnderConstruction />
    <NavBar />
    <main>
      <slot />
    </main>
  </div>
</template>

<script setup>
import NavBar from '~/components/nav/NavBar.vue'
import UnderConstruction from '~/components/UnderConstruction.vue';
// You can add layout-specific logic here if needed
</script>