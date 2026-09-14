import { ref, onUnmounted, type Ref } from 'vue'

export function useQuoteGraphicDrag(
  previewContainer: Ref<Element | null>
) {
  const isDragging = ref(false)
  const textPos = ref({ x: 0, y: 0 })

  let dragStart = { x: 0, y: 0 }
  let initialPos = { x: 0, y: 0 }

  const onDrag = (event: PointerEvent) => {
    if (!isDragging.value || !previewContainer.value) return

    const rect = previewContainer.value.getBoundingClientRect()

    if (!rect.width || !rect.height) return

    const deltaX = event.clientX - dragStart.x
    const deltaY = event.clientY - dragStart.y

    textPos.value = {
      x: Math.min(Math.max(initialPos.x + (deltaX / rect.width) * 100, -30), 30),
      y: Math.min(Math.max(initialPos.y + (deltaY / rect.height) * 100, -30), 30)
    }
  }

  const stopDrag = () => {
    isDragging.value = false
    window.removeEventListener('pointermove', onDrag)
    window.removeEventListener('pointerup', stopDrag)
  }

  const startDrag = (event: PointerEvent) => {
    if (!previewContainer.value) return

    isDragging.value = true

    dragStart = {
      x: event.clientX,
      y: event.clientY
    }

    initialPos = { ...textPos.value }

    window.addEventListener('pointermove', onDrag)
    window.addEventListener('pointerup', stopDrag)
  }

  const resetTextPosition = () => {
    textPos.value = { x: 0, y: 0 }
  }

  onUnmounted(stopDrag)

  return {
    isDragging,
    textPos,
    startDrag,
    stopDrag,
    resetTextPosition
  }
}