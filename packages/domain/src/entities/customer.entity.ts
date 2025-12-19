export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: "Activo" | "Inactivo" | "Pendiente";
  registrationDate: string;
  totalPurchases: number;
  lastPurchase: string;
  segment: "Premium" | "Regular" | "Nuevo";
}