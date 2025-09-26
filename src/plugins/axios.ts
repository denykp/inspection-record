import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import dummy from "../fe-datatest.json";
import type { InspectionItem, InspectionRecord, ItemLot } from "../types";

const api = axios.create();
const mock = new MockAdapter(api);

// use mock request to simulate api request to backend api
mock.onGet("/inspection-records").reply(() => {
  const inspectionDummy = {
    _id: dummy._id,
    request_number: dummy.no,
    location: "Moomba",
    service_type: dummy.insp_type,
    sow: dummy.sow[0]?.works.find(
      (work) => work.subscope === "38b3aae109c86bc7435403d21a924649ca1e79b2"
    ),
    type: dummy.type,
    date_submitted: new Date(dummy.postingdate * 1000).toISOString(),
    ecd: new Date(dummy.postingdate * 1000).toISOString(),
    related_to: dummy.linkTo,
    third_party: "2",
    status: dummy.status,
    items: dummy.items_raw.map(
      (item) =>
        ({
          _id: item.id_item,
          description: item.item_desc,
          qty: item.qty,
          lots: Array.from(
            { length: 3 },
            () =>
              ({
                _id: item.id_item,
                number: item.batch,
                allocation: item.allocation,
                owner: item.owned_name,
                condition: item.condition,
                qty_available: item.qty,
                qty_required: item.qty,
                qty_inspected: item.inspected_qty,
                inspection_required: true,
              } satisfies ItemLot)
          ),
        } satisfies InspectionItem)
    ),
  } satisfies InspectionRecord;

  const listNew: InspectionRecord[] = Array.from({ length: 1 }, () => ({
    ...inspectionDummy,
    status: "New",
  }));
  const listInProgress: InspectionRecord[] = Array.from({ length: 2 }, () => ({
    ...inspectionDummy,
    status: "In Progress",
  }));
  const listForReview: InspectionRecord[] = Array.from({ length: 2 }, () => ({
    ...inspectionDummy,
    status: "Ready to Review",
  }));
  const listClosed: InspectionRecord[] = Array.from({ length: 5 }, () => ({
    ...inspectionDummy,
    status: "Completed",
  }));
  return [
    200,
    [...listNew, ...listInProgress, ...listForReview, ...listClosed],
  ];
});

mock.onGet("/inspection-sow").reply(() => {
  return [200, dummy.sow[0]?.works];
});

mock.onGet("/inspection-items").reply(() => {
  return [
    200,
    Array.from({ length: 3 }, () => dummy.items_raw[0]).map((item, index) => ({
      ...item,
      id_item: `${item?.id_item}-${index.toString()}`,
      item_desc: `${item?.item_desc}-${index.toString()}`,
    })),
  ];
});

export default api;
