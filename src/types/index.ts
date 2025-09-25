export interface Breadcrumb {
  title: string;
  disabled?: boolean;
  href?: string;
}

export interface ItemLot {
  _id: string;
  number: string;
  allocation: string;
  owner: string;
  condition: string;
  qty_available: number;
  qty_required: number;
  qty_inspected: number;
  inspection_required: boolean;
}
export interface InspectionItem {
  _id: string;
  description: string;
  qty: number;
  lots: ItemLot[];
}
export interface SowField {
  name: string;
  type: string;
  selected: boolean;
  value: string;
  editableDescription: boolean;
  requiredDescription: boolean;
  drift_inspection: boolean;
  _id: string;
}
export interface SowSubscope {
  _id: string;
  subscope: string;
  subscope_name: string;
  fields: SowField[];
}
export interface InspectionRecord {
  _id: string;
  request_number: string;
  location: string;
  service_type: string;
  sow?: SowSubscope;
  type: string;
  date_submitted: string;
  ecd: string;
  related_to: string;
  third_party: string;
  status: "New" | "In Progress" | "Ready to Review" | "Completed" | string;
  dc_code?: string;
  charge_to_customer?: boolean;
  customer_name?: string;
  note_to_yard?: string;
  items: InspectionItem[];
}

export interface RawItem {
  id_item: string;
  item_code: string;
  item_desc: string;
  batch: string;
  original_batch: string;
  condition: string;
  owned: string;
  locked: string;
  allocation: string;
  tag: string | null;
  qty: number;
  id_quarantine: string | null;
  customer_item_no: string;
  owned_name: string;
  locked_name: string;
  item_type: string;
  item_type_name: string;
  item_pipe_family: string;
  inspected_qty: number;
  balance: number;
  inprogress_qty: number;
}
