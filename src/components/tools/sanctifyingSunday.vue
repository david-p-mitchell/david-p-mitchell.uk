<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue';

import {
  flow,
  START_NODE,
} from "../../data/sanctifyingSundayWorkflow.ts";

declare global {
  interface Window {
    refTagger?: {
      settings?: Record<string, any>;
      tag?: (element?: HTMLElement) => void;
    };
  }
}

interface BaseNode {
  text: string;
  scriptureReferences?: string[];
}

interface QuestionNode extends BaseNode {
  type: "question";
  yes: string;
  no: string;
}

interface ReflectionNode extends BaseNode {
  type: "reflection";
  next: string;
}

type FlowNode = QuestionNode | ReflectionNode;
type FlowMap = Record<string, FlowNode>;

const flowData = flow as FlowMap;

const currentId = ref<string>(START_NODE);
const lapsCount = ref<number>(0);
const cardRef = ref<HTMLElement | null>(null);

const currentNode = computed<FlowNode>(() => flowData[currentId.value]);

function go(nextId: string): void {
  if (nextId === START_NODE && currentId.value !== START_NODE) {
    lapsCount.value++;
  }

  currentId.value = nextId;
}

function restart(): void {
  currentId.value = START_NODE;
  lapsCount.value = 0;
}

/**
 * Trigger RefTagger tagger safely without throwing errors.
 */
async function tagBibleReferences(): Promise<void> {
  await nextTick();

  // Short delay allows Vue to finish rendering the new DOM nodes
  setTimeout(() => {
    if (window.refTagger && typeof window.refTagger.tag === 'function') {
      if (cardRef.value) {
        window.refTagger.tag(cardRef.value);
      } else {
        window.refTagger.tag();
      }
    } else {
      console.warn("RefTagger: tag() method not available. Script may be blocked or failed to load.");
    }
  }, 100);
}

onMounted(() => {
  // Preserve existing refTagger object methods if already loaded
  window.refTagger = window.refTagger || {};
  window.refTagger.settings = {
    bibleVersion: "ESV",
    tooltipStyle: "dark",
    noFollow: true,
  };

  const existingScript = document.getElementById("reftagger-script");

  if (!existingScript) {
    const script = document.createElement("script");
    script.id = "reftagger-script";
    script.src = "https://api.reftagger.com/v2/RefTagger.js";
    script.async = true;

    script.onload = () => {
      tagBibleReferences();
    };

    script.onerror = () => {
      console.error("RefTagger script failed to load. Check adblockers or network connectivity.");
    };

    document.body.appendChild(script);
  } else {
    tagBibleReferences();
  }
});

watch(currentId, async () => {
  await tagBibleReferences();
});
</script>

<template>
  <div class="mx-auto max-w-xl px-4 py-8 font-sans">
    <h1 class="mb-4 text-center text-2xl font-bold text-slate-100 sm:text-3xl">
      Sanctifying Sunday Questionnaire
    </h1>

    <p class="mb-6 text-center text-sm leading-relaxed text-slate-400">
      This tool is designed to help you evaluate your Sundays.
    </p>

    <p class="mb-6 text-center text-sm leading-relaxed text-slate-400">
      Whilst there can be much disagreement with how Sundays are now viewed in the light of all scripture, my hope is that this tool will help you decipher some key marks within faithful biblical parameters.
    </p>

    <p class="mb-6 text-center text-sm leading-relaxed text-slate-400">
      Answer honestly, one question at a time. Where the flowchart offers guidance
      instead of a yes/no, sit with it before continuing.
    </p>

    <!-- Main Card Section -->
    <section id="app" aria-live="polite">
      <div
        ref="cardRef"
        id="card"
        class="relative flex min-h-[220px] flex-col justify-between rounded-2xl border border-slate-700/60 bg-gradient-to-b from-slate-800/80 to-slate-900/80 p-6 shadow-xl backdrop-blur-md transition-all duration-300 sm:p-8"
        :class="{
          'border-t-4 border-t-amber-500': currentNode.type === 'question',
          'border-t-4 border-t-teal-500': currentNode.type === 'reflection',
        }"
      >
        <div>
          <!-- Type Badge -->
          <div class="mb-4 flex items-center">
            <span
              class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider"
              :class="{
                'border-amber-500/30 bg-amber-500/10 text-amber-400':
                  currentNode.type === 'question',
                'border-teal-500/30 bg-teal-500/10 text-teal-300':
                  currentNode.type === 'reflection',
              }"
            >
              {{ currentNode.type === "question" ? "Question" : "Reflect" }}
            </span>
          </div>

          <!-- Main Text -->
          <div
            id="text"
            class="text-lg leading-relaxed text-slate-100 transition-colors sm:text-xl"
            :class="{
              'italic text-slate-200': currentNode.type === 'reflection',
            }"
          >
            <p>{{ currentNode.text }}</p>

            <p v-for="recommendation in currentNode.recommendations" class="my-4">
              {{ recommendation }}
            </p>

            <!-- Re-keyed container guarantees clean DOM node on state transition -->
            <div
              v-if="currentNode.scriptureReferences?.length"
              :key="currentId"
              class="mt-3 text-xs text-slate-400"
            >
              <span>References: </span>
              <span>{{ currentNode.scriptureReferences.join(', ') }}</span>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div id="actions" class="mt-8 flex gap-3">
          <template v-if="currentNode.type === 'question'">
            <button
              type="button"
              class="flex-1 rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white shadow-md transition-all duration-200 hover:bg-emerald-500 hover:shadow-emerald-900/30 active:scale-[0.98]"
              @click="go(currentNode.yes)"
            >
              Yes
            </button>

            <button
              type="button"
              class="flex-1 rounded-xl bg-red-600 px-4 py-3 font-semibold text-white shadow-md transition-all duration-200 hover:bg-rose-500 hover:shadow-lg hover:shadow-rose-500/40 active:scale-[0.98]"
              @click="go(currentNode.no)"
            >
              No
            </button>
          </template>

          <template v-else-if="currentNode.type === 'reflection'">
            <button
              type="button"
              class="flex-1 rounded-xl bg-teal-600 px-4 py-3 font-semibold text-white shadow-md transition-all duration-200 hover:bg-teal-500 hover:shadow-teal-900/30 active:scale-[0.98]"
              @click="go(currentNode.next)"
            >
              {{
                currentNode.isEnd
                  ? "Restart →"
                  : "Continue"
              }}
            </button>
          </template>
        </div>
      </div>

      <!-- Footer Meta controls -->
      <div
        class="mt-4 flex items-center justify-between text-xs text-slate-400"
      >
        <button
          id="restart"
          type="button"
          class="rounded-lg border border-slate-700/80 bg-slate-800/40 px-3 py-1.5 transition-all hover:bg-slate-700/50 hover:text-slate-200 active:scale-95"
          @click="restart"
        >
          Start over
        </button>

        <span
          v-if="lapsCount > 0"
          id="laps"
          class="font-medium text-slate-400"
        >
          Full walk-throughs completed: {{ lapsCount }}
        </span>
      </div>
    </section>
  </div>
</template>

<style>
/* Ensure RefTagger hover popup renders above card elements */
#lbsTooltip {
  z-index: 99999 !important;
}

.rtBibleRef {
  color: #34d399 !important;
  text-decoration: underline !important;
  cursor: pointer !important;
}
</style>