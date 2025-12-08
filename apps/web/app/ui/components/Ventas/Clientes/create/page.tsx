'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Client, CreateClientDto, OrganizationType, IdentificationType } from '@/domain/entities/Client.entity';
import {
  InputField,
  SelectField,
  CheckboxField,
  TextareaField,
} from '@/app/ui/components/shared/FormFields.tsx';
import { FormModalLayout } from "@/app/ui/components/shared/FormModalLayout"
import { FormSection } from "@/app/ui/components/shared/FormSection"
import { useClients } from '@/interfaces/hooks/features/Clients/useClient';

interface CreateClientProps {
  onBack?: () => void;
  initialData?: Partial<Client> & { id?: number };
  mode?: 'create' | 'edit';
}

type ClientFormData = Omit<CreateClientDto, 'id' | 'createdAt' | 'updatedAt' | 'bills'>;

export default function CreateClient({ onBack, initialData, mode = 'create' }: CreateClientProps) {
  const [opcionesOpen, setOpcionesOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { createClient, updateClient } = useClients();

  const [formData, setFormData] = useState<ClientFormData>({
    organizationType: OrganizationType.NATURAL_PERSON,
    firstLastName: '',
    secondLastName: undefined,
    firstName: '',
    otherNames: undefined,
    commercialName: undefined,
    code: undefined,
    identificationType: IdentificationType.CITIZEN_ID,
    identificationNumber: '',
    email: undefined,
    includeCcBcc: false,
    phone: undefined,
    country: '',
    department: undefined,
    municipality: undefined,
    postalCode: undefined,
    address: undefined,
    is_supplier: false,
    it_branches: false,
    observations: undefined,
    ...initialData,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ClientFormData, string>>>({});

  const isJuridica = formData.organizationType === OrganizationType.PERSON_JURIDIC;

  useEffect(() => {
    if (initialData) {
      const { id, bills, createdAt, updatedAt, ...formDataFields } = initialData;
      setFormData(prev => ({
        ...prev,
        ...formDataFields as ClientFormData,
      }));
    }
  }, [initialData]);

  const handleOrganizationTypeChange = (value: string) => {
    const newType = value as OrganizationType;

    if (newType === OrganizationType.PERSON_JURIDIC) {
      setFormData(prev => ({
        ...prev,
        organizationType: newType,
        identificationType: IdentificationType.NIT,
        firstName: '',
        firstLastName: '',
        secondLastName: '',
        otherNames: ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        organizationType: newType,
        identificationType: IdentificationType.CITIZEN_ID,
        commercialName: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ClientFormData, string>> = {};

    if (isJuridica) {
      if (!formData.commercialName?.trim()) {
        newErrors.commercialName = 'Razón Social es obligatoria';
      }
    } else {
      if (!formData.firstLastName?.trim()) {
        newErrors.firstLastName = 'Primer Apellido es obligatorio';
      }
      if (!formData.firstName?.trim()) {
        newErrors.firstName = 'Primer Nombre es obligatorio';
      }
    }

    if (!formData.identificationNumber?.trim()) {
      newErrors.identificationNumber = 'N° de Identificación es obligatorio';
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    if (!formData.country?.trim()) {
      newErrors.country = 'País es obligatorio';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getFilteredIdentificationOptions = () => {
    if (isJuridica) {
      return identificationTypeOptions.filter(option => option.value === IdentificationType.NIT);
    }
    return identificationTypeOptions.filter(option => option.value !== IdentificationType.NIT);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Por favor, complete todos los campos obligatorios');
      return;
    }

    setIsLoading(true);
    try {
      if (mode === 'create') {
        const result = await createClient(formData);

        if (result) {
          toast.success('Cliente creado exitosamente');
          handleCancel();
        } else {
          toast.error('Error al crear el cliente');
        }
      } else {
        if (!initialData?.id) {
          toast.error('ID del cliente no encontrado');
          return;
        }

        const result = await updateClient(initialData.id, formData);

        if (result) {
          toast.success('Cliente actualizado exitosamente');
          handleCancel();
        } else {
          toast.error('Error al actualizar el cliente');
        }
      }
    } catch (error) {
      toast.error('Error al guardar el cliente');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (onBack) {
      onBack();
    }
  };

  const handleDelete = async () => {
    if (confirm('¿Está seguro de eliminar este cliente?')) {
      if (!initialData?.id) {
        toast.error('ID del cliente no encontrado');
        return;
      }

      const { deleteClient } = useClients();
      const result = await deleteClient(initialData.id);

      if (result) {
        toast.success('Cliente eliminado');
        handleCancel();
      } else {
        toast.error('Error al eliminar el cliente');
      }
    }
  };

  const organizationTypeOptions = [
    { value: OrganizationType.NATURAL_PERSON, label: 'Persona Natural' },
    { value: OrganizationType.PERSON_JURIDIC, label: 'Persona Jurídica' },
  ];

  const identificationTypeOptions = [
    { value: IdentificationType.CITIZEN_ID, label: '13-Cédula de Ciudadanía' },
    { value: IdentificationType.NIT, label: '31-NIT' },
    { value: IdentificationType.PASSPORT, label: '41-Pasaporte' },
    { value: IdentificationType.TAX_ID, label: '22-Cédula de Extranjería' },
    { value: IdentificationType.FOREIGN_ID, label: 'ID Extranjero' },
  ];

  const countryOptions = [
    { value: 'colombia', label: 'Colombia' },
    { value: 'mexico', label: 'México' },
    { value: 'argentina', label: 'Argentina' },
    { value: 'chile', label: 'Chile' },
    { value: 'españa', label: 'España' },
    { value: 'estados_unidos', label: 'Estados Unidos' },
  ];

  return (
    <FormModalLayout
      title={mode === 'create' ? 'Crear Nuevo Cliente' : 'Editar Cliente'}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      onDelete={mode === 'edit' ? handleDelete : undefined}
      submitLabel={mode === 'create' ? 'Crear Cliente' : 'Actualizar Cliente'}
      showMoreOptions={true}
      moreOptionsOpen={opcionesOpen}
      onToggleMoreOptions={() => setOpcionesOpen(!opcionesOpen)}
      moreOptionsContent={
        <div className="space-y-6">
          <CheckboxField
            label="Es Proveedor"
            checked={formData.is_supplier}
            onChange={(checked) =>
              setFormData(prev => ({ ...prev, is_supplier: checked }))
            }
          />
          <CheckboxField
            label="Posee Sucursales"
            checked={formData.it_branches}
            onChange={(checked) =>
              setFormData(prev => ({ ...prev, it_branches: checked }))
            }
          />
          <TextareaField
            label="Observaciones"
            value={formData.observations || ''}
            onChange={(value) =>
              setFormData(prev => ({ ...prev, observations: value }))
            }
            rows={4}
          />
        </div>
      }
      isLoading={isLoading}
      maxWidth="5xl"
    >
      <FormSection columns={2} gap="md">
        <SelectField
          label="Tipo de Organización"
          value={formData.organizationType}
          onChange={handleOrganizationTypeChange}
          options={organizationTypeOptions}
        />

        {isJuridica ? (
          <div className="md:col-span-2">
            <InputField
              label="Razón Social"
              required
              value={formData.commercialName || ''}
              onChange={(value) =>
                setFormData(prev => ({ ...prev, commercialName: value }))
              }
              error={errors.commercialName}
            />
          </div>
        ) : (
          <>
            <InputField
              label="Primer Apellido"
              required
              value={formData.firstLastName}
              onChange={(value) =>
                setFormData(prev => ({ ...prev, firstLastName: value }))
              }
              error={errors.firstLastName}
            />

            <InputField
              label="Segundo Apellido"
              value={formData.secondLastName || ''}
              onChange={(value) =>
                setFormData(prev => ({ ...prev, secondLastName: value }))
              }
            />

            <InputField
              label="Primer Nombre"
              required
              value={formData.firstName}
              onChange={(value) =>
                setFormData(prev => ({ ...prev, firstName: value }))
              }
              error={errors.firstName}
            />

            <InputField
              label="Otros Nombres"
              value={formData.otherNames || ''}
              onChange={(value) =>
                setFormData(prev => ({ ...prev, otherNames: value }))
              }
            />

            <InputField
              label="Nombre Comercial"
              value={formData.commercialName || ''}
              onChange={(value) =>
                setFormData(prev => ({ ...prev, commercialName: value }))
              }
            />
          </>
        )}

        <InputField
          label="Código"
          value={formData.code || ''}
          onChange={(value) =>
            setFormData(prev => ({ ...prev, code: value }))
          }
          placeholder="Auto-generado"
          helpText="Dejar vacío para auto-generar"
        />

        <SelectField
          label="Tipo de Identificación"
          required
          value={formData.identificationType}
          onChange={(value) =>
            setFormData(prev => ({ ...prev, identificationType: value as IdentificationType }))
          }
          options={getFilteredIdentificationOptions()}
        />

        <InputField
          label="N° de Identificación"
          required
          value={formData.identificationNumber}
          onChange={(value) =>
            setFormData(prev => ({ ...prev, identificationNumber: value }))
          }
          error={errors.identificationNumber}
          placeholder={isJuridica ? "123456789-0" : ""}
        />

        <InputField
          label="Email"
          type="email"
          value={formData.email || ''}
          onChange={(value) =>
            setFormData(prev => ({ ...prev, email: value }))
          }
          error={errors.email}
        />

        <div className="flex items-center space-x-2 pt-8">
          <CheckboxField
            label="Incluir Cc/Cco"
            checked={formData.includeCcBcc}
            onChange={(checked) =>
              setFormData(prev => ({ ...prev, includeCcBcc: checked }))
            }
          />
        </div>

        <InputField
          label="Teléfono"
          type="tel"
          value={formData.phone || ''}
          onChange={(value) =>
            setFormData(prev => ({ ...prev, phone: value }))
          }
        />

        <SelectField
          label="País"
          required
          value={formData.country}
          onChange={(value) =>
            setFormData(prev => ({ ...prev, country: value }))
          }
          options={countryOptions}
          error={errors.country}
        />

        <InputField
          label="Departamento"
          value={formData.department || ''}
          onChange={(value) =>
            setFormData(prev => ({ ...prev, department: value }))
          }
        />

        <InputField
          label="Municipio"
          value={formData.municipality || ''}
          onChange={(value) =>
            setFormData(prev => ({ ...prev, municipality: value }))
          }
        />

        <InputField
          label="Código Postal"
          value={formData.postalCode || ''}
          onChange={(value) =>
            setFormData(prev => ({ ...prev, postalCode: value }))
          }
        />

        <div className="md:col-span-2">
          <InputField
            label="Domicilio"
            value={formData.address || ''}
            onChange={(value) =>
              setFormData(prev => ({ ...prev, address: value }))
            }
          />
        </div>
      </FormSection>
    </FormModalLayout>
  );
}