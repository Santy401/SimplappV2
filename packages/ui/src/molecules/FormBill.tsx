"use client";

import { BillPreview } from "./BillPreview";
import { useState, useEffect, useRef } from "react";
import { Input } from "../atoms/Input/Input";
import { Label } from "../atoms/Label/Label";
import { Textarea } from "../atoms/Textarea/Textarea";
import { Button } from "../atoms/Button/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../atoms/Select/Select";
import { X, Plus, Settings, ArrowLeft } from "lucide-react";

// Importar interfaces desde domain
import {
  Bill,
  BillItem as BillItemEntity,
  BillStatus,
  PaymentMethod,
  CreateBillInput,
  CreateBillItemInput,
  BillDetail,
} from "@domain/entities/Bill.entity";
import { Client, IdentificationType } from "@domain/entities/Client.entity";
import { Product } from "@domain/entities/Product.entity";
import { Store } from "@domain/entities/Store.entity";
import { Seller } from "@domain/entities/Seller.entity";
import { ListPrice } from "@domain/entities/ListPrice.entity";

// Interfaces locales para el formulario
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
}

interface FormBillData {
  documentType: "invoice" | "ticket";
  storeId?: string; // almacena el id de la bodega seleccionada
  priceList?: string; // almacena el id de la lista de precios seleccionada
  seller?: string; // id del vendedor seleccionado
  clientType: string;
  clientId: string;
  clientName: string;
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
  // Datos externos para selects
  clients?: Client[];
  products?: Product[];
  stores?: Store[];
  sellers?: Seller[];
  listPrices?: ListPrice[];
  // IDs requeridos (normalmente vendrían del contexto de usuario)
  userId?: string;
  storeId?: string;
  companyId?: string;
}

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
  const [formData, setFormData] = useState<FormBillData>({
    documentType: "invoice",
    storeId: storeId || (stores[0]?.id ?? ""),
    priceList: "",
    seller: "",
    clientType: "CC",
    clientId: "",
    clientName: "",
    selectedClientId: undefined,
    email: "",
    date: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0], // 30 días después
    paymentMethod: PaymentMethod.CASH,
    paymentType: "",
    terms: "",
    notes: "",
    footerNote: "",
    status: BillStatus.ToPay,
    logo: undefined,
    signature: undefined,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const formLoaded = useRef(false);

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
      // también aceptar userId / user como posible campo que contiene el vendedor
      const sellerFromUser = extractId((initialData as any).userId) || extractId((initialData as any).user);
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
        paymentMethod: initialData.paymentMethod || PaymentMethod.CASH,
        notes: initialData.notes || "",
        status: initialData.status || BillStatus.DRAFT,
        selectedClientId: extractId((initialData as any).clientId) || prev.selectedClientId,
        clientName: initialData.clientName || "",
        email: initialData.clientEmail || "",
        clientId: initialData.clientIdentification || "",
        storeId: initialData.storeId || prev.storeId,
        priceList: priceListId ?? prev.priceList,
        seller: finalSellerId ?? prev.seller,
      }));

      if (initialData.items && initialData.items.length > 0) {
        console.log("📦 Inicializando items desde initialData");

        const formattedItems: FormBillItem[] = initialData.items.map(
          (item: any, index) => ({
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
          }),
        );

        console.log("📦 Formatted items:", formattedItems);
        setItems(formattedItems);
      } else {
        console.log("⚠️ No hay items en initialData");
        // Si no hay items y estamos en modo create/edit, agregar un item vacío
        // if (mode === "create" || mode === "edit") {
        if (mode === "edit") {
          setItems([
            {
              id: Date.now().toString(),
              name: "",
              reference: "",
              price: 0,
              quantity: 0,
              discount: 0,
              taxRate: 0,
              taxAmount: 0,
              description: "",
              total: 0,
              productId: undefined,
            },
          ]);
        } else {
          setItems([]);
        }
      }
    } else if (mode === "create") {
      setItems([
        {
          id: Date.now().toString(),
          name: "",
          reference: "",
          price: 0,
          quantity: 0,
          discount: 0,
          taxRate: 0,
          taxAmount: 0,
          description: "",
          total: 0,
          productId: undefined,
        },
      ]);
    }
    setTimeout(() => { formLoaded.current = true; }, 500);
  }, [initialData, mode]);
  const calculateItemTotal = (item: FormBillItem) => {
    const subtotal = item.price * item.quantity;
    const discountAmount = subtotal * (item.discount / 100);
    const subtotalAfterDiscount = subtotal - discountAmount;
    const taxAmount = subtotalAfterDiscount * (item.taxRate / 100);
    return subtotalAfterDiscount + taxAmount;
  };

  const subtotal = items.reduce((sum, item) => {
    const itemSubtotal = item.price * item.quantity;
    const discountAmount = itemSubtotal * (item.discount / 100);
    return sum + (itemSubtotal - discountAmount);
  }, 0);

  const discountTotal = items.reduce((sum, item) => {
    const itemSubtotal = item.price * item.quantity;
    return sum + itemSubtotal * (item.discount / 100);
  }, 0);

  const taxTotal = items.reduce((sum, item) => {
    const itemSubtotal = item.price * item.quantity;
    const discountAmount = itemSubtotal * (item.discount / 100);
    const subtotalAfterDiscount = itemSubtotal - discountAmount;
    return sum + subtotalAfterDiscount * (item.taxRate / 100);
  }, 0);

  const total = items.reduce((sum, item) => sum + calculateItemTotal(item), 0);

  const handleSignatureClick = () => {
    signatureInputRef.current?.click();
  };

  const handleSignatureChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, signature: imageUrl }));
    }
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        id: Date.now().toString(),
        name: "",
        reference: "",
        price: 0,
        quantity: 0,
        discount: 0,
        taxRate: 0,
        taxAmount: 0,
        description: "",
        total: 0,
        productId: undefined,
      },
    ]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const handleItemChange = (
    id: string,
    field: keyof FormBillItem,
    value: any,
  ) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          const subtotal = updatedItem.price * updatedItem.quantity;
          const discountAmount = subtotal * (updatedItem.discount / 100);
          const subtotalAfterDiscount = subtotal - discountAmount;
          updatedItem.taxAmount = subtotalAfterDiscount * (updatedItem.taxRate / 100);
          updatedItem.total = subtotalAfterDiscount + updatedItem.taxAmount;
          return updatedItem;
        }
        return item;
      }),
    );
  };

  const handleProductSelect = (itemId: string, productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      setItems(
        items.map((item) => {
          if (item.id === itemId) {
            const updatedItem = {
              ...item,
              productId: product.id,
              name: product.name,
              reference: product.reference || "",
              price: product.basePrice,
              taxRate: parseFloat(product.taxRate) || 0,
            };
            const subtotal = updatedItem.price * updatedItem.quantity;
            const discountAmount = subtotal * (updatedItem.discount / 100);
            const subtotalAfterDiscount = subtotal - discountAmount;
            updatedItem.taxAmount = subtotalAfterDiscount * (updatedItem.taxRate / 100);
            updatedItem.total = subtotalAfterDiscount + updatedItem.taxAmount;
            return updatedItem;
          }
          return item;
        }),
      );
    }
  };
  const handleClientSelect = (clientId: string) => {
    const client = clients.find((c) => c.id === clientId);
    if (client) {
      setFormData((prev) => ({
        ...prev,
        selectedClientId: client.id,
        clientName: `${client.firstName} ${client.firstLastName}`,
        clientId: client.identificationNumber,
        clientType:
          client.identificationType === IdentificationType.NIT ? "NIT" : "CC",
        email: client.email || "",
      }));
    }
  };

  const prepareBillData = (statusOverride?: BillStatus): CreateBillInput | null => {
    const validItems = items.filter(
      (item) => item.productId && item.quantity > 0,
    );
    if (!formData.selectedClientId) {
      return null;
    }

    const billData: CreateBillInput = {
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
      items: validItems.map(
        (item) =>
          ({
            productId: item.productId!,
            quantity: item.quantity,
            price: item.price.toString(),
            productName: item.name,
            productCode: item.reference,
            total: item.total.toString(),
            discount: item.discount.toString(),
            taxRate: item.taxRate.toString(),
            taxAmount: (item.taxAmount || 0).toString(),
          }) as CreateBillItemInput,
      ),
    };

    return billData;
  }

  // Auto-save effect
  useEffect(() => {
    // Only auto-save if mode is not view and form is loaded
    if (mode === 'view' || !formLoaded.current || !onAutoSave) return;

    const timer = setTimeout(() => {
      const data = prepareBillData(formData.status);
      if (data) {
        onAutoSave(data);
      }
    }, 2000); // 2 second debounce

    return () => clearTimeout(timer);
  }, [items, formData, mode, onAutoSave]);

  // Preparar datos para submit según CreateBillInput
  const handleSubmit = () => {
    const validItems = items.filter(
      (item) => item.productId && item.quantity > 0,
    );

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
    if (onAutoSave && mode !== 'view') {
      const data = prepareBillData(BillStatus.DRAFT);
      if (data) {
        onAutoSave(data).catch(console.error);
      }
    }
    onSelect?.("ventas-facturacion");
  };

  const handleSaveDraft = () => {
    setFormData((prev) => ({ ...prev, status: BillStatus.DRAFT }));

    if (!formData.selectedClientId) {
      alert("Debe seleccionar un cliente para guardar el borrador");
      return;
    }

    const data = prepareBillData(BillStatus.DRAFT);
    if (data) {
      // Llama a una función específica para borradores
      onSaveDraft?.(data); // ← Nuevo prop
    }
  };
  const handleEmitBill = () => {
    setFormData((prev) => ({ ...prev, status: BillStatus.ISSUED }));
    const validItems = items.filter(
      (item) => item.productId && item.quantity > 0,
    );
    if (validItems.length === 0) {
      alert("Debe agregar al menos un producto con cantidad mayor a 0 para emitir");
      return;
    }
    const data = prepareBillData(BillStatus.ISSUED);
    if (data) {
      // Llama a una función específica para emitir
      onEmitBill?.(data); // ← Nuevo prop
    }
  };

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, logo: imageUrl }));
    }
  };

  function handleLogoClick(event: MouseEvent<HTMLDivElement, MouseEvent>): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6 bg-background">
      {/* Header con navegación */}
      <div className="flex items-center gap-4 mb-4">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="gap-2 flex items-center"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver
        </Button>
      </div>

      <div className="bg-card border border-sidebar-border rounded-lg p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3">
          {/* Tipo de documento */}
          {/* <div className="space-y-2">
            <Label>Tipo de documento</Label>
            <div className="flex gap-2">
              <Button
                variant={
                  formData.documentType === "invoice" ? "default" : "outline"
                }
                onClick={() =>
                  setFormData({ ...formData, documentType: "invoice" })
                }
                className="flex-1"
              >
                Factura de venta
              </Button>
              <Button
                variant={
                  formData.documentType === "ticket" ? "default" : "outline"
                }
                onClick={() =>
                  setFormData({ ...formData, documentType: "ticket" })
                }
                className="flex-1"
              >
                Tiquete
              </Button>
            </div>
          </div> */}

          {/* Bodega */}
          <div className="space-y-2">
            <Label>Bodega</Label>
            <Select
              value={formData.storeId}
              onValueChange={(v) => setFormData({ ...formData, storeId: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar bodega" />
              </SelectTrigger>
              <SelectContent>
                {stores && stores.length > 0 ? (
                  stores.map((s) => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>No hay bodegas disponibles</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Lista de precios */}
          <div className="space-y-2">
            <Label>Lista de precios</Label>
            <Select
              value={formData.priceList}
              onValueChange={(v) => setFormData({ ...formData, priceList: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar Precio" />
              </SelectTrigger>
              <SelectContent>
                {listPrices && listPrices.length > 0 ? (
                  listPrices.map((lp) => (
                    <SelectItem key={lp.id} value={lp.id}>{lp.name}</SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>No hay listas de precios disponibles</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Vendedor */}
          <div className="space-y-2">
            <Label>Vendedor</Label>
            <Select
              value={formData.seller}
              onValueChange={(v) => setFormData({ ...formData, seller: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar vendedor..." />
              </SelectTrigger>
              <SelectContent>
                {sellers && sellers.length > 0 ? (
                  sellers.map((s) => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>No hay vendedores disponibles</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Header con configuración */}
      <div className="bg-card border border-sidebar-border rounded-lg p-6 space-y-4">
        {/* Logo placeholder */}
        <div className="flex items-center w-full pb-6">
          {/* IZQUIERDA */}
          <div className="w-1/3 flex justify-start">
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/png, image/jpeg, image/jpg"
              onChange={handleLogoChange}
            />
            <div
              onClick={handleLogoClick}
              className={`flex items-center cursor-pointer justify-center border-2 border-dashed rounded-lg text-muted-foreground w-full max-w-xs h-32 overflow-hidden relative hover:bg-muted/10 transition-colors ${formData.logo ? "border-none p-0" : "p-8"
                }`}
            >
              {formData.logo ? (
                <div className="relative w-full h-full group">
                  <img
                    src={formData.logo}
                    alt="Logo de la empresa"
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="text-white text-xs">Cambiar logo</span>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-2 pointer-events-none">
                  <p className="text-sm font-medium">Utilizar mi logo</p>
                  <p className="text-xs text-muted-foreground">
                    Jpg o .png únicos
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* CENTRO */}
          <div className="w-1/3 flex justify-center">
            <h2 className="text-2xl font-bold">Simplapp</h2>
          </div>

          {/* DERECHA */}
          <div className="w-1/3 flex justify-end">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Principal</p>
              <div className="flex items-center gap-2 justify-end">
                <Label>No.</Label>
                <span className="text-2xl font-bold">
                  {initialData?.number || "Auto"}
                </span>
                {/* <Settings className="w-4 h-4 text-muted-foreground cursor-pointer" /> */}
              </div>
            </div>
          </div>
        </div>

        {/* Información del cliente y factura */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Columna izquierda - Cliente */}
          <div className="space-y-4">
            <div className="space-y-2 pb-2">
              <Label>
                Nombre o razón social{" "}
                <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.selectedClientId || ""}
                onValueChange={(v) => handleClientSelect(v)}
                disabled={clients.length === 0}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      clients.length === 0
                        ? "No hay clientes disponibles"
                        : "Seleccionar cliente"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {clients.length > 0 ? (
                    clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.firstName} {client.firstLastName} -{" "}
                        {client.identificationNumber}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>
                      No hay clientes disponibles
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Select
                  value={formData.clientType}
                  onValueChange={(v) =>
                    setFormData({ ...formData, clientType: v })
                  }
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CC">CC</SelectItem>
                    <SelectItem value="NIT">NIT</SelectItem>
                    <SelectItem value="CE">CE</SelectItem>
                    <SelectItem value="PASSPORT">Pasaporte</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Buscar Nº de ID"
                  value={formData.clientId}
                  onChange={(e) =>
                    setFormData({ ...formData, clientId: e.target.value })
                  }
                  className="flex-1"
                />
              </div>
              <div className="space-y-2">
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="correo@ejemplo.com"
                />
              </div>
            </div>
            {/* Multi Clientes */}
            {/* <Button
              variant="link"
              className="text-primary p-0"
              onClick={() => onSelect?.("ventas-clientes-create")}
            >
              + Nuevo contacto
            </Button> */}
          </div>

          {/* Columna derecha - Datos de factura */}
          <div className="space-y-4">
            <div className="space-y-2 pb-2">
              <Label>
                Fecha <span className="text-destructive">*</span>
              </Label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
              />
            </div>

            <div className="space-y-2 pb-2">
              <Label>
                Fecha de vencimiento <span className="text-destructive">*</span>
              </Label>
              <Input
                type="date"
                value={formData.dueDate}
                onChange={(e) =>
                  setFormData({ ...formData, dueDate: e.target.value })
                }
              />
            </div>

            <div className="flex gap-4 pb-2">
              <div className="space-y-2">
                <Label>
                  Forma de pago <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.paymentMethod}
                  onValueChange={(v) =>
                    setFormData({
                      ...formData,
                      paymentMethod: v as PaymentMethod,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Contado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={PaymentMethod.CASH}>Contado</SelectItem>
                    <SelectItem value={PaymentMethod.CREDIT}>
                      Crédito
                    </SelectItem>
                    <SelectItem value={PaymentMethod.TRANSFER}>
                      Transferencia
                    </SelectItem>
                    <SelectItem value={PaymentMethod.CREDIT_CARD}>
                      Tarjeta de Crédito
                    </SelectItem>
                    <SelectItem value={PaymentMethod.DEBIT_CARD}>
                      Tarjeta Débito
                    </SelectItem>
                    <SelectItem value={PaymentMethod.CHECK}>Cheque</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Estado</Label>
                <Select
                  value={formData.status}
                  onValueChange={(v) =>
                    setFormData({ ...formData, status: v as BillStatus })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={BillStatus.DRAFT}>Borrador</SelectItem>
                    <SelectItem value={BillStatus.ISSUED}>Emitida</SelectItem>
                    <SelectItem value={BillStatus.PAID}>Pagada</SelectItem>
                    <SelectItem value={BillStatus.PARTIALLY_PAID}>
                      Pago Parcial
                    </SelectItem>
                    <SelectItem value={BillStatus.CANCELLED}>
                      Cancelada
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de items */}
      <div className="bg-card border border-sidebar-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-sidebar-border">
              <tr>
                <th className="text-left p-3 text-sm font-medium">Item</th>
                <th className="text-left p-3 text-sm font-medium">
                  Descripción
                </th>
                <th className="text-right p-3 text-sm font-medium">Cantidad</th>
                <th className="text-right p-3 text-sm font-medium">Precio</th>
                <th className="text-right p-3 text-sm font-medium">Impuesto</th>
                <th className="text-right p-3 text-sm font-medium">Desc %</th>
                <th className="text-right p-3 text-sm font-medium">Total</th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="p-8 text-center text-muted-foreground"
                  >
                    No hay items en esta factura
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="border-b border-sidebar-border hover:bg-muted/20">
                    <td className="p-2">
                      <Select
                        value={item.productId || ""}
                        onValueChange={(v) =>
                          handleProductSelect(item.id, v)
                        }
                        disabled={products.length === 0}
                      >
                        <SelectTrigger className="w-full min-w-[200px]">
                          <SelectValue
                            placeholder={
                              products.length === 0
                                ? "No hay productos disponibles"
                                : "Buscar ítem facturable"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {products.length > 0 ? (
                            products.map((product) => (
                              <SelectItem
                                key={product.id}
                                value={product.id!}
                              >
                                {product.name} - ${product.basePrice}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="none" disabled>
                              No hay productos disponibles
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="p-2">
                      <Input
                        placeholder="Descripción"
                        value={item.description}
                        onChange={(e) =>
                          handleItemChange(
                            item.id,
                            "description",
                            e.target.value,
                          )
                        }
                        className="text-sm"
                      />
                    </td>
                    <td className="p-2">
                      <Input
                        type="number"
                        placeholder="0"
                        value={item.quantity || ""}
                        onChange={(e) =>
                          handleItemChange(
                            item.id,
                            "quantity",
                            parseInt(e.target.value) || 0,
                          )
                        }
                        className="text-right text-sm w-20"
                        min="0"
                      />
                    </td>
                    <td className="p-2">
                      <Input
                        type="number"
                        placeholder="Precio uni"
                        value={item.price || ""}
                        onChange={(e) =>
                          handleItemChange(
                            item.id,
                            "price",
                            parseFloat(e.target.value) || 0,
                          )
                        }
                        className="text-right text-sm"
                      />
                    </td>
                    <td className="p-2">
                      <Select
                        value={item.taxRate.toString()}
                        onValueChange={(v) =>
                          handleItemChange(item.id, "taxRate", parseFloat(v))
                        }
                      >
                        <SelectTrigger className="w-28">
                          <SelectValue placeholder="Impuesto" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">0%</SelectItem>
                          <SelectItem value="5">5%</SelectItem>
                          <SelectItem value="10.5">10.5%</SelectItem>
                          <SelectItem value="19">19%</SelectItem>
                          <SelectItem value="21">21%</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="p-2">
                      <Input
                        type="number"
                        placeholder="%"
                        value={item.discount || ""}
                        onChange={(e) =>
                          handleItemChange(
                            item.id,
                            "discount",
                            parseFloat(e.target.value) || 0,
                          )
                        }
                        className="text-right text-sm w-16"
                      />
                    </td>
                    <td className="p-2 text-right font-medium whitespace-nowrap">
                      ${" "}
                      {item.total.toLocaleString("es-CO", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="p-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={items.length === 1}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {(mode === "create" || mode === "edit") && (
          <div className="p-4">
            <Button
              variant="link"
              onClick={handleAddItem}
              className="text-foreground hover:text-foreground/80 hover:underline flex items-center cursor-pointer"
            >
              <Plus className="w-4 h-4 mr-1" />
              Agregar línea
            </Button>
          </div>
        )}
      </div>

      {/* Resumen de totales */}
      <div className="flex items-center justify-between w-full">
        {/* Firma placeholder */}
        <div className="w-1/3">
          <input
            type="file"
            ref={signatureInputRef}
            className="hidden"
            accept="image/png, image/jpeg, image/jpg"
            onChange={handleSignatureChange}
          />
          <div
            onClick={handleSignatureClick}
            className={`flex flex-col justify-start border-2 border-dashed rounded-lg text-muted-foreground cursor-pointer w-full max-w-xs h-32 m-auto overflow-hidden relative hover:bg-muted/10 transition-colors ${formData.signature ? "border-none p-0" : "p-8"
              }`}
          >
            {formData.signature ? (
              <div className="relative w-full h-full group">
                <img
                  src={formData.signature}
                  alt="Firma digital"
                  className="w-full h-full object-contain"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <span className="text-white text-xs">Cambiar firma</span>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-2 pointer-events-none w-full h-full flex flex-col items-center justify-center">
                <p className="text-sm font-medium">Utilizar mi firma</p>
                <p className="text-xs text-muted-foreground">
                  Jpg o .png únicos
                </p>
              </div>
            )}
          </div>
          <div className="mt-2 h-[2px] w-full block bg-sidebar-border"></div>
          <span className="text flex justify-center text-gray-400 mt-1">
            ELABORADOR POR
          </span>
        </div>

        <div className="w-1/3 flex flex-col border border-sidebar-border rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium">
              ${" "}
              {subtotal.toLocaleString("es-CO", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Descuento</span>
            <span className="font-medium text-red-500">
              -${" "}
              {discountTotal.toLocaleString("es-CO", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Impuestos</span>
            <span className="font-medium">
              ${" "}
              {taxTotal.toLocaleString("es-CO", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
          <div className="border-t border-sidebar-border pt-3 flex justify-between items-center">
            <span className="text-lg font-semibold">Total</span>
            <span className="text-2xl font-bold">
              ${" "}
              {total.toLocaleString("es-CO", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Footer con términos, notas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Columna izquierda - Términos y notas */}
        <div className="space-y-2">
          <Label>Términos y condiciones</Label>
          <Textarea
            value={formData.terms}
            onChange={(e) =>
              setFormData({ ...formData, terms: e.target.value })
            }
            placeholder="Este documento se asimila en todos sus efectos a una letra de cambio..."
            rows={4}
          />
        </div>
        <div className="space-y-2">
          <Label>Notas</Label>
          <Textarea
            value={formData.notes}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
            placeholder="Notas adicionales para la factura..."
            rows={3}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Pie de factura</Label>
        <Input
          placeholder="Visible en la impresión del documento"
          value={formData.footerNote}
          onChange={(e) =>
            setFormData({ ...formData, footerNote: e.target.value })
          }
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Los campos marcados con * son obligatorios
      </p>

      {/* Botones de acción */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={handleBack} disabled={isLoading}>
          Cancelar
        </Button>
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => setShowPreview(true)}
          disabled={isLoading || items.length === 0}
        >
          Previsualizar
        </Button>
        {(mode === "create" || mode === "edit") && (
          <>
            <Button
              variant="outline"
              onClick={handleSaveDraft}
              disabled={isLoading}
            >
              {isLoading ? "Guardando..." : "Guardar como borrador"}
            </Button>
            <Button
              onClick={handleEmitBill}
              disabled={isLoading || items.length === 0}
            >
              {isLoading
                ? "Emitiendo..."
                : mode === "edit"
                  ? "Actualizar factura"
                  : "Emitir factura"}
            </Button>
          </>
        )}
      </div>

      {showPreview && (
        <BillPreview
          formData={formData}
          items={items}
          subtotal={subtotal}
          discountTotal={discountTotal}
          taxTotal={taxTotal}
          total={total}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
}
