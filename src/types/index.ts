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
  sow?: SowSubscope;
  type: string;
  date_submitted: string;
  ecd: string;
  related_to: string;
  third_party: string;
  status: "New" | "In Progress" | "Ready to Review" | "Completed" | string;
  items: InspectionItem[];
}
