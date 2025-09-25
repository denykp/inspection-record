import { createStore } from "vuex";
import api from "../plugins/axios";
import type { InspectionRecord } from "../types";

export default createStore({
  state() {
    return {
      listInspection: [] as InspectionRecord[],
      listServiceType: ["New Arrival", "Maintenance", "On Spot"],
      listSow: [],
    };
  },
  mutations: {
    setInspection(state, payload) {
      state.listInspection = payload;
    },
    setSow(state, payload) {
      state.listSow = payload;
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
  },
});
