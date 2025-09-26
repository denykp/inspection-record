import { createStore } from "vuex";
import api from "../plugins/axios";
import type { InspectionRecord, RawItem } from "../types";

export default createStore({
  state() {
    return {
      listInspection: [] as InspectionRecord[],
      listServiceType: ["New Arrival", "Maintenance", "On Spot"],
      listSow: [],
      listRawItem: [] as RawItem[],
    };
  },
  mutations: {
    SET_INSPECTION(state, payload) {
      state.listInspection = payload;
    },
    ADD_INSPECTION(state, payload) {
      state.listInspection.push(payload);
    },
    SET_SOW(state, payload) {
      state.listSow = payload;
    },
    SET_RAW_ITEM(state, payload) {
      state.listRawItem = payload;
    },
  },
  actions: {
    async populateData({ commit }) {
      const response = await api.get("/inspection-records");
      const data = await response.data;
      commit("SET_INSPECTION", data);

      const sowResponse = await api.get("/inspection-sow");
      const sowData = await sowResponse.data;
      commit("SET_SOW", sowData);

      const itemResponse = await api.get("/inspection-items");
      const itemData = await itemResponse.data;
      commit("SET_RAW_ITEM", itemData);
    },
    async addInspection({ commit, state }, payload: InspectionRecord) {
      const lastRequestNumber = state.listInspection
        .map((inspection) =>
          Number(
            inspection.request_number.replace(
              `RRIN-${new Date().getFullYear()}-`,
              ""
            )
          )
        )
        .sort((a, b) => b - a)[0];
      let newRequestNumber = "";
      if (!lastRequestNumber) {
        newRequestNumber = `RRIN-${new Date().getFullYear()}-${"0001"}`;
      } else {
        newRequestNumber = `RRIN-${new Date().getFullYear()}-${String(
          lastRequestNumber + 1
        ).padStart(4, "0")}`;
      }
      commit("ADD_INSPECTION", {
        ...payload,
        request_number: newRequestNumber,
        date_submitted: new Date().toISOString(),
      } as InspectionRecord);
    },
  },
  getters: {
    listInspection:
      (state) => (props: { status: InspectionRecord["status"][] }) => {
        return state.listInspection.filter((inspection) =>
          props.status.includes(inspection.status)
        );
      },
    listServiceType(state) {
      return state.listServiceType;
    },
    listSow(state) {
      return state.listSow;
    },
    listRawItem(state) {
      return state.listRawItem;
    },
    inspectionDetail: (state) => (id: string) => {
      return state.listInspection.find((inspection) => inspection._id === id);
    },
  },
});
