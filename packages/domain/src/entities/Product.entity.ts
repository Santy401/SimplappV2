export interface ProductProps {
  id?: number;
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
  id?: number;
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

export interface CreateProductDto {
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
}

export interface UpdateProductDto {
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