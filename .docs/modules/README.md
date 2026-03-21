# 📦 Documentación de Módulos (Features)

Este directorio contiene la documentación técnica, funcional y arquitectónica de los principales módulos y características del sistema Simplapp V2.

Cada módulo cuenta con su propio subdirectorio donde se especifican:
- **Modelo de Datos** (Entidad de dominio)
- **Rutas y API** (Integraciones con base de datos y clientes)
- **Lógica de Negocio** (Estados, casos de uso)
- **Integraciones** (ej. DIAN, Pagos)

---

## 📚 Índice de Módulos

### 1. 🧾 Facturación (`bill`)
Módulo encargado de la creación, emisión, anulación y gestión de facturas de venta, incluyendo el ciclo de vida comercial y la integración de facturación electrónica (DIAN).
- [Visión General](./bill/overview.md)
- [Ciclo de Vida y Estados](./bill/states.md)
- [Rutas y Endpoints](./bill/api_routes.md)
