import { reactive } from 'vue'

export const companyStore = reactive<{
  selectedCompany: string | null
}>({
  selectedCompany: null
})