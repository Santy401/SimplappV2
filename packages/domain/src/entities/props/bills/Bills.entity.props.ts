import { Bill } from "../../Bill.entity";

export interface BillsProps {
    onSelect?: (view: string) => void;
    onSelectBill?: (bill: Bill) => void;
    onDeleteSuccess?: () => void;
}
