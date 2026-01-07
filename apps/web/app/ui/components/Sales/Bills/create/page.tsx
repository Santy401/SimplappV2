'use client';

import { Bill } from "@domain/entities/Bill.entity";
import { CheckboxField, FormModalLayout, TextareaField } from "@simplapp/ui";

export default function FormBill({
    onSelect,
    onSelectBill,
    initialData,
    mode = 'create',
    isLoading = false,
}: {
    onSelect?: (view: string) => void;
    onSelectBill?: (bill: Bill) => void;
    initialData?: Partial<Bill> & { id?: number };
    mode?: 'create' | 'edit';
    isLoading?: boolean;
}) {

    return (
        <></>
    )
}