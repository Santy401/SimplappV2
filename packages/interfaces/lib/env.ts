/**
 * Environment Variables Validation
 * 
 * Este módulo valida que todas las variables de entorno críticas
 * estén configuradas antes de que la aplicación arranque.
 * 
 * Si alguna variable crítica falta, la aplicación lanzará un error
 * con instrucciones claras de cómo configurarla.
 */

function validateEnv() {
    const errors: string[] = [];

    if (!process.env.JWT_SECRET) {
        errors.push(
            '❌ JWT_SECRET no está configurado.\n' +
            '   Genera uno seguro con: openssl rand -base64 32\n' +
            '   Agrégalo a tu archivo .env'
        );
    } else if (process.env.JWT_SECRET === 'default-secret') {
        errors.push(
            '❌ JWT_SECRET está usando el valor por defecto "default-secret".\n' +
            '   Esto es INSEGURO. Genera uno nuevo con: openssl rand -base64 32'
        );
    } else if (process.env.JWT_SECRET.length < 32) {
        errors.push(
            '⚠️  JWT_SECRET es muy corto (mínimo 32 caracteres recomendado).\n' +
            '   Genera uno más seguro con: openssl rand -base64 32'
        );
    }

    if (!process.env.JWT_REFRESH_SECRET) {
        errors.push(
            '❌ JWT_REFRESH_SECRET no está configurado.\n' +
            '   Genera uno seguro con: openssl rand -base64 32\n' +
            '   Agrégalo a tu archivo .env'
        );
    }

    if (!process.env.DATABASE_URL) {
        errors.push(
            '❌ DATABASE_URL no está configurado.\n' +
            '   Formato: postgresql://USER:PASSWORD@HOST:PORT/DATABASE\n' +
            '   Ejemplo: postgresql://postgres:password@localhost:5432/riosbackend'
        );
    }

    if (errors.length > 0) {
        if (process.env.npm_lifecycle_event === 'build' || process.env.NEXT_PHASE === 'phase-production-build') {
            console.warn('⚠️ Omitiendo validación de variables de entorno durante el build de Next.js');
            return;
        }

        console.error('\n╔════════════════════════════════════════════════════════════╗');
        console.error('║  ⚠️  ERROR: Variables de Entorno Faltantes o Inválidas  ⚠️  ║');
        console.error('╚════════════════════════════════════════════════════════════╝\n');

        errors.forEach((error, index) => {
            console.error(`${index + 1}. ${error}\n`);
        });

        console.error('📝 Pasos para corregir:');
        console.error('   1. Copia .env.example a .env: cp .env.example .env');
        console.error('   2. Edita .env y configura las variables');
        console.error('   3. Reinicia el servidor\n');

        throw new Error('Variables de entorno críticas no configuradas');
    }
}

validateEnv();

export const env = {
    JWT_SECRET: process.env.JWT_SECRET as string,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
    DATABASE_URL: process.env.DATABASE_URL as string,
    DIRECT_URL: process.env.DIRECT_URL,
    NODE_ENV: process.env.NODE_ENV || 'development',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
} as const;

if (env.NODE_ENV === 'development') {
    console.log('✅ Variables de entorno validadas correctamente');
    console.log(`   - NODE_ENV: ${env.NODE_ENV}`);
    console.log(`   - JWT_SECRET: ${env.JWT_SECRET.substring(0, 10)}... (${env.JWT_SECRET.length} caracteres)`);
    console.log(`   - DATABASE_URL: ${env.DATABASE_URL.split('@')[1] || 'configurado'}`);
    console.log(`   - APP_URL: ${env.NEXT_PUBLIC_APP_URL}\n`);
}