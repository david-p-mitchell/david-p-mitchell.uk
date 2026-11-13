<!-- src/components/TelemetryCard.vue -->
<template>
  <div class="w-full">
    <!-- Mobile Toggle Button (Hidden on md and larger) -->
    <button
      @click="isOpen = !isOpen"
      class="md:hidden w-full text-center py-1 text-[0.5rem] font-mono text-neutral-50/80 border-b border-gold/30 flex items-center justify-center gap-1"
    >
      <span>{{ (isOpen ? 'Hide Stats for ' : 'Show Stats for ') + monthName }}</span>
      <span class="text-[10px]">{{ isOpen ? '▲' : '▼' }}</span>
    </button>

    <!-- Telemetry Content: Hidden by default on mobile unless isOpen is true; Always visible on md+ -->
    <div :class="['mt-2 md:mt-0 md:block', isOpen ? 'block' : 'hidden']">
      <p class="text-center hidden md:block text-xs">
        {{ 'Stats for ' + monthName }}
      </p>

      <div class="grid grid-cols-3 gap-4 mt-2">
        <!-- Commits Stat -->
        <div class="px-2 sm:px-3 sm:pt-2 rounded-lg bg-slate-800/50 border border-slate-700/50 max-w-full">
          <!-- Top Stat Header -->
          <div class="flex flex-wrap items-center justify-between gap-2">
            <div class="flex gap-2">
              <div class="flex flex-col">
                <span class="text-xs text-emerald-400 font-mono font-semibold leading-tight">Code Commits</span>
                <span class="text-[0.65rem] text-emerald-400/80 font-mono leading-none">(main)</span>
              </div>

              <div class="flex items-baseline gap-1 text-right">
                <span class="text-xs sm:text-base font-bold text-white">{{ commits.totals.allBranches }}</span>
                <span class="text-xs font-medium text-slate-400">({{ commits.totals.mainBranch }})</span>
              </div>
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
          <div class="flex mt-1">
            <span class="text-xs text-amber-400 font-mono">Exercise</span>
            <span v-if="health && !health.error" class="text-[0.5rem] text-amber-400 font-mono ml-0.5">
              *roughly
            </span>
          </div>

          <div v-if="!health || health.error" class="text-[0.65rem] text-amber-400">
            Data unavailable
          </div>

          <div v-else>
            <div class="flex gap-2 items-baseline">
              <p class="text-[0.65rem]">Miles</p>
              <div class="text-[0.6rem] font-bold mt-1 text-white">
                {{ health.monthToDate.distanceMiles }}
              </div>
              <div class="text-[0.6rem] mt-1 text-white">
                ({{ perDay(health.monthToDate.distanceMiles) }})
              </div>
            </div>

            <p class="text-[0.65rem] mt-2">Active Zone Mins</p>

            <div class="flex gap-2 items-baseline">
              <div class="text-[0.6rem] font-bold mt-1 text-white">
                {{ health.monthToDate.activeZoneMinutes }}
              </div>
              <div class="text-[0.6rem] mt-1 text-white">
                ({{ perDay(health.monthToDate.activeZoneMinutes) }}) per day
              </div>
            </div>
          </div>
        </div>

        <!-- Faith Stat -->
        <div class="px-1 rounded-lg bg-slate-800/50 border border-slate-700/50">
          <span class="text-xs text-sky-400 font-mono">Reading</span>

          <div class="text-xs font-bold mt-2 text-white">Up to {{ bibleProgress?.totalProgress }}%</div>
          <div class="text-xs font-bold mt-2 text-white">through the Bible</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { CommitBreakdown } from '../lib/github';
import type { BookOverallProgress } from '../composables/useBibleReadingProgress';
import type { ActivitySummary } from '../types/health';

function getMonthNameFromDate(monthNumber: number): string {
  const date = new Date(2000, monthNumber - 1, 1);
  return date.toLocaleString('en-US', { month: 'long' });
}

const props = defineProps<{
  commits: CommitBreakdown;
  month: number;
  health?: ActivitySummary;
  bibleProgress?: BookOverallProgress;
}>();

const monthName = computed(() => getMonthNameFromDate(props.month));

// Days elapsed in the displayed month: today's date if it's the current
// month, otherwise the full length of that month.
const daysElapsed = computed(() => {
  const now = new Date();
  if (props.month === now.getMonth() + 1) return now.getDate();
  return new Date(now.getFullYear(), props.month, 0).getDate();
});

function perDay(value: number): string {
  return (value / daysElapsed.value).toFixed(2);
}

// Default state on small screens (false = collapsed)
const isOpen = ref(false);
</script>