import React from 'react';
import { GraduationCap, ShieldCheck, Mail, Globe } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-20 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Col 1 */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-white">
              <div className="w-8 h-8 rounded-lg bg-rgukt-600 flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg tracking-tight">College Project Hub</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              A centralized university platform to collect, manage, evaluate, and showcase student engineering projects across academic cycles.
            </p>
            <div className="text-xs text-slate-500 font-mono">
              Domain restricted to <span className="text-rgukt-300 font-semibold">@rguktsklm.ac.in</span>
            </div>
          </div>

          {/* Col 2 */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Institution</h4>
            <div className="space-y-2 text-sm text-slate-400">
              <p className="font-medium text-slate-200">
                Rajiv Gandhi University of Knowledge Technologies
              </p>
              <p>Srikakulam Campus, Andhra Pradesh, India</p>
              <p className="text-xs text-slate-500">Department of Computer Science and Engineering</p>
            </div>
          </div>

          {/* Col 3 */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Platform Security</h4>
            <div className="space-y-2 text-sm text-slate-400">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>One-Time Submission Protection</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-rgukt-400" />
                <span>Automated Email Notification Engine</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-purple-400" />
                <span>Sandboxed Live Project Previews</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} Rajiv Gandhi University of Knowledge Technologies, Srikakulam. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
