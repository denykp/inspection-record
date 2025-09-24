export interface Breadcrumb {
  title: string;
  disabled?: boolean;
  href?: string;
}

export interface ItemLot {
  id: string;
  number: string;
  allocation: string;
  owner: string;
  condition: string;
  qty_available: number;
  qty_required: number;
  inspection_required: boolean;
}
export interface InspectionItem {
  id: string;
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
export interface InspectionRecord {
  id: string;
  request_number: string;
  location: string;
  sow: SowField[];
  type: string;
  date_submitted: string;
  ecd: string;
  related_to: string;
  third_party: string;
  status: string;
  items: InspectionItem[];
}
