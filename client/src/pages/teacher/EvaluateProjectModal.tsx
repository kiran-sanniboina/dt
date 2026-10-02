import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Project, RatingCriteria } from '../../types';
import {
  X,
  Star,
  ExternalLink,
  Send,
  AlertCircle,
  CheckCircle2,
  Sliders,
  Shield,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

interface EvaluateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  onSuccess: () => void;
}

export const EvaluateProjectModal: React.FC<EvaluateProjectModalProps> = ({
  isOpen,
  onClose,
  project,
  onSuccess,
}) => {
  const [criteria, setCriteria] = useState<RatingCriteria>({
    technicalApproach: 12,
    uiUxDesign: 12,
    designThinking: 8,
    functionality: 16,
    innovation: 12,
    projectQuality: 8,
    problemSolving: 12,
  });

  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // If project already rated, populate existing scores
  useEffect(() => {
    if (project?.ratingId && typeof project.ratingId === 'object' && project.ratingId.criteria) {
      setCriteria(project.ratingId.criteria);
      setFeedback(project.ratingId.feedback || '');
    } else {
      setCriteria({
        technicalApproach: 12,
        uiUxDesign: 12,
        designThinking: 8,
        functionality: 16,
        innovation: 12,
        projectQuality: 8,
        problemSolving: 12,
      });
      setFeedback('');
    }
    setError(null);
    setSuccess(null);
  }, [project]);

  if (!isOpen || !project) return null;

  const totalScore =
    Number(criteria.technicalApproach) +
    Number(criteria.uiUxDesign) +
    Number(criteria.designThinking) +
    Number(criteria.functionality) +
    Number(criteria.innovation) +
    Number(criteria.projectQuality) +
    Number(criteria.problemSolving);

  const handleScoreChange = (field: keyof RatingCriteria, value: number, max: number) => {
    const val = Math.max(0, Math.min(max, isNaN(value) ? 0 : value));
    setCriteria((prev) => ({ ...prev, [field]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!feedback.trim()) {
      setError('Please provide qualitative feedback and constructive remarks for the student team.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.post('/ratings', {
        projectId: project._id,
        criteria,
        feedback: feedback.trim(),
      });

      if (res.data.success) {
        setSuccess(res.data.message || 'Evaluation submitted successfully.');
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1600);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit evaluation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-rgukt-600 flex items-center justify-center text-white font-bold">
              <Star className="w-4 h-4 fill-white" />
            </div>
            <div>
              <h2 className="font-bold text-base text-white">Project Evaluation Suite</h2>
              <p className="text-xs text-slate-400">
                Evaluating: <span className="text-white font-medium">{project.title}</span> ({project.teamId?.name})
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold"
            >
              <span>Open Deployment</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Split 2 columns (Preview vs Rubric Form) */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Left Column: Live Iframe Preview (5 cols) */}
          <div className="lg:col-span-5 bg-slate-100 border-r border-slate-200 flex flex-col h-[350px] lg:h-auto">
            <div className="px-4 py-2 bg-slate-200/80 border-b border-slate-300 flex items-center justify-between text-xs text-slate-700">
              <span className="font-semibold truncate max-w-[200px]">Preview: {project.liveUrl}</span>
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-rgukt-700 font-bold hover:underline flex items-center space-x-1"
              >
                <span>New Tab</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <iframe
              src={project.liveUrl}
              title={project.title}
              className="w-full flex-1 border-0"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            />
            <div className="p-2.5 bg-amber-50 border-t border-amber-200 text-[11px] text-amber-800 text-center">
              If frame does not load due to X-Frame-Options headers, use the <strong>New Tab</strong> link.
            </div>
          </div>

          {/* Right Column: Scoring Form (7 cols) */}
          <div className="lg:col-span-7 p-6 sm:p-8 overflow-y-auto space-y-6">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-2 text-xs text-red-800">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start space-x-2 text-xs text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{success}</span>
              </div>
            )}

            {/* Total Score Header Card */}
            <div className="bg-gradient-to-r from-rgukt-900 to-slate-900 text-white p-5 rounded-2xl flex items-center justify-between shadow-sm">
              <div>
                <span className="text-xs uppercase tracking-wider text-rgukt-300 font-bold">
                  Aggregated Score
                </span>
                <div className="text-3xl font-black mt-0.5">
                  {totalScore} <span className="text-sm font-medium text-slate-400">/ 100</span>
                </div>
              </div>

              <div className="text-right">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    totalScore >= 85
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : totalScore >= 70
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  {totalScore >= 85 ? 'Distinction' : totalScore >= 70 ? 'Merit' : 'Pass'}
                </span>
                <p className="text-[11px] text-slate-400 mt-1">Scale out of 100 Points</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-4">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
                  <Sliders className="w-4 h-4 text-rgukt-600" />
                  <span>Evaluation Rubric Criteria (Max 100 Pts)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                  {/* Criteria 1 */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <div className="flex justify-between items-center mb-1">
                      <label className="font-semibold text-slate-800">1. Technical Approach</label>
                      <span className="font-bold text-rgukt-700">max 15</span>
                    </div>
                    <input
                      type="number"
                      min={0}
                      max={15}
                      value={criteria.technicalApproach}
                      onChange={(e) =>
                        handleScoreChange('technicalApproach', parseInt(e.target.value, 10), 15)
                      }
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-sm font-semibold"
                    />
                  </div>

                  {/* Criteria 2 */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <div className="flex justify-between items-center mb-1">
                      <label className="font-semibold text-slate-800">2. UI / UX Design</label>
                      <span className="font-bold text-rgukt-700">max 15</span>
                    </div>
                    <input
                      type="number"
                      min={0}
                      max={15}
                      value={criteria.uiUxDesign}
                      onChange={(e) =>
                        handleScoreChange('uiUxDesign', parseInt(e.target.value, 10), 15)
                      }
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-sm font-semibold"
                    />
                  </div>

                  {/* Criteria 3 */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <div className="flex justify-between items-center mb-1">
                      <label className="font-semibold text-slate-800">3. Design Thinking</label>
                      <span className="font-bold text-rgukt-700">max 10</span>
                    </div>
                    <input
                      type="number"
                      min={0}
                      max={10}
                      value={criteria.designThinking}
                      onChange={(e) =>
                        handleScoreChange('designThinking', parseInt(e.target.value, 10), 10)
                      }
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-sm font-semibold"
                    />
                  </div>

                  {/* Criteria 4 */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <div className="flex justify-between items-center mb-1">
                      <label className="font-semibold text-slate-800">4. Functionality</label>
                      <span className="font-bold text-rgukt-700">max 20</span>
                    </div>
                    <input
                      type="number"
                      min={0}
                      max={20}
                      value={criteria.functionality}
                      onChange={(e) =>
                        handleScoreChange('functionality', parseInt(e.target.value, 10), 20)
                      }
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-sm font-semibold"
                    />
                  </div>

                  {/* Criteria 5 */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <div className="flex justify-between items-center mb-1">
                      <label className="font-semibold text-slate-800">5. Innovation</label>
                      <span className="font-bold text-rgukt-700">max 15</span>
                    </div>
                    <input
                      type="number"
                      min={0}
                      max={15}
                      value={criteria.innovation}
                      onChange={(e) =>
                        handleScoreChange('innovation', parseInt(e.target.value, 10), 15)
                      }
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-sm font-semibold"
                    />
                  </div>

                  {/* Criteria 6 */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <div className="flex justify-between items-center mb-1">
                      <label className="font-semibold text-slate-800">6. Project Quality</label>
                      <span className="font-bold text-rgukt-700">max 10</span>
                    </div>
                    <input
                      type="number"
                      min={0}
                      max={10}
                      value={criteria.projectQuality}
                      onChange={(e) =>
                        handleScoreChange('projectQuality', parseInt(e.target.value, 10), 10)
                      }
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-sm font-semibold"
                    />
                  </div>

                  {/* Criteria 7 */}
                  <div className="sm:col-span-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <div className="flex justify-between items-center mb-1">
                      <label className="font-semibold text-slate-800">7. Problem Solving</label>
                      <span className="font-bold text-rgukt-700">max 15</span>
                    </div>
                    <input
                      type="number"
                      min={0}
                      max={15}
                      value={criteria.problemSolving}
                      onChange={(e) =>
                        handleScoreChange('problemSolving', parseInt(e.target.value, 10), 15)
                      }
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-sm font-semibold"
                    />
                  </div>
                </div>
              </div>

              {/* Feedback text area */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Faculty Feedback & Remarks <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Provide detailed feedback on architecture, improvements, code structure, and design..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rgukt-600 focus:bg-white transition-all"
                />
                <p className="mt-1 text-[11px] text-slate-400">
                  This feedback and score breakdown will be immediately emailed to{' '}
                  <span className="font-mono font-medium text-slate-700">
                    {project.teamId?.teamLeadEmail}
                  </span>
                  .
                </p>
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center space-x-2 px-6 py-2.5 bg-rgukt-800 hover:bg-rgukt-900 text-white rounded-xl font-bold text-sm shadow-md shadow-rgukt-900/10 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  <span>Submit Evaluation & Notify Team Lead</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
