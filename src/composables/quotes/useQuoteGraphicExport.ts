import { ref, type Ref } from 'vue'
import { toPng } from 'html-to-image'

export function useQuoteGraphicExport(
  exportCard: Ref<HTMLElement | null>
) {
  const isExporting = ref(false)

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
      link.download = `quote-graphic-${Date.now()}.png`
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error('Failed to export:', err)
    } finally {
      isExporting.value = false
    }
  }

  return {
    isExporting,
    downloadImage
  }
}