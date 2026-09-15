import { ref, type Ref } from 'vue'

export interface PhotoAuthor {
  name: string
  license: string
  sourceUrl: string
  sourceName?: string
}

// Track visited IDs/URLs in module scope so history persists across composable calls
const usedImageIds = new Set()
const MAX_HISTORY_SIZE = 20

export function useExternalBackGroundPhoto() {
  const base64Image = ref<string | null>(null)
  const isImageLoading = ref(false)
  const bgMode = ref<'photo' | 'color' | string>('photo')
  const photoAuthor = ref<PhotoAuthor | null>(null)

  const markImageAsUsed = (idOrUrl: string) => {
    usedImageIds.add(idOrUrl)
    // Keep history manageable to prevent infinite memory growth
    if (usedImageIds.size > MAX_HISTORY_SIZE) {
      const firstEntry = usedImageIds.values().next().value
      if (firstEntry) usedImageIds.delete(firstEntry)
    }
  }

  const loadExternalImageAsBase64 = async (url: string): Promise<void> => {
  try {
    const res = await fetch(url)
    
    // Throw an error on HTTP 404/500 status codes so the calling retry loop catches it
    if (!res.ok) {
      throw new Error(`HTTP \({res.status} - Failed to load image from\){url}`)
    }

    const blob = await res.blob()

    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        base64Image.value = reader.result as string
        isImageLoading.value = false
        resolve()
      }
      reader.onerror = (err) => {
        isImageLoading.value = false
        reject(err)
      }
      reader.readAsDataURL(blob)
    })
  } catch (err) {
    isImageLoading.value = false
    throw err // Re-throw so the retry loop in fetchRandomPicsumPhoto catches it
  }
}

const fetchRandomPicsumPhoto = async (maxAttempts = 3): Promise<boolean> => {
  isImageLoading.value = true
  bgMode.value = 'photo'
  photoAuthor.value = null

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const id = Math.floor(Math.random() * 1000).toString()

    // Skip IDs already shown in the current session
    if (usedImageIds.has(`picsum-${id}`)) {
      continue
    }

    const imageUrl = `https://picsum.photos/id/${id}/1080/1080`

    try {
      // 1. Attempt to fetch & convert the image base64
      await loadExternalImageAsBase64(imageUrl)

      // 2. Fetch attribution info if image download succeeded
      const attrRes = await fetch(`https://picsum.photos/id/${id}/info`)
      if (attrRes.ok) {
        const attrJson = await attrRes.json()
        photoAuthor.value = {
            name: attrJson.author || 'Picsum',
            license: 'Unsplash / Free to use',
            sourceUrl: attrJson.url || imageUrl,
            sourceName: 'Picsum'
        }
      }

      markImageAsUsed(`picsum-${id}`)
      return true // Success! Exit function early
    } catch (err) {
      // 404 or network failure caught here -> log quietly and retry next iteration
      console.warn(`Picsum attempt \({attempt}/\){maxAttempts} failed for ID ${id}. Retrying...`)
    }
  }

  // All attempts exhausted
  isImageLoading.value = false
  console.error(`Failed to fetch a valid Picsum photo after ${maxAttempts} attempts.`)
  return false
}

//   const getOpenVersePhoto = async (query: string): Promise<boolean | null> => {
//     const trimmedQuery = query.toLowerCase().trim()
//     if (!trimmedQuery) return false

//     isImageLoading.value = true
//     bgMode.value = 'photo'

//     try {
//       const openverseEndpoint = `https://api.openverse.org/v1/images/?q=${encodeURIComponent(trimmedQuery)}&license=cc0,pdm&page_size=30`
//       const ovRes = await fetch(openverseEndpoint)

//       if (ovRes.ok) {
//         const ovData = await ovRes.json()
//         const results = ovData.results || []

//         // Filter out images that have already been used
//         const freshResults = results.filter(
//           (item: { id?: string; url: string }) => !usedImageIds.has(item.id || item.url)
//         )

//         // If all 30 results have been seen, fall back to any result
//         const pool = freshResults.length > 0 ? freshResults : results

//         if (pool.length > 0) {
//           const chosen = pool[Math.floor(Math.random() * pool.length)]
//           const uniqueIdentifier = chosen.id || chosen.url

//           await loadExternalImageAsBase64(chosen.url)

//           photoAuthor.value = {
//             name: chosen.creator || 'Openverse Contributor',
//             license: (chosen.license || 'CC0').toUpperCase(),
//             sourceUrl: chosen.foreign_landing_url || chosen.url,
//             sourceName: 'Openverse'
//           }

//           markImageAsUsed(uniqueIdentifier)
//           return true
//         }
//       }
//     } catch (err) {
//       console.warn('Openverse fallback trigger:', err)
//     }

//     isImageLoading.value = false
//     return false
//   }

  const fetchPhotoWithFallback = async (queryTerm: string): Promise<boolean> => {
    // const query = queryTerm.toLowerCase().trim()
    const success = await fetchRandomPicsumPhoto()
    if (success) return true
    return false
  }

  return {
    base64Image,
    isImageLoading,
    bgMode,
    photoAuthor,
    fetchPhotoWithFallback,
    loadExternalImageAsBase64
  }
}