<template>
    <div class="body">
  <div class="container mx-auto px-4 py-12">
    <div class="text-center mb-12">
      <h1 class="text-5xl font-bold text-gray-800 mb-6">Welcome Home</h1>
      <p class="text-xl text-gray-600 max-w-2xl mx-auto">
        This is the home page of your Nuxt 3 application with a responsive navigation menu.
      </p>
    </div>
    
    <div class="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
      <div class="bg-white p-6 rounded-lg shadow-md text-center">
        <div class="text-blue-600 text-4xl mb-4">🚀</div>
        <h3 class="text-xl font-semibold mb-2">Fast Performance</h3>
        <p class="text-gray-600">Built with Nuxt 3 for optimal performance and SEO.</p>
      </div>
      
      <div class="bg-white p-6 rounded-lg shadow-md text-center">
        <div class="text-blue-600 text-4xl mb-4">📱</div>
        <h3 class="text-xl font-semibold mb-2">Responsive Design</h3>
        <p class="text-gray-600">Works perfectly on desktop, tablet, and mobile devices.</p>
      </div>
      
      <div class="bg-white p-6 rounded-lg shadow-md text-center">
        <div class="text-blue-600 text-4xl mb-4">🎨</div>
        <h3 class="text-xl font-semibold mb-2">Beautiful UI</h3>
        <p class="text-gray-600">Styled with Tailwind CSS for a modern look.</p>
      </div>
    </div>
  </div>
  </div>
</template>

<script setup>
useHead({
  title: 'Home - My Nuxt App',
  meta: [
    { name: 'description', content: 'Welcome to my Nuxt 3 application' }
  ]
})
</script>