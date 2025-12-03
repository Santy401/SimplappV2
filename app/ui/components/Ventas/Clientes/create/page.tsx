'use client';

import { useEffect, useState } from 'react';
import { ChevronDown, ChevronRight, Printer, Paperclip, History } from 'lucide-react';
import { Button } from '@/app/ui/cn/components/ui/button';
import { Input } from '@/app/ui/cn/components/ui/input';
import { Label } from '@/app/ui/cn/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/ui/cn/components/ui/select';
import { Checkbox } from '@/app/ui/cn/components/ui/checkbox';
import { Textarea } from '@/app/ui/cn/components/ui/textarea';
import { Client, CreateClientDto, OrganizationType, IdentificationType } from '@/domain/entities/Client.entity';
import { toast } from 'sonner';

interface CreateClientProps {
    onBack?: () => void;
}

// Define un tipo para el formulario que excluya los campos no editables
type ClientFormData = Omit<CreateClientDto, 'id' | 'createdAt' | 'updatedAt' | 'bills'>;

export function CreateClient({ onBack }: CreateClientProps) {
    const [responsabilidadesOpen, setResponsabilidadesOpen] = useState(false);
    const [opcionesOpen, setOpcionesOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Inicializa con valores por defecto
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
    });

    const [errors, setErrors] = useState<Partial<Record<keyof ClientFormData, string>>>({});

    // Función corregida para manejar cambios
    const handleInputChange = <K extends keyof ClientFormData>(
        field: K,
        value: ClientFormData[K]
    ) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    // Función específica para enums
    const handleEnumChange = (field: 'organizationType' | 'identificationType', value: string) => {
        if (field === 'organizationType') {
            setFormData(prev => ({
                ...prev,
                organizationType: value as OrganizationType
            }));
        } else if (field === 'identificationType') {
            setFormData(prev => ({
                ...prev,
                identificationType: value as IdentificationType
            }));
        }
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    // Función específica para strings (para inputs normales)
    const handleStringChange = (field: keyof Pick<ClientFormData,
        | 'firstLastName'
        | 'secondLastName'
        | 'firstName'
        | 'otherNames'
        | 'commercialName'
        | 'code'
        | 'identificationNumber'
        | 'email'
        | 'phone'
        | 'country'
        | 'department'
        | 'municipality'
        | 'postalCode'
        | 'address'
        | 'observations'
    >, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    // Función específica para booleanos
    const handleBooleanChange = (field: 'includeCcBcc' | 'is_supplier' | 'it_branches', value: boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<Record<keyof ClientFormData, string>> = {};

        if (!formData.firstLastName?.trim()) {
            newErrors.firstLastName = 'Campo obligatorio';
        }
        if (!formData.firstName?.trim()) {
            newErrors.firstName = 'Campo obligatorio';
        }
        if (!formData.identificationNumber?.trim()) {
            newErrors.identificationNumber = 'Campo obligatorio';
        }
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Email inválido';
        }
        if (!formData.country?.trim()) {
            newErrors.country = 'Campo obligatorio';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    useEffect(() => {
        // Verificar localStorage primero
        const storedTheme = localStorage.getItem('theme');

        if (storedTheme === 'dark') {
            setIsDarkMode(true);
            document.documentElement.classList.add('dark');
        } else if (storedTheme === 'light') {
            setIsDarkMode(false);
            document.documentElement.classList.remove('dark');
        } else {
            // Verificar preferencia del sistema
            const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setIsDarkMode(systemDark);
            if (systemDark) {
                document.documentElement.classList.add('dark');
            }
        }
    }, []);

    const toggleDarkMode = () => {
        const newDarkMode = !isDarkMode;
        setIsDarkMode(newDarkMode);

        if (newDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }

        toast.success(`Modo ${newDarkMode ? 'oscuro' : 'claro'} activado`);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            console.log('Form data:', formData);
            toast.success('Cliente creado exitosamente');

            // Crear objeto completo para guardar
            const newClient: CreateClientDto = {
                ...formData,
                id: 0, // El backend asignará el ID real
                bills: [],
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            // Guardar en localStorage
            const clients = JSON.parse(localStorage.getItem('clients') || '[]');
            clients.push(newClient);
            localStorage.setItem('clients', JSON.stringify(clients));

            // Resetear formulario después de guardar
            handleCancel();
        } else {
            toast.error('Por favor, complete todos los campos obligatorios');
        }
    };

    const handleCancel = () => {
        setFormData({
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
        });
        setErrors({});
        toast.info('Formulario cancelado');

        if (onBack) {
            onBack();
        }
    };

    // Mapeo de valores para el select
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
    ];

    return (
        <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
            <div className='mt-3'>
                <div className="max-w-5xl mx-auto px-1 py-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-foreground">Crear Nuevo Cliente</h1>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                                <Printer className="w-4 h-4 mr-2" />
                                Imprimir
                            </Button>
                            <Button variant="outline" size="sm">
                                <Paperclip className="w-4 h-4 mr-2" />
                                Adjuntar
                            </Button>
                            <Button variant="outline" size="sm">
                                <History className="w-4 h-4 mr-2" />
                                Ver Historial
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-8 py-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="bg-card border border-border rounded-lg p-6 space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            {/* Tipo de Organización */}
                            <div className="space-y-2">
                                <Label htmlFor="organizationType">
                                    Tipo de Organización
                                </Label>
                                <Select
                                    value={formData.organizationType}
                                    onValueChange={(value) => handleEnumChange('organizationType', value)}
                                >
                                    <SelectTrigger id="organizationType">
                                        <SelectValue placeholder="Seleccione tipo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {organizationTypeOptions.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Primer Apellido */}
                            <div className="space-y-2">
                                <Label htmlFor="firstLastName">
                                    Primer Apellido <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="firstLastName"
                                    value={formData.firstLastName || ''}
                                    onChange={(e) => handleStringChange('firstLastName', e.target.value)}
                                    className={errors.firstLastName ? 'border-destructive' : ''}
                                />
                                {errors.firstLastName && (
                                    <p className="text-sm text-destructive">{errors.firstLastName}</p>
                                )}
                            </div>

                            {/* Segundo Apellido */}
                            <div className="space-y-2">
                                <Label htmlFor="secondLastName">Segundo Apellido</Label>
                                <Input
                                    id="secondLastName"
                                    value={formData.secondLastName || ''}
                                    onChange={(e) => handleStringChange('secondLastName', e.target.value)}
                                />
                            </div>

                            {/* Primer Nombre */}
                            <div className="space-y-2">
                                <Label htmlFor="firstName">
                                    Primer Nombre <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="firstName"
                                    value={formData.firstName || ''}
                                    onChange={(e) => handleStringChange('firstName', e.target.value)}
                                    className={errors.firstName ? 'border-destructive' : ''}
                                />
                                {errors.firstName && (
                                    <p className="text-sm text-destructive">{errors.firstName}</p>
                                )}
                            </div>

                            {/* Otros Nombres */}
                            <div className="space-y-2">
                                <Label htmlFor="otherNames">Otros Nombres</Label>
                                <Input
                                    id="otherNames"
                                    value={formData.otherNames || ''}
                                    onChange={(e) => handleStringChange('otherNames', e.target.value)}
                                />
                            </div>

                            {/* Nombre Comercial */}
                            <div className="space-y-2">
                                <Label htmlFor="commercialName">Nombre Comercial</Label>
                                <Input
                                    id="commercialName"
                                    value={formData.commercialName || ''}
                                    onChange={(e) => handleStringChange('commercialName', e.target.value)}
                                />
                            </div>

                            {/* Código */}
                            <div className="space-y-2">
                                <Label htmlFor="code">Código</Label>
                                <Input
                                    id="code"
                                    value={formData.code || ''}
                                    onChange={(e) => handleStringChange('code', e.target.value)}
                                    placeholder="Auto-generado"
                                />
                            </div>

                            {/* Tipo de Identificación */}
                            <div className="space-y-2">
                                <Label htmlFor="identificationType">
                                    Tipo de Identificación <span className="text-destructive">*</span>
                                </Label>
                                <Select
                                    value={formData.identificationType}
                                    onValueChange={(value) => handleEnumChange('identificationType', value)}
                                >
                                    <SelectTrigger id="identificationType">
                                        <SelectValue placeholder="Seleccione tipo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {identificationTypeOptions.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* N° de Identificación */}
                            <div className="space-y-2">
                                <Label htmlFor="identificationNumber">
                                    N° de Identificación <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="identificationNumber"
                                    value={formData.identificationNumber || ''}
                                    onChange={(e) => handleStringChange('identificationNumber', e.target.value)}
                                    className={errors.identificationNumber ? 'border-destructive' : ''}
                                />
                                {errors.identificationNumber && (
                                    <p className="text-sm text-destructive">{errors.identificationNumber}</p>
                                )}
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email || ''}
                                    onChange={(e) => handleStringChange('email', e.target.value)}
                                    className={errors.email ? 'border-destructive' : ''}
                                />
                                {errors.email && (
                                    <p className="text-sm text-destructive">{errors.email}</p>
                                )}
                            </div>

                            {/* Incluir Cc/Cco */}
                            <div className="flex items-center space-x-2 pt-8">
                                <Checkbox
                                    id="includeCcBcc"
                                    checked={formData.includeCcBcc}
                                    onCheckedChange={(checked) => handleBooleanChange('includeCcBcc', checked as boolean)}
                                />
                                <Label htmlFor="includeCcBcc" className="cursor-pointer">
                                    Incluir Cc/Cco
                                </Label>
                            </div>

                            {/* Teléfono */}
                            <div className="space-y-2">
                                <Label htmlFor="phone">Teléfono</Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    value={formData.phone || ''}
                                    onChange={(e) => handleStringChange('phone', e.target.value)}
                                />
                            </div>

                            {/* País */}
                            <div className="space-y-2">
                                <Label htmlFor="country">
                                    País <span className="text-destructive">*</span>
                                </Label>
                                <Select
                                    value={formData.country}
                                    onValueChange={(value) => handleStringChange('country', value)}
                                >
                                    <SelectTrigger id="country">
                                        <SelectValue placeholder="Seleccione país" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {countryOptions.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.country && (
                                    <p className="text-sm text-destructive">{errors.country}</p>
                                )}
                            </div>

                            {/* Departamento */}
                            <div className="space-y-2">
                                <Label htmlFor="department">Departamento</Label>
                                <Input
                                    id="department"
                                    value={formData.department || ''}
                                    onChange={(e) => handleStringChange('department', e.target.value)}
                                />
                            </div>

                            {/* Municipio */}
                            <div className="space-y-2">
                                <Label htmlFor="municipality">Municipio</Label>
                                <Input
                                    id="municipality"
                                    value={formData.municipality || ''}
                                    onChange={(e) => handleStringChange('municipality', e.target.value)}
                                />
                            </div>

                            {/* Código Postal */}
                            <div className="space-y-2">
                                <Label htmlFor="postalCode">Código Postal</Label>
                                <Input
                                    id="postalCode"
                                    value={formData.postalCode || ''}
                                    onChange={(e) => handleStringChange('postalCode', e.target.value)}
                                />
                            </div>

                            {/* Domicilio */}
                            <div className="space-y-2 col-span-2">
                                <Label htmlFor="address">Domicilio</Label>
                                <Input
                                    id="address"
                                    value={formData.address || ''}
                                    onChange={(e) => handleStringChange('address', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Más Opciones */}
                    <div className="bg-card border border-border rounded-lg overflow-hidden">
                        <button
                            type="button"
                            onClick={() => setOpcionesOpen(!opcionesOpen)}
                            className="w-full flex items-center justify-between p-4 hover:bg-accent transition-colors"
                        >
                            <span className="font-medium text-foreground flex items-center gap-2">
                                {opcionesOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                Más Opciones
                            </span>
                        </button>

                        {opcionesOpen && (
                            <div className="p-6 border-t border-border space-y-6">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="is_supplier"
                                        checked={formData.is_supplier}
                                        onCheckedChange={(checked) => handleBooleanChange('is_supplier', checked as boolean)}
                                    />
                                    <Label htmlFor="is_supplier" className="cursor-pointer">
                                        Es Proveedor
                                    </Label>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="it_branches"
                                        checked={formData.it_branches}
                                        onCheckedChange={(checked) => handleBooleanChange('it_branches', checked as boolean)}
                                    />
                                    <Label htmlFor="it_branches" className="cursor-pointer">
                                        Posee Sucursales
                                    </Label>
                                </div>

                                {/* Observaciones */}
                                <div className="space-y-2">
                                    <Label htmlFor="observations">Observaciones</Label>
                                    <Textarea
                                        id="observations"
                                        value={formData.observations || ''}
                                        onChange={(e) => handleStringChange('observations', e.target.value)}
                                        rows={4}
                                        className="resize-none"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Botones de acción */}
                    <div className="flex justify-end gap-3">
                        <Button type="button" variant="outline" onClick={handleCancel}>
                            Cancelar
                        </Button>
                        <Button type="button" variant="destructive">
                            Eliminar
                        </Button>
                        <Button type="submit">
                            Guardar
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}