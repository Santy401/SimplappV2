# Interface Design System - SimplappV2

## Direction & Feel
- **Product type**: SaaS de facturación y gestión empresarial para PYMES colombianas
- **Feel**: Professional pero accesible, como un asistente contable moderno
- **Density**: Media - información organizada pero no saturada

## Depth Strategy
- **Approach**: Bordes sutiles + surface color shifts
- **Borders**: 
  - Separación estándar: `border-slate-200`
  - Énfasis: `border-slate-300`
- **Elevation**: 
  - Cards: `bg-card` (usa tokens de Tailwind)
  - Modals: Sombras sutiles `shadow-xl`

## Spacing
- **Base unit**: 4px (Tailwind default)
- **Spacing scale**:
  - Micro: 1-2 (icon gaps)
  - Component: 3-4 (within cards/buttons)
  - Section: 6-8 (between groups)
  - Major: 12-16 (between distinct areas)

## Key Component Patterns

### Tables (ModernTable)
- Skeleton loading: 8 rows, 7 columns
- Empty state: Icon + title + description + action
- Pagination: 10 items per page default

### Status Badges
- **Pattern**: `px-2 py-1 rounded-full text-xs font-medium`
- **Colors**:
  - Success/Paid: `bg-green-100 text-green-700`
  - Warning/Pending: `bg-yellow-100 text-yellow-700`
  - Error/Cancelled: `bg-red-100 text-red-700`
  - Info/Issued: `bg-blue-100 text-blue-700`
  - Draft: `bg-gray-100 text-gray-700`

### Type Badges (Credit Notes)
- **RETURN**: `bg-blue-100 text-blue-700` + RotateCcw icon
- **DISCOUNT**: `bg-purple-100 text-purple-700` + Percent icon
- **PRICE_ADJUSTMENT**: `bg-orange-100 text-orange-700` + DollarSign icon

### Money Display
- **Negative/Credit**: `text-red-600 font-medium` (con `-` prefix)
- **Positive**: `font-medium` (black default)

### Modals
- **Overlay**: `bg-black/50`
- **Container**: `bg-white rounded-2xl shadow-xl`
- **Header**: `p-6 border-b`
- **Footer**: `p-6 border-t flex justify-between`

### Forms
- **Stepper**: 3 steps max, circles with connecting lines
- **Selection cards**: Hover border + background color change
- **Checkbox + quantity**: Inline layout for line items

## Color Palette
- **Primary**: `#6C47FF` (purple-600)
- **Success**: Green
- **Warning**: Yellow/Amber
- **Error**: Red
- **Neutral**: Slate grays

## Typography
- **Headings**: font-semibold
- **Body**: font-normal
- **Labels**: text-sm font-medium
- **Data**: tabular numbers where important

## Notes
- Siempre incluir loading states ( skeletons )
- Usar toast para feedback de acciones
- Confirmar destrucciones (cancel/delete)
- Animations: `animate-in fade-in duration-300`
