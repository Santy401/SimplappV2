"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  FormModalLayout,
  FormSection,
  InputField,
  SelectField,
  TextareaField,
  CheckboxField,
} from "@simplapp/ui";
import { useProduct } from "@interfaces/src/hooks/features/Products/useProduct";
import {
  CreateProductDto,
  UnitOfMeasure,
} from "@domain/entities/Product.entity";

interface CreateProductProps {
  onBack: () => void;
  initialData?: any;
  mode?: "create" | "edit";
}

type ProductFormData = {
  name: string;
  description: string | null;
  reference: string | null;
  code: string | null;
  type: string;
  categoryProductId: string;
  unit: string;
  taxRate: string;
  trackStock: boolean;
  allowNegativeStock: boolean;
  active: boolean;
  cost: string;
  basePrice: string;
  finalPrice: string;
  goodExcluded: boolean;
  taxExempt: boolean;
  codeBarcode: string | null;
  initialAmount: string;
};

export default function CreateProduct({
  onBack,
  initialData,
  mode = "create",
}: CreateProductProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { createProduct, updateProduct } = useProduct();
  const [isService, setIsService] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof ProductFormData, string>>
  >({});
  const [categories, setCategories] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true); // ✅ Nuevo estado

  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: null,
    reference: null,
    code: null,
    type: "PRODUCT",
    categoryProductId: "",
    unit: UnitOfMeasure.UNIT,
    taxRate: "0",
    trackStock: false,
    allowNegativeStock: false,
    active: true,
    cost: "",
    basePrice: "",
    finalPrice: "",
    goodExcluded: false,
    taxExempt: false,
    codeBarcode: null,
    initialAmount: "0",
    ...initialData,
  });

  useEffect(() => {
    if (initialData) {
      const { id, ...formDataFields } = initialData;
      setFormData((prev) => ({
        ...prev,
        ...(formDataFields as ProductFormData),
      }));
    }
  }, [initialData]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsCategoriesLoading(true);
        const categoriesResponse = await fetch("/api/categories");

        if (!categoriesResponse.ok) {
          const errorText = await categoriesResponse.text();
          console.error("❌ Categories error:", errorText);
          throw new Error(`Error ${categoriesResponse.status}: ${errorText}`);
        }

        const categoriesData = await categoriesResponse.json();

        setCategories(categoriesData);

        if (categoriesData.length > 0 && !formData.categoryProductId) {
          setFormData((prev) => ({
            ...prev,
            categoryProductId: categoriesData[0].id,
          }));
        } else if (categoriesData.length === 0) {
          toast.warning("No hay categorías disponibles. Crea una primero.");
        }
      } catch (error) {
        console.error("💥 Error loading categories:", error);
        toast.error(
          "Error al cargar categorías: " +
          (error instanceof Error ? error.message : "Unknown"),
        );
      } finally {
        setIsCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);
  useEffect(() => {
    const basePrice = parseFloat(formData.basePrice) || 0;
    const taxRate = parseFloat(formData.taxRate) || 0;

    if (basePrice > 0) {
      const finalPrice = basePrice + (basePrice * taxRate) / 100;
      setFormData((prev) => ({
        ...prev,
        finalPrice: finalPrice.toFixed(2),
      }));
    }
  }, [formData.basePrice, formData.taxRate]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ProductFormData, string>> = {};

    if (!formData.name?.trim()) {
      newErrors.name = "El nombre es obligatorio";
    }
    if (!formData.categoryProductId) {
      newErrors.categoryProductId = "Debe seleccionar una categoría";
    }
    if (!formData.taxRate?.trim()) {
      newErrors.taxRate = "La tasa de impuesto es obligatoria";
    }
    if (formData.type === "PRODUCT" && !formData.cost) {
      newErrors.cost = "El costo es obligatorio para productos";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const transformToCreateProductDto = (
    formData: ProductFormData,
  ): CreateProductDto => {
    const getUnitOfMeasure = (unit: string): UnitOfMeasure => {
      const unitMap: Record<string, UnitOfMeasure> = {
        UNIDAD: UnitOfMeasure.UNIT,
        PAR: UnitOfMeasure.PAIR,
        CAJA: UnitOfMeasure.BOX,
        BOTELLA: UnitOfMeasure.BOTTLE,
        CENTIMETRO: UnitOfMeasure.CENTIMETER,
        CENTIMETRO_CUADRADO: UnitOfMeasure.SQUARE_CENTIMETER,
        METRO_CUADRADO: UnitOfMeasure.SQUARE_METER,
        PULGADA: UnitOfMeasure.INCH,
        MILILITRO: UnitOfMeasure.MILLILITER,
        LITRO: UnitOfMeasure.LITER,
        GALON: UnitOfMeasure.GALLON,
        METRO_CUBICO: UnitOfMeasure.CUBIC_METER,
        GRAMO: UnitOfMeasure.GRAM,
        KILOGRAMO: UnitOfMeasure.KILOGRAM,
        TONELADA: UnitOfMeasure.TON,
        LIBRA: UnitOfMeasure.POUND,
        HORA: UnitOfMeasure.HOUR,
        MINUTO: UnitOfMeasure.MINUTE,
        DIA: UnitOfMeasure.DAY,
      };
      return unitMap[unit] || UnitOfMeasure.UNIT;
    };

    return {
      name: formData.name,
      type: formData.type,
      category: formData.categoryProductId,
      unitOfMeasure: getUnitOfMeasure(formData.unit),
      reference: formData.reference,
      codeProduct: formData.code,
      costForUnit: formData.cost ? parseFloat(formData.cost) : null,
      basePrice: parseFloat(formData.basePrice) || 0,
      taxRate: formData.taxRate,
      description: formData.description,
      active: formData.active,
      valuePrice: parseFloat(formData.finalPrice) || 0,
    };
  };

  const hiddenChecks = () => {
    if (formData.type === "SERVICE") {
      setIsService(true);
    } else {
      setIsService(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Por favor, complete todos los campos obligatorios");
      return;
    }

    setIsLoading(true);
    try {
      const productDto = transformToCreateProductDto(formData);

      if (mode === "create") {
        const result = await createProduct(productDto);

        if (result) {
          toast.success("Producto creado exitosamente");
          handleCancel();
        } else {
          toast.error("Error al crear el producto");
        }
      } else {
        if (!initialData?.id) {
          toast.error("ID del producto no encontrado");
          return;
        }

        const result = await updateProduct(initialData.id, productDto);

        if (result) {
          toast.success("Producto actualizado exitosamente");
          handleCancel();
        } else {
          toast.error("Error al actualizar el producto");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al procesar la solicitud");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (onBack) {
      onBack();
    }
  };

  const typeOptions = [
    { value: "PRODUCT", label: "Producto" },
    { value: "SERVICE", label: "Servicio" },
    { value: "COMBO", label: "Combo" },
    { value: "VARIANT", label: "Variante" },
  ];

  const unitOptions = [
    { value: UnitOfMeasure.UNIT, label: "Unidad" },
    { value: UnitOfMeasure.PAIR, label: "Par" },
    { value: UnitOfMeasure.BOX, label: "Caja" },
    { value: UnitOfMeasure.BOTTLE, label: "Botella" },
    { value: UnitOfMeasure.CENTIMETER, label: "Centímetro" },
    { value: UnitOfMeasure.SQUARE_CENTIMETER, label: "Centímetro²" },
    { value: UnitOfMeasure.SQUARE_METER, label: "Metro²" },
    { value: UnitOfMeasure.INCH, label: "Pulgada" },
    { value: UnitOfMeasure.MILLILITER, label: "Mililitro" },
    { value: UnitOfMeasure.LITER, label: "Litro" },
    { value: UnitOfMeasure.GALLON, label: "Galón" },
    { value: UnitOfMeasure.CUBIC_METER, label: "Metro³" },
    { value: UnitOfMeasure.GRAM, label: "Gramo" },
    { value: UnitOfMeasure.KILOGRAM, label: "Kilogramo" },
    { value: UnitOfMeasure.TON, label: "Tonelada" },
    { value: UnitOfMeasure.POUND, label: "Libra" },
    { value: UnitOfMeasure.HOUR, label: "Hora" },
    { value: UnitOfMeasure.MINUTE, label: "Minuto" },
    { value: UnitOfMeasure.DAY, label: "Día" },
  ];

  const taxRateOptions = [
    { value: "0", label: "0%" },
    { value: "5", label: "5%" },
    { value: "19", label: "19%" },
  ];

  return (
    <FormModalLayout
      title={mode === "create" ? "Crear Nuevo Producto" : "Editar Producto"}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      submitLabel={mode === "create" ? "Crear Producto" : "Actualizar Producto"}
      isLoading={isLoading}
      maxWidth="4xl"
      showMoreOptions={false}
    >
      <FormSection columns={1} gap="md">
        <InputField
          label="Nombre"
          required
          value={formData.name}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, name: value }))
          }
          error={errors.name}
          placeholder="Nombre del producto"
        />
      </FormSection>

      <FormSection columns={2} gap="md">
        <SelectField
          label="Categoría"
          required
          value={formData.categoryProductId}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, categoryProductId: value }))
          }
          options={
            isCategoriesLoading
              ? [{ value: "loading", label: "Cargando categorías..." }]
              : categories.length === 0
                ? [
                  {
                    value: "no-categories",
                    label: "No hay categorías disponibles",
                  },
                ]
                : categories.map((cat) => ({
                  value: cat.id,
                  label: cat.name,
                }))
          }
          error={errors.categoryProductId}
          disabled={isCategoriesLoading || categories.length === 0}
        />

        <SelectField
          label="Tipo"
          required
          value={formData.type}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, type: value }))
          }
          options={typeOptions}
        />

        <SelectField
          label="Unidad de Medida"
          required
          value={formData.unit}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, unit: value }))
          }
          options={unitOptions}
        />

        <InputField
          label="Referencia"
          value={formData.reference || ""}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, reference: value }))
          }
          placeholder="Referencia del producto"
        />

        <InputField
          label="Código del producto o servicio"
          value={formData.code || ""}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, code: value }))
          }
          placeholder="Buscar..."
        />
      </FormSection>

      <FormSection columns={4} gap="md">
        <InputField
          label="Costo por unidad"
          required={formData.type === "PRODUCT"}
          value={formData.cost}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, cost: value }))
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
            setFormData((prev) => ({ ...prev, basePrice: value }))
          }
          placeholder="0.00"
          className="w-50 mr-4"
        />

        <SelectField
          label="Impuesto"
          required
          value={formData.taxRate}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, taxRate: value }))
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
            setFormData((prev) => ({ ...prev, finalPrice: value }))
          }
          placeholder="0.00"
        />
      </FormSection>

      <FormSection columns={1} gap="md">
        <TextareaField
          label="Descripción"
          value={formData.description || ""}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, description: value }))
          }
          rows={4}
          placeholder="Descripción del producto..."
        />
      </FormSection>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">Opciones de Inventario</h3>
        <FormSection columns={3} gap="md">
          {formData.type === "PRODUCT" && (
            <>
              <CheckboxField
                label="Controlar Stock"
                checked={formData.trackStock}
                onChange={(checked) =>
                  setFormData((prev) => ({ ...prev, trackStock: checked }))
                }
              />

              <CheckboxField
                label="Permitir Stock Negativo"
                checked={formData.allowNegativeStock}
                onChange={(checked) =>
                  setFormData((prev) => ({ ...prev, allowNegativeStock: checked }))
                }
              />
            </>
          ) || (
              <></>
            )}
          <CheckboxField
            label="Producto Activo"
            checked={formData.active}
            onChange={(checked) =>
              setFormData((prev) => ({ ...prev, active: checked }))
            }
          />
        </FormSection>
      </div>
    </FormModalLayout>
  );
}
