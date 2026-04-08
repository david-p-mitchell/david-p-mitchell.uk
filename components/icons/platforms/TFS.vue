
<template>
    <BubbleLogo
      :name="'TFS'"
      :size="size"
      :showName="showName"
      :isSearchIcon="isSearchIcon"
      >
    <g transform="translate(70,40) scale(1.4) translate(-24,-14)">
        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round">

        </g>
        <g id="SVGRepo_iconCarrier">
            <path d="M10.175,18.342a8.171,8.171,0,1,1,8.171-8.171A8.181,8.181,0,0,1,10.175,18.342Zm0-11.673a3.5,3.5,0,1,0,3.5,3.5A3.506,3.506,0,0,0,10.175,6.669Z" style="fill:#ffffff"></path><path d="M28.089,24.023a4.2,4.2,0,1,1-1.231-2.971A4.189,4.189,0,0,1,28.089,24.023Z" style="fill:#ffffff"></path><path d="M30,6.21a4.2,4.2,0,1,1-1.231-2.971A4.189,4.189,0,0,1,30,6.21Z" style="fill:#ffffff"></path><path d="M10.416,25.8a4.2,4.2,0,1,1-1.231-2.971A4.189,4.189,0,0,1,10.416,25.8Z" style="fill:#ffffff"></path><rect x="15.758" y="6.37" width="8.189" height="2.801" transform="translate(-1.301 5.119) rotate(-14.233)" style="fill:#ffffff"></rect><rect x="3.834" y="18.591" width="7.601" height="2.802" transform="translate(-13.621 22.479) rotate(-75.774)" style="fill:#ffffff"></rect><rect x="17.171" y="14.085" width="2.801" height="9.292" transform="translate(-7.805 18.485) rotate(-44.709)" style="fill:#ffffff"></rect></g>
            </g>
    </BubbleLogo>
</template>

<script setup>
import BubbleLogo from '@/components/icons/BubbleLogo.vue';
const props = defineProps({
  size: { type: [Number, String], default: 96 },
  showName: { type: Boolean, default: true },
  isSearchIcon: { type: Boolean, default: false}
});
</script>