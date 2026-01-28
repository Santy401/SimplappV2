export interface ProductProps {
  id?: string;
  name: string;
  category: ProductCategory;
  unitOfMeasure: UnitOfMeasure;
  reference?: string | null;
  codeProduct: string | null;
  codeBarcode?: string | null;

  initialAmount: number | null;
  costForUnit: number | null;
  basePrice: number;

  goodExcluded: boolean;
  taxRate: string;
  taxExempt: boolean;
  observation?: string | null;

  active: boolean;

  store?: [];

  priceList?: [];
  valuePrice?: number;

  bills: [];

  createdAt?: Date;
  updatedAt?: Date;
}

export interface Product {
  id?: string;
  name: string;
  category: ProductCategory;
  unitOfMeasure: UnitOfMeasure;
  reference?: string | null;
  codeProduct: string | null;
  codeBarcode?: string | null;

  initialAmount: number | null;
  costForUnit: number | null;
  basePrice: number;

  goodExcluded: boolean;
  taxRate: string;
  taxExempt: boolean;
  observation?: string | null;

  active: boolean;

  store?: [];

  priceList?: [];
  valuePrice?: number;

  bills: [];

  createdAt?: Date;
  updatedAt?: Date;
}

// Revisa cómo está definido CreateProductDto:
export interface CreateProductDto {
  name: string;
  type: string;
  category: string;
  unitOfMeasure: UnitOfMeasure;
  reference: string | null;
  codeProduct: string | null;  // Mapped to 'code' in backend
  costForUnit: number | null;  // Mapped to 'cost' in backend
  basePrice: number;
  taxRate: string;
  description: string | null;
  active: boolean;
  valuePrice: number;          // Mapped to 'finalPrice' in backend
}

export interface UpdateProductDto {
  name: string;
  type?: string;
  category: string;
  unitOfMeasure: UnitOfMeasure;
  reference?: string | null;
  codeProduct: string | null;
  costForUnit: number | null;
  basePrice: number;
  taxRate: string;
  description: string | null;
  active: boolean;
  valuePrice: number;
}

export enum ProductCategory {
  SERVICES_SALE = 'VENTA_DE_SERVICIOS',
  GOODS_SALE = 'VENTA_DE_BIENES_Y_CAMBIO',
  ASSETS_SALE = 'VENTA_DE_PROPIEDAD_PLANTA_Y_EQUIPO'
}

export enum UnitOfMeasure {
  UNIT = 'UNIDAD',
  PAIR = 'PAR',
  BOX = 'CAJA',
  BOTTLE = 'BOTELLA',
  CENTIMETER = 'CENTIMETRO',
  SQUARE_CENTIMETER = 'CENTIMETRO_CUADRADO',
  SQUARE_METER = 'METRO_CUADRADO',
  INCH = 'PULGADA',
  MILLILITER = 'MILILITRO',
  LITER = 'LITRO',
  GALLON = 'GALON',
  CUBIC_METER = 'METRO_CUBICO',
  GRAM = 'GRAMO',
  KILOGRAM = 'KILOGRAMO',
  TON = 'TONELADA',
  POUND = 'LIBRA',
  HOUR = 'HORA',
  MINUTE = 'MINUTO',
  DAY = 'DIA'
}