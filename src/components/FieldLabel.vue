<script setup lang="ts">
defineProps<{ label: string; valueClass?: string; labelClass?: string }>();
</script>

<template>
  <div>
    <div class="v-label text-subtitle-2" :class="labelClass">
      {{ label }}
    </div>
    <div class="text-subtitle-1 font-weight-bold" :class="valueClass">
      <slot />
    </div>
  </div>
</template>
