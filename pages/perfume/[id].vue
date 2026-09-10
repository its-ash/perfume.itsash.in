<template>
  <div class="bg-cream min-h-screen">
    <AppHeader />

    <main v-if="perfume" class="max-w-4xl mx-auto px-6 md:px-10 py-10 md:py-16">
      <NuxtLink to="/" class="inline-flex items-center gap-1.5 font-display font-bold text-sm text-black/60 hover:text-black mb-8">
        ← Back to matcher
      </NuxtLink>

      <div class="bg-white border-4 border-black rounded-4xl p-6 md:p-10 shadow-[8px_8px_0_#000]">
        <span class="inline-block font-display font-bold text-xs uppercase tracking-widest bg-sunshine border-2 border-black px-3 py-1.5 rounded-full mb-4">
          {{ perfume.brand }}
        </span>
        <h1 class="font-display font-extrabold text-3xl md:text-5xl text-black leading-tight mb-2">
          {{ perfume.name }}
        </h1>
        <p class="text-black/60 font-semibold mb-8">by {{ perfume.brand }}</p>

        <h2 class="font-display font-extrabold text-lg text-black mb-3">Notes</h2>
        <div class="flex flex-wrap gap-2 mb-10">
          <span
            v-for="note in noteDetails"
            :key="note.id"
            class="inline-flex items-center gap-1.5 rounded-full border-2 border-black px-3 py-1.5 text-xs font-display font-bold"
            :class="chipBg(note.color)"
          >
            <img :src="`/notes/${note.id}.svg`" :alt="note.name" class="w-4 h-4 object-contain">
            {{ note.name }}
          </span>
        </div>

        <div class="flex flex-wrap gap-3">
          <a
            :href="perfume.fragrantica"
            target="_blank"
            rel="noopener"
            class="inline-block bg-black text-white font-display font-bold rounded-full px-6 py-3 text-sm hover:opacity-80 transition"
          >
            View on Fragrantica →
          </a>
          <NuxtLink
            to="/"
            class="inline-block bg-white border-4 border-black text-black font-display font-bold rounded-full px-6 py-3 text-sm hover:bg-lime transition"
          >
            Find similar scents
          </NuxtLink>
        </div>
      </div>

      <section v-if="related.length" class="mt-12">
        <h2 class="font-display font-extrabold text-2xl text-black mb-5">You might also like</h2>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <NuxtLink
            v-for="r in related"
            :key="r.id"
            :to="`/perfume/${r.id}`"
            class="card-pop bg-white/80 border-4 border-black rounded-4xl p-5 shadow-[4px_4px_0_#000] block"
          >
            <h3 class="font-display font-extrabold text-black">{{ r.name }}</h3>
            <p class="text-black/60 text-sm font-semibold">{{ r.brand }}</p>
          </NuxtLink>
        </div>
      </section>
    </main>

    <main v-else class="max-w-4xl mx-auto px-6 md:px-10 py-24 text-center">
      <h1 class="font-display font-extrabold text-3xl text-black mb-3">Perfume not found</h1>
      <NuxtLink to="/" class="inline-block bg-black text-white font-display font-bold rounded-full px-6 py-3 text-sm">
        ← Back to matcher
      </NuxtLink>
    </main>

    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { PERFUMES } from '~/data/perfumes';
import { NOTE_MAP } from '~/data/notes';
import { SITE_URL, SITE_NAME } from '~/data/site';

const route = useRoute();
const id = computed(() => String(route.params.id));
const perfume = computed(() => PERFUMES.find(p => p.id === id.value) ?? null);

const noteDetails = computed(() =>
  (perfume.value?.notes ?? []).map(nid => NOTE_MAP[nid]).filter(Boolean)
);

const related = computed(() => {
  if (!perfume.value) return [];
  const noteSet = new Set(perfume.value.notes);
  return PERFUMES
    .filter(p => p.id !== perfume.value!.id)
    .map(p => ({ p, overlap: p.notes.filter(n => noteSet.has(n)).length }))
    .filter(x => x.overlap > 0)
    .sort((a, b) => b.overlap - a.overlap)
    .slice(0, 3)
    .map(x => x.p);
});

const colorClasses: Record<string, string> = {
  tangerine: 'bg-tangerine-light',
  lime: 'bg-lime-light',
  watermelon: 'bg-watermelon-light',
  sunshine: 'bg-sunshine-light'
};
function chipBg(color: string) {
  return colorClasses[color] ?? colorClasses.tangerine;
}

const title = perfume.value
  ? `${perfume.value.name} by ${perfume.value.brand} — Notes & Match | ${SITE_NAME}`
  : `Perfume not found | ${SITE_NAME}`;
const description = perfume.value
  ? `Explore ${perfume.value.name} by ${perfume.value.brand}: full note breakdown (${noteDetails.value.map(n => n.name).join(', ')}) and AI-matched similar fragrances.`
  : `This perfume could not be found in the ${SITE_NAME} fragrance database.`;
const canonicalUrl = `${SITE_URL}/perfume/${id.value}`;

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogType: 'website',
  ogUrl: canonicalUrl,
  ogSiteName: SITE_NAME,
  twitterCard: 'summary'
});

useHead({
  link: [{ rel: 'canonical', href: canonicalUrl }],
  script: perfume.value ? [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: perfume.value.name,
        brand: { '@type': 'Brand', name: perfume.value.brand },
        description,
        url: canonicalUrl,
        additionalProperty: noteDetails.value.map(n => ({
          '@type': 'PropertyValue',
          name: 'note',
          value: n.name
        }))
      })
    }
  ] : []
});
</script>
