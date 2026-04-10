"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';
import { FileWarning, RotateCcw, Percent, DollarSign, Check } from 'lucide-react';
import { FormModalLayout, FormSection } from '@simplapp/ui';
import { useCreditNote } from '@interfaces/src/hooks/features/CreditNotes';
import { useBill } from '@interfaces/src/hooks/features/Bills/useBill';
import { useNavigation } from '@/app/context/NavigationContext';
import { CreditNoteType, CreditNoteReason } from '@domain/entities/CreditNote.entity';

interface CreateCreditNotePageProps {
  initialBillId?: string;
}

interface CreditNoteItem {
  billItemId: string;
  quantity: number;
  price: string;
  subtotal: string;
  taxRate: string;
  taxAmount: string;
  discount: string;
  total: string;
  productName?: string;
  productCode?: string;
}

interface BillWithPayments {
  id: string;
  items?: any[];
  payments?: any[];
  creditNotes?: any[];
  prefix?: string;
  number: number;
  clientName?: string;
  total?: string;
}

export default function CreateCreditNotePage({ initialBillId }: CreateCreditNotePageProps) {
  return (
    <Suspense fallback={<div className="p-8 text-center">Cargando...</div>}>
      <CreateCreditNoteContent initialBillId={initialBillId} />
    </Suspense>
  );
}

function CreateCreditNoteContent({ initialBillId }: CreateCreditNotePageProps) {
  const searchParams = useSearchParams();
  const { navigateTo, goBack } = useNavigation();
  const billIdFromUrl = searchParams.get('billId');
  const billId = initialBillId || billIdFromUrl;

  const { bills, isLoading: isLoadingBills } = useBill();
  const { createCreditNote, isLoading: isCreating } = useCreditNote();

  const [selectedBillId, setSelectedBillId] = useState<string>(billId || '');
  const [selectedType, setSelectedType] = useState<CreditNoteType>(CreditNoteType.RETURN);
  const [selectedReason, setSelectedReason] = useState<CreditNoteReason>(CreditNoteReason.DEVOLUCION_PARCIAL);
  const [notes, setNotes] = useState('');
  const [selectedItems, setSelectedItems] = useState<Record<string, { quantity: number; maxQuantity: number; item: any }>>({});

  const selectedBill = (bills as BillWithPayments[]).find(b => b.id === selectedBillId);
  const hasPayments = selectedBill?.payments && selectedBill.payments.length > 0;

  useEffect(() => {
    if (billId && !selectedBillId) {
      setSelectedBillId(billId);
    }
  }, [billId, selectedBillId]);

  const getAvailableReturnQty = (billItemId: string): number => {
    if (!selectedBill) return 0;
    const originalItem = selectedBill.items?.find((i: any) => i.id === billItemId);
    if (!originalItem) return 0;
    const returnedQty = (selectedBill.creditNotes || [])
      .filter((cn: any) => cn.type === 'RETURN' && cn.status !== 'CANCELLED')
      .flatMap((cn: any) => cn.items || [])
      .filter((ci: any) => ci.billItemId === billItemId)
      .reduce((sum: number, ci: any) => sum + ci.quantity, 0);
    return Math.max(0, Number(originalItem.quantity) - returnedQty);
  };

  const handleItemToggle = (itemId: string, item: any, maxQuantity: number) => {
    setSelectedItems(prev => {
      if (prev[itemId]) {
        const { [itemId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [itemId]: { quantity: 1, maxQuantity, item } };
    });
  };

  const handleQuantityChange = (itemId: string, quantity: number) => {
    setSelectedItems(prev => ({
      ...prev,
      [itemId]: { ...prev[itemId], quantity: Math.min(quantity, prev[itemId].maxQuantity) }
    }));
  };

  const calculateTotal = () => {
    return Object.entries(selectedItems).reduce((sum, [itemId, { quantity }]) => {
      const item = selectedItems[itemId].item;
      return sum + (item ? Number(item.total || 0) * quantity / (item.quantity || 1) : 0);
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedBillId) {
      toast.error('Selecciona una factura');
      return;
    }

    if (hasPayments) {
      toast.error('Esta factura tiene pagos. Elimínalos antes de crear la nota de crédito.');
      return;
    }

    if (Object.keys(selectedItems).length === 0) {
      toast.error('Selecciona al menos un ítem');
      return;
    }

    const items: CreditNoteItem[] = Object.entries(selectedItems).map(([billItemId, { quantity }]) => {
      const item = selectedItems[billItemId].item;
      const itemTotal = Number(item.total || 0) * quantity / (item.quantity || 1);
      return {
        billItemId,
        quantity,
        price: item?.price || '0',
        subtotal: String(itemTotal),
        taxRate: item?.taxRate || '0',
        taxAmount: String(Number(itemTotal) * Number(item?.taxRate || 0) / 100),
        discount: item?.discount || '0',
        total: String(itemTotal),
        productName: item?.productName,
        productCode: item?.productCode
      };
    });

    try {
      await createCreditNote({
        billId: selectedBillId,
        type: selectedType,
        reason: selectedReason,
        notes,
        items
      });
      toast.success('Nota de crédito creada correctamente');
      router.push('/ventas/notas-credito');
    } catch (error: any) {
      toast.error(error.message || 'Error al crear la nota de crédito');
    }
  };

  const isReturn = selectedType === CreditNoteType.RETURN;

  return (
    <form onSubmit={handleSubmit}>
      <FormModalLayout
        title="Nueva Nota de Crédito"
        icon={FileWarning}
        onSubmit={handleSubmit}
        onCancel={() => router.back()}
        submitLabel={isCreating ? 'Creando...' : 'Crear Nota de Crédito'}
        isLoading={!!isCreating}
        maxWidth="6xl"
      >
        <div className="space-y-6 p-6">
          {/* Factura seleccionada */}
          <FormSection columns={1}>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Factura
              </label>
              {isLoadingBills ? (
                <p className="text-muted-foreground p-4">Cargando facturas...</p>
              ) : (
                <select
                  value={selectedBillId}
                  onChange={e => {
                    setSelectedBillId(e.target.value);
                    setSelectedItems({});
                  }}
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                >
                  <option value="">Seleccionar factura...</option>
                  {(bills || []).filter((b: any) => b.status !== 'CANCELLED').map((bill: any) => (
                    <option key={bill.id} value={bill.id} disabled={bill.payments?.length > 0}>
                      #{bill.prefix || ''}{bill.number} - {bill.clientName} - ${Number(bill.total || 0).toLocaleString('es-CO')}
                      {bill.payments?.length > 0 ? ' (con pagos)' : ''}
                    </option>
                  ))}
                </select>
              )}
              {(selectedBill?.payments?.length ?? 0) > 0 && (
                <div className="mt-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <p className="text-sm text-amber-800">
                    Esta factura tiene {selectedBill?.payments?.length} pago(s). Elimínalos desde la factura antes de crear la nota de crédito.
                  </p>
                </div>
              )}
            </div>
          </FormSection>

          {selectedBillId && !hasPayments && (
            <>
              {/* Tipo y Motivo */}
              <FormSection columns={2} gap="lg">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                    Tipo de Nota de Crédito
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: CreditNoteType.RETURN, label: 'Devolución', icon: RotateCcw, color: 'blue' },
                      { value: CreditNoteType.DISCOUNT, label: 'Descuento', icon: Percent, color: 'purple' },
                      { value: CreditNoteType.PRICE_ADJUSTMENT, label: 'Ajuste', icon: DollarSign, color: 'orange' }
                    ].map(t => (
                      <button
                        key={t.value}
                        type="button"
                        onClick={() => setSelectedType(t.value)}
                        className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2
                          ${selectedType === t.value 
                            ? `border-${t.color}-500 bg-${t.color}-50 dark:bg-${t.color}-900/20` 
                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'}`}
                      >
                        <t.icon className={`w-6 h-6 text-${t.color}-600`} />
                        <span className="text-sm font-medium">{t.label}</span>
                        {selectedType === t.value && (
                          <Check className={`w-4 h-4 text-${t.color}-600`} />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Motivo
                  </label>
                  <select
                    value={selectedReason}
                    onChange={e => setSelectedReason(e.target.value as CreditNoteReason)}
                    className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  >
                    <option value={CreditNoteReason.DEVOLUCION_PARCIAL}>Devolución Parcial</option>
                    <option value={CreditNoteReason.DEVOLUCION_TOTAL}>Devolución Total</option>
                    <option value={CreditNoteReason.ANULACION}>Anulación</option>
                    <option value={CreditNoteReason.DESCUENTO_COMERCIAL}>Descuento Comercial</option>
                    <option value={CreditNoteReason.DESCUENTO_CONDICIONAL}>Descuento Condicional</option>
                    <option value={CreditNoteReason.OTRO}>Otro</option>
                  </select>
                </div>
              </FormSection>

              {/* Items */}
              <FormSection columns={1}>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                    Seleccionar Ítems ({Object.keys(selectedItems).length} selected)
                  </label>
                  <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-slate-50 dark:bg-slate-800/50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Seleccionar</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Producto</th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Disponible</th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Cantidad</th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {(selectedBill?.items || []).map((item: any) => {
                          const availableQty = isReturn ? getAvailableReturnQty(item.id) : Number(item.quantity);
                          const isSelected = !!selectedItems[item.id];
                          return (
                            <tr key={item.id} className={`${isSelected ? 'bg-purple-50 dark:bg-purple-900/10' : ''}`}>
                              <td className="px-4 py-3">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => handleItemToggle(item.id, item, availableQty)}
                                  disabled={isReturn && availableQty <= 0}
                                  className="w-5 h-5 rounded border-slate-300 text-[#6C47FF] focus:ring-[#6C47FF]"
                                />
                              </td>
                              <td className="px-4 py-3">
                                <p className="font-medium text-slate-900 dark:text-slate-100">{item.productName || 'Producto'}</p>
                                <p className="text-xs text-slate-500">Ref: {item.productCode || 'N/A'}</p>
                              </td>
                              <td className="px-4 py-3 text-right">
                                {isReturn ? availableQty : item.quantity}
                              </td>
                              <td className="px-4 py-3">
                                {isSelected && (
                                  <input
                                    type="number"
                                    min={1}
                                    max={availableQty}
                                    value={selectedItems[item.id].quantity}
                                    onChange={e => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                                    className="w-20 p-2 border border-slate-300 rounded-lg text-center"
                                  />
                                )}
                              </td>
                              <td className="px-4 py-3 text-right font-medium">
                                ${Number(item.total || 0).toLocaleString('es-CO')}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </FormSection>

              {/* Resumen y Notas */}
              <FormSection columns={2} gap="lg">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Observaciones
                  </label>
                  <textarea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="Observaciones adicionales..."
                    className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    rows={4}
                  />
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 space-y-3">
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100">Resumen</h4>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Ítems seleccionados:</span>
                    <span className="font-medium">{Object.keys(selectedItems).length}</span>
                  </div>
                  <div className="border-t border-slate-200 dark:border-slate-700 pt-3 flex justify-between">
                    <span className="font-semibold text-slate-900 dark:text-slate-100">Total NC:</span>
                    <span className="text-xl font-bold text-red-600">
                      ${calculateTotal().toLocaleString('es-CO')}
                    </span>
                  </div>
                </div>
              </FormSection>
            </>
          )}
        </div>
      </FormModalLayout>
    </form>
  );
}
