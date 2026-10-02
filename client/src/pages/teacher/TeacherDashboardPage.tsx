import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Project } from '../../types';
import { ProjectCard } from '../../components/ProjectCard';
import { EvaluateProjectModal } from './EvaluateProjectModal';
import { AcademicManagementTab } from './AcademicManagementTab';
import {
  ShieldCheck,
  Layers,
  Clock,
  Star,
  Users,
  Award,
  Calendar,
  ExternalLink,
  Eye,
  CheckCircle2,
  RefreshCw,
  Search,
} from 'lucide-react';

export const TeacherDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'unrated' | 'rated' | 'academic'>('unrated');
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [unratedProjects, setUnratedProjects] = useState<Project[]>([]);
  const [ratedProjects, setRatedProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Evaluation modal state
  const [evaluatingProject, setEvaluatingProject] = useState<Project | null>(null);
  const [evalModalOpen, setEvalModalOpen] = useState(false);

  // Search filter
  const [search, setSearch] = useState('');

  const loadProjects = async () => {
    setIsLoading(true);
    try {
      const [allRes, unratedRes, ratedRes] = await Promise.all([
        api.get('/projects/public'),
        api.get('/ratings/unrated'),
        api.get('/ratings/rated'),
      ]);

      if (allRes.data.success) setAllProjects(allRes.data.projects);
      if (unratedRes.data.success) setUnratedProjects(unratedRes.data.projects);
      if (ratedRes.data.success) setRatedProjects(ratedRes.data.projects);
    } catch (err) {
      console.error('Failed to load portal data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const openEvaluation = (p: Project) => {
    setEvaluatingProject(p);
    setEvalModalOpen(true);
  };

  const handleEvaluationSuccess = () => {
    loadProjects();
  };

  const filterBySearch = (list: Project[]) => {
    if (!search.trim()) return list;
    const q = search.toLowerCase();
    return list.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.teamId?.name?.toLowerCase().includes(q) ||
        p.teamId?.teamLeadName?.toLowerCase().includes(q)
    );
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Teacher Portal Header */}
      <div className="bg-gradient-to-r from-rgukt-900 via-rgukt-800 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-rgukt-700/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-rgukt-700/60 border border-rgukt-500/40 text-[11px] font-semibold text-rgukt-200">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Authorized Faculty Console</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Faculty Evaluation Portal</h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Manage academic hierarchy, review submissions, and submit weighted rubric evaluations.
            </p>
          </div>

          <button
            onClick={loadProjects}
            className="self-start sm:self-auto inline-flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold backdrop-blur border border-white/20 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Data</span>
          </button>
        </div>

        {/* Metric Cards Bar */}
        <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div
            onClick={() => setActiveTab('all')}
            className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
              activeTab === 'all'
                ? 'bg-white/15 border-white/40 shadow-sm'
                : 'bg-white/5 border-white/10 hover:bg-white/10'
            }`}
          >
            <div className="text-2xl font-black text-white">{allProjects.length}</div>
            <div className="text-xs text-slate-300 font-medium">All Projects</div>
          </div>

          <div
            onClick={() => setActiveTab('unrated')}
            className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
              activeTab === 'unrated'
                ? 'bg-white/15 border-white/40 shadow-sm'
                : 'bg-white/5 border-white/10 hover:bg-white/10'
            }`}
          >
            <div className="text-2xl font-black text-amber-300">{unratedProjects.length}</div>
            <div className="text-xs text-slate-300 font-medium">Unrated (Pending)</div>
          </div>

          <div
            onClick={() => setActiveTab('rated')}
            className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
              activeTab === 'rated'
                ? 'bg-white/15 border-white/40 shadow-sm'
                : 'bg-white/5 border-white/10 hover:bg-white/10'
            }`}
          >
            <div className="text-2xl font-black text-emerald-300">{ratedProjects.length}</div>
            <div className="text-xs text-slate-300 font-medium">Rated Submissions</div>
          </div>

          <div
            onClick={() => setActiveTab('academic')}
            className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
              activeTab === 'academic'
                ? 'bg-white/15 border-white/40 shadow-sm'
                : 'bg-white/5 border-white/10 hover:bg-white/10'
            }`}
          >
            <div className="text-2xl font-black text-rgukt-200">Hierarchy</div>
            <div className="text-xs text-slate-300 font-medium">Academic Mgmt</div>
          </div>
        </div>
      </div>

      {/* Portal Tabs Bar */}
      <div className="flex border-b border-slate-200 bg-white px-6 rounded-2xl shadow-xs overflow-x-auto">
        <button
          onClick={() => setActiveTab('unrated')}
          className={`py-4 px-4 font-bold text-sm border-b-2 flex items-center space-x-2 whitespace-nowrap transition-colors ${
            activeTab === 'unrated'
              ? 'border-rgukt-700 text-rgukt-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Clock className="w-4 h-4 text-amber-500" />
          <span>Unrated Projects</span>
          <span className="ml-1.5 px-2 py-0.5 text-xs rounded-full bg-amber-100 text-amber-800 font-bold">
            {unratedProjects.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('rated')}
          className={`py-4 px-4 font-bold text-sm border-b-2 flex items-center space-x-2 whitespace-nowrap transition-colors ${
            activeTab === 'rated'
              ? 'border-rgukt-700 text-rgukt-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Star className="w-4 h-4 text-emerald-500" />
          <span>Rated Projects</span>
          <span className="ml-1.5 px-2 py-0.5 text-xs rounded-full bg-emerald-100 text-emerald-800 font-bold">
            {ratedProjects.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('all')}
          className={`py-4 px-4 font-bold text-sm border-b-2 flex items-center space-x-2 whitespace-nowrap transition-colors ${
            activeTab === 'all'
              ? 'border-rgukt-700 text-rgukt-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="w-4 h-4 text-rgukt-600" />
          <span>All Projects</span>
          <span className="ml-1.5 px-2 py-0.5 text-xs rounded-full bg-slate-100 text-slate-700 font-bold">
            {allProjects.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('academic')}
          className={`py-4 px-4 font-bold text-sm border-b-2 flex items-center space-x-2 whitespace-nowrap transition-colors ${
            activeTab === 'academic'
              ? 'border-rgukt-700 text-rgukt-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4 text-purple-600" />
          <span>Academic Management</span>
        </button>
      </div>

      {/* TAB 1: UNRATED PROJECTS QUEUE */}
      {activeTab === 'unrated' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Pending Evaluation Queue</h2>
              <p className="text-xs text-slate-500">
                Student submissions awaiting evaluation, scoring, and automated email dispatch
              </p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search unrated..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-rgukt-600"
              />
            </div>
          </div>

          {filterBySearch(unratedProjects).length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">All Caught Up!</h3>
              <p className="text-xs text-slate-500 mt-1">
                There are currently no pending unrated projects in this queue.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterBySearch(unratedProjects).map((p) => (
                <div
                  key={p._id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between hover:shadow-md transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                        Pending Evaluation
                      </span>
                      <span className="text-xs text-slate-400">
                        {typeof p.yearId === 'object' ? p.yearId.year : ''} · {typeof p.sectionId === 'object' ? p.sectionId.name : ''}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-base line-clamp-1">{p.title}</h3>
                    <p className="text-xs text-slate-600 line-clamp-2">{p.description}</p>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                      <div>
                        Team: <strong className="text-slate-800">{p.teamId?.name}</strong>
                      </div>
                      <div>
                        Lead: <strong className="text-slate-800">{p.teamId?.teamLeadName}</strong> ({p.teamId?.teamLeadEmail})
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">URL: {p.liveUrl}</div>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <a
                      href={p.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-slate-500 hover:text-slate-800 flex items-center space-x-1"
                    >
                      <span>Preview App</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>

                    <button
                      onClick={() => openEvaluation(p)}
                      className="px-4 py-2 bg-rgukt-800 hover:bg-rgukt-900 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
                    >
                      Evaluate Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: RATED PROJECTS */}
      {activeTab === 'rated' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Graded Submissions Repository</h2>
              <p className="text-xs text-slate-500">
                Projects with completed faculty scorecards and feedback logs
              </p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search rated..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-rgukt-600"
              />
            </div>
          </div>

          {filterBySearch(ratedProjects).length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto">
              <p className="text-xs text-slate-500">No evaluated projects found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterBySearch(ratedProjects).map((p) => {
                const score = p.ratingId?.totalScore;
                return (
                  <div
                    key={p._id}
                    className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between hover:shadow-md transition-all"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          <span>Score: {score}/100</span>
                        </span>

                        <span className="text-xs text-slate-400">
                          {typeof p.yearId === 'object' ? p.yearId.year : ''} · {typeof p.sectionId === 'object' ? p.sectionId.name : ''}
                        </span>
                      </div>

                      <h3 className="font-bold text-slate-900 text-base line-clamp-1">{p.title}</h3>
                      <p className="text-xs text-slate-600 line-clamp-2">{p.description}</p>

                      {p.ratingId?.feedback && (
                        <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200/60 text-xs italic text-amber-950 line-clamp-2">
                          "{p.ratingId.feedback}"
                        </div>
                      )}

                      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600">
                        Team: <strong>{p.teamId?.name}</strong> · Lead: <strong>{p.teamId?.teamLeadName}</strong>
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <a
                        href={p.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-slate-500 hover:text-slate-800 flex items-center space-x-1"
                      >
                        <span>Live Demo</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>

                      <button
                        onClick={() => openEvaluation(p)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
                      >
                        Edit Score
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: ALL PROJECTS */}
      {activeTab === 'all' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">All Submissions Directory</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allProjects.map((p) => (
              <ProjectCard key={p._id} project={p} />
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: ACADEMIC MANAGEMENT */}
      {activeTab === 'academic' && <AcademicManagementTab />}

      {/* Evaluation Modal */}
      <EvaluateProjectModal
        isOpen={evalModalOpen}
        onClose={() => setEvalModalOpen(false)}
        project={evaluatingProject}
        onSuccess={handleEvaluationSuccess}
      />
    </div>
  );
};
