import { Bill, BillDetail } from "../../Bill.entity";

export interface BillsProps {
    onSelect?: (view: string) => void;
    onSelectBill?: (bill: BillDetail) => void;
    onDeleteSuccess?: () => void;
}
