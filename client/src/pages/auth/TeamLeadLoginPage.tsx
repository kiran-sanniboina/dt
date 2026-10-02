import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UploadCloud, Mail, KeyRound, AlertCircle, ArrowRight, Eye, EyeOff, Info } from 'lucide-react';

export const TeamLeadLoginPage: React.FC = () => {
  const { loginTeamLead } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const from = (location.state as any)?.from?.pathname || '/upload';

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
      await loginTeamLead(trimmedEmail, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          'Authentication failed. Please check your credentials or contact your course faculty.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoFresh = () => {
    setEmail('suresh@rguktsklm.ac.in');
    setPassword('password123');
    setError(null);
  };

  const fillDemoSubmitted = () => {
    setEmail('priya@rguktsklm.ac.in');
    setPassword('password123');
    setError(null);
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
            <UploadCloud className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Team Lead Login</h2>
          <p className="text-xs text-slate-500">
            Submit & manage your team's official academic project
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
              Registered College Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="lead@rguktsklm.ac.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all"
              />
            </div>
            <p className="mt-1 text-[11px] text-slate-400">Your official @rguktsklm.ac.in college inbox</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Generated Access Password
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="mt-1 text-[11px] text-slate-400">Password dispatched to your email upon team creation</p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-md shadow-emerald-600/10 transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Access Project Upload</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Credentials Box */}
        <div className="pt-4 border-t border-slate-100 space-y-2">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center space-x-1">
            <Info className="w-3.5 h-3.5 text-slate-400" />
            <span>Test with Pre-seeded Accounts:</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={fillDemoFresh}
              className="p-2.5 rounded-xl border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50 text-left transition-colors"
            >
              <div className="font-bold text-emerald-800">Fresh Submission</div>
              <div className="text-[10px] text-slate-500 truncate">suresh@rguktsklm.ac.in</div>
            </button>

            <button
              type="button"
              onClick={fillDemoSubmitted}
              className="p-2.5 rounded-xl border border-blue-200 bg-blue-50/50 hover:bg-blue-50 text-left transition-colors"
            >
              <div className="font-bold text-blue-800">Already Submitted</div>
              <div className="text-[10px] text-slate-500 truncate">priya@rguktsklm.ac.in</div>
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-slate-500">
          Faculty or Evaluator?{' '}
          <Link to="/login/teacher" className="font-bold text-rgukt-700 hover:underline">
            Teacher Login
          </Link>
        </div>
      </div>
    </div>
  );
};
