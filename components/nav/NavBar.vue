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
    <div class="mx-auto px-4 ">
      <div class="flex justify-between items-center h-8">
        <NavLogo />
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
         <MobileMenu 
          :isOpen="isOpen" :toggleMenu="toggleMenu"
           />
      </div>
    </div>
    

    <!-- Mobile Menu -->
    <NavMobileMenu
      :menuItems="menuItems"
      :activeDropdown="activeDropdown"
      :toggleDropdown="toggleDropdown"
      v-if="isOpen"
    />
    
  </nav>
</template>