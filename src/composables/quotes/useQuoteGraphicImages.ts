import type { Ref } from 'vue'
import { useExternalBackGroundPhoto } from '../useExternalBackGroundPhoto'

export function useQuoteGraphicImages(
  bgMode: Ref<string>,
  imageSearchTerm: Ref<string>,
  isImageLoading: Ref<boolean>,
  photoAuthor: Ref<{
    name: string| null,
    license: string| null,
    sourceUrl: string | null,
    sourceName?: string | null
  }>
) {
  const photoHook = useExternalBackGroundPhoto()

  const base64Image = photoHook.base64Image
  const fetchPhotoWithFallback = photoHook.fetchPhotoWithFallback
  const externalPhotoAuthor = photoHook.photoAuthor

  const handleFileUpload = (event: Event) => {
    const input = event.target as HTMLInputElement
    const file = input.files?.[0]

    if (!file) return

    isImageLoading.value = true
    bgMode.value = 'userUploadPhoto'

    const reader = new FileReader()

    reader.onload = (e) => {
      base64Image.value = e.target?.result as string

      photoAuthor.value = {
        name: 'User Upload',
        license: 'Personal Image',
        sourceUrl: ''
      }

      isImageLoading.value = false
    }

    reader.readAsDataURL(file)
  }

  const fetchPhotography = async () => {
    isImageLoading.value = true
    bgMode.value = 'photo'

    try {
      await fetchPhotoWithFallback(imageSearchTerm.value.toLowerCase().trim())
        const author = externalPhotoAuthor.value
        photoAuthor.value = {
            name: author?.name ?? '',
            license: author?.license ?? '',
            sourceUrl: author?.sourceUrl ?? '',
            sourceName: author?.sourceName
        }
    } finally {
      isImageLoading.value = false
    }
  }

  const selectTopic = (topic: string) => {
    imageSearchTerm.value = topic
    fetchPhotography()
  }

  return {
    base64Image,
    photoAuthor,
    handleFileUpload,
    fetchPhotography,
    selectTopic
  }
}