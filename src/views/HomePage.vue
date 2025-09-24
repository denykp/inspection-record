<script setup lang="ts">
import { ref } from "vue";
import DefaultLayout from "../components/DefaultLayout.vue";
import type { Breadcrumb } from "../types";

const breadcrumbs: Breadcrumb[] = [
  {
    title: "Quality & HSE",
    disabled: true,
    href: "#",
  },
  {
    title: "Inspection",
    disabled: false,
    href: "#",
  },
  {
    title: "Inspection Record",
    disabled: false,
    href: "#",
  },
];

const tab = ref("open");
const listTab = [
  {
    title: "Open",
    value: "open",
  },
  {
    title: "For Review",
    value: "review",
  },
  {
    title: "Completed",
    value: "completed",
  },
];
</script>

<template>
  <DefaultLayout :breadcrumbs="breadcrumbs">
    <div>
      <v-tabs v-model="tab" color="teal-lighten-2">
        <v-tab v-for="tab in listTab" :value="tab.value">{{ tab.title }}</v-tab>
      </v-tabs>
    </div>
  </DefaultLayout>
</template>
