-- Insert default product categories
INSERT INTO "CategoryProduct" (id, name, description) VALUES
(1, 'General', 'Categoría general para productos sin clasificación específica'),
(2, 'Electrónica', 'Productos electrónicos y tecnológicos'),
(3, 'Ropa y Accesorios', 'Prendas de vestir y accesorios'),
(4, 'Alimentos y Bebidas', 'Productos alimenticios y bebidas'),
(5, 'Hogar y Jardín', 'Artículos para el hogar y jardinería'),
(6, 'Servicios', 'Servicios profesionales y técnicos')
ON CONFLICT (id) DO NOTHING;