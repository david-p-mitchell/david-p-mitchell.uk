<!-- components/BackgroundSection.vue -->
<template>
  <CollapsibleSection title="Background Style" :badge="bgMode === 'color' ? 'Solid' : 'Photo'" :default-open="true">
    <!-- Mode Switcher -->
    <div class="flex gap-2">
      <button
        type="button"
        @click="$emit('update:bgMode', 'color')"
        :class="[
          bgMode === 'color' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
          'flex-1 py-2 text-xs font-medium rounded-lg transition'
        ]"
      >
        Solid / Typographic
      </button>
      <button
        type="button"
        @click="$emit('update:bgMode', 'photo')"
        :class="[
          bgMode === 'photo' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
          'flex-1 py-2 text-xs font-medium rounded-lg transition'
        ]"
      >
        Photo Background
      </button>
      <button
        type="button"
        @click="$emit('update:bgMode', 'userUploadPhoto')"
        :class="[
          bgMode === 'userUploadPhoto' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
          'flex-1 py-2 text-xs font-medium rounded-lg transition'
        ]"
      >
        User Photo Background (Upload)
      </button>
    </div>

    <!-- Solid Color Palette -->
    <div v-if="bgMode === 'color'" class="grid grid-cols-3 gap-2 pt-2">
      <button
        v-for="c in colorThemes"
        :key="c.id"
        type="button"
        @click="$emit('update:selectedColor', c.id)"
        :class="[
          selectedColor === c.id ? 'ring-2 ring-blue-500 ring-offset-1' : 'border-slate-200 hover:border-slate-300',
          'py-2 px-3 border rounded-lg text-xs font-medium transition text-center',
          c.btnClass
        ]"
      >
        {{ c.name }}
      </button>
    </div>

    <!-- Photo Picker & Library Search -->
    <div v-else-if="bgMode === 'photo'" class="space-y-3">
      <button @click="$emit('fetchPhotography')" :disabled="isImageLoading" class="w-full px-4 py-2 bg-blue-200 text-black hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition disabled:opacity-50">
        {{ isImageLoading ? 'Fetching photo...' : 'Fetch New Random Photo' }}
      </button>

      <p class="text-xs text-slate-500">
        Find a photo elsewhere.
      </p>
      <p class="text-xs text-slate-500">
         Here are some free stock photo sites you can use to find a photo, download the file and use the upload feature to use it. 
      </p>
      <p class="text-xs text-slate-500">
        <strong>Make sure you give credit to the author if you use their photo!</strong>
      </p>
      <a href="https://unsplash.com/" target="_blank" rel="noopener noreferrer" class="w-full flex justify-center p-3 bg-neutral-100 rounded-xl text-slate-800 border border-black hover:text-slate-400 text-xs font-medium transition" > Unsplash </a>
      <a href="https://www.pexels.com/" target="_blank" rel="noopener noreferrer" class="w-full flex justify-center p-3 bg-slate-50 rounded-xl text-slate-950 border border-slate-950 hover:text-slate-400 text-xs font-medium transition" > Pexels </a>
      <a href="https://pixabay.com/" target="_blank" rel="noopener noreferrer" class="w-full flex justify-center p-3 bg-black rounded-xl text-slate-200 border hover:text-slate-400 text-xs font-medium transition" > Pixabay </a>
      <!-- <div>
        <div class="flex justify-between items-center mb-1">
          <label class="text-xs font-medium text-slate-600">Search Photography</label>
          <span v-if="isImageLoading" class="text-xs text-blue-600 animate-pulse">Fetching photo...</span>
        </div>
        <form @submit.prevent="$emit('fetchPhotography')" class="flex gap-2">
          <input
            :value="imageSearchTerm"
            @input="$emit('update:imageSearchTerm', $event.target.value)"
            type="text"
            class="w-full rounded-lg border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-none transition"
            placeholder="Topic (e.g. landscape, mountains, forest)"
          />
          <button
            type="submit"
            :disabled="isImageLoading"
            class="px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition disabled:opacity-50 whitespace-nowrap"
          >
            Search
          </button>
        </form>
      </div> -->

      <!-- <div class="flex flex-wrap gap-1.5">
        <button
          v-for="topic in quickTopics"
          :key="topic"
          type="button"
          @click="$emit('selectTopic', topic)"
          class="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] rounded-full transition capitalize"
        >
          {{ topic }}
        </button>
      </div> -->
      
      <!-- Photo Attribution Info -->
      <div v-if="photoAuthor.name|| photoAuthor.license" class="p-2.5 bg-slate-50 border border-slate-100 rounded-lg text-xs space-y-1">
        <div class="flex justify-between items-start">
          <span class="text-slate-600 truncate max-w-[240px]">
            Photo: 
            <a v-if="photoAuthor.sourceUrl" :href="photoAuthor.sourceUrl" target="_blank" rel="noopener" class="font-medium text-slate-800 underline hover:text-blue-600">
              {{ photoAuthor.name }}
            </a>
            <span v-else class="font-medium text-slate-800">{{ photoAuthor.name }}</span>
          </span>
          <span class="text-[10px] font-semibold px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded uppercase whitespace-nowrap">
            {{ photoAuthor.license }}
          </span>
        </div>
        
        <div class="flex items-center justify-between pt-1 border-t border-slate-200/60">
          <label class="flex items-center gap-1.5 cursor-pointer text-[11px] text-slate-600 select-none">
            <input
              type="checkbox"
              :checked="showCreditOnExport"
              @change="$emit('update:showCreditOnExport', $event.target.checked)"
              class="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            Include credit line on exported PNG
          </label>
        </div>
      </div>
    </div>
    <div v-else class="space-y-3 pt-2">
        <div>
            <label class="block text-xs font-medium text-slate-600 mb-1">Upload Local Image</label>
            <label class="flex items-center justify-center gap-2 w-full p-2.5 bg-slate-50 hover:bg-slate-100 border border-dashed border-slate-300 rounded-lg cursor-pointer transition text-xs font-medium text-slate-700">
            <svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <span>Choose Image from Device</span>
            <input type="file" accept="image/*" @change="$emit('fileUpload', $event)" class="hidden" />
            </label>
            <label class="block text-xs font-medium text-slate-600 my-2">Website URL</label>
            <input
            :value="websiteUrl"
            @input="$emit('update:websiteUrl', $event.target.value)"
            type="text"
            class="w-full rounded-lg border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-none transition"
            />
            <label class="block text-xs font-medium text-slate-600 my-2">Instagram Handle</label>
            <input
            :value="instaHandle"
            @input="$emit('update:instaHandle', $event.target.value)"
            type="text"
            class="w-full rounded-lg border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-none transition"
            />
        </div>
    </div>
  </CollapsibleSection>
</template>

<script setup>
import CollapsibleSection from '../../CollapsibleSection.vue'

const props = defineProps({
  bgMode: String,
  selectedColor: String,
  colorThemes: Array,
  imageSearchTerm: String,
  isImageLoading: Boolean,
  quickTopics: Array,
  photoAuthor: Object,
  showCreditOnExport: Boolean,
  instaHandle: String,
  websiteUrl: String
})

defineEmits([
  'update:bgMode',
  'update:selectedColor',
  'update:imageSearchTerm',
  'update:showCreditOnExport',
  'fileUpload',
  'fetchPhotography',
  'selectTopic'
])
</script>