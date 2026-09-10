<template>
  <section class="w-full h-full px-4 md:px-6 py-4 md:py-6 flex flex-col">

    <div v-if="!results.length" class="flex-1 flex items-center justify-center text-center">
      <p class="font-display font-bold text-black/40 text-lg">Pick a note above to see matching perfumes.</p>
    </div>

    <div v-else class="flex-1 min-h-0 overflow-y-auto">
      <p class="font-display font-bold text-xs uppercase tracking-widest text-black/40 mb-3">
        {{ results.length }} matching perfumes
      </p>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        <div
          v-for="(r, i) in results"
          :key="r.perfume.id"
          class="rounded-3xl border-4 border-black p-4 shadow-[5px_5px_0_#000] flex flex-col"
          :class="resultBg(i)"
        >
          <div class="flex items-start justify-between mb-2">
            <span class="font-display font-bold text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full border-2 border-black bg-white/70">
              {{ i === 0 ? '🎉 Best Match' : `#${i + 1}` }}
            </span>
            <span class="font-display font-extrabold text-lg">{{ r.matchPercent }}%</span>
          </div>
          <h3 class="font-display font-extrabold text-base leading-tight">{{ r.perfume.name }}</h3>
          <p class="text-xs text-black/60 mb-2">{{ r.perfume.brand }}</p>
          <div class="flex gap-1.5 flex-wrap mb-3">
            <span
              v-for="note in r.matchedNotes.slice(0, 4)"
              :key="note.id"
              class="text-[10px] font-display font-bold bg-white/70 border-2 border-black px-2 py-0.5 rounded-full"
            >
              {{ note.name }}
            </span>
          </div>
          <div class="flex flex-wrap gap-2 mt-auto">
            <NuxtLink :to="`/perfume/${r.perfume.id}`" class="inline-block bg-black text-white font-display font-bold rounded-full px-3 py-1.5 text-xs hover:opacity-80 transition">
              View Detail
            </NuxtLink>
            <a :href="r.perfume.fragrantica" target="_blank" rel="noopener" class="inline-block bg-white border-2 border-black text-black font-display font-bold rounded-full px-3 py-1.5 text-xs hover:bg-white/70 transition">
              View on Fragrantica →
            </a>
          </div>
        </div>
      </div>
    </div>

  </section>
</template>

<script setup lang="ts">
import type { MatchResult } from '~/composables/useKnnMatcher';

withDefaults(defineProps<{
  results?: MatchResult[];
}>(), {
  results: () => []
});

const resultBgs = ['bg-watermelon-light', 'bg-sunshine-light', 'bg-lime-light', 'bg-tangerine-light'];
function resultBg(i: number) {
  return resultBgs[i % resultBgs.length];
}
</script>
