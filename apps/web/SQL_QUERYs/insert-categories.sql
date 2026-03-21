-- Insert default product categories
INSERT INTO "CategoryProduct" (id, name, description, "companyId")
SELECT 
  v.id, v.name, v.description, c.id
FROM (VALUES 
  ('1', 'General', 'Categoría general para productos sin clasificación específica'),
  ('2', 'Electrónica', 'Productos electrónicos y tecnológicos'),
  ('3', 'Ropa y Accesorios', 'Prendas de vestir y accesorios'),
  ('4', 'Alimentos y Bebidas', 'Productos alimenticios y bebidas'),
  ('5', 'Hogar y Jardín', 'Artículos para el hogar y jardinería'),
  ('6', 'Servicios', 'Servicios profesionales y técnicos')
) AS v(id, name, description)
CROSS JOIN (SELECT id FROM "Company" LIMIT 1) AS c
ON CONFLICT (id) DO NOTHING;