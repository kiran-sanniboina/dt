import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Project, AcademicYear, Section } from '../../types';
import { ProjectCard } from '../../components/ProjectCard';
import {
  Search,
  Filter,
  GraduationCap,
  Sparkles,
  BookOpen,
  Award,
  Users,
  UploadCloud,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [years, setYears] = useState<AcademicYear[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch filters & projects
  const fetchMetadata = async () => {
    try {
      const [yearsRes, sectionsRes] = await Promise.all([
        api.get('/academic/years'),
        api.get('/academic/sections'),
      ]);
      if (yearsRes.data.success) setYears(yearsRes.data.years);
      if (sectionsRes.data.success) setSections(sectionsRes.data.sections);
    } catch (err) {
      console.error('Failed to load filter metadata:', err);
    }
  };

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const params: any = {};
      if (selectedYear) params.yearId = selectedYear;
      if (selectedSection) params.sectionId = selectedSection;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const res = await api.get('/projects/public', { params });
      if (res.data.success) {
        setProjects(res.data.projects);
      }
    } catch (err) {
      console.error('Failed to load projects:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMetadata();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProjects();
    }, 250);
    return () => clearTimeout(timer);
  }, [selectedYear, selectedSection, searchQuery]);

  // Statistics
  const totalCount = projects.length;
  const ratedCount = projects.filter((p) => p.status === 'RATED').length;
  const filteredSections = selectedYear
    ? sections.filter((s) => (typeof s.yearId === 'object' ? s.yearId._id === selectedYear : s.yearId === selectedYear))
    : sections;

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-rgukt-900 via-rgukt-800 to-slate-900 text-white rounded-3xl p-8 sm:p-12 lg:p-16 shadow-xl border border-rgukt-700/50">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-rgukt-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rgukt-700/60 border border-rgukt-500/30 text-xs font-semibold text-rgukt-200 mb-6 backdrop-blur">
            <GraduationCap className="w-4 h-4 text-rgukt-300" />
            <span>RGUKT Srikakulam Central Repository</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            One College. One Platform. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rgukt-200 via-emerald-200 to-teal-300">
              Every Project.
            </span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
            Discover, evaluate, and benchmark student engineering innovations across academic years. All RGUKT Srikakulam projects preserved in one unified digital hub.
          </p>

          {/* Quick Action CTA Buttons */}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/upload"
              className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all hover:scale-105"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Team Lead: Upload Project</span>
            </Link>

            <Link
              to="/teacher"
              className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 backdrop-blur transition-all"
            >
              <ShieldCheck className="w-4 h-4 text-rgukt-300" />
              <span>Teacher Evaluation Portal</span>
            </Link>
          </div>
        </div>

        {/* Highlight Stats Bar */}
        <div className="mt-12 pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center sm:text-left">
          <div className="bg-white/5 backdrop-blur rounded-2xl p-4 border border-white/10">
            <div className="text-2xl sm:text-3xl font-black text-white">{totalCount}</div>
            <div className="text-xs text-slate-400 font-medium mt-1">Submitted Projects</div>
          </div>
          <div className="bg-white/5 backdrop-blur rounded-2xl p-4 border border-white/10">
            <div className="text-2xl sm:text-3xl font-black text-emerald-300">{ratedCount}</div>
            <div className="text-xs text-slate-400 font-medium mt-1">Faculty Evaluated</div>
          </div>
          <div className="bg-white/5 backdrop-blur rounded-2xl p-4 border border-white/10">
            <div className="text-2xl sm:text-3xl font-black text-rgukt-300">{years.length}</div>
            <div className="text-xs text-slate-400 font-medium mt-1">Academic Years</div>
          </div>
          <div className="bg-white/5 backdrop-blur rounded-2xl p-4 border border-white/10">
            <div className="text-2xl sm:text-3xl font-black text-amber-300">{sections.length}</div>
            <div className="text-xs text-slate-400 font-medium mt-1">Course Sections</div>
          </div>
        </div>
      </section>

      {/* Filter and Search Controls */}
      <section className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search projects by title, description, keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rgukt-600 focus:bg-white transition-all"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
            {/* Year Selector */}
            <select
              value={selectedYear}
              onChange={(e) => {
                setSelectedYear(e.target.value);
                setSelectedSection('');
              }}
              className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-rgukt-600"
            >
              <option value="">All Academic Years</option>
              {years.map((y) => (
                <option key={y._id} value={y._id}>
                  Year {y.year}
                </option>
              ))}
            </select>

            {/* Section Selector */}
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-rgukt-600"
            >
              <option value="">All Sections</option>
              {filteredSections.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>

            {(selectedYear || selectedSection || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedYear('');
                  setSelectedSection('');
                  setSearchQuery('');
                }}
                className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Project Showcase</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Showing {projects.length} submitted projects across departments
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="bg-white rounded-2xl border border-slate-200 p-6 h-64 animate-pulse flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="h-4 bg-slate-200 rounded w-1/3" />
                  <div className="h-6 bg-slate-200 rounded w-3/4" />
                  <div className="h-4 bg-slate-100 rounded w-full" />
                  <div className="h-4 bg-slate-100 rounded w-2/3" />
                </div>
                <div className="h-8 bg-slate-100 rounded w-full" />
              </div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-rgukt-50 text-rgukt-600 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No Projects Found</h3>
            <p className="text-sm text-slate-500 mt-1">
              No submissions match your active search or filter criteria.
            </p>
            <button
              onClick={() => {
                setSelectedYear('');
                setSelectedSection('');
                setSearchQuery('');
              }}
              className="mt-5 inline-flex items-center space-x-1.5 px-4 py-2 bg-rgukt-800 text-white rounded-xl text-xs font-semibold hover:bg-rgukt-900"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
