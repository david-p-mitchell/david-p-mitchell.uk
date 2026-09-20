<!-- App.vue or pages/index.vue -->
<template>
  <div class="max-w-5xl mx-auto p-6 bg-white border border-slate-200 rounded-2xl shadow-sm font-sans">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      
      <!-- Left Controls Panel -->
      <div class="space-y-5">
        <div>
          <h2 class="text-xl font-semibold text-slate-800">Image Quote Generator</h2>
          <p class="text-sm text-slate-500">Create shareable graphics using free to use photography, or your own uploaded images.</p>
        </div>

        <div class="space-y-3">
          <!-- Section 1: Quote Text -->
          <QuoteSection
            v-model:quoteTextSections="quoteTextSections"
            v-model:author="author"
            v-model:quoteSource="quoteSource"
            v-model:showQuoteSource="showQuoteSource"
            @loadRandomQuote="loadRandomQuote"
            @addQuoteSection="addQuoteSection"
            @removeQuoteSection="quoteTextSections.length > 1 ? (index: number) => quoteTextSections.splice(index, 1) : null"
          />

          <!-- Section 2: Background Mode & Selection -->
          <BackgroundSection
            v-model:bgMode="bgMode"
            v-model:selectedColor="selectedColor"
            v-model:imageSearchTerm="imageSearchTerm"
            v-model:showCreditOnExport="showCreditOnExport"
            v-model:instaHandle="instaHandle"
            v-model:websiteUrl="websiteUrl"
            :colorThemes="colorThemes"
            :isImageLoading="isImageLoading"
            :quickTopics="quickTopics"
            :photoAuthor="photoAuthor"
            @fileUpload="handleFileUpload"
            @fetchPhotography="fetchPhotography"
            @selectTopic="selectTopic"
          />

          <!-- Section 3: Overlay & Text Box Panel -->
          <OverlayReadabilitySection
            :bgMode="bgMode"
            :overlayStyles="overlayStyles"
            v-model:selectedOverlay="selectedOverlay"
            v-model:enableTextBoxBg="enableTextBoxBg"
            v-model:textBoxBgColor="textBoxBgColor"
            v-model:textBoxOpacity="textBoxOpacity"
          />

          <!-- Section 4: Typography & Layout -->
          <TypographyLayoutSection
            v-model:fontColor="fontColor"
            v-model:fontSize="fontSize"
            v-model:boxWidth="boxWidth"
            @resetTextLayout="resetTextLayout"
          />

          <!-- Export Action CTA -->
          <div class="pt-2">
            <button
              @click="downloadImage"
              :disabled="isExporting || isImageLoading || (bgMode === 'photo' && !base64Image)"
              class="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium shadow-sm transition disabled:opacity-50"
            >
              {{ isExporting ? 'Exporting PNG...' : 'Download High-Res Graphic' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Right Column: Live Interactive Preview -->
      <div class="flex flex-col items-center justify-center w-full lg:sticky lg:top-6">
        <span class="text-xs text-slate-400 mb-2">Live Preview (1:1 Square) — Drag box to position</span>
        
        <div 
          ref="previewContainer"
          class="w-full max-w-[420px] aspect-square rounded-xl shadow-lg overflow-hidden border border-slate-100 bg-slate-900 relative touch-none select-none"
        >
          <div v-if="isImageLoading" class="absolute inset-0 z-20 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center text-white text-xs font-medium">
            Preparing photo...
          </div>

          <div
            :class="[bgMode === 'color' ? currentColor.containerClass : 'bg-cover bg-center text-white']"
            :style="hasPhotoBackground && base64Image ? { backgroundImage: `url(${base64Image})` } : {}"
            class="w-full h-full relative overflow-hidden"
          >
            <div v-if="hasPhotoBackground" :class="['absolute inset-0 pointer-events-none', currentOverlay.class]"></div>

            <!-- Absolute Top Quote Decoration -->
            <div class="absolute top-6 left-6 z-10 pointer-events-none opacity-40 text-4xl font-serif">“</div>

            <!-- Draggable Text Container centered with left/top percentage offset -->
            <div 
              @pointerdown="startDrag"
              :style="{ 
                left: `calc(50% + ${textPos.x}%)`,
                top: `calc(50% + ${textPos.y}%)`,
                transform: 'translate(-50%, -50%)',
                width: `${boxWidth}%`,
                backgroundColor: computedRgbaBg
              }"
              :class="[
                'absolute z-10 pointer-events-auto cursor-grab active:cursor-grabbing space-y-3 p-4 rounded-xl transition-shadow duration-150 text-center',
                isDragging ? 'ring-2 ring-blue-400/80 shadow-lg' : 'hover:ring-1 hover:ring-white/40'
              ]"
            >
            
              <p
                v-for="(section, index) in quoteTextSections"
                :key="index"
                :style="{
                  fontSize: `${fontSize + section.fontSizeDifference}px`,
                  lineHeight: 1.35,
                  color: fontColor
                }"
                :class="[
                  'font-serif tracking-wide leading-relaxed drop-shadow-md text-center',
                  section?.bold ? 'font-bold' : ''
                ]"
              >
                {{ section.text }}
              </p>
              <p
                v-if="author"
                :style="{ color: fontColor }"
                class="text-xs font-sans font-semibold tracking-wider uppercase opacity-90 drop-shadow text-center"
              >
                — {{ author }}
              </p>
              <p
                v-if="quoteSource && showQuoteSource"
                :style="{ color: fontColor }"
                class="text-[11px] font-sans tracking-wider opacity-90 drop-shadow italic text-center !mt-2"
              >
                 {{ quoteSource }}
              </p>
            </div>

            <!-- Absolute Bottom Credit Attribution (Preview) -->
            <QuoteFooter v-if="hasPhotoBackground"
          :type="photoFooterType"
          :show-credit="showCreditOnExport"
          :photo-author="photoAuthor"
          :website-url="websiteUrl"
          :insta-handle="instaHandle"
        />
          </div>
        </div>
      </div>

    </div>

    <!-- Hidden Export Render Card (1080x1080) -->
    <div class="fixed top-[-9999px] left-[-9999px] pointer-events-none overflow-hidden">
      <div
        ref="exportCard"
        :class="[bgMode === 'color' ? currentColor.containerClass : 'bg-cover bg-center text-white']"
        :style="hasPhotoBackground && base64Image ? { backgroundImage: `url(${base64Image})` } : {}"
        class="w-[1080px] h-[1080px] relative overflow-hidden"
      >
        <div v-if="hasPhotoBackground" :class="['absolute inset-0', currentOverlay.class]"></div>

        <!-- Absolute Top Quote Decoration -->
        <div class="absolute top-[61px] left-[61px] z-10 opacity-40 text-7xl font-serif">“</div>

        <!-- Draggable Text Card Scaled for High-Res -->
        <div 
          :style="{ 
            left: `calc(50% + ${textPos.x}%)`,
            top: `calc(50% + ${textPos.y}%)`,
            transform: 'translate(-50%, -50%)',
            width: `${boxWidth}%`,
            backgroundColor: computedRgbaBg
          }"
          class="absolute z-10 space-y-[31px] p-[41px] rounded-2xl text-center"
        >
          <p v-for="(section, index) in quoteTextSections" :key="index"
            :style="{ fontSize: `${fontSize * 2.571}px`, lineHeight: 1.35, color: fontColor }"
            class="font-serif font-medium tracking-wide leading-relaxed drop-shadow-md text-center"
          >
            {{ section.text }}
          </p>
          <p
            v-if="author"
            :style="{ color: fontColor }"
            class="text-[31px] font-sans font-semibold tracking-wider uppercase opacity-90 drop-shadow text-center"
          >
            — {{ author }}
          </p>

          <p
            v-if="quoteSource && showQuoteSource"
            :style="{ color: fontColor }"
            class="text-[24px] font-sans tracking-wider opacity-90 drop-shadow italic text-center !mt-2"
          >
              {{ quoteSource }}
          </p>
        </div>

        <!-- Absolute Bottom Credit Attribution (Export 1080px) -->
        <QuoteFooter v-if="hasPhotoBackground"
          :type="photoFooterType"
          :show-credit="showCreditOnExport"
          :photo-author="photoAuthor"
          :website-url="websiteUrl"
          :insta-handle="instaHandle"
          large
        />
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

import QuoteSection from './quotes/QuoteSection.vue'
import BackgroundSection from './quotes/BackgroundSection.vue'
import OverlayReadabilitySection from './quotes/OverlayReadabilitySection.vue'
import TypographyLayoutSection from './quotes/TypographyLayoutSection.vue'
import QuoteFooter from './quotes/QuoteFooter.vue'

import { useQuoteGraphicState } from '../../composables/quotes/useQuoteGraphicState'
import { useQuoteGraphicDrag } from '../../composables/quotes/useQuoteGraphicDrag'
import { useQuoteGraphicImages } from '../../composables/quotes/useQuoteGraphicImages'
import { useQuoteGraphicExport } from '../../composables/quotes/useQuoteGraphicExport'

// --------------------------------------------------
// Shared graphic state
// --------------------------------------------------

const {
  quoteTextSections,
  author,
  quoteSource,
  showQuoteSource,

  fontColor,
  fontSize,
  boxWidth,

  bgMode,
  selectedColor,
  selectedOverlay,
  imageSearchTerm,

  isImageLoading,
  showCreditOnExport,

  instaHandle,
  websiteUrl,

  enableTextBoxBg,
  textBoxBgColor,
  textBoxOpacity,

  photoAuthor,

  computedRgbaBg,
  hasPhotoBackground,

  resetTextLayout,
  loadRandomQuote,
  addQuoteSection
} = useQuoteGraphicState()

// --------------------------------------------------
// Template refs
// --------------------------------------------------

const exportCard = ref(null)
const previewContainer = ref(null)

// --------------------------------------------------
// Dragging
// --------------------------------------------------

const {
  isDragging,
  textPos,
  startDrag
} = useQuoteGraphicDrag(previewContainer)

// --------------------------------------------------
// Images
// --------------------------------------------------

const {
  base64Image,
  handleFileUpload,
  fetchPhotography,
  selectTopic
} = useQuoteGraphicImages(
  bgMode,
  imageSearchTerm,
  isImageLoading,
  photoAuthor
)

// --------------------------------------------------
// Export
// --------------------------------------------------

const {
  isExporting,
  downloadImage
} = useQuoteGraphicExport(exportCard)

// --------------------------------------------------
// Static options
// --------------------------------------------------

const quickTopics = [
  'landscape',
  'mountains',
  'forest',
  'sea',
  'stars',
  'vintage'
]

const colorThemes = [
  {
    id: 'paper',
    name: 'Warm Paper',
    btnClass: 'bg-[#FAF7F2] text-[#2C2621]',
    containerClass: 'bg-[#FAF7F2] text-[#2C2621]'
  },
  {
    id: 'slate',
    name: 'Slate Dark',
    btnClass: 'bg-[#0F172A] text-[#F8FAFC]',
    containerClass: 'bg-[#0F172A] text-[#F8FAFC]'
  },
  {
    id: 'burgundy',
    name: 'Deep Burgundy',
    btnClass: 'bg-[#4A1521] text-[#FDF8F5]',
    containerClass: 'bg-[#4A1521] text-[#FDF8F5]'
  },
  {
    id: 'navy',
    name: 'Classic Navy',
    btnClass: 'bg-[#1E293B] text-[#F8FAFC]',
    containerClass: 'bg-[#1E293B] text-[#F8FAFC]'
  },
  {
    id: 'light',
    name: 'Minimal Light',
    btnClass: 'bg-white text-slate-900 border border-slate-200',
    containerClass: 'bg-white text-slate-900'
  }
]

const overlayStyles = [
  {
    id: 'dark-gradient',
    name: 'Dark Gradient',
    class: 'bg-gradient-to-t from-black/85 via-black/40 to-black/60'
  },
  {
    id: 'dark-dim',
    name: 'Full Dim',
    class: 'bg-black/50'
  },
  {
    id: 'vignette',
    name: 'Soft Vignette',
    class: 'bg-black/30 backdrop-brightness-90'
  }
]

// --------------------------------------------------
// Computed theme values
// --------------------------------------------------

const currentColor = computed(() =>
  colorThemes.find(c => c.id === selectedColor.value) ||
  colorThemes[0]
)

const currentOverlay = computed(() =>
  overlayStyles.find(o => o.id === selectedOverlay.value) ||
  overlayStyles[0]
)

const photoFooterType = computed<'photo' | 'userUploadPhoto'>(() =>
  bgMode.value === 'userUploadPhoto'
    ? 'userUploadPhoto'
    : 'photo'
)

// --------------------------------------------------
// Initialisation
// --------------------------------------------------

onMounted(() => {
  fetchPhotography()
  loadRandomQuote()
})
</script>