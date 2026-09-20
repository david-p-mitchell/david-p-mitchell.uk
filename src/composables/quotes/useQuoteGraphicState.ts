import { ref, computed, watch } from 'vue'
import { quotes } from '../../data/quotes'

export function useQuoteGraphicState() {
  const quoteTextSections = ref([{ text: '', bold: false, fontSizeDifference: 0 }])
  const author = ref('')
  const quoteSource = ref('')
  const showQuoteSource = ref(true)

  const fontColor = ref('#FFFFFF')
  const fontSize = ref(22)
  const boxWidth = ref(85)

  const bgMode = ref<'color' |'photo' | 'userUploadPhoto'>('photo')
  const selectedColor = ref('paper')
  const selectedOverlay = ref('dark-gradient')
  const imageSearchTerm = ref('landscape')

  const isImageLoading = ref(false)
  const isExporting = ref(false)
  const showCreditOnExport = ref(true)
  const instaHandle = ref('')
  const websiteUrl = ref('')

   if (typeof window !== 'undefined') {
    instaHandle.value = localStorage.getItem('quoteGraphic.instaHandle') || ''
    websiteUrl.value = localStorage.getItem('quoteGraphic.websiteUrl') || ''
  }

  watch(instaHandle, (value) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('quoteGraphic.instaHandle', value)
    }
  })

  watch(websiteUrl, (value) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('quoteGraphic.websiteUrl', value)
    }
  })

  const enableTextBoxBg = ref(true)
  const textBoxBgColor = ref('#000000')
  const textBoxOpacity = ref(45)

  const photoAuthor = ref({
    name: '',
    license: 'CC0 / Public Domain',
    sourceUrl: ''
  })
  const addQuoteSection = (text: string, bold: boolean = false) => {
    quoteTextSections.value.push({ text, bold, fontSizeDifference: 0 })
  }

  const computedRgbaBg = computed(() => {
    if (!enableTextBoxBg.value) return 'transparent'

    const hex = textBoxBgColor.value.replace('#', '')

    const r = parseInt(hex.substring(0, 2), 16) || 0
    const g = parseInt(hex.substring(2, 4), 16) || 0
    const b = parseInt(hex.substring(4, 6), 16) || 0

    return `rgba(${r}, ${g}, ${b}, ${textBoxOpacity.value / 100})`
  })

  const hasPhotoBackground = computed(() =>
    bgMode.value === 'photo' ||
    bgMode.value === 'userUploadPhoto'
  )

  const resetTextLayout = () => {
    fontSize.value = 22
    boxWidth.value = 85
    textBoxOpacity.value = 45
    textBoxBgColor.value = '#000000'
  }
  const loadRandomQuote = () => {
        const pick = quotes[Math.floor(Math.random() * quotes.length)]
            
        quoteTextSections.value = [{ text: pick.text, bold: false, fontSizeDifference: 0  }]
        author.value = pick.author
        quoteSource.value = pick.source || pick.years || ''
    }
  

  return {
    quotes,
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
    isExporting,
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
  }
}