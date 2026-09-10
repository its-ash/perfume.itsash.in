<template>
  <svg viewBox="0 0 40 40" :width="size" :height="size" fill="none" xmlns="http://www.w3.org/2000/svg">
    <!-- spray nozzle -->
    <rect x="17" y="2" width="6" height="4" rx="1.5" fill="#111" />
    <!-- cap -->
    <rect x="14" y="6" width="12" height="7" rx="2" fill="#111" />
    <!-- bottle body -->
    <path
      d="M12 13h16c1.1 0 2 .9 2 2v18c0 3.3-2.7 6-6 6H16c-3.3 0-6-2.7-6-6V15c0-1.1.9-2 2-2Z"
      class="bottle-body"
      stroke="#111"
      stroke-width="2.5"
    />
    <!-- liquid fill -->
    <path
      d="M11.5 23h17v10c0 3.3-2.7 6-6 6h-5c-3.3 0-6-2.7-6-6V23Z"
      class="bottle-fill"
    />
    <!-- shine -->
    <path d="M16 18v14" stroke="#fff" stroke-opacity=".55" stroke-width="2" stroke-linecap="round" />
  </svg>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ size?: number }>(), { size: 40 });
</script>

<style scoped>
.bottle-body { fill: #fff; }
.bottle-fill { fill: currentColor; }
</style>
