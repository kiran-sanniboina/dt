import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Team, Project } from '../../types';
import { ProjectPreviewModal } from '../../components/ProjectPreviewModal';
import {
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Eye,
  ShieldCheck,
  Calendar,
  Layers,
  Users,
  Lock,
  ArrowRight,
  Clock,
  Star,
} from 'lucide-react';

export const UploadProjectPage: React.FC = () => {
  const [team, setTeam] = useState<Team | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Modal preview
  const [previewOpen, setPreviewOpen] = useState(false);

  const fetchTeamStatus = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/projects/team/me');
      if (res.data.success) {
        setTeam(res.data.team);
        setProject(res.data.project);
        setIsSubmitted(res.data.isSubmitted);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch team data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamStatus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!title.trim() || !description.trim() || !liveUrl.trim()) {
      setError('Project Title, Description, and Live Deployment URL are required.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.post('/projects', {
        title: title.trim(),
        description: description.trim(),
        liveUrl: liveUrl.trim(),
      });

      if (res.data.success) {
        setSuccessMessage('Project successfully uploaded! Your team submission is now locked and submitted.');
        setProject(res.data.project);
        setIsSubmitted(true);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit project.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-slate-500 font-medium">Loading your team profile...</p>
      </div>
    );
  }

  const isRated = project?.status === 'RATED';

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Team Project Submission Portal
              </h1>
              <p className="text-xs text-slate-500">
                Rajiv Gandhi University of Knowledge Technologies, Srikakulam
              </p>
            </div>
          </div>

          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 self-start sm:self-auto">
            <Lock className="w-3.5 h-3.5 text-slate-500" />
            <span>One-Time Submission Enforced</span>
          </div>
        </div>
      </div>

      {/* Auto-Populated Team Context Box (Read-Only) */}
      {team && (
        <div className="bg-gradient-to-br from-slate-900 via-rgukt-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-800 space-y-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h2 className="text-sm font-bold tracking-wider uppercase text-emerald-300">
                Verified Academic Metadata
              </h2>
            </div>
            <span className="text-xs text-slate-400">Inherited from Faculty Records</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="bg-white/5 backdrop-blur p-3.5 rounded-xl border border-white/10">
              <span className="text-slate-400 block mb-1">Academic Year & Section</span>
              <span className="text-sm font-bold text-white">
                Year {typeof team.yearId === 'object' ? team.yearId.year : '2026'} -{' '}
                {typeof team.sectionId === 'object' ? team.sectionId.name : 'CSE'}
              </span>
            </div>

            <div className="bg-white/5 backdrop-blur p-3.5 rounded-xl border border-white/10">
              <span className="text-slate-400 block mb-1">Assigned Team</span>
              <span className="text-sm font-bold text-white">{team.name}</span>
            </div>

            <div className="bg-white/5 backdrop-blur p-3.5 rounded-xl border border-white/10">
              <span className="text-slate-400 block mb-1">Team Lead & Email</span>
              <span className="text-sm font-bold text-white block truncate">{team.teamLeadName}</span>
              <span className="text-[11px] text-emerald-300 font-mono">{team.teamLeadEmail}</span>
            </div>
          </div>

          {/* Members List */}
          <div className="pt-2">
            <span className="text-xs font-semibold text-slate-400 block mb-2">Team Members Roster:</span>
            <div className="flex flex-wrap gap-2">
              {team.members.map((member, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-white/10 border border-white/10 rounded-lg text-xs font-medium text-slate-200"
                >
                  {member} {member === team.teamLeadName ? '(Lead)' : ''}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* STATE A: Already Submitted View */}
      {isSubmitted && project ? (
        <div className="bg-white rounded-3xl border border-emerald-200 p-6 sm:p-10 shadow-sm space-y-6">
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start space-x-3 text-emerald-900">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-sm">You have already uploaded your project</h3>
              <p className="text-xs text-emerald-800 mt-0.5">
                Your submission is permanently recorded. As per college guidelines, each team may submit only once.
              </p>
            </div>
          </div>

          {/* Project Details Dossier */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Submitted Project Title
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">{project.title}</h2>
              </div>

              {isRated ? (
                <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 self-start sm:self-auto">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>Evaluated: {project.ratingId?.totalScore}/100</span>
                </span>
              ) : (
                <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 self-start sm:self-auto">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Status: Under Review</span>
                </span>
              )}
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Project Abstract / Description
              </span>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-2xl border border-slate-200">
                {project.description}
              </p>
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Live Project Deployment URL
              </span>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono font-bold text-rgukt-700 hover:underline break-all"
                >
                  {project.liveUrl}
                </a>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => setPreviewOpen(true)}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-rgukt-800 hover:bg-rgukt-900 text-white rounded-lg text-xs font-semibold shadow-xs"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Live Preview</span>
                  </button>

                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-200"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between text-xs text-slate-500">
              <span>Submitted on: {new Date(project.submittedAt).toLocaleDateString()}</span>
              <Link
                to={`/project/${project._id}`}
                className="font-bold text-rgukt-700 hover:underline flex items-center space-x-1"
              >
                <span>View Full Public Dossier</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <ProjectPreviewModal
            isOpen={previewOpen}
            onClose={() => setPreviewOpen(false)}
            title={project.title}
            url={project.liveUrl}
          />
        </div>
      ) : (
        /* STATE B: Fresh Project Submission Form */
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900">Enter Project Details</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Ensure all information is accurate. Once submitted, project information cannot be modified.
            </p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start space-x-3 text-xs text-red-800">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start space-x-3 text-xs text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Project Name / Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Smart Campus IoT Navigation System"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Project Description / Abstract <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={4}
                placeholder="Describe the problem, technical stack used, key features, and engineering solution implemented by your team..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Live Deployment URL <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="https://your-project.vercel.app or https://github-pages..."
                value={liveUrl}
                onChange={(e) => setLiveUrl(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all font-mono"
              />
              <p className="mt-1.5 text-[11px] text-slate-400">
                This URL will be used by faculty to preview and interact with your working application directly inside the platform.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-amber-700 font-medium">
                ⚠️ Confirm you are submitting the final version.
              </span>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center space-x-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-md shadow-emerald-600/20 transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <UploadCloud className="w-4 h-4" />
                )}
                <span>{isSubmitting ? 'Uploading...' : 'Submit Project (One-Time)'}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
