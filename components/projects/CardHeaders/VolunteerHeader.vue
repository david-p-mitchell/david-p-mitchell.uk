<template>
  <div class="flex justify-center mt-4 max-w-sm">
    <div class="flex flex-wrap justify-center gap-4">
      <div class="relative bg-white rounded-lg shadow-md text-center transform transition-transform duration-300 hover:scale-105">
        <div class="flex justify-end">
          <div class="inline-block bg-yellow-500 text-black text-sm rounded-md px-2 py-1">
            Volunteer
          </div>
        </div>
        <slot/>  
      </div>
    </div>
  </div>
</template>

