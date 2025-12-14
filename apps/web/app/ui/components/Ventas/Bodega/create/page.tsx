'use client';

import { Store, CreateStoreDto } from "@domain/entities/Store.entity";
import { useEffect, useState } from "react";
import { useStore } from "@interfaces/src/hooks/features/Store/useStore";
import { toast } from "sonner";

import {
  FormModalLayout,
  FormSection,
  InputField,
  TextareaField,
} from "@simplapp/ui";

interface CreateStoreProps {
    onBack: () => void;
    initialData?: Partial<Store> & { id?: number };
    mode?: 'create' | 'edit';
}

type StoresFormData = Omit<CreateStoreDto, 'id'> & { id?: number };

export default function CreateStore({ onBack, initialData, mode = 'create' }: CreateStoreProps) {
    const [isLoading, setIsLoading] = useState(false);
    const { createStore, updateStore } = useStore();
    const [errors, setErrors] = useState<Partial<Record<keyof Store, string>>>({});
    const [formData, setFormData] = useState<StoresFormData>({
        name: '',
        address: null,
        observation: null,
        ...initialData
    })

    useEffect(() => {
        if (initialData) {
            const { id, ...formDataFields } = initialData;
            setFormData(prev => ({
                ...prev,
                ...formDataFields as StoresFormData,
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
                const result = await createStore(formData);

                if (result) {
                    toast.success('Bodega creado exitosamente');
                    handleCancel();
                } else {
                    toast.error('Error al crear la bodega');
                }
            } else {
                if (!initialData?.id) {
                    toast.error('ID de la bodega no encontrado');
                    return;
                }

                const result = await updateStore(initialData.id, formData);

                if (result) {
                    toast.success('Bodega actualizada exitosamente');
                    handleCancel();
                } else {
                    toast.error('Error al actualizar la bodega');
                }
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error al procesar la solicitud');
        } finally {
            setIsLoading(false);
        }
    }

    const [opcionesOpen, setOpcionesOpen] = useState(false);

    return (
        <FormModalLayout
            title={mode === 'create' ? 'Crear Nueva Bodega' : 'Editar Bodega'}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            submitLabel={mode === 'create' ? 'Crear Bodega' : 'Actualizar Bodega'}
            isLoading={isLoading}
            maxWidth="2xl"
            showMoreOptions={false}
        >
            <FormSection columns={1} gap="md">
                <InputField
                    label="Nombre de la Bodega"
                    required
                    value={formData.name}
                    onChange={(value) =>
                        setFormData(prev => ({ ...prev, name: value }))
                    }
                    error={errors.name}
                />

                <TextareaField
                    label="Dirección"
                    value={formData.address || ''}
                    onChange={(value) =>
                        setFormData(prev => ({ ...prev, address: value }))
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