"use client";

import { ListPrice, CreateListPriceDto, UpdateListPriceDto, TypePrice } from "@domain/entities/ListPrice.entity";
import { useEffect, useState } from "react";
import { useListPrice } from "@interfaces/src/hooks/features/ListPrice/useListPrice";
import {
    FormModalLayout,
    FormSection,
    InputField,
    TextareaField
} from "@simplapp/ui";
import { CircleAlert } from "lucide-react";

interface CreateListPriceProps {
    onBack: () => void;
    initialData?: Partial<ListPrice> & { id?: string };
    mode?: 'create' | 'edit';
}

type ListPriceFormData = Omit<CreateListPriceDto, 'id'> & { id?: string };

const TYPE_PRICE_OPTIONS = [
    { value: TypePrice.PORCENTAJE, label: 'Porcentaje' },
    { value: TypePrice.VALOR, label: 'Valor Fijo' },
];

export default function CreateListPrice({ onBack, initialData, mode = 'create' }: CreateListPriceProps) {
    const [isLoading, setIsLoading] = useState(false);
    const { createListPrice, updateListPrice } = useListPrice();
    const [errors, setErrors] = useState<Partial<Record<keyof ListPrice, string>>>({});
    const [formData, setFormData] = useState<ListPriceFormData>({
        name: '',
        description: null,
        type: TypePrice.VALOR,
        percentage: '',
        ...initialData
    })

    useEffect(() => {
        if (initialData) {
            const { id, ...formDataFields } = initialData;
            setFormData(prev => ({
                ...prev,
                ...formDataFields as ListPriceFormData
            }));
        }
    }, [initialData])

    const handleCancel = () => {
        if (onBack) {
            onBack();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validación
        const newErrors: Partial<Record<keyof ListPrice, string>> = {};

        if (!formData.name?.trim()) {
            newErrors.name = 'El nombre es requerido';
        }

        if (formData.type === TypePrice.PORCENTAJE) {
    const percentageValue = formData.percentage 
        ? parseFloat(formData.percentage) 
        : 0;

    if (percentageValue < 0) {  // ← Comparar números, no strings
        newErrors.percentage = 'El porcentaje no puede ser negativo';
    }

    if (percentageValue > 1000) {  // ← Comparar números
        newErrors.percentage = 'El porcentaje no puede ser mayor a 1000%';
    }  

    if (percentageValue === 0) {
        newErrors.percentage = 'El porcentaje no puede ser 0';
    }
}

        // Si es VALOR, podemos establecer el porcentaje en 0 o mantenerlo según tu lógica de negocio
        if (formData.type === TypePrice.VALOR) {
            // Opcional: puedes resetear el porcentaje a 0 si no se usa
            // setFormData(prev => ({ ...prev, percentage: 0 }));
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            return;
        }

        setIsLoading(true);
        try {
            if (mode === 'create') {
                const result = await createListPrice(formData);

                if (result) {
                    handleCancel();
                } else {
                    console.log('Error al crear la Lista de Precios');
                }
            } else {
                if (!initialData?.id) {
                    console.log('ID de la Lista de Precios no encontrado');
                    return;
                }

                const result = await updateListPrice(initialData.id, formData);

                if (result) {
                    handleCancel();
                } else {
                    console.log('Error al actualizar la Lista de Precios');
                }
            }
        } catch (error) {
            console.error('Error:', error);
            console.log('Error al procesar la solicitud');
        } finally {
            setIsLoading(false);
        }
    }

    // const handlePercentageChange = (value: string) => {
    //     const numValue = value === '' ? 0 : parseFloat(value);
    //     if (!isNaN(numValue)) {
    //         setFormData(prev => ({ ...prev, percentage: numValue }));
    //     }
    // }

    const handleTypeChange = (value: TypePrice) => {
        setFormData(prev => ({ 
            ...prev, 
            type: value,
            // Opcional: resetear porcentaje si cambia de PORCENTAJE a VALOR
            percentage: value === TypePrice.VALOR ? '' : prev.percentage
        }));
    }

    return (
        <FormModalLayout
            title={mode === 'create' ? 'Crear Nueva Lista de Precios' : 'Editar Lista de Precios'}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            submitLabel={mode === 'create' ? 'Crear Lista de Precios' : 'Actualizar Lista de Precios'}
            isLoading={isLoading}
            maxWidth="2xl"
            showMoreOptions={false}
        >
            <FormSection columns={1} gap="md">
                <InputField
                    label="Nombre de la Lista de Precios"
                    required
                    value={formData.name ?? ''}
                    onChange={(value) =>
                        setFormData(prev => ({ ...prev, name: value }))
                    }
                    error={errors.name}
                    placeholder="Ej: Mayoristas, Minoristas, Oferta Especial"
                />

                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        Tipo de Lista
                    </label>
                    <select
                        value={formData.type}
                        onChange={(e) => handleTypeChange(e.target.value as TypePrice)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-foreground focus:border-foreground outline-none"
                    >
                        {TYPE_PRICE_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                <TextareaField
                    label="Descripción"
                    value={formData.description || ''}
                    onChange={(value) =>
                        setFormData(prev => ({ ...prev, description: value }))
                    }
                    rows={3}
                    placeholder="Describe el propósito de esta lista de precios"
                />

                {/* Mostrar campo de porcentaje solo si el tipo es PORCENTAJE */}
                {formData.type === TypePrice.PORCENTAJE && (
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Porcentaje
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                min="0"
                                max="1000"
                                step="0.01"
                                value={formData.percentage?.toString() || '0'}
                                onChange={(e) => {
                                    const value = e.target.value === '' ? '0' : e.target.value;
                                    const numValue = parseFloat(value);
                                    if (!isNaN(numValue)) {
                                        setFormData(prev => ({ ...prev, percentage: numValue.toString() }));
                                    }
                                }}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-foreground focus:border-foreground outline-none ${errors.percentage ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="0"
                            />
                            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                %
                            </span>
                        </div>
                        {errors.percentage && (
                            <p className="mt-1 text-sm text-red-600">{errors.percentage}</p>
                        )}
                        <p className="mt-1 text-xs text-gray-500">
                            Porcentaje aplicado sobre el precio base
                        </p>
                    </div>
                )}

                {/* Opcional: Mostrar mensaje cuando es VALOR */}
                {formData.type === TypePrice.VALOR && (
                    <div className="p-3 bg-sidebar-50 border border-sidebar-border rounded-lg flex items-center gap-2">
                      <CircleAlert width={30} height={30} className="text-blue-700"/>  <p className="text-sm text-blue-700">
                            Para listas de precios de tipo "Valor Fijo", se utiliza el valor fijo definido 
                            en el producto. Este campo no requiere porcentaje.
                        </p>
                    </div>
                )}
            </FormSection>
        </FormModalLayout>
    )
}