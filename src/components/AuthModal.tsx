import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, Eye, EyeOff, AlertCircle, Loader2, Sparkles, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'signin' | 'signup';
  onClose: () => void;
}

export function AuthModal({ isOpen, initialMode = 'signup', onClose }: AuthModalProps) {
  const { signUpWithEmail, signInWithEmail, signInWithGoogle, authError, clearAuthError } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localValidationMessage, setLocalValidationMessage] = useState<string | null>(null);

  // Sync initial mode
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setLocalValidationMessage(null);
      clearAuthError();
    }
  }, [isOpen, initialMode]);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalValidationMessage(null);
    clearAuthError();

    const trimmedEmail = email.trim();

    // 1. Validar correo obligatorio
    if (!trimmedEmail) {
      setLocalValidationMessage('El correo electrónico es obligatorio y no puede estar vacío.');
      return;
    }

    // 2. Validar formato de correo
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(trimmedEmail)) {
      setLocalValidationMessage('Por favor ingresa un correo con formato válido (ejemplo: usuario@correo.com).');
      return;
    }

    // 3. Validar longitud máxima de correo
    if (trimmedEmail.length > 100) {
      setLocalValidationMessage('El correo electrónico es demasiado largo (máximo 100 caracteres).');
      return;
    }

    // 4. Validar contraseña obligatoria
    if (!password) {
      setLocalValidationMessage('La contraseña es obligatoria y no puede estar vacía.');
      return;
    }

    // 5. Validar longitud mínima de contraseña
    if (password.length < 6) {
      setLocalValidationMessage('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    // 6. Validar longitud máxima de contraseña
    if (password.length > 128) {
      setLocalValidationMessage('La contraseña es demasiado larga (máximo 128 caracteres).');
      return;
    }

    if (mode === 'signup') {
      if (!confirmPassword) {
        setLocalValidationMessage('Debes confirmar tu contraseña para completar el registro.');
        return;
      }

      if (password !== confirmPassword) {
        setLocalValidationMessage('Las contraseñas no coinciden. Verifícalas e inténtalo nuevamente.');
        return;
      }

      setIsSubmitting(true);
      const success = await signUpWithEmail(trimmedEmail, password);
      setIsSubmitting(false);

      if (success) {
        onClose();
      }
    } else {
      setIsSubmitting(true);
      const success = await signInWithEmail(trimmedEmail, password);
      setIsSubmitting(false);

      if (success) {
        onClose();
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    await signInWithGoogle();
    setIsSubmitting(false);
    onClose();
  };

  const activeError = localValidationMessage || authError;

  return (
    <div
      id="modal-auth-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 dark:bg-black/75 backdrop-blur-xs animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div
        id="modal-auth-container"
        className="w-full max-w-md rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden transition-all text-stone-900 dark:text-stone-100"
      >
        {/* Header with Mode Switcher */}
        <div className="relative p-6 pb-4 border-b border-stone-100 dark:border-stone-800/80">
          <button
            type="button"
            id="btn-cerrar-auth-modal"
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-white/95 border border-stone-200 dark:border-white/20 flex items-center justify-center p-1 shadow-xs shrink-0 overflow-hidden">
              <img
                src="/logo.png"
                alt="Armario Digital"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h2 id="auth-modal-title" className="text-lg font-semibold tracking-tight">
                {mode === 'signup' ? 'Crear cuenta' : 'Iniciar sesión'}
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Respalda tu armario y outfits en Firebase
              </p>
            </div>
          </div>

          {/* Tab selector */}
          <div className="mt-4 grid grid-cols-2 p-1 rounded-xl bg-stone-100 dark:bg-stone-800/70 border border-stone-200/80 dark:border-stone-700/80 gap-1">
            <button
              type="button"
              id="tab-auth-signup"
              onClick={() => {
                setMode('signup');
                setLocalValidationMessage(null);
                clearAuthError();
              }}
              className={`py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                mode === 'signup'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-2xs'
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              Registrarse
            </button>
            <button
              type="button"
              id="tab-auth-signin"
              onClick={() => {
                setMode('signin');
                setLocalValidationMessage(null);
                clearAuthError();
              }}
              className={`py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                mode === 'signin'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-2xs'
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              Iniciar sesión
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Error notice */}
          {activeError && (
            <div
              id="auth-error-message"
              className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 text-xs flex items-start gap-2 shadow-2xs"
            >
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{activeError}</span>
            </div>
          )}

          {/* Email field */}
          <div>
            <label
              htmlFor="input-auth-correo"
              className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1.5"
            >
              Correo electrónico
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                id="input-auth-correo"
                required
                maxLength={100}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (localValidationMessage) setLocalValidationMessage(null);
                }}
                placeholder="tu@correo.com"
                autoComplete="email"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-stone-400 dark:focus:ring-stone-600 transition-all"
              />
            </div>
          </div>

          {/* Password field */}
          <div>
            <label
              htmlFor="input-auth-contrasena"
              className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1.5"
            >
              Contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                id="input-auth-contrasena"
                required
                maxLength={128}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (localValidationMessage) setLocalValidationMessage(null);
                }}
                placeholder="Mínimo 6 caracteres"
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                className="w-full pl-9 pr-10 py-2 text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-stone-400 dark:focus:ring-stone-600 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 cursor-pointer"
                title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password (only in signup mode) */}
          {mode === 'signup' && (
            <div>
              <label
                htmlFor="input-auth-confirmar-contrasena"
                className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1.5"
              >
                Confirmar contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="input-auth-confirmar-contrasena"
                  required
                  maxLength={128}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (localValidationMessage) setLocalValidationMessage(null);
                  }}
                  placeholder="Repite tu contraseña"
                  autoComplete="new-password"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-stone-400 dark:focus:ring-stone-600 transition-all"
                />
              </div>
            </div>
          )}

          {/* Notice of data handling */}
          <div className="flex items-start gap-2 p-2.5 rounded-xl bg-stone-100/70 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80 text-[11px] text-stone-500 dark:text-stone-400">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <p className="leading-snug">
              <strong className="text-stone-700 dark:text-stone-200">Uso de datos:</strong> Tu correo y contraseña se emplean únicamente para autenticar tu cuenta y aislar tus prendas en la base de datos protegida.
            </p>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            id="btn-auth-submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-2.5 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900 text-sm font-semibold shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Procesando...</span>
              </>
            ) : mode === 'signup' ? (
              <span>Registrarse con correo</span>
            ) : (
              <span>Entrar a mi armario</span>
            )}
          </button>

          {/* Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone-200 dark:border-stone-800" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white dark:bg-stone-900 px-3 text-stone-400">
                o también puedes
              </span>
            </div>
          </div>

          {/* Google Sign-in Alternative */}
          <button
            type="button"
            id="btn-auth-modal-google"
            onClick={handleGoogleSignIn}
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/70 hover:bg-stone-100 dark:bg-stone-800/80 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-200 text-xs font-medium shadow-2xs transition-all cursor-pointer flex items-center justify-center gap-2.5"
          >
            {/* Google G icon */}
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>Continuar con Google</span>
          </button>
        </form>

        {/* Footer switch prompt */}
        <div className="p-4 bg-stone-50/70 dark:bg-stone-800/40 border-t border-stone-100 dark:border-stone-800/80 text-center text-xs text-stone-500 dark:text-stone-400">
          {mode === 'signup' ? (
            <p>
              ¿Ya tienes una cuenta?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setLocalValidationMessage(null);
                  clearAuthError();
                }}
                className="text-stone-900 dark:text-stone-100 font-semibold underline underline-offset-2 hover:opacity-80 cursor-pointer"
              >
                Inicia sesión aquí
              </button>
            </p>
          ) : (
            <p>
              ¿Aún no tienes cuenta?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setLocalValidationMessage(null);
                  clearAuthError();
                }}
                className="text-stone-900 dark:text-stone-100 font-semibold underline underline-offset-2 hover:opacity-80 cursor-pointer"
              >
                Regístrate con correo
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
