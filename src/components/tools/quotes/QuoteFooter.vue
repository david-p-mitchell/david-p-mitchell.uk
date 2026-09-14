<script setup lang="ts">
interface Props {
  type: 'photo' | 'userUploadPhoto'
  showCredit?: boolean
  photoAuthor?: {
    name?: string
    license?: string
  }
  websiteUrl?: string
  instaHandle?: string
  large?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showCredit: true,
  photoAuthor: () => ({
    name: '',
    license: ''
  }),
  websiteUrl: '',
  instaHandle: '',
  large: false
})
</script>

<template>
  <div
    v-if="
      (type === 'photo' &&
        showCredit &&
        (photoAuthor.name || photoAuthor.license)) ||
      (type === 'userUploadPhoto' &&
        (websiteUrl || instaHandle))
    "
    :class="[
      'absolute z-10 flex justify-between items-end font-sans opacity-70 border-t border-current/20',
      large
        ? 'bottom-[10px] left-[61px] right-[61px] text-[22px] pt-4 text-white'
        : 'bottom-[10px] left-6 right-6 text-xs pt-2'
    ]"
  >
    <!-- Stock photo attribution -->
    <template v-if="type === 'photo'">
        
      <span
        :class="[
          'opacity-80',
          large ? '' : 'text-[9px]'
        ]"
      >
        📸 {{ photoAuthor.name }} ({{ photoAuthor.license }})
      </span>
    </template>

    <!-- User-upload attribution -->
    <template v-else-if="type === 'userUploadPhoto'">
      <span
        v-if="websiteUrl"
        :class="[
          'opacity-80 truncate',
          large ? 'max-w-[450px]' : 'max-w-[180px]'
        ]"
      >
        {{ websiteUrl }}
      </span>

      <span
        v-if="instaHandle"
        :class="[
          'opacity-80 truncate',
          large ? 'max-w-[450px]' : 'max-w-[180px]'
        ]"
      >
        📸 {{ instaHandle }}
      </span>
    </template>
  </div>
</template>