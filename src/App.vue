<script setup lang="ts">
import { onMounted } from "vue";
import inspectionStore from "./store/inspection";

onMounted(async () => {
  await inspectionStore.dispatch("populateData");
});
</script>

<template>
  <RouterView />
</template>

<style scoped></style>
