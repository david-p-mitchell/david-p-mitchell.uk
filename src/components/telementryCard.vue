<!-- src/components/TelemetryCard.vue -->
<template>
  <div class="w-full">
    <!-- Mobile Toggle Button (Hidden on md and larger) -->
    <button 
      @click="isOpen = !isOpen"
      class="md:hidden w-full text-center py-1 text-[0.5rem] font-mono text-neutral-50/80 border-b border-gold/30 flex items-center justify-center gap-1"
    >
      <span>{{ isOpen ? 'Hide "Stats for ' + getMonthNameFromDate(month) : 'Show Stats for ' + getMonthNameFromDate(month) }}</span>
      <span class="text-[10px]">{{ isOpen ? '▲' : '▼' }}</span>
    </button>

    <!-- Telemetry Content: Hidden by default on mobile unless isOpen is true; Always visible on md+ -->
    <div :class="['mt-2 md:mt-0 md:block', isOpen ? 'block' : 'hidden']">
        <p class="text-center hidden md:block text-xs">
            {{ "Stats for " + getMonthNameFromDate(month) }}
        </p>
      <div class="grid grid-cols-3 gap-4 mt-2">
        <div class="px-2 sm:px-3 sm:pt-2 rounded-lg bg-slate-800/50 border border-slate-700/50 max-w-full">
  <!-- Top Stat Header -->
  <div class="flex flex-wrap items-center justify-between gap-2">
    <div class="flex flex-col">
      <span class="text-xs text-emerald-400 font-mono font-semibold leading-tight">Code Commits</span>
      <span class="text-[0.65rem] text-emerald-400/80 font-mono leading-none">(main branch)</span>
    </div>
    
    <div class="flex items-baseline gap-1 text-right">
      <span class="text-xs sm:text-base font-bold text-white">{{ commits.totals.allBranches }}</span>
      <span class="text-xs font-medium text-slate-400">({{ commits.totals.mainBranch }})</span>
    </div>
  </div>

  <!-- Breakdown Grid -->
  <div class="grid grid-cols-2 gap-2 text-xs text-slate-400 font-mono mt-1 border-t border-slate-700/40">
    <!-- Personal Repos -->
    <div class="flex flex-wrap items-center gap-x-1 gap-y-0.5" title="Personal Repos">
      <span>👤</span>
      <span class="font-medium text-slate-200">{{ commits.personal.allBranches }}</span>
      <span class="text-[0.7rem] text-slate-400">({{ commits.personal.mainBranch }})</span>
    </div>

    <!-- Org Repos -->
    <div class="flex flex-wrap items-center gap-x-1 gap-y-0.5" title="Organization Repos">
      <span>🏢</span>
      <span class="font-medium text-slate-200">{{ commits.org.allBranches }}</span>
      <span class="text-[0.7rem] text-slate-400">({{ commits.org.mainBranch }})</span>
    </div>
  </div>
</div>

        <!-- Fitness Stat -->
        <div class="px-1 rounded-lg bg-slate-800/50 border border-slate-700/50">
          <span class="text-xs text-amber-400 font-mono">Exercise</span>
          <div class="text-md font-bold mt-1 text-white">{{ runningKm }} km</div>
        </div>

        <!-- Faith Stat -->
        <div class="px-1 rounded-lg bg-slate-800/50 border border-slate-700/50">
          <span class="text-xs text-sky-400 font-mono">Reading</span>
          
          <div class="text-xs font-bold mt-2 text-white">Up to {{ bibleProgress.totalProgress }}% </div>
          <div class="text-xs font-bold mt-2 text-white"> through the Bible</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { CommitBreakdown } from '../lib/github';
import type { BookOverallProgress } from '../../composables/useBibleReadingProgress'

function getMonthNameFromDate(monthNumber: number): string {
  const date = new Date(2000, monthNumber - 1, 1);
  return date.toLocaleString("en-US", { month: "long" });
}

defineProps<{
  commits: CommitBreakdown;
  month: number;
  runningKm?: number;
  bibleProgress?: BookOverallProgress;
}>();

// Default state on small screens (false = collapsed)
const isOpen = ref(false);
</script>