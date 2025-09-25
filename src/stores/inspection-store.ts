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
    setInspection(state, payload) {
      state.listInspection = payload;
    },
    setSow(state, payload) {
      state.listSow = payload;
    },
    setRawItem(state, payload) {
      state.listRawItem = payload;
    },
  },
  actions: {
    async populateData({ commit }) {
      const response = await api.get("/inspection-records");
      const data = await response.data;
      commit("setInspection", data);

      const sowResponse = await api.get("/inspection-sow");
      const sowData = await sowResponse.data;
      commit("setSow", sowData);

      const itemResponse = await api.get("/inspection-items");
      const itemData = await itemResponse.data;
      commit("setRawItem", itemData);
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
  },
});
