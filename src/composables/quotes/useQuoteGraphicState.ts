import { ref, computed } from 'vue'
import { quotes } from '../../data/quotes'

export function useQuoteGraphicState() {
  const quoteText = ref('')
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

  const enableTextBoxBg = ref(true)
  const textBoxBgColor = ref('#000000')
  const textBoxOpacity = ref(45)

  const photoAuthor = ref({
    name: '',
    license: 'CC0 / Public Domain',
    sourceUrl: ''
  })

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

  quoteText.value = pick.text
  author.value = pick.author
  quoteSource.value = pick.source || pick.years || ''
}
  

  return {
    quotes,
    quoteText,
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
    loadRandomQuote
  }
}