import React, { useState } from 'react';
import { X, Lock, KeyRound, Loader2, ShieldAlert } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (token: string) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  if (!isOpen) return null;

  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      onLoginSuccess(data.token);
    } catch (err: any) {
      setError(err.message || 'Incorrect password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#1E1114]/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-[#F5EFE9] border border-[#1E1114]/20 shadow-2xl p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#1E1114]/60 hover:text-[#5A0F26] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-3 mb-6">
          <div className="w-12 h-12 bg-[#5A0F26]/10 text-[#5A0F26] rounded-full mx-auto flex items-center justify-center">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#C48A8C] font-semibold block">
              Private Access
            </span>
            <h2 className="font-editorial text-2xl text-[#1E1114] font-medium">
              Atelier Management
            </h2>
          </div>
          <p className="text-xs text-[#1E1114]/70 font-light">
            Enter your studio administrator passcode to manage creations, customer orders, and custom briefs.
          </p>
        </div>

        {error && (
          <div className="p-3 mb-4 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-[11px] uppercase tracking-wider text-[#1E1114]/70 font-medium">
              Studio Passcode
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-white border border-[#1E1114]/20 focus:border-[#5A0F26] focus:outline-none"
              />
              <KeyRound className="w-4 h-4 text-[#1E1114]/40 absolute left-3 top-3" />
            </div>
          </div>

          <div className="p-2.5 bg-[#EAE3DB]/60 border border-[#1E1114]/10 text-[11px] text-[#1E1114]/70 space-y-1">
            <p className="font-medium text-[#5A0F26]">Initial Studio Access Note:</p>
            <p>Default passcode is <code className="bg-white/80 px-1 font-mono text-[#5A0F26]">karunya2026</code>. You can change this anytime inside the Settings tab.</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-[#5A0F26] text-[#F5EFE9] text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#3E0818] transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying credentials...</span>
              </>
            ) : (
              <span>Access Studio Console</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
