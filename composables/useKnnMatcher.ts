import { NOTES, NOTE_MAP, type Note } from '~/data/notes';
import { PERFUMES, type Perfume } from '~/data/perfumes';

export interface MatchResult {
  perfume: Perfume;
  score: number;       // 0..1 similarity
  matchPercent: number; // 0..100 rounded
  matchedNotes: Note[];
}

// Minimal type surface for the TFJS global loaded from CDN.
interface TfTensor {
  expandDims: (axis?: number) => TfTensor;
  squeeze: (axes?: number[]) => TfTensor;
  dataSync: () => Float32Array | Int32Array | Uint8Array;
}
interface TfBackend {
  tensor1d: (vals: number[]) => TfTensor;
  tensor2d: (vals: number[][]) => TfTensor;
  matMul: (a: TfTensor, b: TfTensor, transposeA?: boolean, transposeB?: boolean) => TfTensor;
  sum: (t: TfTensor, axis?: number) => TfTensor;
  square: (t: TfTensor) => TfTensor;
  sqrt: (t: TfTensor) => TfTensor;
  div: (a: TfTensor, b: TfTensor) => TfTensor;
  mul: (a: TfTensor, b: TfTensor) => TfTensor;
  add: (a: TfTensor, b: TfTensor) => TfTensor;
  tidy: (fn: () => TfTensor) => Float32Array | Int32Array | Uint8Array;
  ready: () => Promise<void>;
}
function getTf(): TfBackend {
  const tf = (window as any).tf as TfBackend | undefined;
  if (!tf) throw new Error('TensorFlow.js not loaded from CDN');
  return tf;
}

// Wait for the CDN script to load the global `tf`.
function waitForTf(): Promise<TfBackend> {
  return new Promise((resolve, reject) => {
    if ((window as any).tf) return resolve(getTf());
    const check = setInterval(() => {
      if ((window as any).tf) {
        clearInterval(check);
        resolve(getTf());
      }
    }, 50);
    setTimeout(() => {
      clearInterval(check);
      reject(new Error('TensorFlow.js failed to load from CDN'));
    }, 10000);
  });
}

// Build a fixed-dimension binary feature vector across the canonical note catalog.
// Each dimension = 1 if the perfume/user contains that note, else 0.
function toVector(noteIds: string[]): number[] {
  return NOTES.map(n => (noteIds.includes(n.id) ? 1 : 0));
}

export function useKnnMatcher() {
  const ready = ref(false);
  const matching = ref(false);

  // Perfume feature matrix as a 2D tensor, lazily built client-side.
  const perfumeMatrix = ref<number[][]>([]);
  const perfumeRows   = ref<Perfume[]>([]);

  onMounted(async () => {
    // Dedupe & filter notes against the catalog, then vectorize.
    perfumeRows.value = PERFUMES.map(p => ({
      ...p,
      notes: Array.from(new Set(p.notes.filter(id => NOTE_MAP[id])))
    }));
    perfumeMatrix.value = perfumeRows.value.map(p => toVector(p.notes));

    // Wait for the CDN-loaded TFJS global, then warm the backend.
    const tf = await waitForTf();
    await tf.ready();
    tf.tidy(() => tf.tensor2d(perfumeMatrix.value));
    ready.value = true;
  });

  /**
   * KNN match using TensorFlow.js.
   * Strategy: compute cosine similarity between the user vector and every
   * perfume vector via vectorized tensor ops, take the top-k, and return
   * them sorted by similarity descending. k defaults to 8.
   */
  async function match(selectedNoteIds: string[], k = 8): Promise<MatchResult[]> {
    if (!selectedNoteIds.length) return [];
    if (!perfumeRows.value.length) {
      // Fallback: build lazily if onMounted hasn't run yet.
      perfumeRows.value = PERFUMES.map(p => ({
        ...p,
        notes: Array.from(new Set(p.notes.filter(id => NOTE_MAP[id])))
      }));
      perfumeMatrix.value = perfumeRows.value.map(p => toVector(p.notes));
    }
    matching.value = true;
    try {
      const tf = await waitForTf();
      const userVec = toVector(selectedNoteIds);

      const results = tf.tidy(() => {
        const user  = tf.tensor1d(userVec).expandDims(0);          // [1, N]
        const data  = tf.tensor2d(perfumeMatrix.value);             // [M, N]
        // Cosine similarity row-wise: (u·d) / (||u|| ||d||)
        const dot   = tf.matMul(user, data, false, true).squeeze([0]); // [M]
        const uNorm = tf.sqrt(tf.sum(tf.square(user)));
        const dNorm = tf.sqrt(tf.sum(tf.square(data), 1));
        const sims  = dot.div(uNorm.mul(dNorm).add(1e-8));
        return sims.dataSync();
      });

      const ranked: MatchResult[] = perfumeRows.value
        .map((perfume, i) => {
          const score = Number(results[i]);
          const matchedIds = perfume.notes.filter(id => selectedNoteIds.includes(id));
          return {
            perfume,
            score,
            matchPercent: Math.max(0, Math.min(100, Math.round(score * 100))),
            matchedNotes: matchedIds.map(id => NOTE_MAP[id]).filter(Boolean) as Note[]
          };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, k);

      // Release the typed array's backing data explicitly.
      results instanceof Float32Array && (results as Float32Array).fill(0);
      return ranked;
    } finally {
      matching.value = false;
    }
  }

  return { ready, matching, match };
}