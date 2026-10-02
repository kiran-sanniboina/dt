import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, Mail, Lock, AlertCircle, ArrowRight, Eye, EyeOff, GraduationCap } from 'lucide-react';

export const TeacherLoginPage: React.FC = () => {
  const { loginTeacher } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const from = (location.state as any)?.from?.pathname || '/teacher';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail.endsWith('@rguktsklm.ac.in')) {
      setError('Official college email required. Must end with @rguktsklm.ac.in');
      return;
    }

    setIsLoading(true);
    try {
      await loginTeacher(trimmedEmail, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setEmail('teacher@rguktsklm.ac.in');
    setPassword('teacher123');
    setError(null);
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-rgukt-100 text-rgukt-700 flex items-center justify-center mx-auto shadow-inner">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Faculty Portal Login</h2>
          <p className="text-xs text-slate-500">
            Academic Management & Student Project Evaluation
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start space-x-3 text-xs text-red-800 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Institutional Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="teacher@rguktsklm.ac.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rgukt-600 focus:bg-white transition-all"
              />
            </div>
            <p className="mt-1 text-[11px] text-slate-400">Restricted to @rguktsklm.ac.in</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rgukt-600 focus:bg-white transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-rgukt-800 hover:bg-rgukt-900 text-white rounded-xl font-bold text-sm shadow-md shadow-rgukt-900/10 transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In to Teacher Portal</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Credentials Box */}
        <div className="pt-4 border-t border-slate-100">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs space-y-2">
            <div className="flex items-center justify-between font-semibold text-slate-700">
              <span>Quick Demo Credentials</span>
              <button
                type="button"
                onClick={fillDemoCredentials}
                className="text-[11px] font-bold text-rgukt-700 hover:underline"
              >
                Auto Fill
              </button>
            </div>
            <div className="font-mono text-slate-600 text-[11px] space-y-0.5">
              <div>Email: teacher@rguktsklm.ac.in</div>
              <div>Password: teacher123</div>
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-slate-500">
          Are you a student team lead?{' '}
          <Link to="/login/team-lead" className="font-bold text-emerald-700 hover:underline">
            Team Lead Login
          </Link>
        </div>
      </div>
    </div>
  );
};
