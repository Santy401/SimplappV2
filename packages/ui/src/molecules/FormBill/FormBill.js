"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { BillPreview } from "../BillPreview/BillPreview";
import { useState, useEffect, useRef } from "react";
import { Input } from "../../atoms/Input/Input";
import { InputCurrency } from "../../atoms/InputCurrency/InputCurrency";
import { Label } from "../../atoms/Label/Label";
import { Textarea } from "../../atoms/Textarea/Textarea";
import { Button } from "../../atoms/Button/Button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "../../atoms/Select/Select";
import { X, Plus, ArrowLeft } from "lucide-react";
import { calculateItemTotals, calculateBillTotals } from "@domain/utils/billing";
export function FormBill({ onSubmit, onSaveDraft, onEmitBill, onAutoSave, onSelect, onSelectBill, initialData, mode = "create", isLoading = false, clients = [], products = [], userId = "", storeId = "", companyId = "", stores = [], sellers = [], listPrices = [], }) {
    const [items, setItems] = useState([]);
    const [showPreview, setShowPreview] = useState(false);
    const signatureInputRef = useRef(null);
    const [formData, setFormData] = useState({
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
            .split("T")[0],
        paymentMethod: "CASH",
        paymentType: "",
        terms: "",
        notes: "",
        footerNote: "",
        status: "DRAFT",
        logo: undefined,
        signature: undefined,
    });
    const fileInputRef = useRef(null);
    const formLoaded = useRef(false);
    useEffect(() => {
        if (initialData && (mode === "edit" || mode === "view")) {
            const extractId = (val) => {
                if (val == null)
                    return undefined;
                if (typeof val === "string" || typeof val === "number")
                    return String(val);
                if (typeof val === "object")
                    return String(val.id ?? val._id ?? "");
                return undefined;
            };
            const sellerId = extractId(initialData.sellerId) ||
                extractId(initialData.seller) ||
                extractId(initialData.sellerObj);
            // también aceptar userId / user como posible campo que contiene el vendedor
            const sellerFromUser = extractId(initialData.userId) || extractId(initialData.user);
            const finalSellerId = sellerId || sellerFromUser;
            const priceListId = extractId(initialData.listPriceId) ||
                extractId(initialData.priceList) ||
                extractId(initialData.listPrice);
            setFormData((prev) => ({
                ...prev,
                date: initialData.date
                    ? new Date(initialData.date).toISOString().split("T")[0]
                    : prev.date,
                dueDate: initialData.dueDate
                    ? new Date(initialData.dueDate).toISOString().split("T")[0]
                    : prev.dueDate,
                paymentMethod: initialData.paymentMethod || "CASH",
                notes: initialData.notes || "",
                status: initialData.status || "DRAFT",
                selectedClientId: extractId(initialData.clientId) || prev.selectedClientId,
                clientName: initialData.clientName || "",
                email: initialData.clientEmail || "",
                clientId: initialData.clientIdentification || "",
                storeId: initialData.storeId || prev.storeId,
                priceList: priceListId ?? prev.priceList,
                seller: finalSellerId ?? prev.seller,
            }));
            if (initialData.items && initialData.items.length > 0) {
                console.log("📦 Inicializando items desde initialData");
                const formattedItems = initialData.items.map((item, index) => ({
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
                console.log("📦 Formatted items:", formattedItems);
                setItems(formattedItems);
            }
            else {
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
                            storeId: formData.storeId,
                        },
                    ]);
                }
                else {
                    setItems([]);
                }
            }
        }
        else if (mode === "create") {
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
                    storeId: formData.storeId,
                },
            ]);
        }
        setTimeout(() => { formLoaded.current = true; }, 500);
    }, [initialData, mode]);
    // Centralized calculations using @domain/utils/billing
    const calculatedBill = calculateBillTotals(items.map(i => ({
        price: i.price,
        quantity: i.quantity,
        discountPercentage: i.discount,
        taxRate: i.taxRate
    })));
    const subtotal = calculatedBill.subtotal;
    const discountTotal = calculatedBill.discountTotal;
    const taxTotal = calculatedBill.taxTotal;
    const total = calculatedBill.total;
    const handleSignatureClick = () => {
        signatureInputRef.current?.click();
    };
    const handleSignatureChange = (event) => {
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
                storeId: formData.storeId,
            },
        ]);
    };
    const handleRemoveItem = (id) => {
        if (items.length > 1) {
            setItems(items.filter((item) => item.id !== id));
        }
    };
    const handleItemChange = (id, field, value) => {
        setItems(items.map((item) => {
            if (item.id === id) {
                const updatedItem = { ...item, [field]: value };
                const calc = calculateItemTotals({
                    price: updatedItem.price,
                    quantity: updatedItem.quantity,
                    discountPercentage: updatedItem.discount,
                    taxRate: updatedItem.taxRate
                });
                updatedItem.taxAmount = calc.taxAmount;
                updatedItem.total = calc.total;
                return updatedItem;
            }
            return item;
        }));
    };
    const handleProductSelect = (itemId, productId) => {
        const product = products.find((p) => p.id === productId);
        if (product) {
            setItems(items.map((item) => {
                if (item.id === itemId) {
                    const updatedItem = {
                        ...item,
                        productId: product.id,
                        name: product.name,
                        reference: product.reference || "",
                        price: parseFloat(product.basePrice) || 0,
                        taxRate: parseFloat(product.taxRate) || 0,
                        storeId: product.storeId || item.storeId || formData.storeId,
                    };
                    const calc = calculateItemTotals({
                        price: updatedItem.price,
                        quantity: updatedItem.quantity,
                        discountPercentage: updatedItem.discount,
                        taxRate: updatedItem.taxRate
                    });
                    updatedItem.taxAmount = calc.taxAmount;
                    updatedItem.total = calc.total;
                    return updatedItem;
                }
                return item;
            }));
        }
    };
    const handleClientSelect = (clientId) => {
        const client = clients.find((c) => c.id === clientId);
        if (client) {
            setFormData((prev) => ({
                ...prev,
                selectedClientId: client.id,
                clientName: `${client.firstName} ${client.firstLastName}`,
                clientId: client.identificationNumber,
                clientType: client.identificationType === "NIT" ? "NIT" : "CC",
                email: client.email || "",
            }));
        }
    };
    const prepareBillData = (statusOverride) => {
        const validItems = items.filter((item) => item.productId && item.quantity > 0);
        if (!formData.selectedClientId) {
            return null;
        }
        const billData = {
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
                productId: item.productId,
                quantity: item.quantity,
                price: item.price.toString(),
                productName: item.name,
                productCode: item.reference,
                total: item.total.toString(),
                discount: item.discount.toString(),
                taxRate: item.taxRate.toString(),
                taxAmount: (item.taxAmount || 0).toString(),
                storeId: item.storeId,
            })),
        };
        return billData;
    };
    // Auto-save effect
    useEffect(() => {
        // Only auto-save if mode is not view and form is loaded
        if (mode === 'view' || !formLoaded.current || !onAutoSave)
            return;
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
        if (billData)
            onSubmit?.(billData);
    };
    const handleBack = () => {
        if (onAutoSave && mode !== 'view') {
            const data = prepareBillData("DRAFT");
            if (data) {
                onAutoSave(data).catch(console.error);
            }
        }
        onSelect?.("ventas-facturacion");
    };
    const handleSaveDraft = () => {
        setFormData((prev) => ({ ...prev, status: "DRAFT" }));
        if (!formData.selectedClientId) {
            alert("Debe seleccionar un cliente para guardar el borrador");
            return;
        }
        // Usar statusOverride === "DRAFT" en prepareBillData debido a que setFormData es async
        const data = prepareBillData("DRAFT");
        if (data) {
            onSaveDraft?.(data);
        }
    };
    const handleEmitBill = () => {
        setFormData((prev) => ({ ...prev, status: "TO_PAY" }));
        const validItems = items.filter((item) => item.productId && item.quantity > 0);
        if (validItems.length === 0) {
            alert("Debe agregar al menos un producto con cantidad mayor a 0 para emitir");
            return;
        }
        const data = prepareBillData("TO_PAY");
        if (data) {
            // Llama a una función específica para emitir
            onEmitBill?.(data); // ← Nuevo prop
        }
    };
    const handleLogoChange = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setFormData((prev) => ({ ...prev, logo: imageUrl }));
        }
    };
    // function handleLogoClick(event: MouseEvent<HTMLDivElement, MouseEvent>): void {
    //   throw new Error("Function not implemented.");
    // }
    if (showPreview) {
        return (_jsx("div", { className: "max-w-7xl mx-auto p-6 bg-background animate-in fade-in duration-500", children: _jsx(BillPreview, { formData: formData, items: items, subtotal: subtotal, discountTotal: discountTotal, taxTotal: taxTotal, total: total, onClose: () => setShowPreview(false) }) }));
    }
    return (_jsxs("div", { className: "max-w-7xl mx-auto p-6 space-y-6 bg-slate-50 dark:bg-slate-950 min-h-screen", children: [_jsx("div", { className: "flex items-center gap-4 mb-4", children: _jsxs(Button, { variant: "ghost", onClick: handleBack, className: "gap-2 flex items-center", children: [_jsx(ArrowLeft, { className: "w-4 h-4" }), "Volver"] }) }), _jsx("div", { className: "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-6 space-y-4", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Lista de precios" }), _jsxs(Select, { value: formData.priceList, onValueChange: (v) => setFormData({ ...formData, priceList: v }), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Seleccionar Precio" }) }), _jsx(SelectContent, { children: listPrices && listPrices.length > 0 ? (listPrices.map((lp) => (_jsx(SelectItem, { value: lp.id, children: lp.name }, lp.id)))) : (_jsx(SelectItem, { value: "none", disabled: true, children: "No hay listas de precios disponibles" })) })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Vendedor" }), _jsxs(Select, { value: formData.seller, onValueChange: (v) => setFormData({ ...formData, seller: v }), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Seleccionar vendedor..." }) }), _jsx(SelectContent, { children: sellers && sellers.length > 0 ? (sellers.map((s) => (_jsx(SelectItem, { value: s.id, children: s.name }, s.id)))) : (_jsx(SelectItem, { value: "none", disabled: true, children: "No hay vendedores disponibles" })) })] })] })] }) }), _jsxs("div", { className: "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm p-6 space-y-4", children: [_jsxs("div", { className: "flex items-center w-full pb-6", children: [_jsxs("div", { className: "w-1/3 flex justify-start", children: [_jsx("input", { type: "file", ref: fileInputRef, className: "hidden", accept: "image/png, image/jpeg, image/jpg", onChange: handleLogoChange }), _jsx("div", { className: `flex items-center cursor-pointer justify-center border-2 border-dashed rounded-lg text-muted-foreground w-full max-w-xs h-32 overflow-hidden relative hover:bg-muted/10 transition-colors ${formData.logo ? "border-none p-0" : "p-8"}`, children: formData.logo ? (_jsxs("div", { className: "relative w-full h-full group", children: [_jsx("img", { src: formData.logo, alt: "Logo de la empresa", className: "w-full h-full object-contain" }), _jsx("div", { className: "absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity", children: _jsx("span", { className: "text-white text-xs", children: "Cambiar logo" }) })] })) : (_jsxs("div", { className: "text-center space-y-2 pointer-events-none", children: [_jsx("p", { className: "text-sm font-medium", children: "Utilizar mi logo" }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Jpg o .png \u00FAnicos" })] })) })] }), _jsx("div", { className: "w-1/3 flex justify-center", children: _jsx("h2", { className: "text-2xl font-bold", children: "Simplapp" }) }), _jsx("div", { className: "w-1/3 flex justify-end", children: _jsxs("div", { className: "text-right", children: [_jsx("p", { className: "text-sm text-muted-foreground", children: "Principal" }), _jsxs("div", { className: "flex items-center gap-2 justify-end", children: [_jsx(Label, { children: "No." }), _jsx("span", { className: "text-2xl font-bold", children: initialData?.number || "Auto" })] })] }) })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsx("div", { className: "space-y-4", children: _jsxs("div", { className: "space-y-2 pb-2", children: [_jsxs(Label, { children: ["Nombre o raz\u00F3n social", " ", _jsx("span", { className: "text-destructive", children: "*" })] }), _jsxs(Select, { value: formData.selectedClientId || "", onValueChange: (v) => handleClientSelect(v), disabled: clients.length === 0, children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: clients.length === 0
                                                            ? "No hay clientes disponibles"
                                                            : "Seleccionar cliente" }) }), _jsx(SelectContent, { children: clients.length > 0 ? (clients.map((client) => (_jsxs(SelectItem, { value: client.id, children: [client.firstName, " ", client.firstLastName, " -", " ", client.identificationNumber] }, client.id)))) : (_jsx(SelectItem, { value: "none", disabled: true, children: "No hay clientes disponibles" })) })] }), _jsxs("div", { className: "flex gap-2", children: [_jsxs(Select, { value: formData.clientType, onValueChange: (v) => setFormData({ ...formData, clientType: v }), children: [_jsx(SelectTrigger, { className: "w-24", children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "CC", children: "CC" }), _jsx(SelectItem, { value: "NIT", children: "NIT" }), _jsx(SelectItem, { value: "CE", children: "CE" }), _jsx(SelectItem, { value: "PASSPORT", children: "Pasaporte" })] })] }), _jsx(Input, { placeholder: "Buscar N\u00BA de ID", value: formData.clientId, onChange: (e) => setFormData({ ...formData, clientId: e.target.value }), className: "flex-1" })] }), _jsx("div", { className: "space-y-2", children: _jsx(Input, { type: "email", value: formData.email, onChange: (e) => setFormData({ ...formData, email: e.target.value }), placeholder: "correo@ejemplo.com" }) })] }) }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "space-y-2 pb-2", children: [_jsxs(Label, { children: ["Fecha ", _jsx("span", { className: "text-destructive", children: "*" })] }), _jsx(Input, { type: "date", value: formData.date, onChange: (e) => setFormData({ ...formData, date: e.target.value }) })] }), _jsxs("div", { className: "space-y-2 pb-2", children: [_jsxs(Label, { children: ["Fecha de vencimiento ", _jsx("span", { className: "text-destructive", children: "*" })] }), _jsx(Input, { type: "date", value: formData.dueDate, onChange: (e) => setFormData({ ...formData, dueDate: e.target.value }) })] }), _jsxs("div", { className: "flex gap-4 pb-2", children: [_jsxs("div", { className: "space-y-2", children: [_jsxs(Label, { children: ["Forma de pago ", _jsx("span", { className: "text-destructive", children: "*" })] }), _jsxs(Select, { value: formData.paymentMethod, onValueChange: (v) => setFormData({
                                                            ...formData,
                                                            paymentMethod: v,
                                                        }), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Contado" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "CASH", children: "Contado" }), _jsx(SelectItem, { value: "CREDIT", children: "Cr\u00E9dito" }), _jsx(SelectItem, { value: "TRANSFER", children: "Transferencia" }), _jsx(SelectItem, { value: "CREDIT_CARD", children: "Tarjeta de Cr\u00E9dito" }), _jsx(SelectItem, { value: "DEBIT_CARD", children: "Tarjeta D\u00E9bito" }), _jsx(SelectItem, { value: "CHECK", children: "Cheque" })] })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Estado" }), _jsxs(Select, { value: formData.status, onValueChange: (v) => setFormData({ ...formData, status: v }), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Estado" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "DRAFT", children: "Borrador" }), _jsx(SelectItem, { value: "ISSUED", children: "Emitida" }), _jsx(SelectItem, { value: "PAID", children: "Pagada" }), _jsx(SelectItem, { value: "PARTIALLY_PAID", children: "Pago Parcial" }), _jsx(SelectItem, { value: "CANCELLED", children: "Cancelada" }), _jsx(SelectItem, { value: "TO_PAY", children: "Por Pagar" })] })] })] })] })] })] })] }), _jsxs("div", { className: "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden", children: [_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full min-w-[900px]", children: [_jsx("thead", { className: "bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800", children: _jsxs("tr", { children: [_jsx("th", { className: "text-left px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400", children: "Item" }), _jsx("th", { className: "text-left px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400", children: "Descripci\u00F3n" }), _jsx("th", { className: "text-right px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400", children: "Cantidad" }), _jsx("th", { className: "text-right px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400", children: "Precio" }), _jsx("th", { className: "text-right px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400", children: "Impuesto" }), _jsx("th", { className: "text-right px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400", children: "Bodega" }), _jsx("th", { className: "text-right px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400", children: "Desc %" }), _jsx("th", { className: "text-right px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400", children: "Total" }), _jsx("th", { className: "w-10 px-4 py-3" })] }) }), _jsx("tbody", { className: "divide-y divide-slate-100 dark:divide-slate-800", children: items.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: 8, className: "p-8 text-center text-slate-500 font-medium", children: "No hay items en esta factura" }) })) : (items.map((item) => (_jsxs("tr", { className: "hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors", children: [_jsx("td", { className: "px-4 py-3", children: _jsxs(Select, { value: item.productId || "", onValueChange: (v) => handleProductSelect(item.id, v), disabled: products.length === 0, children: [_jsx(SelectTrigger, { className: "w-full min-w-[200px]", children: _jsx(SelectValue, { placeholder: products.length === 0
                                                                    ? "No hay productos disponibles"
                                                                    : "Buscar ítem facturable" }) }), _jsx(SelectContent, { children: products.length > 0 ? (products.map((product) => (_jsxs(SelectItem, { value: product.id, children: [product.name, " - $", product.basePrice] }, product.id)))) : (_jsx(SelectItem, { value: "none", disabled: true, children: "No hay productos disponibles" })) })] }) }), _jsx("td", { className: "px-4 py-3", children: _jsx(Input, { placeholder: "Descripci\u00F3n", value: item.description, onChange: (e) => handleItemChange(item.id, "description", e.target.value), className: "text-sm" }) }), _jsx("td", { className: "px-4 py-3", children: _jsx(Input, { type: "number", placeholder: "0", value: item.quantity || "", onChange: (e) => handleItemChange(item.id, "quantity", parseFloat(e.target.value) || 0), className: "text-right text-sm w-20", min: "0", step: "any" }) }), _jsx("td", { className: "px-4 py-3", children: _jsx(InputCurrency, { placeholder: "Precio uni", value: item.price || 0, onChange: (val) => handleItemChange(item.id, "price", val), className: "text-right text-sm px-2 w-32" }) }), _jsx("td", { className: "px-4 py-3", children: _jsxs(Select, { value: item.taxRate.toString(), onValueChange: (v) => handleItemChange(item.id, "taxRate", parseFloat(v)), children: [_jsx(SelectTrigger, { className: "w-28", children: _jsx(SelectValue, { placeholder: "Impuesto" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "0", children: "0%" }), _jsx(SelectItem, { value: "5", children: "5%" }), _jsx(SelectItem, { value: "10.5", children: "10.5%" }), _jsx(SelectItem, { value: "19", children: "19%" }), _jsx(SelectItem, { value: "21", children: "21%" })] })] }) }), _jsx("td", { className: "px-4 py-3", children: _jsxs(Select, { value: item.storeId || "", onValueChange: (v) => handleItemChange(item.id, "storeId", v), children: [_jsx(SelectTrigger, { className: "w-32", children: _jsx(SelectValue, { placeholder: "Bodega" }) }), _jsx(SelectContent, { children: stores.map((s) => (_jsx(SelectItem, { value: s.id, children: s.name }, s.id))) })] }) }), _jsx("td", { className: "px-4 py-3", children: _jsx(Input, { type: "number", placeholder: "%", value: item.discount || "", onChange: (e) => handleItemChange(item.id, "discount", parseFloat(e.target.value) || 0), className: "text-right text-sm w-16", step: "any" }) }), _jsxs("td", { className: "px-4 py-3 text-right text-slate-500 font-medium whitespace-nowrap", children: ["$", " ", item.total.toLocaleString("es-CO", {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2,
                                                    })] }), _jsx("td", { className: "px-4 py-3", children: _jsx(Button, { variant: "ghost", size: "sm", onClick: () => handleRemoveItem(item.id), disabled: items.length === 1, children: _jsx(X, { className: "w-4 h-4" }) }) })] }, item.id)))) })] }) }), (mode === "create" || mode === "edit") && (_jsx("div", { className: "p-4", children: _jsxs(Button, { variant: "link", onClick: handleAddItem, className: "text-foreground hover:text-foreground/80 hover:underline flex items-center cursor-pointer", children: [_jsx(Plus, { className: "w-4 h-4 mr-1" }), "Agregar l\u00EDnea"] }) }))] }), _jsxs("div", { className: "flex items-center justify-between w-full", children: [_jsxs("div", { className: "w-1/3", children: [_jsx("input", { type: "file", ref: signatureInputRef, className: "hidden", accept: "image/png, image/jpeg, image/jpg", onChange: handleSignatureChange }), _jsx("div", { onClick: handleSignatureClick, className: `flex flex-col justify-start border-2 border-dashed rounded-lg text-muted-foreground cursor-pointer w-full max-w-xs h-32 m-auto overflow-hidden relative hover:bg-muted/10 transition-colors ${formData.signature ? "border-none p-0" : "p-8"}`, children: formData.signature ? (_jsxs("div", { className: "relative w-full h-full group", children: [_jsx("img", { src: formData.signature, alt: "Firma digital", className: "w-full h-full object-contain" }), _jsx("div", { className: "absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity", children: _jsx("span", { className: "text-white text-xs", children: "Cambiar firma" }) })] })) : (_jsxs("div", { className: "text-center space-y-2 pointer-events-none w-full h-full flex flex-col items-center justify-center", children: [_jsx("p", { className: "text-sm font-medium", children: "Utilizar mi firma" }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Jpg o .png \u00FAnicos" })] })) }), _jsx("div", { className: "mt-2 h-[2px] w-full block bg-slate-200 dark:bg-slate-800" }), _jsx("span", { className: "text flex justify-center text-gray-400 mt-1", children: "ELABORADOR POR" })] }), _jsxs("div", { className: "w-1/3 flex flex-col border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 shadow-sm p-5 space-y-3", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-slate-500", children: "Subtotal" }), _jsxs("span", { className: "font-medium", children: ["$", " ", subtotal.toLocaleString("es-CO", {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })] })] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-slate-500", children: "Descuento" }), _jsxs("span", { className: "font-medium text-red-500", children: ["-$", " ", discountTotal.toLocaleString("es-CO", {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })] })] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-slate-500", children: "Impuestos" }), _jsxs("span", { className: "font-medium", children: ["$", " ", taxTotal.toLocaleString("es-CO", {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })] })] }), _jsxs("div", { className: "border-t border-slate-200 dark:border-slate-800 pt-3 mt-1 flex justify-between items-center", children: [_jsx("span", { className: "text-lg font-semibold text-slate-700 dark:text-slate-300", children: "Total" }), _jsxs("span", { className: "text-2xl font-bold", children: ["$", " ", total.toLocaleString("es-CO", {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })] })] })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "T\u00E9rminos y condiciones" }), _jsx(Textarea, { value: formData.terms, onChange: (e) => setFormData({ ...formData, terms: e.target.value }), placeholder: "Este documento se asimila en todos sus efectos a una letra de cambio...", rows: 4 })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Notas" }), _jsx(Textarea, { value: formData.notes, onChange: (e) => setFormData({ ...formData, notes: e.target.value }), placeholder: "Notas adicionales para la factura...", rows: 3 })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Pie de factura" }), _jsx(Input, { placeholder: "Visible en la impresi\u00F3n del documento", value: formData.footerNote, onChange: (e) => setFormData({ ...formData, footerNote: e.target.value }) })] }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Los campos marcados con * son obligatorios" }), _jsxs("div", { className: "flex justify-end gap-3", children: [_jsx(Button, { variant: "outline", onClick: handleBack, disabled: isLoading, children: "Cancelar" }), _jsx(Button, { variant: "outline", className: "gap-2", onClick: () => setShowPreview(true), disabled: isLoading || items.length === 0, children: "Previsualizar" }), (mode === "create" || mode === "edit") && (_jsxs(_Fragment, { children: [_jsx(Button, { variant: "outline", onClick: handleSaveDraft, disabled: isLoading, children: isLoading ? "Guardando..." : "Guardar como borrador" }), _jsx(Button, { onClick: handleEmitBill, disabled: isLoading || items.length === 0, children: isLoading
                                    ? "Emitiendo..."
                                    : mode === "edit"
                                        ? "Actualizar factura"
                                        : "Emitir factura" })] }))] })] }));
}
