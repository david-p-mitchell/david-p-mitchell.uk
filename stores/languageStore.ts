import { reactive } from 'vue'

export const languageStore = reactive<{
  selectedLanguage: string | null
}>({
  selectedLanguage: null
})