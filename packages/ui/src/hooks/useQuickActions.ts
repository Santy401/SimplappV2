'use client';

import { useState } from 'react';
import { User, Package, Store, UserCheck, Tag } from 'lucide-react';
import { QuickField } from '../molecules/QuickCreateModal/QuickCreateModal';
import { OrganizationType, IdentificationType } from '@domain/entities/Client.entity';
import { ProductCategory, UnitOfMeasure } from '@domain/entities/Product.entity';

export type QuickActionType = 'client' | 'product' | 'store' | 'seller' | 'listPrice' | null;

export const useQuickActions = (onSelect?: (view: string) => void) => {
  const [activeAction, setActiveAction] = useState<QuickActionType>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const openAction = (type: QuickActionType) => {
    setActiveAction(type);
    setValues({});
  };

  const closeAction = () => {
    setActiveAction(null);
    setValues({});
  };

  const handleValueChange = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  // ─── Configuraciones por tipo ──────────────────────────────────────────────

  const configs: Record<string, any> = {
    client: {
      title: 'Nuevo cliente',
      icon: User,
      description: 'Crea un cliente rápido con los datos básicos de facturación.',
      submitLabel: 'Crear cliente',
      advancedLabel: 'Ir a formulario completo',
      onAdvanced: () => {
        onSelect?.('ventas-clientes-create');
        closeAction();
      },
      fields: [
        { key: 'firstName', label: 'Nombres', type: 'text', placeholder: 'Ej: Juan', required: true },
        { key: 'firstLastName', label: 'Apellidos', type: 'text', placeholder: 'Ej: Pérez', required: true },
        { 
          key: 'organizationType', 
          label: 'Tipo Organización', 
          type: 'select', 
          options: [
            { label: 'Persona Natural', value: OrganizationType.NATURAL_PERSON }, 
            { label: 'Persona Jurídica', value: OrganizationType.PERSON_JURIDIC }
          ], 
          defaultValue: OrganizationType.NATURAL_PERSON,
          required: true 
        },
        { 
          key: 'identificationType', 
          label: 'Tipo ID', 
          type: 'select', 
          options: [
            { label: 'Cédula de Ciudadanía', value: IdentificationType.CITIZEN_ID }, 
            { label: 'NIT', value: IdentificationType.NIT },
            { label: 'Pasaporte', value: IdentificationType.PASSPORT }
          ], 
          defaultValue: IdentificationType.CITIZEN_ID,
          required: true 
        },
        { key: 'identificationNumber', label: 'Número ID', type: 'text', placeholder: '123456789', required: true, colSpan: 2 },
        { key: 'email', label: 'Correo', type: 'email', placeholder: 'correo@empresa.com', colSpan: 2 },
      ] as QuickField[],
    },
    product: {
      title: 'Nuevo producto',
      icon: Package,
      description: 'Agrega un ítem al catálogo rápidamente.',
      submitLabel: 'Guardar producto',
      advancedLabel: 'Ver catálogo completo',
      onAdvanced: () => {
        onSelect?.('inventarios-productos-create');
        closeAction();
      },
      fields: [
        { key: 'name', label: 'Nombre del producto', type: 'text', placeholder: 'Ej: Camisa Oxford', required: true, colSpan: 2 },
        { key: 'basePrice', label: 'Precio base', type: 'number', placeholder: '0.00', required: true },
        { 
          key: 'taxRate', 
          label: 'IVA (%)', 
          type: 'select', 
          options: [
            { label: '19%', value: '19' }, 
            { label: '5%', value: '5' }, 
            { label: '0%', value: '0' }
          ], 
          defaultValue: '19',
          required: true 
        },
        { 
          key: 'unitOfMeasure', 
          label: 'Unidad de Medida', 
          type: 'select', 
          options: [
            { label: 'Unidad', value: UnitOfMeasure.UNIT }, 
            { label: 'Servicio', value: UnitOfMeasure.HOUR }
          ], 
          defaultValue: UnitOfMeasure.UNIT,
          required: true 
        },
      ] as QuickField[],
    },
    store: {
      title: 'Nueva bodega',
      icon: Store,
      description: 'Registra un punto de almacenamiento.',
      submitLabel: 'Crear bodega',
      advancedLabel: 'Gestionar bodegas',
      onAdvanced: () => {
        onSelect?.('inventarios-bodegas');
        closeAction();
      },
      fields: [
        { key: 'name', label: 'Nombre sede / bodega', type: 'text', placeholder: 'Sede Norte', required: true, colSpan: 2 },
        { key: 'address', label: 'Dirección física', type: 'textarea', placeholder: 'Calle 100 #15-30', colSpan: 2 },
      ] as QuickField[],
    },
    seller: {
      title: 'Nuevo vendedor',
      icon: UserCheck,
      description: 'Registra una nueva persona para gestionar ventas.',
      submitLabel: 'Crear vendedor',
      advancedLabel: 'Lista de vendedores',
      onAdvanced: () => {
        onSelect?.('ventas-vendedor');
        closeAction();
      },
      fields: [
        { key: 'name', label: 'Nombre completo', type: 'text', placeholder: 'Ej: Alexander García', required: true, colSpan: 2 },
        { key: 'identification', label: 'Identificación', type: 'text', placeholder: '123456789' },
        { key: 'phone', label: 'Teléfono', type: 'text', placeholder: '300 123 4567' },
      ] as QuickField[],
    },
    listPrice: {
      title: 'Nueva lista de precios',
      icon: Tag,
      description: 'Crea una categoría de precios para tus productos.',
      submitLabel: 'Crear lista',
      advancedLabel: 'Gestionar listas',
      onAdvanced: () => {
        onSelect?.('inventario-precios');
        closeAction();
      },
      fields: [
        { key: 'name', label: 'Nombre de la lista', type: 'text', placeholder: 'Ej: Mayoristas', required: true, colSpan: 2 },
        { key: 'description', label: 'Descripción', type: 'textarea', placeholder: 'Precios especiales para clientes frecuentes', colSpan: 2 },
      ] as QuickField[],
    },
  };

  const handleQuickSubmit = async (vals: Record<string, string>) => {
    setIsLoading(true);
    try {
      let endpoint = '';
      let body: any = {};

      if (activeAction === 'client') {
        endpoint = '/api/clients';
        body = {
          organizationType: vals.organizationType || OrganizationType.NATURAL_PERSON,
          firstName: vals.firstName,
          firstLastName: vals.firstLastName,
          identificationType: vals.identificationType || IdentificationType.CITIZEN_ID,
          identificationNumber: vals.identificationNumber,
          email: vals.email || null,
          country: 'Colombia',
        };
      } else if (activeAction === 'product') {
        const catRes = await fetch('/api/categories');
        const catData = await catRes.json();
        const categories = Array.isArray(catData) ? catData : catData.data || [];
        if (categories.length === 0) throw new Error('Crea una categoría primero.');
        const defaultCatId = categories[0].id;

        endpoint = '/api/products';
        const basePrice = parseFloat(vals.basePrice) || 0;
        const taxRate = parseFloat(vals.taxRate || '19');
        body = {
          name: vals.name,
          basePrice: basePrice,
          taxRate: vals.taxRate || '19',
          unitOfMeasure: vals.unitOfMeasure || UnitOfMeasure.UNIT,
          category: defaultCatId,
          active: true,
          type: 'PRODUCT',
          valuePrice: basePrice * (1 + (taxRate / 100)),
        };
      } else if (activeAction === 'store') {
        endpoint = '/api/stores';
        body = {
          name: vals.name,
          address: vals.address || null,
        };
      } else if (activeAction === 'seller') {
        endpoint = '/api/sellers';
        body = {
          name: vals.name,
          identification: vals.identification || null,
          phone: vals.phone || null,
          active: true
        };
      } else if (activeAction === 'listPrice') {
        endpoint = '/api/list-prices';
        body = {
          name: vals.name,
          description: vals.description || null,
          active: true
        };
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.message || 'Error al crear el registro');
      }

      closeAction();
      alert(`${configs[activeAction!].title} creado correctamente`);
      
    } catch (error: any) {
      console.error('Error in quick create:', error);
      alert('Error: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    activeAction,
    values,
    isLoading,
    openAction,
    closeAction,
    handleValueChange,
    handleQuickSubmit,
    config: activeAction ? configs[activeAction] : null,
  };
};
