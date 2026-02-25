/**
 * Email Service — Simplapp V2
 * ──────────────────────────────────────────────────────────
 * Powered by Resend (https://resend.com)
 *
 * Para usar en local: agrega RESEND_API_KEY en .env
 * En producción: configurar en variables de entorno de Vercel
 *
 * Si RESEND_API_KEY no está configurada, los emails se logean en consola
 * (modo desarrollo sin configurar Resend).
 */
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 'RESEND_NOT_CONFIGURED');

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Simplapp <no-reply@simplapp.com.co>';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// ─── Types ────────────────────────────────────────────────────────────────────

interface EmailResult {
    success: boolean;
    error?: string;
}

// ─── Templates ────────────────────────────────────────────────────────────────

function passwordResetTemplate(userName: string, resetUrl: string, country: string): string {
    return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Recuperar contraseña — Simplapp</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f7;padding:40px 20px;">
    <tr><td align="center">
      <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#7c3aed,#4f46e5);padding:32px;text-align:center;">
            <div style="width:44px;height:44px;background:rgba(255,255,255,0.2);border-radius:10px;display:inline-flex;align-items:center;justify-content:center;font-weight:700;font-size:20px;color:#fff;margin-bottom:12px;">S</div>
            <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;">Simplapp</h1>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:36px 40px;">
            <h2 style="margin:0 0 12px;font-size:20px;color:#111827;">Hola, ${userName} 👋</h2>
            <p style="margin:0 0 20px;color:#6b7280;font-size:15px;line-height:1.6;">
              Recibimos una solicitud para restablecer la contraseña de tu cuenta en Simplapp.
              Si no fuiste tú, puedes ignorar este correo con total seguridad.
            </p>
            <p style="margin:0 0 28px;color:#6b7280;font-size:15px;line-height:1.6;">
              Este enlace expirará en <strong style="color:#111827;">1 hora</strong>.
            </p>
            <!-- CTA Button -->
            <table cellpadding="0" cellspacing="0" width="100%">
              <tr><td align="center">
                <a href="${resetUrl}"
                   style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#4f46e5);color:#ffffff;padding:14px 32px;border-radius:10px;font-weight:600;font-size:15px;text-decoration:none;letter-spacing:-0.01em;">
                  Restablecer contraseña
                </a>
              </td></tr>
            </table>
            <!-- Fallback URL -->
            <p style="margin:24px 0 0;color:#9ca3af;font-size:12px;line-height:1.5;word-break:break-all;">
              ¿El botón no funciona? Copia y pega este enlace en tu navegador:<br />
              <span style="color:#7c3aed;">${resetUrl}</span>
            </p>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="padding:20px 40px;border-top:1px solid #f3f4f6;text-align:center;">
            <p style="margin:0;color:#d1d5db;font-size:11px;">
              © ${new Date().getFullYear()} Simplapp · Colombia · Este email fue enviado a la dirección asociada a tu cuenta.
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`.trim();
}

function welcomeTemplate(userName: string, country: string): string {
    const loginUrl = `${APP_URL}/${country}/Login/`;
    return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Bienvenido a Simplapp</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f7;padding:40px 20px;">
    <tr><td align="center">
      <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <tr>
          <td style="background:linear-gradient(135deg,#7c3aed,#4f46e5);padding:32px;text-align:center;">
            <div style="width:44px;height:44px;background:rgba(255,255,255,0.2);border-radius:10px;display:inline-flex;align-items:center;justify-content:center;font-weight:700;font-size:20px;color:#fff;margin-bottom:12px;">S</div>
            <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;">¡Bienvenido a Simplapp!</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:36px 40px;">
            <h2 style="margin:0 0 12px;font-size:20px;color:#111827;">Hola, ${userName} 🎉</h2>
            <p style="margin:0 0 20px;color:#6b7280;font-size:15px;line-height:1.6;">
              Tu cuenta ha sido creada exitosamente. Ya puedes gestionar tu facturación, clientes,
              productos y más desde un solo lugar.
            </p>
            <table cellpadding="0" cellspacing="0" width="100%">
              <tr><td align="center">
                <a href="${loginUrl}"
                   style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#4f46e5);color:#ffffff;padding:14px 32px;border-radius:10px;font-weight:600;font-size:15px;text-decoration:none;">
                  Ir a mi cuenta
                </a>
              </td></tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 40px;border-top:1px solid #f3f4f6;text-align:center;">
            <p style="margin:0;color:#d1d5db;font-size:11px;">
              © ${new Date().getFullYear()} Simplapp · Colombia
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`.trim();
}

// ─── Funciones públicas ───────────────────────────────────────────────────────

/**
 * Envía un email de restablecimiento de contraseña.
 */
export async function sendPasswordResetEmail(
    to: string,
    userName: string,
    resetToken: string,
    country: string = 'colombia'
): Promise<EmailResult> {
    const resetUrl = `${APP_URL}/${country}/ResetPassword/?token=${resetToken}`;

    // Si no hay API key configurada, logeamos en consola (desarrollo sin Resend)
    if (!process.env.RESEND_API_KEY) {
        console.log(`[EMAIL DEV] Password reset para ${to}`);
        console.log(`[EMAIL DEV] Reset URL: ${resetUrl}`);
        return { success: true };
    }

    try {
        const { error } = await resend.emails.send({
            from: FROM_EMAIL,
            to,
            subject: 'Restablece tu contraseña — Simplapp',
            html: passwordResetTemplate(userName, resetUrl, country),
        });

        if (error) {
            console.error('[EMAIL] Error enviando reset email:', error);
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (err) {
        console.error('[EMAIL] Error inesperado:', err);
        return { success: false, error: 'Error al enviar el correo' };
    }
}

/**
 * Envía email de bienvenida al registrarse.
 */
export async function sendWelcomeEmail(
    to: string,
    userName: string,
    country: string = 'colombia'
): Promise<EmailResult> {
    if (!process.env.RESEND_API_KEY) {
        console.log(`[EMAIL DEV] Bienvenida para ${to} (${userName})`);
        return { success: true };
    }

    try {
        const { error } = await resend.emails.send({
            from: FROM_EMAIL,
            to,
            subject: '¡Bienvenido a Simplapp! 🎉',
            html: welcomeTemplate(userName, country),
        });

        if (error) {
            console.error('[EMAIL] Error enviando welcome email:', error);
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (err) {
        console.error('[EMAIL] Error inesperado:', err);
        return { success: false, error: 'Error al enviar el correo' };
    }
}
