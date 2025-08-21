<script setup>
import { ref } from 'vue'
import NavLogo from './NavLogo.vue'
import NavItem from './NavItem.vue'
import MobileMenu from './MobileMenu.vue'
import NavMobileMenu from './NavMobileMenu.vue'

const isOpen = ref(false)
const activeDropdown = ref(null)

const toggleMenu = () => {
  isOpen.value = !isOpen.value
}

const toggleDropdown = (index) => {
  activeDropdown.value = activeDropdown.value === index ? null : index
}

const setActiveDropdown = (index) => {
  activeDropdown.value = index
}
const closeMenu = () => {
  isOpen.value = false
}

const menuItems = [
  { name: 'About', href: '#about' },
  { name: 'Projects', href: '#projects' },
  { name: 'CV', href: '/David Mitchell CV.pdf' }
]
</script>

<template>
  <section id="top">
    <nav class="bg-blue-950 text-white shadow-lg border-b border-gray-200">
      <div class="mx-auto px-4">
        <div class="flex justify-between items-center">
          <!-- Logo -->
          <NavLogo />

          <!-- Desktop navigation -->
          <div class="hidden md:flex items-center space-x-4 w-full">
            <!-- Spacer pushes links to the right -->
            <div class="flex-1"></div>

            <!-- Nav links grouped together -->
            <div class="flex items-center space-x-4">
              <NavItem
                v-for="(item, index) in menuItems"
                :key="index"
                :item="item"
                :index="index"
                :activeDropdown="activeDropdown"
                :setActiveDropdown="setActiveDropdown"
              />
            </div>

            <!-- Social icons pushed far right -->
              <Logos />
          </div>
          <div class="md:hidden flex justify-between items-center px-4">
  <!-- Logos and text -->
  <div class="flex items-center pr-5">
    <Logos />
  </div>
          <!-- Mobile menu button -->
          <MobileMenu :isOpen="isOpen" :toggleMenu="toggleMenu" />
        </div>  
        </div>
      </div>

      <!-- Mobile dropdown menu -->
      <NavMobileMenu
        v-if="isOpen"
        :menuItems="menuItems"
        :activeDropdown="activeDropdown"
        :toggleDropdown="toggleDropdown"
        :closeMenu="closeMenu"
      />
    </nav>
  </section>
</template>
