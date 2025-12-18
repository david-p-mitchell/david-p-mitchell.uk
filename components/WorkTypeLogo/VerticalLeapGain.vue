<script setup lang="ts">
import VerticalLeapLogo from './VerticalLeapLogo.vue';
import GAINLogo from './GainLogo.vue';

// Define props with TypeScript support
interface Props {
  iconScale?: number;
    showName?: boolean;
    showTime?: boolean;
}

const props = defineProps<Props>();
const { iconScale = 1 } = props;
import { ref } from 'vue';

const hovering = ref(false);
</script>

<template>
  <div>
  <div class="grid grid-cols-2 divide-x-2 divide-blue-900 divide-opacity-75">
    <div>
      <GAINLogo :icon-scale="iconScale" />
    </div>
    <div>
      <VerticalLeapLogo :icon-scale="iconScale" />
    </div>
  </div>
  </div>
</template>
