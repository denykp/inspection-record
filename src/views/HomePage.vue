<script setup lang="ts">
import { onMounted, ref } from "vue";
import DefaultLayout from "../components/DefaultLayout.vue";
import type { InspectionRecord, Breadcrumb } from "../types";
import api from "../plugins/axios";

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

const listInspection = ref<InspectionRecord[]>();
onMounted(() => {
  api.get("/inspection-records").then((res) => {
    listInspection.value = res.data;
  });
});
</script>

<template>
  <DefaultLayout :breadcrumbs="breadcrumbs">
    <div>
      <v-tabs v-model="tab" color="teal-lighten-2">
        <v-tab v-for="tab in listTab" :value="tab.value">{{ tab.title }}</v-tab>
      </v-tabs>
    </div>
    {{ listInspection }}
  </DefaultLayout>
</template>
