'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
    FormModalLayout,
    FormSection,
    InputField,
    SelectField,
    TextareaField,
    CheckboxField,
} from '@simplapp/ui';
import { useProduct } from '@interfaces/src/hooks/features/Products/useProduct';
import { DollarSign, Calculator, TrendingUp, Search } from 'lucide-react';
import { Button } from '@ui/index';

interface CreateProductProps {
    onBack: () => void;
    initialData?: any;
    mode?: 'create' | 'edit';
}

type ProductFormData = {
    name: string;
    description: string | null;
    reference: string | null;
    code: string | null;
    type: string;
    categoryProductId: number;
    unit: string;
    taxRate: string;
    trackStock: boolean;
    allowNegativeStock: boolean;
    active: boolean;
    cost: string;
    basePrice: string;
    finalPrice: string;
};

export default function CreateProduct({ onBack, initialData, mode = 'create' }: CreateProductProps) {
    const [isLoading, setIsLoading] = useState(false);
    const { createProduct, updateProduct } = useProduct();
    const [errors, setErrors] = useState<Partial<Record<keyof ProductFormData, string>>>({});
    const [categories, setCategories] = useState<Array<{ id: number; name: string }>>([]);

    const [formData, setFormData] = useState<ProductFormData>({
        name: '',
        description: null,
        reference: null,
        code: null,
        type: 'PRODUCT',
        categoryProductId: 1,
        unit: 'UNIDAD',
        taxRate: '19',
        trackStock: true,
        allowNegativeStock: false,
        active: true,
        cost: '',
        basePrice: '',
        finalPrice: '',
        ...initialData
    });

    useEffect(() => {
        if (initialData) {
            const { id, ...formDataFields } = initialData;
            setFormData(prev => ({
                ...prev,
                ...formDataFields as ProductFormData,
            }));
        }
    }, [initialData]);

    // Cargar categorías
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categoriesResponse = await fetch('/api/categories');
                if (categoriesResponse.ok) {
                    const categoriesData = await categoriesResponse.json();
                    setCategories(categoriesData);
                    if (categoriesData.length > 0 && !formData.categoryProductId) {
                        setFormData(prev => ({ ...prev, categoryProductId: categoriesData[0].id }));
                    }
                }
            } catch (error) {
                console.error('Error loading categories:', error);
                toast.error('Error al cargar categorías');
            }
        };
        fetchCategories();
    }, []);

    // Calcular precio final automáticamente
    useEffect(() => {
        const basePrice = parseFloat(formData.basePrice) || 0;
        const taxRate = parseFloat(formData.taxRate) || 0;

        if (basePrice > 0) {
            const finalPrice = basePrice + (basePrice * taxRate / 100);
            setFormData(prev => ({
                ...prev,
                finalPrice: finalPrice.toFixed(2)
            }));
        }
    }, [formData.basePrice, formData.taxRate]);

    const validateForm = (): boolean => {
        const newErrors: Partial<Record<keyof ProductFormData, string>> = {};

        if (!formData.name?.trim()) {
            newErrors.name = 'El nombre es obligatorio';
        }
        if (!formData.taxRate?.trim()) {
            newErrors.taxRate = 'La tasa de impuesto es obligatoria';
        }
        if (formData.type === 'PRODUCT' && !formData.cost) {
            newErrors.cost = 'El costo es obligatorio para productos';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const generateCode = () => {
        const typePrefix = formData.type === 'PRODUCT' ? 'PROD' : 'SERV';
        const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        const code = `${typePrefix}-${randomNum}`;
        setFormData(prev => ({ ...prev, code }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Por favor, complete todos los campos obligatorios');
            return;
        }

        setIsLoading(true);
        try {
            const productData = {
                ...formData,
            };

            if (mode === 'create') {
                const result = await createProduct(productData);

                if (result) {
                    toast.success('Producto creado exitosamente');
                    handleCancel();
                } else {
                    toast.error('Error al crear el producto');
                }
            } else {
                if (!initialData?.id) {
                    toast.error('ID del producto no encontrado');
                    return;
                }

                const result = await updateProduct(initialData.id, productData);

                if (result) {
                    toast.success('Producto actualizado exitosamente');
                    handleCancel();
                } else {
                    toast.error('Error al actualizar el producto');
                }
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error al procesar la solicitud');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        if (onBack) {
            onBack();
        }
    };

    // Options for select fields
    const typeOptions = [
        { value: 'PRODUCT', label: 'Producto' },
        { value: 'SERVICE', label: 'Servicio' },
        { value: 'COMBO', label: 'Combo' },
        { value: 'VARIANT', label: 'Variante' },
    ];

    const unitOptions = [
        { value: 'UNIDAD', label: 'Unidad' },
        { value: 'PAR', label: 'Par' },
        { value: 'CAJA', label: 'Caja' },
        { value: 'BOTELLA', label: 'Botella' },
        { value: 'CENTIMETRO', label: 'Centímetro' },
        { value: 'CENTIMETRO_CUADRADO', label: 'Centímetro²' },
        { value: 'METRO_CUADRADO', label: 'Metro²' },
        { value: 'PULGADA', label: 'Pulgada' },
        { value: 'MILILITRO', label: 'Mililitro' },
        { value: 'LITRO', label: 'Litro' },
        { value: 'GALON', label: 'Galón' },
        { value: 'METRO_CUBICO', label: 'Metro³' },
        { value: 'GRAMO', label: 'Gramo' },
        { value: 'KILOGRAMO', label: 'Kilogramo' },
        { value: 'TONELADA', label: 'Tonelada' },
        { value: 'LIBRA', label: 'Libra' },
        { value: 'HORA', label: 'Hora' },
        { value: 'MINUTO', label: 'Minuto' },
        { value: 'DIA', label: 'Día' },
    ];

    const taxRateOptions = [
        { value: '0', label: '0%' },
        { value: '5', label: '5%' },
        { value: '19', label: '19%' },
    ];

    return (
        <FormModalLayout
            title={mode === 'create' ? 'Crear Nuevo Producto' : 'Editar Producto'}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            submitLabel={mode === 'create' ? 'Crear Producto' : 'Actualizar Producto'}
            isLoading={isLoading}
            maxWidth="4xl"
            showMoreOptions={false}
        >
            {/* Información Básica */}
            <FormSection columns={1} gap="md">
                <InputField
                    label="Nombre"
                    required
                    value={formData.name}
                    onChange={(value) =>
                        setFormData(prev => ({ ...prev, name: value }))
                    }
                    error={errors.name}
                    placeholder="Nombre del producto"
                />
            </FormSection>

            <FormSection columns={2} gap="md">
                <SelectField
                    label="Categoría"
                    required
                    value={formData.categoryProductId.toString()}
                    onChange={(value) =>
                        setFormData(prev => ({ ...prev, categoryProductId: parseInt(value) }))
                    }
                    options={categories.map(cat => ({ value: cat.id.toString(), label: cat.name }))}
                />

                <SelectField
                    label="Tipo"
                    required
                    value={formData.type}
                    onChange={(value) =>
                        setFormData(prev => ({ ...prev, type: value }))
                    }
                    options={typeOptions}
                />

                <SelectField
                    label="Unidad de Medida"
                    required
                    value={formData.unit}
                    onChange={(value) =>
                        setFormData(prev => ({ ...prev, unit: value }))
                    }
                    options={unitOptions}
                />

                <InputField
                    label="Referencia"
                    value={formData.reference || ''}
                    onChange={(value) =>
                        setFormData(prev => ({ ...prev, reference: value }))
                    }
                    placeholder="Referencia del producto"
                />

                <div className="space-y-2">
                    {/* <label className="text-sm font-medium flex items-center gap-2">
                        Código del producto o servicio
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2"
                        >
                        </Button>
                    </label> */}
                    <InputField
                        label="Código del producto o servicio"
                        value={formData.code || ''}
                        onChange={(value) => setFormData(prev => ({ ...prev, code: value }))}
                        placeholder="Buscar..."
                    />
                </div>
            </FormSection>

            {/* Precio Base, Impuesto y Precio Total */}
            <FormSection columns={4} gap="md">

                <InputField
                    label="Costo por unidad"
                    required={formData.type === 'PRODUCT'}
                    value={formData.cost}
                    onChange={(value) =>
                        setFormData(prev => ({ ...prev, cost: value }))
                    }
                    error={errors.cost}
                    placeholder="0.00"
                    className="w-50 mr-4"
                />

                <InputField
                    label="Precio base"
                    required
                    value={formData.basePrice}
                    onChange={(value) =>
                        setFormData(prev => ({ ...prev, basePrice: value }))
                    }
                    placeholder="0.00"
                    className="w-50 mr-4"
                />

                <SelectField
                    label="Impuesto"
                    required
                    value={formData.taxRate}
                    onChange={(value) =>
                        setFormData(prev => ({ ...prev, taxRate: value }))
                    }
                    options={taxRateOptions}
                    error={errors.taxRate}
                    className="w-50 mr-4"
                />

                <InputField
                    label="Precio Total"
                    required
                    value={formData.finalPrice}
                    onChange={(value) =>
                        setFormData(prev => ({ ...prev, finalPrice: value }))
                    }
                    placeholder="0.00"
                />
            </FormSection>

            {/* Descripción */}
            <FormSection columns={1} gap="md">
                <TextareaField
                    label="Descripción"
                    value={formData.description || ''}
                    onChange={(value) =>
                        setFormData(prev => ({ ...prev, description: value }))
                    }
                    rows={4}
                    placeholder="Descripción del producto..."
                />
            </FormSection>

            {/* Opciones de Inventario */}
            <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4">Opciones de Inventario</h3>
                <FormSection columns={3} gap="md">
                    <CheckboxField
                        label="Controlar Stock"
                        checked={formData.trackStock}
                        onChange={(checked) =>
                            setFormData(prev => ({ ...prev, trackStock: checked }))
                        }
                    />

                    <CheckboxField
                        label="Permitir Stock Negativo"
                        checked={formData.allowNegativeStock}
                        onChange={(checked) =>
                            setFormData(prev => ({ ...prev, allowNegativeStock: checked }))
                        }
                    />

                    <CheckboxField
                        label="Producto Activo"
                        checked={formData.active}
                        onChange={(checked) =>
                            setFormData(prev => ({ ...prev, active: checked }))
                        }
                    />
                </FormSection>
            </div>
        </FormModalLayout>
    );
}