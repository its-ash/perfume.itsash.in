<template>
  <div class="bg-cream min-h-screen md:h-screen md:overflow-hidden flex flex-col">
    <AppHeader :selected="selected" @toggle="toggleNote" @reset="resetAll" />
    <main class="flex-1 min-h-0 md:overflow-hidden overflow-y-auto">
      <MatchDashboard :results="results" />
    </main>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { useKnnMatcher, type MatchResult } from '~/composables/useKnnMatcher';
import { SITE_URL, SITE_NAME } from '~/data/site';

const selected = ref<Set<string>>(new Set());
const results  = ref<MatchResult[]>([]);

const { ready, match } = useKnnMatcher();

function toggleNote(id: string) {
  const next = new Set(selected.value);
  next.has(id) ? next.delete(id) : next.add(id);
  selected.value = next;
}

function resetAll() {
  selected.value = new Set();
  results.value = [];
}

let liveTimer: ReturnType<typeof setTimeout> | undefined;
watch(selected, () => {
  clearTimeout(liveTimer);
  if (!selected.value.size) {
    results.value = [];
    return;
  }
  liveTimer = setTimeout(async () => {
    if (!ready.value) return;
    results.value = await match([...selected.value]);
  }, 250);
}, { deep: true });

const title = `${SITE_NAME} — Find Your Signature Fragrance with AI Matching`;
const description = 'Pick your favorite fragrance notes and get AI-matched perfume recommendations powered by TensorFlow.js KNN cosine similarity. Browse 500+ real perfumes.';

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogType: 'website',
  ogUrl: SITE_URL,
  ogSiteName: SITE_NAME,
  twitterCard: 'summary'
});

useHead({
  link: [{ rel: 'canonical', href: SITE_URL }]
});
</script>
