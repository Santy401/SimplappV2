export const DIAN_ERROR_MESSAGES: Record<string, string> = {
  'FAD01': 'NIT del emisor no autorizado para facturación electrónica',
  'FAD02': 'CUFE inválido o duplicado',
  'FAD03': 'Numeración de factura fuera de rango autorizado',
  'FAD04': 'Fecha de emisión fuera del rango permitido',
  'FAD05': 'NIT del receptor no válido',
  'FAD06': 'Valor total no coincide con suma de items',
  'FAD07': 'Impuesto calculado incorrectamente',
  'FAD08': 'XML mal formado o no cumple esquema',
  'FAD09': 'Certificado digital vencido o inválido',
  'FAD10': 'Resolución de facturación vencida',
};

export const getFriendlyDianMessage = (errorCode: string): string => {
  return DIAN_ERROR_MESSAGES[errorCode] || 'Error desconocido de DIAN. Contacte soporte.';
};
