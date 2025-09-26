<script setup lang="ts">
import { computed, ref, watch } from "vue";
import DefaultLayout from "../components/DefaultLayout.vue";
import type { InspectionRecord, Breadcrumb } from "../types";
import { dateFormat } from "../utils/helper";
import inspectionStore from "../stores/inspection-store";
import { useRouter } from "vue-router";

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
const router = useRouter();

const tab = ref("open");
const listTab = [
  {
    title: "Open",
    value: "open",
    status: ["Draft", "New", "In Progress"],
  },
  {
    title: "For Review",
    value: "review",
    status: ["Ready to Review"],
  },
  {
    title: "Completed",
    value: "completed",
    status: ["Completed"],
  },
];

const listInspection = computed<InspectionRecord[]>(() => {
  const status = listTab.find(
    (currentTab) => tab.value === currentTab.value
  )?.status;
  return inspectionStore.getters.listInspection({ status });
});

const expandedRow = ref<string>("");
const tableColumns: { label: string; key: keyof InspectionRecord }[] = [
  {
    label: "Request No",
    key: "request_number",
  },
  {
    label: "Location",
    key: "location",
  },
  {
    label: "Scope Of Work",
    key: "sow",
  },
  {
    label: "Type",
    key: "type",
  },
  {
    label: "Date Submitted",
    key: "date_submitted",
  },
  {
    label: "ECD",
    key: "ecd",
  },
  {
    label: "Related To",
    key: "related_to",
  },
  {
    label: "Third Party",
    key: "third_party",
  },
  {
    label: "Status",
    key: "status",
  },
];

watch(tab, () => {
  expandedRow.value = "";
});
</script>

<template>
  <DefaultLayout :breadcrumbs="breadcrumbs">
    <div class="d-md-flex justify-space-between align-center border-b">
      <v-tabs v-model="tab" color="teal-lighten-2">
        <v-tab v-for="tab in listTab" :value="tab.value">{{ tab.title }}</v-tab>
      </v-tabs>
      <div class="d-flex align-center ga-2">
        <v-btn
          icon="mdi-magnify"
          size="small"
          density="comfortable"
          class="rounded"
          variant="outlined"
          color="teal"
        ></v-btn>
        <v-btn
          prepend-icon="mdi-file-document-arrow-right-outline"
          density="comfortable"
          variant="outlined"
          color="teal"
          >Export</v-btn
        >
      </div>
    </div>
    <!-- {{ listInspection }} -->
    <div class="d-flex justify-end mt-2">
      <v-btn
        prepend-icon="mdi-plus"
        color="teal"
        @click="router.push('/create')"
        >Create Request</v-btn
      >
    </div>
    <div class="mt-4">
      <v-table>
        <thead class="bg-grey-darken-1">
          <tr>
            <th
              v-for="column in tableColumns"
              class="text-left font-weight-bold"
            >
              {{ column.label }}
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(item, index) in listInspection" :key="item._id">
            <tr @click="router.push(`/detail/${item._id}`)">
              <template v-for="column in tableColumns" :key="column.key">
                <td v-if="column.key === 'sow'">
                  {{ item[column.key]?.subscope_name }}
                </td>
                <td
                  v-else-if="
                    column.key === 'date_submitted' || column.key === 'ecd'
                  "
                >
                  {{ dateFormat(new Date(String(item[column.key]))) }}
                </td>
                <td v-else>{{ item[column.key] }}</td>
              </template>
              <td>
                <v-btn
                  icon="mdi-chevron-down"
                  size="small"
                  color="teal"
                  variant="tonal"
                  class="border"
                  density="comfortable"
                  @click.stop="
                    expandedRow === index.toString()
                      ? (expandedRow = '')
                      : (expandedRow = index.toString())
                  "
                ></v-btn>
              </td>
            </tr>
            <tr v-if="expandedRow === index.toString()">
              <td colspan="10" class="px-0 border-t-lg border-b-lg py-1">
                <v-table>
                  <thead class="bg-grey-lighten-2">
                    <tr>
                      <th class="text-left font-weight-bold">
                        Item Description
                      </th>
                      <th class="text-left font-weight-bold">Ownership</th>
                      <th class="text-left font-weight-bold">Lot. No</th>
                      <th class="text-left font-weight-bold">Qty</th>
                      <th class="text-left font-weight-bold">Progress</th>
                    </tr>
                  </thead>
                  <tbody>
                    <template
                      v-for="inspectionItem in item.items"
                      :key="inspectionItem._id"
                    >
                      <tr v-for="lot in inspectionItem.lots">
                        <td>{{ inspectionItem.description }}</td>
                        <td>{{ lot.owner }}</td>
                        <td>{{ lot.number }}</td>
                        <td>{{ lot.qty_required }}</td>
                        <td>
                          {{ (lot.qty_inspected / lot.qty_required) * 100 }}%
                        </td>
                      </tr>
                    </template>
                  </tbody>
                </v-table>
              </td>
            </tr>
          </template>
        </tbody>
      </v-table>
    </div>
  </DefaultLayout>
</template>
