'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, ArrowRight, Loader2, Mail, Lock, User, Phone, AlertCircle } from 'lucide-react';
import { AuthCard, PasswordStrengthMeter } from './AuthAtoms';
import { cn } from '../../utils/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

type AuthMode = 'login' | 'register';

interface AuthFormProps {
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<any>;
  register: any; 
  isLoading: boolean;
  error?: string | null;
  formErrors?: any; // Agregamos para mostrar errores de campo
}

// ─── Atoms ────────────────────────────────────────────────────────────────────

function InputField({ 
  label, icon: Icon, error, registration, ...props 
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; icon: any; error?: string; registration: any }) {
  return (
    <div className="space-y-1.5 w-full">
      <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">
        {label}
      </label>
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#6C47FF] transition-colors">
          <Icon size={18} />
        </div>
        <input
          {...props}
          {...registration}
          className={cn(
            "w-full h-12 pl-12 pr-4 rounded-2xl border transition-all outline-none text-sm font-medium",
            error 
              ? "border-rose-200 bg-rose-50/30 text-rose-900 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10" 
              : "border-slate-100 bg-slate-50/50 dark:bg-slate-900/50 dark:border-slate-800 focus:border-[#6C47FF] focus:ring-4 focus:ring-[#6C47FF]/10 text-slate-900 dark:text-white"
          )}
        />
      </div>
      {error && (
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[10px] font-bold text-rose-500 ml-1 mt-1 uppercase tracking-tighter"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function AuthForm({ mode, onModeChange, onSubmit, register, isLoading, error, formErrors }: AuthFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordValue, setPasswordValue] = useState('');

  const isLogin = mode === 'login';

  return (
    <AuthCard>
      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        >
          {/* Header */}
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">
              {isLogin ? '¡Hola de nuevo!' : 'Crea tu cuenta'}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              {isLogin ? 'Ingresa tus credenciales para continuar.' : 'Únete a la nueva era de gestión empresarial.'}
            </p>
          </div>

          {/* Global Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0, scale: 0.95 }}
                animate={{ opacity: 1, height: 'auto', scale: 1 }}
                exit={{ opacity: 0, height: 0, scale: 0.95 }}
                className="mb-6 p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 rounded-2xl flex items-center gap-3 text-rose-600 dark:text-rose-400"
              >
                <div className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-900/40 flex items-center justify-center shrink-0">
                  <AlertCircle size={16} strokeWidth={3} />
                </div>
                <p className="text-xs font-bold leading-tight">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={onSubmit} className="space-y-5">
            {!isLogin && (
              <InputField
                label="Nombre completo"
                icon={User}
                placeholder="Alexander García"
                registration={register("name")}
                error={formErrors?.name?.message}
                required
              />
            )}

            <InputField
              label="Correo electrónico"
              icon={Mail}
              type="email"
              placeholder="correo@empresa.com"
              registration={register("email")}
              error={formErrors?.email?.message}
              required
            />

            {!isLogin && (
              <InputField
                label="Teléfono"
                icon={Phone}
                type="tel"
                placeholder="+57 300 123 4567"
                registration={register("phone")}
                error={formErrors?.phone?.message}
                required
              />
            )}

            <div className="space-y-1.5 relative group">
              <label className="block text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#6C47FF] transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register("password", {
                    onChange: (e: any) => setPasswordValue(e.target.value)
                  })}
                  className={cn(
                    "w-full h-12 pl-12 pr-12 rounded-2xl border transition-all outline-none text-sm font-medium dark:text-white",
                    formErrors?.password
                      ? "border-rose-200 bg-rose-50/30 focus:border-rose-500 focus:ring-rose-500/10"
                      : "border-slate-100 bg-slate-50/50 dark:bg-slate-900/50 dark:border-slate-800 focus:border-[#6C47FF] focus:ring-4 focus:ring-[#6C47FF]/10"
                  )}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              
              {isLogin && (
                <div className="flex justify-end pt-1">
                  <button type="button" className="text-[11px] font-black text-[#6C47FF] hover:text-[#5835E8] uppercase tracking-wider transition-colors">
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
              )}

              {formErrors?.password && (
                <p className="text-[10px] font-bold text-rose-500 ml-1 mt-1 uppercase tracking-tighter">{formErrors.password.message}</p>
              )}

              {!isLogin && passwordValue && (
                <PasswordStrengthMeter password={passwordValue} />
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full h-14 bg-[#6C47FF] hover:bg-[#5835E8] text-white font-black rounded-2xl shadow-xl shadow-purple-500/20 transition-all flex items-center justify-center gap-3 overflow-hidden mt-8 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>{isLogin ? 'Iniciar Sesión' : 'Crear mi cuenta'}</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </button>
          </form>

          {/* Footer Toggle */}
          <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-900 text-center">
            <p className="text-sm text-slate-500 font-medium">
              {isLogin ? '¿Aún no tienes cuenta?' : '¿Ya eres parte de Simplapp?'}
              <button
                onClick={() => onModeChange(isLogin ? 'register' : 'login')}
                className="ml-2 text-[#6C47FF] font-black hover:underline underline-offset-4 transition-all"
              >
                {isLogin ? 'Regístrate gratis' : 'Inicia sesión'}
              </button>
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </AuthCard>
  );
}
