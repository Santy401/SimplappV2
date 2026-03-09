import type { Meta, StoryObj } from '@storybook/react';
import { FormBill } from './FormBill';
import type { IdentificationType, OrganizationType } from '@domain/entities/Client.entity';
import type { UnitOfMeasure, ProductCategory } from '@domain/entities/Product.entity';
import type { BillStatus, PaymentMethod } from '@domain/entities/Bill.entity';

const meta = {
  title: 'Molecules/FormBill',
  component: FormBill,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof FormBill>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    companyId: 'company-123',
    clients: [
      {
        id: '1',
        firstName: 'John',
        firstLastName: 'Doe',
        identificationNumber: '123456789',
        email: 'john@example.com',
        phone: '555-0101',
        organizationType: 'NATURAL_PERSON' as OrganizationType,
        identificationType: 'CITIZEN_ID' as IdentificationType,
        country: 'Colombia',
        includeCcBcc: false,
        is_supplier: false,
        it_branches: false,
        bills: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ],
    products: [
      {
        id: '1',
        name: 'Product A',
        reference: 'REF-001',
        basePrice: 1000,
        taxRate: '19',
        active: true,
        category: 'VENTA_DE_BIENES_Y_CAMBIO' as ProductCategory,
        unitOfMeasure: 'UNIDAD' as UnitOfMeasure,
        codeProduct: '001',
        goodExcluded: false,
        taxExempt: false,
        initialAmount: 10,
        costForUnit: 500,
        bills: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ],
    listPrices: [],
    stores: [],
    sellers: [],
  },
};

export const ViewMode: Story = {
  args: {
    ...Default.args,
    mode: 'view',
    initialData: {
      id: 'bill-1',
      number: 1001,
      clientName: 'John Doe',
      clientEmail: 'john@example.com',
      date: new Date(),
      subtotal: 1000,
      total: 1190,
      balance: 1190,
      status: 'ISSUED' as BillStatus,
      paymentMethod: 'CASH' as PaymentMethod,
      items: [
        {
          id: 'item-1',
          name: 'Product A',
          quantity: 1,
          price: 1000,
          discount: 0,
          taxRate: 19,
          taxAmount: 190,
          description: 'Test product',
          total: 1190,
          productId: '1'
        }
      ] as any
    }
  }
};
