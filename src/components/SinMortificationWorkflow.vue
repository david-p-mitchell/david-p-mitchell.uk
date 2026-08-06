<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue';

onMounted(async () => {
  await nextTick();

  if ((window as any).refTagger?.tag) {
    (window as any).refTagger.tag();
  }
});
import {
  flow,
  START_NODE,
} from "../data/mortifyingSinWorkflow.ts";

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
</script>

<template>
  <div class="mx-auto max-w-xl px-4 py-8 font-sans">
    <h1 class="mb-4 text-center text-2xl font-bold text-slate-100 sm:text-3xl">
      Putting Sin to Death Questionnaire
    </h1>
    <p class="mb-6 text-center text-sm leading-relaxed text-slate-400">
    This tool is designed to help you identify and mortify sin in your life.
    </p>
    <p class="mb-6 text-center text-sm leading-relaxed text-slate-400">
      Romans 8:13
      Colossians 3:5
    </p>
    <p class="mb-6 text-center text-sm leading-relaxed text-slate-400">
      Answer honestly, one question at a time. Where the flowchart offers guidance
      instead of a yes/no, sit with it before continuing.
    </p>

    <!-- Main Card Section -->
    <section id="app" aria-live="polite">
      <div
        id="card"
        class="relative flex min-h-[220px] flex-col justify-between overflow-hidden rounded-2xl border border-slate-700/60 bg-gradient-to-b from-slate-800/80 to-slate-900/80 p-6 sm:p-8 shadow-xl backdrop-blur-md transition-all duration-300"
        :class="{
          'border-t-4 border-t-amber-500': currentNode.type === 'question',
          'border-t-4 border-t-teal-500': currentNode.type === 'reflection',
        }"
      >
        <div>
          <!-- Type Badge -->
          <div class="mb-4 flex items-center">
            <span
              class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wider uppercase border"
              :class="{
                'bg-amber-500/10 text-amber-400 border-amber-500/30': currentNode.type === 'question',
                'bg-teal-500/10 text-teal-300 border-teal-500/30': currentNode.type === 'reflection',
              }"
            >
              {{ currentNode.type === "question" ? "Question" : "Reflect" }}
            </span>
          </div>

          <!-- Main Text -->
          <p
            id="text"
            class="text-lg sm:text-xl leading-relaxed text-slate-100 transition-colors"
            :class="{ 'italic text-slate-200': currentNode.type === 'reflection' }"
          >
            {{ currentNode.text }}
            <span v-if="currentNode.scriptureReferences" class="block text-xs text-slate-400 mt-2">
                References:
                <span v-for="(ref, index) in currentNode.scriptureReferences" :key="index">
                    <a
                    :href="`https://www.biblegateway.com/passage/?search=${encodeURIComponent(ref)}&version=ESV`"
                    target="_blank"
                    class="text-emerald-400 hover:text-emerald-300"
                    >
                    {{ ref }}
                    </a>
                    <span v-if="index < currentNode.scriptureReferences.length - 1">, </span>
                </span>
            </span>
          </p>
        </div>

        <!-- Action Buttons -->
        <div id="actions" class="mt-8 flex gap-3">
          <template v-if="currentNode.type === 'question'">
            <button
              type="button"
              class="flex-1 rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white shadow-md transition-all duration-200 hover:bg-emerald-500 hover:shadow-emerald-900/30 active:scale-[0.98] hover:shadow-emerald-900/30 active:scale-[0.98]"
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
                currentNode.next === START_NODE
                  ? "Identify another sin →"
                  : "Continue"
              }}
            </button>
          </template>
        </div>
      </div>

      <!-- Footer Meta controls -->
      <div class="mt-4 flex items-center justify-between text-xs text-slate-400">
        <button
          id="restart"
          type="button"
          class="rounded-lg border border-slate-700/80 bg-slate-800/40 px-3 py-1.5 transition-all hover:bg-slate-700/50 hover:text-slate-200 active:scale-95"
          @click="restart"
        >
          Start over
        </button>

        <span id="laps" v-if="lapsCount > 0" class="font-medium text-slate-400">
          Full walk-throughs completed: {{ lapsCount }}
        </span>
      </div>
    </section>

    <!-- Footer Note -->
    <p class="mt-10 text-center text-xs text-slate-500 mt-3">
      Based on the <a href="https://visualtheology.church/shop/posters/books-of-the-bible/colossians/putting-sin-to-death/" target="_blank" class="text-emerald-400 hover:text-emerald-300">Visual Theology "How to Put Sin to Death" infographic</a>.
    </p>
  </div>
</template>