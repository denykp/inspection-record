<script setup lang="ts">
defineProps<{ required?: boolean; label: string }>();
</script>

<template>
  <div class="flex-grow-1">
    <div :class="{ required }">
      <label class="v-label">
        {{ label }}
      </label>
    </div>
    <slot />
  </div>
</template>
