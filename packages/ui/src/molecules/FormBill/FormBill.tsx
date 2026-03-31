"use client";

import { BillPreview } from "../BillPreview/BillPreview";
import { useState, useEffect, useRef } from "react";

import type {
  BillStatus,
  PaymentMethod,
  CreateBillInput,
  CreateBillItemInput,
  BillDetail,
} from "@domain/entities/Bill.entity";
import type { Client } from "@domain/entities/Client.entity";
import { Product } from "@domain/entities/Product.entity";
import { Store } from "@domain/entities/Store.entity";
import { Seller } from "@domain/entities/Seller.entity";
import { ListPrice } from "@domain/entities/ListPrice.entity";
import { calculateItemTotals, calculateBillTotals } from "@domain/utils/billing";

// ─── Refactored Components ───────────────────────────────────────────────────
import { FormBillHeader } from "./components/FormBillHeader";
import { ConfigSection } from "./components/ConfigSection";
import { BillDetailsSection } from "./components/BillDetailsSection";
import { ItemsTable } from "./components/ItemsTable";
import { TotalsSignatureSection } from "./components/TotalsSignatureSection";
import { NotesSection } from "./components/NotesSection";
import { FormActions } from "./components/FormActions";

// ─── Interfaces ────────────────────────────────────────────────────────────────

export interface FormBillItem {
  id: string;
  productId?: string;
  productName?: string;
  name: string;
  reference: string;
  price: number;
  quantity: number;
  discount: number;
  taxRate: number;
  taxAmount: number;
  description: string;
  total: number;
  storeId?: string;
}

interface FormBillData {
  documentType: "invoice" | "ticket";
  storeId?: string;
  priceList?: string;
  seller?: string;
  clientType: string;
  clientId: string;
  clientName: string;
  commercialName: string;
  selectedClientId?: string;
  email: string;
  date: string;
  dueDate: string;
  paymentMethod: PaymentMethod;
  paymentType: string;
  terms: string;
  notes: string;
  footerNote: string;
  status: BillStatus;
  logo?: string;
  signature?: string;
}

interface FormBillProps {
  onSubmit?: (data: CreateBillInput) => void;
  onSaveDraft?: (data: CreateBillInput) => void;
  onEmitBill?: (data: CreateBillInput) => void;
  onSelect?: (view: string) => void;
  onAutoSave?: (data: CreateBillInput) => Promise<string | undefined | null | void>;
  onSelectBill?: (bill: BillDetail) => void;
  initialData?: Partial<BillDetail> & { id?: string };
  mode?: "create" | "edit" | "view";
  isLoading?: boolean;
  clients?: Client[];
  products?: Product[];
  stores?: Store[];
  sellers?: Seller[];
  listPrices?: ListPrice[];
  userId?: string;
  storeId?: string;
  companyId: string;
}

// ─── Main component ────────────────────────────────────────────────────────────

export function FormBill({
  onSubmit,
  onSaveDraft,
  onEmitBill,
  onAutoSave,
  onSelect,
  onSelectBill,
  initialData,
  mode = "create",
  isLoading = false,
  clients = [],
  products = [],
  userId = "",
  storeId = "",
  companyId = "",
  stores = [],
  sellers = [],
  listPrices = [],
}: FormBillProps) {
  const [items, setItems] = useState<FormBillItem[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const signatureInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formLoaded = useRef(false);

  const [formData, setFormData] = useState<FormBillData>({
    documentType: "invoice",
    storeId: storeId || (stores[0]?.id ?? ""),
    priceList: "",
    seller: "",
    clientType: "CC",
    clientId: "",
    clientName: "",
    commercialName:"",
    selectedClientId: undefined,
    email: "",
    date: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    paymentMethod: "CASH" as PaymentMethod,
    paymentType: "",
    terms: "",
    notes: "",
    footerNote: "",
    status: "DRAFT" as BillStatus,
    logo: undefined,
    signature: undefined,
  });

  // ─── Init from initialData ────────────────────────────────────────────────────

  useEffect(() => {
    if (initialData && (mode === "edit" || mode === "view")) {
      const extractId = (val: any) => {
        if (val == null) return undefined;
        if (typeof val === "string" || typeof val === "number") return String(val);
        if (typeof val === "object") return String(val.id ?? val._id ?? "");
        return undefined;
      };

      const sellerId =
        extractId((initialData as any).sellerId) ||
        extractId((initialData as any).seller) ||
        extractId((initialData as any).sellerObj);
      const sellerFromUser =
        extractId((initialData as any).userId) || extractId((initialData as any).user);
      const finalSellerId = sellerId || sellerFromUser;

      const priceListId =
        extractId((initialData as any).listPriceId) ||
        extractId((initialData as any).priceList) ||
        extractId((initialData as any).listPrice);

      setFormData((prev) => ({
        ...prev,
        date: initialData.date
          ? new Date(initialData.date).toISOString().split("T")[0]
          : prev.date,
        dueDate: initialData.dueDate
          ? new Date(initialData.dueDate).toISOString().split("T")[0]
          : prev.dueDate,
        paymentMethod: initialData.paymentMethod || ("CASH" as PaymentMethod),
        notes: initialData.notes || "",
        status: initialData.status || ("DRAFT" as BillStatus),
        selectedClientId: extractId((initialData as any).clientId) || prev.selectedClientId,
        clientName: initialData.clientName || "",
        email: initialData.clientEmail || "",
        clientId: initialData.clientIdentification || "",
        storeId: initialData.storeId || prev.storeId,
        priceList: priceListId ?? prev.priceList,
        seller: finalSellerId ?? prev.seller,
      }));

      if (initialData.items && initialData.items.length > 0) {
        const formattedItems: FormBillItem[] = initialData.items.map((item: any, index) => ({
          id: item.id?.toString() || `item-${index}`,
          productId: item.productId,
          productName: item.productName,
          name: item.productName || item.name || "",
          reference: item.productCode || item.reference || "",
          price: parseFloat(item.price) || 0,
          quantity: parseFloat(item.quantity) || 0,
          discount: parseFloat(item.discount) || 0,
          taxRate: parseFloat(item.taxRate) || 0,
          taxAmount: parseFloat(item.taxAmount) || 0,
          description: item.description || "",
          total: parseFloat(item.total) || 0,
          storeId: item.storeId,
        }));
        setItems(formattedItems);
      } else {
        if (mode === "edit") {
          setItems([{
            id: Date.now().toString(), name: "", reference: "", price: 0,
            quantity: 0, discount: 0, taxRate: 0, taxAmount: 0,
            description: "", total: 0, productId: undefined, storeId: formData.storeId,
          }]);
        } else {
          setItems([]);
        }
      }
    } else if (mode === "create") {
      setItems([{
        id: Date.now().toString(), name: "", reference: "", price: 0,
        quantity: 0, discount: 0, taxRate: 0, taxAmount: 0,
        description: "", total: 0, productId: undefined, storeId: formData.storeId,
      }]);
    }
    setTimeout(() => { formLoaded.current = true; }, 500);
  }, [initialData, mode]);

  // ─── Totals via domain util ───────────────────────────────────────────────────

  const calculatedBill = calculateBillTotals(
    items.map((i) => ({
      price: i.price,
      quantity: i.quantity,
      discountPercentage: i.discount,
      taxRate: i.taxRate,
    }))
  );
  const { subtotal, discountTotal, taxTotal, total } = calculatedBill;

  // ─── Item handlers ────────────────────────────────────────────────────────────

  const handleAddItem = () => {
    setItems([...items, {
      id: Date.now().toString(), name: "", reference: "", price: 0,
      quantity: 0, discount: 0, taxRate: 0, taxAmount: 0,
      description: "", total: 0, productId: undefined, storeId: formData.storeId,
    }]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length > 1) setItems(items.filter((item) => item.id !== id));
  };

  const handleItemChange = (id: string, field: keyof FormBillItem, value: any) => {
    setItems(items.map((item) => {
      if (item.id !== id) return item;
      const updatedItem = { ...item, [field]: value };
      const calc = calculateItemTotals({
        price: updatedItem.price,
        quantity: updatedItem.quantity,
        discountPercentage: updatedItem.discount,
        taxRate: updatedItem.taxRate,
      });
      return { ...updatedItem, taxAmount: calc.taxAmount, total: calc.total };
    }));
  };

  const handleProductSelect = (itemId: string, productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    setItems(items.map((item) => {
      if (item.id !== itemId) return item;
      const updatedItem = {
        ...item,
        productId: product.id,
        name: product.name,
        reference: product.reference || "",
        price: parseFloat(product.basePrice as any) || 0,
        taxRate: parseFloat(product.taxRate) || 0,
        storeId: (product as any).storeId || item.storeId || formData.storeId,
      };
      const calc = calculateItemTotals({
        price: updatedItem.price,
        quantity: updatedItem.quantity,
        discountPercentage: updatedItem.discount,
        taxRate: updatedItem.taxRate,
      });
      return { ...updatedItem, taxAmount: calc.taxAmount, total: calc.total };
    }));
  };

  const handleClientSelect = (clientId: string) => {
    const client = clients.find((c) => c.id === clientId);
    if (!client) return;
    setFormData((prev) => ({
      ...prev,
      selectedClientId: client.id,
      clientName: `${client.firstName} ${client.firstLastName}`,
      clientId: client.identificationNumber,
      clientType: client.identificationType === "NIT" ? "NIT" : "CC",
      email: client.email || "",
    }));
  };

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setFormData((prev) => ({ ...prev, logo: URL.createObjectURL(file) }));
  };

  const handleSignatureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setFormData((prev) => ({ ...prev, signature: URL.createObjectURL(file) }));
  };

  // ─── prepareBillData ──────────────────────────────────────────────────────────

  const prepareBillData = (statusOverride?: BillStatus): CreateBillInput | null => {
    if (!formData.selectedClientId) return null;
    const validItems = items.filter((item) => item.productId && item.quantity > 0);
    return {
      userId: formData.seller || userId,
      listPriceId: formData.priceList || "",
      sellerId: formData.seller || "",
      clientId: formData.selectedClientId,
      storeId: formData.storeId || storeId,
      companyId,
      status: statusOverride ?? formData.status,
      paymentMethod: formData.paymentMethod,
      date: new Date(formData.date),
      dueDate: new Date(formData.dueDate),
      notes: formData.notes || null,
      subtotal: subtotal.toString(),
      taxTotal: taxTotal.toString(),
      discountTotal: discountTotal.toString(),
      total: total.toString(),
      items: validItems.map((item) => ({
        productId: item.productId!,
        quantity: item.quantity,
        price: item.price.toString(),
        productName: item.name,
        productCode: item.reference,
        total: item.total.toString(),
        discount: item.discount.toString(),
        taxRate: item.taxRate.toString(),
        taxAmount: (item.taxAmount || 0).toString(),
        storeId: item.storeId,
      }) as CreateBillItemInput),
    };
  };

  // ─── Auto-save (2s debounce) ──────────────────────────────────────────────────

  useEffect(() => {
    if (mode === "view" || !formLoaded.current || !onAutoSave) return;
    const timer = setTimeout(() => {
      const data = prepareBillData(formData.status);
      if (data) onAutoSave(data);
    }, 2000);
    return () => clearTimeout(timer);
  }, [items, formData, mode, onAutoSave]);

  // ─── Submit actions ───────────────────────────────────────────────────────────

  const handleSubmit = () => {
    const validItems = items.filter((item) => item.productId && item.quantity > 0);
    if (validItems.length === 0) {
      alert("Debe agregar al menos un producto con cantidad mayor a 0");
      return;
    }
    if (!formData.selectedClientId) {
      alert("Debe seleccionar un cliente");
      return;
    }
    const billData = prepareBillData();
    if (billData) onSubmit?.(billData);
  };

  const handleBack = () => {
    if (onAutoSave && mode !== "view") {
      const data = prepareBillData("DRAFT" as BillStatus);
      if (data) onAutoSave(data).catch(console.error);
    }
    onSelect?.("ventas-facturacion");
  };

  const handleSaveDraft = () => {
    setFormData((prev) => ({ ...prev, status: "DRAFT" as BillStatus }));
    if (!formData.selectedClientId) {
      alert("Debe seleccionar un cliente para guardar el borrador");
      return;
    }
    const data = prepareBillData("DRAFT" as BillStatus);
    if (data) onSaveDraft?.(data);
  };

  const handleEmitBill = () => {
    setFormData((prev) => ({ ...prev, status: "TO_PAY" as BillStatus }));
    const validItems = items.filter((item) => item.productId && item.quantity > 0);
    if (validItems.length === 0) {
      alert("Debe agregar al menos un producto con cantidad mayor a 0 para emitir");
      return;
    }
    const data = prepareBillData("TO_PAY" as BillStatus);
    if (data) onEmitBill?.(data);
  };

  // ─── Preview shortcut ─────────────────────────────────────────────────────────

  if (showPreview) {
    return (
      <div className="max-w-7xl mx-auto p-6 bg-background animate-in fade-in duration-500">
        <BillPreview
          formData={formData}
          items={items}
          subtotal={subtotal}
          discountTotal={discountTotal}
          taxTotal={taxTotal}
          total={total}
          onClose={() => setShowPreview(false)}
        />
      </div>
    );
  }

  const isEditable = mode === "create" || mode === "edit";

  // ─── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">

      <FormBillHeader
        mode={mode}
        status={formData.status}
        billNumber={initialData?.number}
        isLoading={isLoading}
        itemsCount={items.length}
        onBack={handleBack}
        onPreview={() => setShowPreview(true)}
        onSaveDraft={handleSaveDraft}
        onEmitBill={handleEmitBill}
      />

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-5">

        <ConfigSection
          priceList={formData.priceList || ""}
          seller={formData.seller || ""}
          paymentMethod={formData.paymentMethod}
          isEditable={isEditable}
          listPrices={listPrices}
          sellers={sellers}
          onFormDataChange={(updates) => setFormData((prev) => ({ ...prev, ...updates }))}
        />

        <BillDetailsSection
          formData={formData}
          isEditable={isEditable}
          clients={clients}
          initialBillNumber={initialData?.number}
          fileInputRef={fileInputRef}
          onLogoChange={handleLogoChange}
          onClientSelect={handleClientSelect}
          onFormDataChange={(updates) => setFormData((prev) => ({ ...prev, ...updates }))}
        />

        <ItemsTable
          items={items}
          products={products}
          stores={stores}
          isEditable={isEditable}
          onAddItem={handleAddItem}
          onRemoveItem={handleRemoveItem}
          onItemChange={handleItemChange}
          onProductSelect={handleProductSelect}
        />

        <TotalsSignatureSection
          signature={formData.signature}
          isEditable={isEditable}
          subtotal={subtotal}
          discountTotal={discountTotal}
          taxTotal={taxTotal}
          total={total}
          signatureInputRef={signatureInputRef}
          onSignatureChange={handleSignatureChange}
        />

        <NotesSection
          formData={formData}
          isEditable={isEditable}
          onFormDataChange={(updates) => setFormData((prev) => ({ ...prev, ...updates }))}
        />

        <FormActions
          isLoading={isLoading}
          isEditable={isEditable}
          itemsCount={items.length}
          mode={mode}
          onBack={handleBack}
          onPreview={() => setShowPreview(true)}
          onSaveDraft={handleSaveDraft}
          onEmitBill={handleEmitBill}
        />

      </div>
    </div>
  );
}
