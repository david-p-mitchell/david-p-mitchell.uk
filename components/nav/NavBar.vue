<script setup>
import { ref } from 'vue'
import NavLogo from './NavLogo.vue'
import NavItem from './NavItem.vue'
import MobileMenu from './NavMobileMenu.vue'

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

const menuItems = [
  { name: 'About', href: '/about' },
  { 
    name: 'Services', 
    href: '/services',
    dropdown: [
      { name: 'Web Design', href: '/services/web-design' },
      { name: 'Development', href: '/services/development' },
      { name: 'Consulting', href: '/services/consulting' }
    ]
  },
  
  { name: 'Portfolio', href: '/portfolio' },
  { 
    name: 'Hobbies', 
    href: '/hobbies',
    dropdown: [
      { name: 'Sport', href: '/services/sport' },
      { name: 'Development', href: '/services/development' },
      { name: 'Music', href: '/services/music' }
    ]
  },
  { name: 'Contact', href: '/contact' }
]
</script>

<template>
  <nav class="bg-blue-950 text-white shadow-lg border-b border-gray-200">
    <div class="mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-8">
        <NavLogo />

        <!-- Desktop Menu -->
        <div class="hidden md:block">
          <div class="ml-10 flex items-baseline space-x-4">
            <NavItem
              v-for="(item, index) in menuItems"
              :key="index"
              :item="item"
              :index="index"
              :activeDropdown="activeDropdown"
              :setActiveDropdown="setActiveDropdown"
            />
          </div>
        </div>

        <!-- Mobile menu button -->
        <div class="md:hidden">
          <button
            @click="toggleMenu"
            class="text-white hover:text-blue-300 focus:outline-none focus:text-blue-300 transition-colors duration-200"
            aria-label="Toggle menu"
          >
            <template v-if="isOpen">
              <!-- X icon -->
              <svg
                class="h-6 w-6"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </template>
            <template v-else>
              <!-- Menu icon -->
              <svg
                class="h-6 w-6 mt-1"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </template>
          </button>
        </div>
      </div>
    </div>
    

    <!-- Mobile Menu -->
    <MobileMenu
      :menuItems="menuItems"
      :activeDropdown="activeDropdown"
      :toggleDropdown="toggleDropdown"
      v-if="isOpen"
    />
  </nav>
</template>
