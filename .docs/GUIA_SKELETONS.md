# Guía de Cargas Skeleton (Skeletons) en Simplapp V2

## 🌟 ¿Qué es un Skeleton?
Un Skeleton es un estado de carga visual que imita la estructura del contenido final (como tablas o tarjetas) mientras los datos se cargan desde el servidor. Proporciona una experiencia mucho mejor que una pantalla en blanco o un simple spinner, ya que reduce la ansiedad del usuario al mostrar que la aplicación está trabajando.

---

## 🛠️ Componentes Disponibles
En el paquete `@simplapp/ui`, tenemos varios componentes listos para usar:

1.  **`Skeleton` (Atom)**: Un bloque básico pulsante.
    -   Uso: `<Skeleton className="h-4 w-[200px]" />`
2.  **`DataTableSkeleton` (Molecule)**: Un esqueleto completo que imita una tabla con sus cabeceras y filas.
    -   Uso: `<DataTableSkeleton />`
3.  **`PageSkeleton` (Molecule)**: Estructura básica de una página (título + contenido).

---

## 🚀 Cómo Implementar un Skeleton en una Nueva Vista

### 1. Preparar el Componente
Importa los skeletons desde el paquete de UI:

```tsx
import { Skeleton, DataTableSkeleton } from '@simplapp/ui'
```

### 2. Definir el Estado de Carga
Normalmente, el estado de carga vendrá de tu hook de datos (React Query):

```tsx
const { data, isLoading } = useMyData();
```

### 3. Crear el "Esqueleto" de la Página
Dentro de tu componente, antes del `return` principal, maneja el estado `isLoading`. 

**Tip de Diseño**: Intenta que el skeleton coincida exactamente con los márgenes y estructura del contenido final.

```tsx
if (isLoading) {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Skeleton del Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <Skeleton className="h-9 w-32" /> {/* Título */}
          <Skeleton className="h-5 w-64 mt-2" /> {/* Subtítulo */}
        </div>
        <Skeleton className="h-10 w-28 rounded-lg" /> {/* Botón */}
      </div>

      {/* Skeleton de la Tabla o Contenido */}
      <DataTableSkeleton />
    </div>
  );
}
```

---

## 🎨 Best Practices
-   **Coherencia**: Usa el mismo contenedor (ej. `max-w-5xl mx-auto`) tanto en el skeleton como en la página real para evitar saltos visuales.
-   **No exagerar**: No todos los botones necesitan ser skeletons. A veces basta con ocultarlos o deshabilitarlos si el layout general ya muestra carga.
-   **Animación**: El componente `Skeleton` ya incluye `animate-pulse` por defecto. No necesitas añadir animaciones extra.

---

## 🔍 Ejemplo Real
Puedes ver un ejemplo de implementación pulida en:
`apps/web/app/(dashboard)/Sales/Clients/pages.tsx`
