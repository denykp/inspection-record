import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import dummy from "../fe-datatest.json";
import type { InspectionItem, InspectionRecord, ItemLot } from "../types";

const api = axios.create();
const mock = new MockAdapter(api);

// use mock request to simulate api request to backend api
mock.onGet("/inspection-records").reply(() => {
  const inspectionDummy = {
    id: dummy._id,
    request_number: dummy.no,
    location: "Moomba",
    sow:
      dummy.sow[0]?.works.find(
        (work) => work.subscope === "38b3aae109c86bc7435403d21a924649ca1e79b2"
      )?.fields || [],
    type: dummy.type,
    date_submitted: new Date(dummy.postingdate * 1000).toISOString(),
    ecd: new Date(dummy.postingdate * 1000).toISOString(),
    related_to: dummy.linkTo,
    third_party: "2",
    status: dummy.status,
    items: dummy.items_raw.map(
      (item) =>
        ({
          id: item.id_item,
          description: item.item_desc,
          qty: item.qty,
          lots: Array.from(
            { length: 3 },
            () =>
              ({
                id: item.id_item,
                number: item.batch,
                allocation: item.allocation,
                owner: item.owned_name,
                condition: item.condition,
                qty_available: item.inspected_qty,
                qty_required: item.inspected_qty,
                inspection_required: true,
              } satisfies ItemLot)
          ),
        } satisfies InspectionItem)
    ),
  } satisfies InspectionRecord;

  const listOpen: InspectionRecord[] = Array.from({ length: 3 }, () => ({
    ...inspectionDummy,
    status: "Open",
  }));
  const listForReview: InspectionRecord[] = Array.from({ length: 2 }, () => ({
    ...inspectionDummy,
    status: "For Review",
  }));
  const listClosed: InspectionRecord[] = Array.from({ length: 5 }, () => ({
    ...inspectionDummy,
    status: "Completed",
  }));
  return [200, [...listOpen, ...listForReview, ...listClosed]];
});

export default api;
