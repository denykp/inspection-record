<script setup lang="ts">
import { useRouter } from "vue-router";
import type { Breadcrumb, InspectionRecord } from "../types";
import DefaultLayout from "../components/DefaultLayout.vue";
import FieldLabel from "../components/FieldLabel.vue";
import { computed } from "vue";
import inspectionStore from "../stores/inspection-store";
import { dateFormat } from "../utils/helper";

const breadcrumbs: Breadcrumb[] = [
  {
    title: "Operation",
    disabled: true,
    href: "#",
  },
  {
    title: "Yard Services",
    disabled: false,
    href: "/",
  },
  {
    title: "Yard Service Details",
    disabled: false,
    href: "#",
  },
];
const router = useRouter();
const inspectionDetail = computed<InspectionRecord>(() =>
  inspectionStore.getters.inspectionDetail(router.currentRoute.value.params.id)
);
</script>

<template>
  <DefaultLayout :breadcrumbs="breadcrumbs">
    <div>
      <v-btn
        prepend-icon="mdi-chevron-left"
        color="teal"
        variant="text"
        @click="router.push('/')"
        >Back</v-btn
      >
    </div>
    <v-row no-gutters class="border pa-4">
      <v-col
        cols="12"
        sm="9"
        class="pr-10"
        :style="{ 'border-right': '1px dashed #9e9e9e' }"
      >
        <v-row no-gutters>
          <v-col cols="3">
            <FieldLabel label="Request No">
              {{ inspectionDetail.request_number }}
            </FieldLabel>
          </v-col>
          <v-col cols="3">
            <FieldLabel label="Service Type">
              {{ inspectionDetail.service_type }}
            </FieldLabel>
          </v-col>
          <v-col cols="3">
            <FieldLabel label="Location">
              {{ inspectionDetail.location }}
            </FieldLabel>
          </v-col>
        </v-row>
        <v-row no-gutters class="mt-4">
          <v-col offset="3" cols="3">
            <FieldLabel label="Date Submitted">
              {{ dateFormat(new Date(inspectionDetail.date_submitted)) }}
            </FieldLabel>
          </v-col>
          <v-col cols="3">
            <FieldLabel label="ECD">
              {{ dateFormat(new Date(inspectionDetail.ecd)) }}
            </FieldLabel>
          </v-col>
          <v-col cols="3">
            <FieldLabel label="Related To" value-class="text-teal">
              {{ inspectionDetail.related_to }}
            </FieldLabel>
          </v-col>
        </v-row>
        <v-row no-gutters class="mt-4">
          <v-col offset="3" cols="9">
            <div>
              <div
                class="v-label mb-2 text-subtitle-1"
                :style="{ borderBottom: '1px solid grey', width: '100%' }"
              >
                <label>Custom Field Header</label>
              </div>
              <FieldLabel label="D/C Code">
                {{ inspectionDetail.dc_code || "-" }}
              </FieldLabel>
            </div>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="5" sm="3" class="pl-10">
        <div class="d-flex justify-space-between">
          <FieldLabel label="Charge to Customer">
            {{ inspectionDetail.customer_name || "-" }}
          </FieldLabel>
          <FieldLabel label="Status">
            <div
              class="text-subtitle-2 bg-grey-lighten-2 text-center rounded-lg border"
              :style="{
                width: '75px',
              }"
            >
              {{ inspectionDetail.status }}
            </div>
          </FieldLabel>
        </div>
      </v-col>
    </v-row>
    <div class="mt-8">
      <div class="text-lg font-weight-bold">Scope Of Work</div>
      <div class="border">
        <div class="pa-4 text-lg font-weight-bold">
          {{ inspectionDetail.sow?.subscope_name }}
        </div>
        <v-table>
          <thead class="bg-grey-darken-1">
            <tr>
              <th class="text-left font-weight-bold">Service Type</th>
              <th class="text-left font-weight-bold">Scope Name</th>
              <th class="text-left font-weight-bold">Scope Description</th>
            </tr>
          </thead>
          <tbody>
            <template
              v-for="(item, index) in inspectionDetail.sow?.fields"
              :key="item._id"
            >
              <tr>
                <td>{{ index == 0 ? "Inspection" : "" }}</td>
                <td>{{ item.name }}</td>
                <td>{{ item.value }}</td>
              </tr>
            </template>
          </tbody>
        </v-table>
      </div>
    </div>
    <div class="mt-8">
      <div class="text-lg font-weight-bold">Item Information</div>
      <div>
        <v-table>
          <thead class="bg-grey-darken-1">
            <tr>
              <th class="text-left font-weight-bold">Item No.</th>
              <th class="text-left font-weight-bold">Item Description</th>
              <th class="text-left font-weight-bold">Lot No.</th>
              <th class="text-left font-weight-bold">Allocation</th>
              <th class="text-left font-weight-bold">Owner</th>
              <th class="text-left font-weight-bold">Condition</th>
              <th class="text-left font-weight-bold">Requested</th>
              <th class="text-left font-weight-bold">Pending</th>
              <th class="text-left font-weight-bold">Completed</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="item in inspectionDetail.items" :key="item._id">
              <tr v-for="lot in item.lots">
                <td>{{ item._id }}</td>
                <td>{{ item.description }}</td>
                <td>{{ lot.number }}</td>
                <td>{{ lot.allocation }}</td>
                <td>{{ lot.owner }}</td>
                <td :style="{ textTransform: 'capitalize' }">
                  {{ lot.condition }}
                </td>
                <td>{{ lot.qty_required }}</td>
                <td>{{ lot.qty_available }}</td>
                <td>{{ lot.qty_inspected }}</td>
              </tr>
            </template>
          </tbody>
        </v-table>
      </div>
    </div>
    <div class="mt-8">
      <div class="text-lg font-weight-bold">Charges to Customer</div>
      <div>
        <v-table>
          <thead class="bg-grey-darken-1">
            <tr>
              <th class="text-left font-weight-bold">Order No</th>
              <th class="text-left font-weight-bold">Service Description</th>
              <th class="text-left font-weight-bold">Qty</th>
              <th class="text-left font-weight-bold">Unit Price</th>
              <th class="text-left font-weight-bold">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{ "-" }}</td>
              <td>{{ "-" }}</td>
              <td>{{ "-" }}</td>
              <td>{{ "-" }}</td>
              <td>{{ "-" }}</td>
            </tr>
          </tbody>
        </v-table>
      </div>
    </div>
  </DefaultLayout>
</template>
