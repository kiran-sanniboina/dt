import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { Project, Rating } from '../../types';
import {
  ArrowLeft,
  Calendar,
  Layers,
  Users,
  ExternalLink,
  Star,
  CheckCircle2,
  Clock,
  Award,
  MessageSquare,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

export const ProjectDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [rating, setRating] = useState<Rating | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      setIsLoading(true);
      try {
        const res = await api.get(`/projects/${id}`);
        if (res.data.success) {
          setProject(res.data.project);

          // If rated, fetch full rating details
          if (res.data.project.ratingId) {
            try {
              const rRes = await api.get(`/ratings/project/${id}`);
              if (rRes.data.success) setRating(rRes.data.rating);
            } catch (err) {
              console.warn('Could not fetch rating detail:', err);
            }
          }
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load project details.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3">
        <div className="w-10 h-10 border-4 border-rgukt-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-slate-500 font-medium">Loading project dossier...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="max-w-lg mx-auto my-16 p-8 bg-white rounded-3xl border border-red-200 text-center shadow-sm">
        <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
          ⚠️
        </div>
        <h2 className="text-lg font-bold text-slate-900 mb-1">Project Not Found</h2>
        <p className="text-sm text-slate-600 mb-6">{error || 'This project does not exist in the repository.'}</p>
        <Link
          to="/"
          className="inline-flex items-center space-x-2 px-5 py-2.5 bg-rgukt-800 text-white rounded-xl text-sm font-semibold hover:bg-rgukt-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Showcase</span>
        </Link>
      </div>
    );
  }

  const isRated = project.status === 'RATED' && (rating || project.ratingId);
  const activeRating = rating || (project.ratingId as any);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Navigation Breadcrumb */}
      <div>
        <Link
          to="/"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-rgukt-700 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Projects</span>
        </Link>
      </div>

      {/* Main Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold bg-rgukt-50 text-rgukt-700 border border-rgukt-200">
              <Calendar className="w-3.5 h-3.5" />
              <span>Year {typeof project.yearId === 'object' ? project.yearId.year : '2026'}</span>
            </span>

            <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
              <Layers className="w-3.5 h-3.5" />
              <span>Section {typeof project.sectionId === 'object' ? project.sectionId.name : 'CSE'}</span>
            </span>

            {isRated ? (
              <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>Score: {activeRating?.totalScore}/100</span>
              </span>
            ) : (
              <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                <Clock className="w-3.5 h-3.5" />
                <span>Submitted (Pending Evaluation)</span>
              </span>
            )}
          </div>

          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-rgukt-800 hover:bg-rgukt-900 text-white text-sm font-semibold shadow-sm transition-all shrink-0"
          >
            <span>Open Live Deployment</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {project.title}
          </h1>
          <p className="mt-4 text-base text-slate-600 leading-relaxed whitespace-pre-line">
            {project.description}
          </p>
        </div>

        {/* Live URL Pill */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <span className="font-semibold text-slate-500 uppercase tracking-wider block sm:inline mr-2">
              Live URL:
            </span>
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-rgukt-700 font-mono font-medium hover:underline break-all"
            >
              {project.liveUrl}
            </a>
          </div>
          <span className="text-slate-400">
            Submitted: {new Date(project.submittedAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Grid: Left Column (Preview + Evaluation), Right Column (Team Metadata) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 spans) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Live Preview Container */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="ml-2 text-xs font-mono text-slate-400">Live Application Preview</span>
              </div>
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-rgukt-300 hover:underline flex items-center space-x-1"
              >
                <span>Full Screen</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="h-[450px] bg-slate-100 relative">
              <iframe
                src={project.liveUrl}
                title={project.title}
                className="w-full h-full border-0"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              />
            </div>
            <div className="p-3 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-500">
              Note: If preview cannot connect due to CSP / X-Frame-Options,{' '}
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-rgukt-700 font-semibold underline"
              >
                open the project directly in a new tab
              </a>
              .
            </div>
          </div>

          {/* Evaluation Details if Rated */}
          {isRated && activeRating?.criteria && (
            <div className="bg-white rounded-3xl border border-amber-200/80 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">Official Faculty Evaluation</h3>
                    <p className="text-xs text-slate-500">Rubric criteria breakdown (Scale: 0–100)</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-black text-amber-600">
                    {activeRating.totalScore}
                    <span className="text-sm font-medium text-slate-400">/100</span>
                  </div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                    Final Score
                  </div>
                </div>
              </div>

              {/* Rubric Progress Bars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: 'Technical Approach', score: activeRating.criteria.technicalApproach, max: 15 },
                  { label: 'UI/UX Design', score: activeRating.criteria.uiUxDesign, max: 15 },
                  { label: 'Design Thinking', score: activeRating.criteria.designThinking, max: 10 },
                  { label: 'Functionality', score: activeRating.criteria.functionality, max: 20 },
                  { label: 'Innovation', score: activeRating.criteria.innovation, max: 15 },
                  { label: 'Project Quality', score: activeRating.criteria.projectQuality, max: 10 },
                  { label: 'Problem Solving', score: activeRating.criteria.problemSolving, max: 15 },
                ].map((item, idx) => (
                  <div key={idx} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
                      <span>{item.label}</span>
                      <span className="text-slate-900">
                        {item.score} / {item.max}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-500 h-full rounded-full transition-all"
                        style={{ width: `${(item.score / item.max) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Remarks */}
              {activeRating.feedback && (
                <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-5 space-y-2">
                  <div className="flex items-center space-x-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
                    <MessageSquare className="w-4 h-4 text-amber-600" />
                    <span>Faculty Feedback & Remarks</span>
                  </div>
                  <p className="text-sm text-amber-950 italic leading-relaxed">
                    "{activeRating.feedback}"
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Academic & Team Dossier */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
            <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
              <Users className="w-4 h-4 text-rgukt-600" />
              <span>Team Dossier</span>
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Team Name</span>
                <span className="font-semibold text-slate-800">{project.teamId?.name || 'N/A'}</span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Designated Lead</span>
                <span className="font-semibold text-slate-800">{project.teamId?.teamLeadName || 'N/A'}</span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Academic Year</span>
                <span className="font-semibold text-slate-800">
                  {typeof project.yearId === 'object' ? project.yearId.year : '2026'}
                </span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Section</span>
                <span className="font-semibold text-slate-800">
                  {typeof project.sectionId === 'object' ? project.sectionId.name : 'CSE'}
                </span>
              </div>
            </div>

            {/* Team Members List */}
            <div className="pt-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                Team Members
              </span>
              <div className="space-y-2">
                {project.teamId?.members?.map((member, idx) => (
                  <div
                    key={idx}
                    className="flex items-center space-x-2.5 p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700"
                  >
                    <div className="w-6 h-6 rounded-lg bg-rgukt-100 text-rgukt-800 flex items-center justify-center font-bold text-[10px]">
                      {member.charAt(0)}
                    </div>
                    <span>{member}</span>
                    {member === project.teamId.teamLeadName && (
                      <span className="ml-auto text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Lead
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Institutional Stamp Card */}
          <div className="bg-gradient-to-br from-slate-900 to-rgukt-950 text-white rounded-3xl p-6 shadow-sm space-y-3">
            <div className="flex items-center space-x-2 text-rgukt-300">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Verified Submission</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              This project is authenticated and permanently archived under Rajiv Gandhi University of Knowledge Technologies, Srikakulam.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
