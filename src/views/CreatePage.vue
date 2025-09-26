<script setup lang="ts">
import { computed, ref } from "vue";
import DefaultLayout from "../components/DefaultLayout.vue";
import type {
  InspectionRecord,
  Breadcrumb,
  SowSubscope,
  RawItem,
  ItemLot,
} from "../types";
import inspectionStore from "../stores/inspection-store";
import { VDateInput } from "vuetify/labs/VDateInput";
import FormField from "../components/FormField.vue";
import { useRouter } from "vue-router";

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
    title: "Create Yard Service",
    disabled: false,
    href: "#",
  },
];
const router = useRouter();

const listServiceType = computed<string[]>(
  () => inspectionStore.getters.listServiceType
);
const listSow = computed<SowSubscope[]>(() => inspectionStore.getters.listSow);
const listLocation = ["Location 1", "Location 2", "Location 3"];
const listRelatedTo = ["Related To 1", "Related To 2", "Related To 3"];
const listCustomer = ["Customer 1", "Customer 2", "Customer 3"];
const listRawItem = computed<RawItem[]>(
  () => inspectionStore.getters.listRawItem
);

const isFormValid = ref(false);
const formFields = ref<InspectionRecord>({
  _id: new Date().getTime().toString(),
  request_number: "",
  location: "",
  service_type: "",
  sow: undefined,
  type: "11",
  date_submitted: "",
  ecd: "",
  related_to: "",
  third_party: "2",
  status: "Draft",
  dc_code: "",
  charge_to_customer: false,
  customer_name: "",
  items: [],
  note_to_yard: "",
});
const fieldValidations = {
  location: [
    (required: string) => (required ? true : "Please select location"),
  ],
  service_type: [
    (value: string) => (value ? true : "Please select service type"),
  ],
  sow: [(value: SowSubscope) => (value ? true : "Please select scope of work")],
  ecd: [(required: string) => (required ? true : "Please select ECD")],
  related_to: [
    (required: string) => (required ? true : "Please select related to"),
  ],
  customer_name: [
    (required: string) => (required ? true : "Please select customer"),
  ],
};

const selectedSow = computed({
  get: () => formFields.value.sow?._id || "",
  set: (value) => {
    formFields.value.sow = listSow.value.find((sow) => sow._id === value);
  },
});
const expandedRow = ref<string>("");
const selectedRow = ref<string[]>([]);
const handleAddItem = () => {
  formFields.value.items.push({
    _id: new Date().getTime().toString(),
    description: "",
    qty: 0,
    lots: [],
  });
};
const handleDeleteItem = () => {
  selectedRow.value.sort((a, b) => Number(b) - Number(a));
  selectedRow.value.forEach((index) => {
    formFields.value.items.splice(Number(index), 1);
  });
  selectedRow.value = [];
};
const handleAddlot = (index: string, item: RawItem) => {
  const targetItem = formFields.value.items[Number(index)];
  console.log("item", item);
  if (targetItem && targetItem.lots && item) {
    targetItem.lots.push({
      _id: item.id_item,
      number: item.batch,
      allocation: formFields.value.customer_name || item.allocation,
      owner: item.owned_name,
      condition: item.condition,
      qty_available: item.qty,
      qty_required: item.qty,
      qty_inspected: item.inspected_qty,
      inspection_required: true,
    } satisfies ItemLot);
  }
};
const handleDeleteLot = (index: number, indexLot: number) => {
  const targetItem = formFields.value.items[index];
  if (targetItem && targetItem.lots) {
    targetItem.lots.splice(indexLot, 1);
  }
};

const handleSave = (isDraft: boolean) => {
  console.log("isDraft", isDraft);
  inspectionStore.dispatch("addInspection", {
    ...formFields.value,
    status: isDraft ? "Draft" : "New",
  });
  router.push(`/detail/${formFields.value._id}`);
};
</script>

<template>
  <DefaultLayout :breadcrumbs="breadcrumbs">
    <v-form v-model="isFormValid" @submit.prevent>
      <v-row no-gutters>
        <v-col
          cols="12"
          sm="8"
          class="pr-10"
          :style="{ 'border-right': '1px dashed #9e9e9e' }"
        >
          <div class="d-flex ga-4">
            <div class="flex-grow-1">
              <FormField required label="Service Type">
                <v-autocomplete
                  v-model="formFields.service_type"
                  :items="listServiceType"
                  placeholder="Select Service Type"
                  variant="outlined"
                  density="compact"
                  :rules="fieldValidations.service_type"
                ></v-autocomplete>
              </FormField>
            </div>
            <div class="flex-grow-1">
              <FormField required label="Scope of Work">
                <v-autocomplete
                  v-model="selectedSow"
                  :items="listSow"
                  item-title="subscope_name"
                  item-value="_id"
                  variant="outlined"
                  placeholder="Select Scope of Work"
                  density="compact"
                  :rules="fieldValidations.sow"
                ></v-autocomplete>
              </FormField>
            </div>
          </div>
          <div>
            <FormField required label="Scope included">
              <div
                class="pa-4 d-flex ga-2 rounded flex-sm-wrap"
                :style="{ border: '1px solid #9e9e9e' }"
              >
                <div
                  v-for="scope in formFields.sow?.fields"
                  class="bg-grey-lighten-1 text-grey-darken-4 pa-2 rounded text-subtitle-2"
                >
                  {{ scope.name }}
                </div>
              </div>
            </FormField>
          </div>
          <div class="d-flex ga-4 mt-8">
            <FormField required label="Location">
              <v-autocomplete
                v-model="formFields.location"
                :items="listLocation"
                variant="outlined"
                placeholder="Select Location"
                density="compact"
                :rules="fieldValidations.location"
              ></v-autocomplete>
            </FormField>
            <FormField required label="Estimated Completion Date">
              <VDateInput
                v-model="formFields.ecd"
                prepend-icon=""
                variant="outlined"
                placeholder="Select ECD"
                density="compact"
                :rules="fieldValidations.ecd"
                :min="new Date().toISOString().slice(0, 10)"
              ></VDateInput>
            </FormField>
            <FormField required label="Related To">
              <v-autocomplete
                v-model="formFields.related_to"
                :items="listRelatedTo"
                variant="outlined"
                placeholder="Select Related To"
                density="compact"
                :rules="fieldValidations.related_to"
              ></v-autocomplete>
            </FormField>
          </div>
          <div class="mt-4">
            <div
              class="v-label mb-2"
              :style="{ borderBottom: '1px solid grey', width: '100%' }"
            >
              <label>Custom Field Header</label>
            </div>
            <FormField label="D/C Code">
              <v-text-field
                v-model="formFields.dc_code"
                placeholder="Enter D/C Code"
                variant="outlined"
                density="compact"
              ></v-text-field>
            </FormField>
          </div>
        </v-col>
        <v-col cols="12" sm="4" class="pl-10">
          <div class="d-flex">
            <FormField required label="Charge to Customer">
              <v-switch
                v-model="formFields.charge_to_customer"
                color="teal"
              ></v-switch>
            </FormField>
            <FormField label="Status">
              <div
                class="text-subtitle-2 bg-grey-lighten-1 text-center rounded border"
              >
                {{ formFields.status }}
              </div>
            </FormField>
          </div>
          <FormField required label="Customer Name">
            <v-autocomplete
              v-model="formFields.customer_name"
              :items="listCustomer"
              variant="outlined"
              placeholder="Select Customer Name"
              density="compact"
              :rules="fieldValidations.customer_name"
            ></v-autocomplete>
          </FormField>
        </v-col>
      </v-row>
      <div>
        <div class="d-flex justify-space-between align-center">
          <div class="text-lg font-weight-bold">Order Information</div>
          <div>
            <v-btn
              prepend-icon="mdi-trash-can"
              color="red"
              variant="text"
              size="small"
              @click="handleDeleteItem"
            >
              Delete
            </v-btn>
            <v-btn
              prepend-icon="mdi-plus"
              color="teal"
              variant="text"
              size="small"
              @click="handleAddItem"
            >
              Add Item
            </v-btn>
          </div>
        </div>
        <v-table class="mt-2">
          <thead class="bg-grey-darken-1">
            <tr>
              <th></th>
              <th class="text-left font-weight-bold">Item Description</th>
              <th class="text-left font-weight-bold">Qty</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <template
              v-for="(inspectionItem, index) in formFields.items"
              :key="inspectionItem._id"
            >
              <tr>
                <td class="flex-grow-0">
                  <v-checkbox
                    v-model="selectedRow"
                    :value="index.toString()"
                  ></v-checkbox>
                </td>
                <td class="pt-1">
                  <v-autocomplete
                    v-model="inspectionItem.description"
                    :items="listRawItem"
                    item-title="item_desc"
                    item-value="item_desc"
                    variant="outlined"
                    @update:model-value="
                    () => {
                      if (!inspectionItem.lots.length) {
                        handleAddlot(
                          index.toString(),
                          listRawItem.find(
                            (item) => item.item_desc === inspectionItem.description
                          ) as RawItem
                        )
                      }
                    }
                  "
                  ></v-autocomplete>
                </td>
                <td>
                  <v-text-field
                    v-model="inspectionItem.qty"
                    type="number"
                    variant="outlined"
                    placeholder="Enter Qty"
                  ></v-text-field>
                </td>
                <td>
                  <v-btn
                    icon="mdi-chevron-down"
                    size="small"
                    color="teal"
                    variant="tonal"
                    class="border"
                    density="comfortable"
                    @click="
                      expandedRow === index.toString()
                        ? (expandedRow = '')
                        : (expandedRow = index.toString())
                    "
                  ></v-btn>
                </td>
              </tr>
              <tr v-if="expandedRow === index.toString()">
                <td colspan="4" class="px-0 border-t-lg border-b-lg py-1">
                  <v-table>
                    <thead>
                      <tr>
                        <th class="text-left text-caption font-weight-bold">
                          Lot Selection
                        </th>
                        <th class="text-left text-caption font-weight-bold">
                          Allocation
                        </th>
                        <th class="text-left text-caption font-weight-bold">
                          Owner
                        </th>
                        <th
                          class="text-left text-caption font-weight-bold border-b-sm"
                        >
                          Condition
                        </th>
                        <th class="text-left text-caption font-weight-bold">
                          Avail. Qty
                        </th>
                        <th class="text-left text-caption font-weight-bold">
                          Qty Required
                        </th>
                        <th class="text-left text-caption font-weight-bold">
                          Inspection Required
                        </th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(lot, indexLot) in inspectionItem.lots"
                        :key="lot._id"
                      >
                        <td class="pt-2">
                          <v-text-field
                            v-model="lot.number"
                            variant="outlined"
                            width="200"
                            class="text-caption"
                            density="compact"
                          ></v-text-field>
                        </td>
                        <td>
                          <v-text-field
                            v-model="lot.allocation"
                            variant="outlined"
                            width="100"
                            density="compact"
                          ></v-text-field>
                        </td>
                        <td>
                          <v-text-field
                            v-model="lot.owner"
                            variant="outlined"
                            width="150"
                            density="compact"
                          ></v-text-field>
                        </td>
                        <td>
                          <v-text-field
                            v-model="lot.condition"
                            variant="outlined"
                            density="compact"
                          ></v-text-field>
                        </td>
                        <td>
                          <v-text-field
                            v-model="lot.qty_available"
                            type="number"
                            variant="outlined"
                            disabled
                            width="100"
                            density="compact"
                          ></v-text-field>
                        </td>
                        <td>
                          <v-text-field
                            v-model="lot.qty_required"
                            type="number"
                            variant="outlined"
                            width="100"
                            density="compact"
                          ></v-text-field>
                        </td>
                        <td>
                          <v-checkbox
                            v-model="lot.inspection_required"
                            type="number"
                            variant="outlined"
                            density="compact"
                          ></v-checkbox>
                        </td>
                        <td>
                          <v-btn
                            icon="mdi-minus"
                            size="small"
                            color="red"
                            variant="text"
                            class="border"
                            density="comfortable"
                            :disabled="inspectionItem.lots.length === 1"
                            @click="handleDeleteLot(index, indexLot)"
                          ></v-btn>
                          <v-btn
                            icon="mdi-plus"
                            size="small"
                            color="teal"
                            variant="text"
                            class="border"
                            density="comfortable"
                            @click="
                              handleAddlot(
                                index.toString(),
                                listRawItem.find(
                                  (item) =>
                                    item.item_desc ===
                                    inspectionItem.description
                                ) as RawItem
                              )
                            "
                          ></v-btn>
                          <div class="v-input__details"></div>
                        </td>
                      </tr>
                    </tbody>
                  </v-table>
                </td>
              </tr>
            </template>
          </tbody>
        </v-table>
      </div>
      <div class="mt-8">
        <div class="text-lg font-weight-bold">Note to Yard</div>
        <v-textarea
          v-model="formFields.note_to_yard"
          placeholder="Enter Note"
        ></v-textarea>
      </div>
      <div class="d-flex justify-end ga-2">
        <v-btn @click="router.push('/')" variant="plain">Cancel</v-btn>
        <v-btn type="submit" :disabled="!isFormValid" @click="handleSave(true)"
          >Save as Draft</v-btn
        >
        <v-btn
          type="submit"
          :disabled="!isFormValid"
          color="teal"
          @click="handleSave(false)"
          >Submit</v-btn
        >
      </div>
    </v-form>
  </DefaultLayout>
</template>
