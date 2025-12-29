-- Insert default product categories
INSERT INTO "CategoryProduct" (name, description) VALUES
('General', 'Categoría general para productos sin clasificación específica'),
('Electrónica', 'Productos electrónicos y tecnológicos'),
('Ropa y Accesorios', 'Prendas de vestir y accesorios'),
('Alimentos y Bebidas', 'Productos alimenticios y bebidas'),
('Hogar y Jardín', 'Artículos para el hogar y jardinería'),
('Servicios', 'Servicios profesionales y técnicos')
ON CONFLICT DO NOTHING;
