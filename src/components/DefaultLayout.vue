<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import type { Breadcrumb } from "../types";

const route = useRoute();
const pageTitle = computed(() => route.meta.title || "Untitled Page");

const props = defineProps<{ breadcrumbs: Breadcrumb[] }>();
</script>

<template>
  <div class="py-4 px-8">
    <div>
      <h2>{{ pageTitle }}</h2>
      <v-breadcrumbs
        :items="breadcrumbs"
        divider=">"
        class="pa-0 text-subtitle-2"
      ></v-breadcrumbs>
    </div>
    <div class="mt-4 pa-4">
      <slot />
    </div>
  </div>
</template>
