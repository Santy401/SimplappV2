"use client";

import { Seller, CreateSellerDto } from "@domain/entities/Seller.entity";
import { useEffect, useState } from "react";
import { useSeller } from "@interfaces/src/hooks/features/Sellers/useSeller";
import {
    FormModalLayout,
    FormSection,
    InputField,
    TextareaField,
} from "@simplapp/ui";

interface CreateSellerProps {
    onBack: () => void;
    initialData?: Partial<Seller> & { id?: string };
    mode?: 'create' | 'edit';
}

type SellerFormData = Omit<CreateSellerDto, 'id'> & { id?: string };

export default function CreateSeller({ onBack, initialData, mode = 'create' }: CreateSellerProps) {
    const [isLoading, setIsLoading] = useState(false);
    const { createSeller, updateSeller } = useSeller();
    const [errors, setErrors] = useState<Partial<Record<keyof Seller, string>>>({});
    const [formData, setFormData] = useState<SellerFormData>({
        name: '',
        identification: null,
        observation: null,
        ...initialData
    })

    useEffect(() => {
        if (initialData) {
            const { id, ...formDataFields } = initialData;
            setFormData(prev => ({
                ...prev,
                ...formDataFields as SellerFormData
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

        setIsLoading(true);
        try {
            if (mode === 'create') {
                const result = await createSeller(formData);

                if (result) {
                    handleCancel();
                } else {
                    console.log('Error al crear la Vendedor');
                }
            } else {
                if (!initialData?.id) {
                    console.log('ID de la Vendedor no encontrado');
                    return;
                }

                const result = await updateSeller(initialData.id, formData);

                if (result) {
                    handleCancel();
                } else {
                    console.log('Error al actualizar el Vendedor');
                }
            }
        } catch (error) {
            console.error('Error:', error);
            console.log('Error al procesar la solicitud');
        } finally {
            setIsLoading(false);
        }
    }


    return (
        <FormModalLayout
            title={mode === 'create' ? 'Crear Nuevo Vendedor' : 'Editar Vendedor'}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            submitLabel={mode === 'create' ? 'Crear Vendedor' : 'Actualizar Vendedor'}
            isLoading={isLoading}
            maxWidth="2xl"
            showMoreOptions={false}
        >
            <FormSection columns={1} gap="md">
                <InputField
                    label="Nombre de del vendedor"
                    required
                    value={formData.name ?? ''}
                    onChange={(value) =>
                        setFormData(prev => ({ ...prev, name: value }))
                    }
                    error={errors.name}
                />

                <TextareaField
                    label="Identificacion"
                    value={formData.identification || ''}
                    onChange={(value) =>
                        setFormData(prev => ({ ...prev, identification: value }))
                    }
                    rows={2}
                />

                <TextareaField
                    label="Observaciones"
                    value={formData.observation || ''}
                    onChange={(value) =>
                        setFormData(prev => ({ ...prev, observation: value }))
                    }
                    rows={4}
                />
            </FormSection>
        </FormModalLayout>
    )
}