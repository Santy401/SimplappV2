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

export class Product {
  private readonly _id?: number;
  private _name: string;
  private _code: string | null;
  private _codeBarcode: string | null;
  private _category: ProductCategory;
  private _price: number;
  private _cost: number | null;
  private _stock: number;
  private _minStock: number | null;
  private _goodExcluded: boolean;
  private _taxRate: string;
  private _taxExempt: boolean;
  private _unitOfMeasure: UnitOfMeasure;
  private _description: string | null;
  private _observation: string | null;
  private _active: boolean;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: ProductProps) {
    this.validateProps(props);
    
    this._id = props.id;
    this._name = props.name;
    this._code = props.reference ?? null;
    this._codeBarcode = props.codeBarcode ?? null;
    this._category = props.category;
    this._price = props.price;
    this._cost = props.cost ?? null;
    this._stock = props.stock;
    this._minStock = props.minStock ?? null;
    this._goodExcluded = props.goodExcluded;
    this._taxRate = props.taxRate;
    this._taxExempt = props.taxExempt;
    this._unitOfMeasure = props.unitOfMeasure;
    this._description = props.description ?? null;
    this._observation = props.observation ?? null;
    this._active = props.active;
    this._createdAt = props.createdAt ?? new Date();
    this._updatedAt = props.updatedAt ?? new Date();
  }

  private validateProps(props: ProductProps): void {
    if (!props.name || props.name.trim().length === 0) {
      throw new Error('Product name is required');
    }

    if (props.name.length > 200) {
      throw new Error('Product name cannot exceed 200 characters');
    }

    if (props.price < 0) {
      throw new Error('Price cannot be negative');
    }

    if (props.stock < 0) {
      throw new Error('Stock cannot be negative');
    }

    if (props.cost && props.cost < 0) {
      throw new Error('Cost cannot be negative');
    }

    if (props.minStock && props.minStock < 0) {
      throw new Error('Minimum stock cannot be negative');
    }

    if (!Object.values(ProductCategory).includes(props.category)) {
      throw new Error('Invalid product category');
    }

    if (!Object.values(UnitOfMeasure).includes(props.unitOfMeasure)) {
      throw new Error('Invalid unit of measure');
    }
  }

  public updateStock(quantity: number): void {
    if (quantity < 0 && Math.abs(quantity) > this._stock) {
      throw new Error('Insufficient stock');
    }
    this._stock += quantity;
    this._updatedAt = new Date();
  }

  public isLowStock(): boolean {
    return this._minStock !== null && this._stock <= this._minStock;
  }

  public calculateTaxAmount(): number {
    if (this._taxExempt || this._goodExcluded) {
      return 0;
    }
    return this._price * (parseFloat(this._taxRate) / 100);
  }

  public calculatePriceWithTax(): number {
    return this._price + this.calculateTaxAmount();
  }

  public activate(): void {
    this._active = true;
    this._updatedAt = new Date();
  }

  public deactivate(): void {
    this._active = false;
    this._updatedAt = new Date();
  }

  get id(): number | undefined {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get code(): string | null {
    return this._code;
  }

  get codeBarcode(): string | null {
    return this._codeBarcode;
  }

  get category(): ProductCategory {
    return this._category;
  }

  get price(): number {
    return this._price;
  }

  get cost(): number | null {
    return this._cost;
  }

  get stock(): number {
    return this._stock;
  }

  get minStock(): number | null {
    return this._minStock;
  }

  get goodExcluded(): boolean {
    return this._goodExcluded;
  }

  get taxRate(): string {
    return this._taxRate;
  }

  get taxExempt(): boolean {
    return this._taxExempt;
  }

  get unitOfMeasure(): UnitOfMeasure {
    return this._unitOfMeasure;
  }

  get description(): string | null {
    return this._description;
  }

  get observation(): string | null {
    return this._observation;
  }

  get active(): boolean {
    return this._active;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  set name(name: string) {
    if (!name || name.trim().length === 0) {
      throw new Error('Product name is required');
    }
    this._name = name;
    this._updatedAt = new Date();
  }

  set price(price: number) {
    if (price < 0) {
      throw new Error('Price cannot be negative');
    }
    this._price = price;
    this._updatedAt = new Date();
  }

  set stock(stock: number) {
    if (stock < 0) {
      throw new Error('Stock cannot be negative');
    }
    this._stock = stock;
    this._updatedAt = new Date();
  }

  set cost(cost: number | null) {
    if (cost !== null && cost < 0) {
      throw new Error('Cost cannot be negative');
    }
    this._cost = cost;
    this._updatedAt = new Date();
  }

  public static create(props: Omit<ProductProps, 'id' | 'createdAt' | 'updatedAt'>): Product {
    return new Product({
      ...props,
      active: props.active ?? true,
      stock: props.stock ?? 0,
      goodExcluded: props.goodExcluded ?? false,
      taxExempt: props.taxExempt ?? false
    });
  }

  public static fromPersistence(data: any): Product {
    return new Product({
      id: data.id,
      name: data.name,
      reference: data.code,
      codeBarcode: data.codeBarcode,
      category: data.category as ProductCategory,
      price: data.price,
      cost: data.cost,
      stock: data.stock,
      minStock: data.minStock,
      goodExcluded: data.goodExcluded,
      taxRate: data.taxRate,
      taxExempt: data.taxExempt,
      unitOfMeasure: data.unitOfMeasure as UnitOfMeasure,
      description: data.description,
      observation: data.observation,
      active: data.active,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt)
    });
  }

  public toPersistence(): any {
    return {
      id: this._id,
      name: this._name,
      code: this._code,
      codeBarcode: this._codeBarcode,
      category: this._category,
      price: this._price,
      cost: this._cost,
      stock: this._stock,
      minStock: this._minStock,
      goodExcluded: this._goodExcluded,
      taxRate: this._taxRate,
      taxExempt: this._taxExempt,
      unitOfMeasure: this._unitOfMeasure,
      description: this._description,
      observation: this._observation,
      active: this._active,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt
    };
  }

  public toJSON(): any {
    return {
      id: this._id,
      name: this._name,
      code: this._code,
      codeBarcode: this._codeBarcode,
      category: this._category,
      price: this._price,
      cost: this._cost,
      stock: this._stock,
      minStock: this._minStock,
      goodExcluded: this._goodExcluded,
      taxRate: this._taxRate,
      taxExempt: this._taxExempt,
      unitOfMeasure: this._unitOfMeasure,
      description: this._description,
      observation: this._observation,
      active: this._active,
      isLowStock: this.isLowStock(),
      taxAmount: this.calculateTaxAmount(),
      priceWithTax: this.calculatePriceWithTax(),
      createdAt: this._createdAt,
      updatedAt: this._updatedAt
    };
  }
}