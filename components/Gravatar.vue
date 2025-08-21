<template>
  <div class="flex justify-center items-center">
    <img :src="avatarUrl" alt="User Avatar" class="rounded-full" />
  </div>
</template>

<script setup>
import { getGravatarUrl } from '~/utils/gravatar'

const email = 'davidpmitchell92@googlemail.com'
const avatarUrl = getGravatarUrl(email, 250)
</script>