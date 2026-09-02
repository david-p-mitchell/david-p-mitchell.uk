<template>
  <div class="max-w-5xl mx-auto p-6 bg-white border border-slate-200 rounded-2xl shadow-sm font-sans">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      
      <div class="space-y-5">
        <div>
          <h2 class="text-xl font-semibold text-slate-800">Image Quote Generator</h2>
          <p class="text-sm text-slate-500">Create shareable graphics using Openverse, CC0 photography, or your own uploaded images.</p>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-xs font-medium text-slate-600 mb-1">Quote or Scripture</label>
            <textarea
              v-model="quoteText"
              rows="4"
              class="w-full rounded-lg border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-none transition resize-none"
              placeholder="Enter quote text..."
            ></textarea>
          </div>

          <div>
            <label class="block text-xs font-medium text-slate-600 mb-1">Attribution / Reference</label>
            <input
              v-model="author"
              type="text"
              class="w-full rounded-lg border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-none transition"
              placeholder="e.g. John Flavel or Psalm 46:1"
            />
          </div>

          <div>
            <label class="block text-xs font-medium text-slate-600 mb-1">Background Mode</label>
            <div class="flex gap-2 mb-3">
              <button
                @click="bgMode = 'color'"
                :class="[
                  bgMode === 'color' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
                  'flex-1 py-2 text-xs font-medium rounded-lg transition'
                ]"
              >
                Solid / Typographic
              </button>
              <button
                @click="bgMode = 'photo'"
                :class="[
                  bgMode === 'photo' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
                  'flex-1 py-2 text-xs font-medium rounded-lg transition'
                ]"
              >
                Photo Background
              </button>
            </div>

            <div v-if="bgMode === 'color'" class="grid grid-cols-3 gap-2">
              <button
                v-for="c in colorThemes"
                :key="c.id"
                @click="selectedColor = c.id"
                :class="[
                  selectedColor === c.id ? 'ring-2 ring-blue-500 ring-offset-1' : 'border-slate-200 hover:border-slate-300',
                  'py-2 px-3 border rounded-lg text-xs font-medium transition text-center',
                  c.btnClass
                ]"
              >
                {{ c.name }}
              </button>
            </div>

            <div v-else class="space-y-3">
              <!-- Upload Custom Photo UI -->
              <div>
                <label class="block text-xs font-medium text-slate-600 mb-1">Upload Local Image</label>
                <label class="flex items-center justify-center gap-2 w-full p-2.5 bg-slate-50 hover:bg-slate-100 border border-dashed border-slate-300 rounded-lg cursor-pointer transition text-xs font-medium text-slate-700">
                  <svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  <span>Choose Image from Device</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    @change="handleFileUpload" 
                    class="hidden" 
                  />
                </label>
              </div>

              <div class="relative flex items-center py-0.5">
                <div class="flex-grow border-t border-slate-200"></div>
                <span class="flex-shrink mx-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">or search library</span>
                <div class="flex-grow border-t border-slate-200"></div>
              </div>

              <div>
                <div class="flex justify-between items-center mb-1">
                  <label class="text-xs font-medium text-slate-600">Search Photography (Openverse & Catalog)</label>
                  <span v-if="isImageLoading" class="text-xs text-blue-600 animate-pulse">Fetching photo...</span>
                </div>
                <form @submit.prevent="fetchPhotography" class="flex gap-2">
                  <input
                    v-model="imageSearchTerm"
                    type="text"
                    class="w-full rounded-lg border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 outline-none transition"
                    placeholder="Topic (e.g. landscape, mountains, forest, sea, stars, vintage)"
                  />
                  <button 
                    type="submit"
                    :disabled="isImageLoading"
                    class="px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition disabled:opacity-50 whitespace-nowrap"
                  >
                    Search
                  </button>
                </form>
              </div>

              <div class="flex flex-wrap gap-1.5 pt-1">
                <button
                  v-for="topic in quickTopics"
                  :key="topic"
                  @click="selectTopic(topic)"
                  class="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] rounded-full transition capitalize"
                >
                  {{ topic }}
                </button>
              </div>

              <div v-if="photoAuthor.name" class="p-2.5 bg-slate-50 border border-slate-100 rounded-lg text-xs space-y-1">
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
                
                <div v-if="photoAuthor.sourceUrl" class="flex items-center justify-between pt-1 border-t border-slate-200/60">
                  <label class="flex items-center gap-1.5 cursor-pointer text-[11px] text-slate-600 select-none">
                    <input type="checkbox" v-model="showCreditOnExport" class="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                    Include credit line on exported PNG
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div v-if="bgMode === 'photo'">
            <label class="block text-xs font-medium text-slate-600 mb-1">Text Readability Overlay</label>
            <div class="grid grid-cols-3 gap-2">
              <button
                v-for="o in overlayStyles"
                :key="o.id"
                @click="selectedOverlay = o.id"
                :class="[
                  selectedOverlay === o.id ? 'border-blue-600 ring-2 ring-blue-100' : 'border-slate-200 hover:border-slate-300',
                  'py-2 px-3 border rounded-lg text-xs font-medium text-slate-700 bg-white transition'
                ]"
              >
                {{ o.name }}
              </button>
            </div>
          </div>

          <div class="space-y-3 p-3 bg-slate-50 border border-slate-100 rounded-xl">
            <div class="flex items-center justify-between">
              <label class="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer select-none">
                <input type="checkbox" v-model="enableTextBoxBg" class="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                Text Box Background Panel
              </label>
              
              <div v-if="enableTextBoxBg" class="flex items-center gap-2">
                <span class="text-[11px] text-slate-500">Color:</span>
                <input 
                  type="color" 
                  v-model="textBoxBgColor" 
                  class="w-6 h-6 rounded cursor-pointer border border-slate-300 bg-transparent p-0 overflow-hidden"
                />
              </div>
            </div>

            <div v-if="enableTextBoxBg">
              <div class="flex justify-between text-xs text-slate-600 mb-1">
                <span>Box Background Opacity</span>
                <span>{{ textBoxOpacity }}%</span>
              </div>
              <input
                v-model="textBoxOpacity"
                type="range"
                min="0"
                max="100"
                class="w-full accent-blue-600"
              />
            </div>
          </div>

          <div class="space-y-3 p-3 bg-slate-50 border border-slate-100 rounded-xl">
            <div>
              <div class="flex justify-between text-xs text-slate-600 mb-1">
                <span>Font Size</span>
                <span>{{ fontSize }}px</span>
              </div>
              <input
                v-model="fontSize"
                type="range"
                min="16"
                max="40"
                class="w-full accent-blue-600"
              />
            </div>

            <div>
              <div class="flex justify-between text-xs text-slate-600 mb-1">
                <span>Box Max Width</span>
                <span>{{ boxWidth }}%</span>
              </div>
              <input
                v-model="boxWidth"
                type="range"
                min="40"
                max="100"
                class="w-full accent-blue-600"
              />
            </div>

            <div class="flex justify-between items-center text-xs text-slate-500 pt-1 border-t border-slate-200/60">
              <span>Drag box to move</span>
              <button 
                @click="resetTextLayout" 
                class="text-blue-600 hover:underline text-[11px] font-medium"
              >
                Reset Box & Position
              </button>
            </div>
          </div>

          <div class="pt-2 flex gap-3">
            <button
              @click="loadRandomQuote"
              class="flex-1 py-2.5 px-4 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
            >
              Random Quote
            </button>
            <button
              @click="downloadImage"
              :disabled="isExporting || isImageLoading || (bgMode === 'photo' && !base64Image)"
              class="flex-1 py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium shadow-sm transition disabled:opacity-50"
            >
              {{ isExporting ? 'Exporting...' : 'Download Image' }}
            </button>
          </div>
        </div>
      </div>

      <div class="flex flex-col items-center justify-center w-full">
        <span class="text-xs text-slate-400 mb-2">Live Preview (1:1 Square) — Drag to position</span>
        
        <div 
          ref="previewContainer"
          class="w-full max-w-[420px] aspect-square rounded-xl shadow-lg overflow-hidden border border-slate-100 bg-slate-900 relative touch-none"
        >
          
          <div v-if="isImageLoading" class="absolute inset-0 z-20 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center text-white text-xs font-medium">
            Preparing photo...
          </div>

          <div
            :class="[bgMode === 'color' ? currentColor.containerClass : 'bg-cover bg-center text-white']"
            :style="bgMode === 'photo' && base64Image ? { backgroundImage: `url(${base64Image})` } : {}"
            class="w-full h-full py-2 px-8 flex flex-col justify-between relative select-none"
          >
            <div v-if="bgMode === 'photo'" :class="['absolute inset-0', currentOverlay.class]"></div>

            <div class="relative z-10 flex flex-col justify-between h-full pointer-events-none">
              <div class="opacity-40 text-4xl font-serif">“</div>

              <div 
                @pointerdown="startDrag"
                :style="{ 
                  transform: `translate3d(${textPos.x}%, ${textPos.y}%, 0)`,
                  maxWidth: `${boxWidth}%`,
                  backgroundColor: computedRgbaBg
                }"
                :class="[
                  'pointer-events-auto cursor-grab active:cursor-grabbing space-y-3 p-4 rounded-xl transition-shadow duration-150 relative ',
                  isDragging ? 'ring-2 ring-blue-400/80 shadow-lg' : 'hover:ring-1 hover:ring-white/40'
                ]"
              >
                <p
                  :style="{ fontSize: `${fontSize}px`, lineHeight: 1.35 }"
                  class="font-serif font-medium tracking-wide leading-relaxed drop-shadow-md text-center"
                >
                  {{ quoteText || 'Enter a quote above...' }}
                </p>
                <p
                  v-if="author"
                  class="text-xs font-sans font-semibold tracking-wider uppercase opacity-90 drop-shadow text-center"
                >
                  — {{ author }}
                </p>
              </div>

              <div v-if=" bgMode === 'photo' && showCreditOnExport" class="flex justify-between items-end text-xs font-sans opacity-70 pt-0.5 border-t border-current/20">
                <span class="text-[9px] opacity-80 truncate max-w-[300px] pt-0.5">
                      
                    </span>
                <div class="flex flex-col">
                    
                  <span v-if="bgMode === 'photo' && showCreditOnExport && photoAuthor.name && photoAuthor.sourceUrl" class="text-[9px] opacity-80 truncate max-w-[300px] pt-0.5">
                    Background Photo: {{ photoAuthor.name }} ({{ photoAuthor.license }})
                  </span>
                </div>
                
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>

    <div class="fixed top-[-9999px] left-[-9999px] pointer-events-none overflow-hidden">
      <div
        ref="exportCard"
        :class="[bgMode === 'color' ? currentColor.containerClass : 'bg-cover bg-center text-white']"
        :style="bgMode === 'photo' && base64Image ? { backgroundImage: `url(${base64Image})` } : {}"
        class="w-[1080px] h-[1080px] p-20 flex flex-col justify-between relative"
      >
        <div v-if="bgMode === 'photo'" :class="['absolute inset-0', currentOverlay.class]"></div>

        <div class="relative z-10 flex flex-col justify-between h-full">
          <div class="opacity-40 text-7xl font-serif">“</div>

          <div 
            :style="{ 
              transform: `translate3d(${textPos.x}%, ${textPos.y}%, 0)`,
              maxWidth: `${boxWidth}%`,
              backgroundColor: computedRgbaBg
            }"
            class="space-y-6 p-10 rounded-2xl"
          >
            <p
              :style="{ fontSize: `${fontSize * 2.5}px`, lineHeight: 1.35 }"
              class="font-serif font-medium tracking-wide leading-relaxed drop-shadow-md text-center"
            >
              {{ quoteText || 'Enter a quote above...' }}
            </p>
            <p
              v-if="author"
              class="text-2xl font-sans font-semibold tracking-wider uppercase opacity-90 drop-shadow text-center"
            >
              — {{ author }}
            </p>
          </div>

          <div v-if="bgMode === 'photo' && showCreditOnExport" class="flex justify-between items-end text-xl font-sans opacity-70 pt-2 border-t border-current/20">
            <div class="flex flex-col">
              <span v-if="bgMode === 'photo' && showCreditOnExport && photoAuthor.name && photoAuthor.sourceUrl" class="text-sm opacity-80 mt-1">
                Background Photo: {{ photoAuthor.name }} ({{ photoAuthor.license }})
              </span>
            </div>
            <span class="text-sm">SOLI DEO GLORIA</span>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { toPng } from 'html-to-image'

const quoteText = ref('God is to be trusted, even when His providence seems to contradict His promise.')
const author = ref('John Flavel')
const fontSize = ref(22)
const boxWidth = ref(85)
const bgMode = ref('photo')
const selectedColor = ref('paper')
const selectedOverlay = ref('dark-gradient')
const imageSearchTerm = ref('landscape')
const base64Image = ref('')
const isImageLoading = ref(false)
const isExporting = ref(false)
const showCreditOnExport = ref(true)
const exportCard = ref(null)
const previewContainer = ref(null)

// Custom Text Box Background Controls
const enableTextBoxBg = ref(true)
const textBoxBgColor = ref('#000000')
const textBoxOpacity = ref(45)

// Converts HEX + Opacity % into RGBA String
const computedRgbaBg = computed(() => {
  if (!enableTextBoxBg.value) return 'transparent'
  
  const hex = textBoxBgColor.value.replace('#', '')
  const r = parseInt(hex.substring(0, 2), 16) || 0
  const g = parseInt(hex.substring(2, 4), 16) || 0
  const b = parseInt(hex.substring(4, 6), 16) || 0
  const alpha = textBoxOpacity.value / 100

  return `rgba(${r}, ${g}, ${b}, ${alpha})`
})

// Dragging Logic State
const isDragging = ref(false)
const textPos = ref({ x: 0, y: 0 })
let dragStart = { x: 0, y: 0 }
let initialPos = { x: 0, y: 0 }

const startDrag = (event) => {
  if (!previewContainer.value) return
  isDragging.value = true
  
  dragStart = { x: event.clientX, y: event.clientY }
  initialPos = { ...textPos.value }

  window.addEventListener('pointermove', onDrag)
  window.addEventListener('pointerup', stopDrag)
}

const onDrag = (event) => {
  if (!isDragging.value || !previewContainer.value) return
  
  const rect = previewContainer.value.getBoundingClientRect()
  if (rect.width === 0 || rect.height === 0) return

  const deltaX = event.clientX - dragStart.x
  const deltaY = event.clientY - dragStart.y

  const percentX = (deltaX / rect.width) * 100
  const percentY = (deltaY / rect.height) * 100

  textPos.value = {
    x: Math.min(Math.max(initialPos.x + percentX, -45), 45),
    y: Math.min(Math.max(initialPos.y + percentY, -45), 45)
  }
}

const stopDrag = () => {
  isDragging.value = false
  window.removeEventListener('pointermove', onDrag)
  window.removeEventListener('pointerup', stopDrag)
}

const resetTextLayout = () => {
  textPos.value = { x: 0, y: 0 }
  boxWidth.value = 85
  fontSize.value = 22
  textBoxOpacity.value = 45
  textBoxBgColor.value = '#000000'
}

const photoAuthor = ref({
  name: '',
  license: 'CC0 / Public Domain',
  sourceUrl: ''
})

// Handle Client-Side Image Uploads via FileReader
const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return

  isImageLoading.value = true
  bgMode.value = 'photo'

  const reader = new FileReader()
  reader.onload = (e) => {
    base64Image.value = e.target.result
    photoAuthor.value = {
      name: 'User Upload',
      license: 'Personal Image',
      sourceUrl: ''
    }
    isImageLoading.value = false
  }
  reader.onerror = () => {
    console.error('Error reading uploaded image')
    isImageLoading.value = false
  }
  reader.readAsDataURL(file)
}

const quickTopics = ['landscape', 'mountains', 'forest', 'sea', 'stars', 'vintage']

const verifiedCatalog = [
  {
    topics: ['landscape', 'mountains', 'alps', 'nature'],
    title: 'Aiguille du Midi Landscape',
    author: 'Public Domain',
    license: 'CC0 / Public Domain',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Aiguille_du_Midi_Mont_Blanc.jpg/1280px-Aiguille_du_Midi_Mont_Blanc.jpg',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Aiguille_du_Midi_Mont_Blanc.jpg'
  },
  {
    topics: ['forest', 'trees', 'mist', 'fog', 'nature'],
    title: 'Misty Woodland',
    author: 'Public Domain',
    license: 'CC0 / Public Domain',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Misty_forest_trees.jpg/1280px-Misty_forest_trees.jpg',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Misty_forest_trees.jpg'
  },
  {
    topics: ['sea', 'ocean', 'water', 'sunset', 'waves'],
    title: 'Pacific Coast Sunset',
    author: 'Public Domain',
    license: 'CC0 / Public Domain',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Sunset_at_Pacific_Ocean.jpg/1280px-Sunset_at_Pacific_Ocean.jpg',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Sunset_at_Pacific_Ocean.jpg'
  },
  {
    topics: ['stars', 'night', 'sky', 'space', 'astronomy'],
    title: 'Milky Way Sky',
    author: 'Public Domain',
    license: 'CC0 / Public Domain',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Milky_Way_Night_Sky.jpg/1280px-Milky_Way_Night_Sky.jpg',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Milky_Way_Night_Sky.jpg'
  },
  {
    topics: ['vintage', 'art', 'classical', 'painting'],
    title: 'Italian Landscape Painting',
    author: 'Hendrik Voogd',
    license: 'Public Domain',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Hendrik_Voogd_-_Italian_landscape_with_Umbrella_Pines.jpg/1280px-Hendrik_Voogd_-_Italian_landscape_with_Umbrella_Pines.jpg',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Hendrik_Voogd_-_Italian_landscape_with_Umbrella_Pines.jpg'
  }
]

const colorThemes = [
  { id: 'paper', name: 'Warm Paper', btnClass: 'bg-[#FAF7F2] text-[#2C2621]', containerClass: 'bg-[#FAF7F2] text-[#2C2621]' },
  { id: 'slate', name: 'Slate Dark', btnClass: 'bg-[#0F172A] text-[#F8FAFC]', containerClass: 'bg-[#0F172A] text-[#F8FAFC]' },
  { id: 'burgundy', name: 'Deep Burgundy', btnClass: 'bg-[#4A1521] text-[#FDF8F5]', containerClass: 'bg-[#4A1521] text-[#FDF8F5]' },
  { id: 'navy', name: 'Classic Navy', btnClass: 'bg-[#1E293B] text-[#F8FAFC]', containerClass: 'bg-[#1E293B] text-[#F8FAFC]' },
  { id: 'light', name: 'Minimal Light', btnClass: 'bg-white text-slate-900 border border-slate-200', containerClass: 'bg-white text-slate-900' }
]

const overlayStyles = [
  { id: 'dark-gradient', name: 'Dark Gradient', class: 'bg-gradient-to-t from-black/85 via-black/40 to-black/60' },
  { id: 'dark-dim', name: 'Full Dim', class: 'bg-black/50' },
  { id: 'vignette', name: 'Soft Vignette', class: 'bg-black/30 backdrop-brightness-90' }
]

const presets = [
  { text: 'Faith is a living, daring confidence in God’s grace, so sure and certain that a man could stake his life on it a thousand times.', author: 'Martin Luther' },
  { text: 'You have made us for yourself, O Lord, and our heart is restless until it rests in you.', author: 'Augustine of Hippo' },
  { text: 'He is no fool who gives what he cannot keep to gain what he cannot lose.', author: 'Jim Elliot' },
  { text: 'There is not a square inch in the whole domain of our human existence over which Christ, who is Sovereign over all, does not cry, Mine!', author: 'Abraham Kuyper' }
]

const currentColor = computed(() => {
  return colorThemes.find(c => c.id === selectedColor.value) || colorThemes[0]
})

const currentOverlay = computed(() => {
  return overlayStyles.find(o => o.id === selectedOverlay.value) || overlayStyles[0]
})

const fetchPhotography = async () => {
  const query = imageSearchTerm.value.toLowerCase().trim()
  isImageLoading.value = true
  bgMode.value = 'photo'

  const matches = verifiedCatalog.filter(item => 
    item.topics.some(t => t.includes(query)) || item.title.toLowerCase().includes(query)
  )

  if (matches.length > 0) {
    const chosen = matches[Math.floor(Math.random() * matches.length)]
    photoAuthor.value = {
      name: chosen.author,
      license: chosen.license,
      sourceUrl: chosen.sourceUrl
    }
    await loadExternalImageAsBase64(chosen.url)
    return
  }

  try {
    const openverseEndpoint = `https://api.openverse.org/v1/images/?q=${encodeURIComponent(query)}&license_type=custom,cc0,pdm&page_size=20`
    const ovRes = await fetch(openverseEndpoint)
    
    if (ovRes.ok) {
      const ovData = await ovRes.json()
      if (ovData.results && ovData.results.length > 0) {
        const chosen = ovData.results[Math.floor(Math.random() * ovData.results.length)]
        photoAuthor.value = {
          name: chosen.creator || 'Openverse Contributor',
          license: (chosen.license || 'CC0').toUpperCase(),
          sourceUrl: chosen.foreign_landing_url || chosen.url
        }
        await loadExternalImageAsBase64(chosen.url)
        return
      }
    }
  } catch (err) {
    console.warn('Openverse search missed or encountered CORS, falling back to seed pool:', err)
  }

  try {
    const randomSeed = Math.floor(Math.random() * 1000)
    photoAuthor.value = {
      name: 'Unsplash Contributor',
      license: 'Public / Free License',
      sourceUrl: 'https://picsum.photos'
    }
    await loadExternalImageAsBase64(`https://picsum.photos/id/${randomSeed}/1080/1080`)
  } catch (err) {
    console.error('Failed to load fallback photo:', err)
    isImageLoading.value = false
  }
}

const loadExternalImageAsBase64 = async (url) => {
  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
    const blob = await res.blob()
    convertBlobToBase64(blob)
  } catch (err) {
    console.warn('Failed to load image, attempting fallback:', err)
    try {
      const fallbackRes = await fetch(`https://picsum.photos/1080/1080?random=${Date.now()}`)
      const blob = await fallbackRes.blob()
      convertBlobToBase64(blob)
    } catch (e) {
      isImageLoading.value = false
    }
  }
}

const convertBlobToBase64 = (blob) => {
  const reader = new FileReader()
  reader.onloadend = () => {
    base64Image.value = reader.result
    isImageLoading.value = false
  }
  reader.readAsDataURL(blob)
}

const selectTopic = (topic) => {
  imageSearchTerm.value = topic
  fetchPhotography()
}

const loadRandomQuote = () => {
  const pick = presets[Math.floor(Math.random() * presets.length)]
  quoteText.value = pick.text
  author.value = pick.author
}

const downloadImage = async () => {
  if (!exportCard.value) return
  isExporting.value = true
  try {
    const dataUrl = await toPng(exportCard.value, {
      pixelRatio: 1,
      width: 1080,
      height: 1080,
      cacheBust: true
    })
    const link = document.createElement('a')
    link.download = `squarequote-${Date.now()}.png`
    link.href = dataUrl
    link.click()
  } catch (err) {
    console.error('Failed to export image:', err)
  } finally {
    isExporting.value = false
  }
}

onMounted(() => {
  fetchPhotography()
})
</script>