<template>
  <div class="shrink-0">
    <div class="bg-black text-white border-b-4 border-black">
      <div class="w-full px-4 md:px-6 py-1.5 flex items-center justify-between font-display font-bold text-xs uppercase tracking-widest">
        <span>🧪 live scent dashboard</span>
        <span class="hidden sm:inline text-sunshine">cosine-similarity engine · client-side</span>
      </div>
    </div>

    <header class="w-full px-4 md:px-6 py-2 flex items-center justify-between gap-4">
      <a href="/" class="flex items-center gap-2 shrink-0">
        <BottleLogo :size="28" class="text-lime shrink-0" />
        <span class="font-display text-xl md:text-2xl font-extrabold text-black">Bloomé</span>
      </a>
      <div class="flex items-center gap-2 shrink-0">
        <button
          v-if="selected.size"
          type="button"
          class="font-display font-bold text-xs bg-white border-2 border-black text-black px-3 py-1.5 rounded-full hover:bg-watermelon hover:text-white transition-colors"
          @click="$emit('reset')"
        >
          Reset all
        </button>
      </div>
    </header>

    <div class="w-full px-4 md:px-6 pb-2 border-b-4 border-black bg-white">
      <div class="flex flex-wrap gap-1.5 md:gap-2">
        <button
          v-for="note in notes"
          :key="note.id"
          type="button"
          :title="note.name"
          class="note-chip flex items-center rounded-full border-2 border-black px-3 py-1.5"
          :class="selected.has(note.id) ? ['selected', chipBg(note.color)] : 'bg-white'"
          @click="$emit('toggle', note.id)"
        >
          <span class="font-display font-semibold text-xs" :class="selected.has(note.id) ? 'text-white' : 'text-black/80'">{{ note.name }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NOTE_MAP, PICKABLE_NOTE_IDS, type Note } from '~/data/notes';

const props = withDefaults(defineProps<{ selected?: Set<string> }>(), {
  selected: () => new Set<string>()
});

defineEmits<{
  (e: 'toggle', noteId: string): void;
  (e: 'reset'): void;
}>();

const notes = computed<Note[]>(() =>
  PICKABLE_NOTE_IDS.map(id => NOTE_MAP[id]).filter((n): n is Note => Boolean(n))
);

const colorClasses: Record<string, string> = {
  tangerine: 'bg-tangerine',
  lime: 'bg-lime',
  watermelon: 'bg-watermelon',
  sunshine: 'bg-sunshine'
};
function chipBg(color: string) {
  return colorClasses[color] ?? colorClasses.tangerine;
}
</script>

<style scoped>
.note-chip { transition: transform .15s ease, box-shadow .15s ease; }
.note-chip:hover { transform: translateY(-2px); }
.note-chip.selected { box-shadow: inset 0 0 0 2px #000, 3px 3px 0 rgba(0,0,0,.15); }
</style>
