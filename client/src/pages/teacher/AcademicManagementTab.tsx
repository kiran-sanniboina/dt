import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { AcademicYear, Section, Team } from '../../types';
import { ConfirmModal } from '../../components/ConfirmModal';
import {
  Calendar,
  Layers,
  Users,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Copy,
  Mail,
  ShieldAlert,
  Info,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

export const AcademicManagementTab: React.FC = () => {
  const [years, setYears] = useState<AcademicYear[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedYearId, setSelectedYearId] = useState<string>('');
  const [selectedSectionId, setSelectedSectionId] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Creation forms state
  const [newYearInput, setNewYearInput] = useState('');
  const [newSectionInput, setNewSectionInput] = useState('');

  // Team creation form state
  const [teamName, setTeamName] = useState('');
  const [membersInput, setMembersInput] = useState('');
  const [teamLeadName, setTeamLeadName] = useState('');
  const [teamLeadEmail, setTeamLeadEmail] = useState('');

  // Success / Generated Password Banner
  const [createdTeamResult, setCreatedTeamResult] = useState<{
    teamName: string;
    email: string;
    password: string;
  } | null>(null);

  // Status messages
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );

  // Cascading Deletion Modal State
  const [deleteModalState, setDeleteModalState] = useState<{
    isOpen: boolean;
    type: 'YEAR' | 'SECTION' | 'TEAM';
    id: string;
    title: string;
    name: string;
    warningNote: string;
  }>({
    isOpen: false,
    type: 'YEAR',
    id: '',
    title: '',
    name: '',
    warningNote: '',
  });

  const [isDeleting, setIsDeleting] = useState(false);

  // Email logs modal & status
  const [mailLogsOpen, setMailLogsOpen] = useState(false);
  const [mailLogs, setMailLogs] = useState<Array<{ to: string; subject: string; text: string; mode?: string; date: string }>>([]);
  const [mailStatus, setMailStatus] = useState<{ configured: boolean; mode: string; host: string; port: string; user: string | null } | null>(null);
  const [smtpGuideOpen, setSmtpGuideOpen] = useState(false);
  const [isSendingTestMail, setIsSendingTestMail] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [yearsRes, sectionsRes, teamsRes, statusRes] = await Promise.all([
        api.get('/academic/years'),
        api.get('/academic/sections'),
        api.get('/academic/teams'),
        api.get('/academic/mail-status'),
      ]);
      if (yearsRes.data.success) {
        setYears(yearsRes.data.years);
        if (yearsRes.data.years.length > 0 && !selectedYearId) {
          setSelectedYearId(yearsRes.data.years[0]._id);
        }
      }
      if (sectionsRes.data.success) setSections(sectionsRes.data.sections);
      if (teamsRes.data.success) setTeams(teamsRes.data.teams);
      if (statusRes.data.success) setMailStatus(statusRes.data);
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: 'Failed to load academic data.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter sections by selected year
  const filteredSections = selectedYearId
    ? sections.filter((s) =>
        typeof s.yearId === 'object' ? s.yearId._id === selectedYearId : s.yearId === selectedYearId
      )
    : [];

  // Filter teams by selected section
  const filteredTeams = selectedSectionId
    ? teams.filter((t) =>
        typeof t.sectionId === 'object' ? t.sectionId._id === selectedSectionId : t.sectionId === selectedSectionId
      )
    : selectedYearId
    ? teams.filter((t) =>
        typeof t.yearId === 'object' ? t.yearId._id === selectedYearId : t.yearId === selectedYearId
      )
    : teams;

  // Add Year
  const handleAddYear = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newYearInput.trim()) return;

    try {
      const res = await api.post('/academic/years', { year: newYearInput.trim() });
      if (res.data.success) {
        setStatusMessage({ type: 'success', text: `Academic Year ${res.data.year.year} created successfully!` });
        setNewYearInput('');
        loadData();
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.response?.data?.message || 'Failed to create academic year.' });
    }
  };

  // Add Section
  const handleAddSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedYearId || !newSectionInput.trim()) return;

    try {
      const res = await api.post('/academic/sections', {
        yearId: selectedYearId,
        name: newSectionInput.trim(),
      });
      if (res.data.success) {
        setStatusMessage({ type: 'success', text: `Section "${res.data.section.name}" created!` });
        setNewSectionInput('');
        loadData();
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.response?.data?.message || 'Failed to create section.' });
    }
  };

  // Add Team & Team Lead
  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedYearId || !selectedSectionId || !teamName || !teamLeadName || !teamLeadEmail) {
      setStatusMessage({ type: 'error', text: 'All team fields are required.' });
      return;
    }

    try {
      const members = membersInput
        .split(',')
        .map((m) => m.trim())
        .filter(Boolean);

      const res = await api.post('/academic/teams', {
        yearId: selectedYearId,
        sectionId: selectedSectionId,
        name: teamName.trim(),
        members,
        teamLeadName: teamLeadName.trim(),
        teamLeadEmail: teamLeadEmail.trim().toLowerCase(),
      });

      if (res.data.success) {
        setCreatedTeamResult({
          teamName: teamName.trim(),
          email: teamLeadEmail.trim().toLowerCase(),
          password: res.data.generatedPasswordForTeacherRecord,
        });

        setStatusMessage({
          type: 'success',
          text: `Team "${teamName}" created! Temporary credentials sent to ${teamLeadEmail}.`,
        });

        // Clear team form
        setTeamName('');
        setMembersInput('');
        setTeamLeadName('');
        setTeamLeadEmail('');
        loadData();
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.response?.data?.message || 'Failed to create team.' });
    }
  };

  // Trigger Cascading Deletion
  const triggerDelete = (type: 'YEAR' | 'SECTION' | 'TEAM', id: string, name: string) => {
    let warningNote = '';
    if (type === 'YEAR') {
      warningNote = `Deleting Academic Year "${name}" will permanently destroy all its dependent Sections, Teams, Student Leads, and Project Submissions.`;
    } else if (type === 'SECTION') {
      warningNote = `Deleting Section "${name}" will permanently destroy all teams and project submissions under it.`;
    } else {
      warningNote = `Deleting Team "${name}" will remove team credentials and their submitted project.`;
    }

    setDeleteModalState({
      isOpen: true,
      type,
      id,
      title: `Delete ${type.toLowerCase()} "${name}"?`,
      name,
      warningNote,
    });
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      if (deleteModalState.type === 'YEAR') {
        await api.delete(`/academic/years/${deleteModalState.id}`);
      } else if (deleteModalState.type === 'SECTION') {
        await api.delete(`/academic/sections/${deleteModalState.id}`);
      } else {
        await api.delete(`/academic/teams/${deleteModalState.id}`);
      }

      setStatusMessage({
        type: 'success',
        text: `Successfully deleted ${deleteModalState.name} and cascaded dependent records.`,
      });
      setDeleteModalState((prev) => ({ ...prev, isOpen: false }));
      loadData();
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.response?.data?.message || 'Delete operation failed.' });
    } finally {
      setIsDeleting(false);
    }
  };

  const openMailLogs = async () => {
    try {
      const res = await api.get('/auth/mail-logs');
      if (res.data.success) {
        setMailLogs(res.data.logs);
        setMailLogsOpen(true);
      }
    } catch (err) {
      console.error('Failed to fetch mail logs:', err);
    }
  };

  const handleSendTestEmail = async () => {
    setIsSendingTestMail(true);
    setStatusMessage(null);
    try {
      const res = await api.post('/academic/test-mail', {});
      if (res.data.success) {
        setStatusMessage({ type: 'success', text: res.data.message });
      }
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to dispatch test email.',
      });
    } finally {
      setIsSendingTestMail(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Tab Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Academic Hierarchy Management</h2>
          <p className="text-xs text-slate-500 mt-1">
            Configure Academic Years $\rightarrow$ Sections $\rightarrow$ Teams $\rightarrow$ Team Leads
          </p>
        </div>

        <button
          onClick={openMailLogs}
          className="inline-flex items-center space-x-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
        >
          <Mail className="w-4 h-4 text-slate-500" />
          <span>View Notification / Email Logs</span>
        </button>
      </div>

      {/* Email Service Delivery Status Banner */}
      <div
        className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
          mailStatus?.configured
            ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
            : 'bg-amber-50/90 border-amber-200 text-amber-950'
        }`}
      >
        <div className="flex items-start sm:items-center space-x-3.5">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              mailStatus?.configured ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
            }`}
          >
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-sm">
                {mailStatus?.configured ? 'Live SMTP Email Delivery: ACTIVE' : 'Email Service: Local Development / Simulated'}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  mailStatus?.configured ? 'bg-emerald-200 text-emerald-800' : 'bg-amber-200 text-amber-900'
                }`}
              >
                {mailStatus?.configured ? 'Real Delivery' : 'Simulated'}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              {mailStatus?.configured
                ? `Connected to ${mailStatus.host} via ${mailStatus.user}. All team passwords and evaluations are dispatched to real student inboxes.`
                : 'SMTP credentials are not configured in server/.env. Generated passwords and evaluation results are recorded locally in Notification Logs so you can test freely.'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0 self-start sm:self-auto flex-wrap">
          {mailStatus?.configured ? (
            <button
              onClick={handleSendTestEmail}
              disabled={isSendingTestMail}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center space-x-1.5 disabled:opacity-50"
            >
              {isSendingTestMail ? (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Mail className="w-3.5 h-3.5" />
              )}
              <span>{isSendingTestMail ? 'Sending Test...' : 'Send Test Email'}</span>
            </button>
          ) : (
            <button
              onClick={() => setSmtpGuideOpen(true)}
              className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              How to Send Real Emails
            </button>
          )}
          <button
            onClick={openMailLogs}
            className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold transition-colors"
          >
            Notification Logs
          </button>
        </div>
      </div>

      {statusMessage && (
        <div
          className={`p-4 rounded-2xl flex items-start space-x-3 text-xs animate-in fade-in ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
              : 'bg-red-50 border border-red-200 text-red-900'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Generated Password Success Card */}
      {createdTeamResult && (
        <div className="bg-emerald-50 border-2 border-emerald-300 rounded-3xl p-6 shadow-sm space-y-3 animate-in slide-in-from-top-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-emerald-900 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Team Provisioned & Credentials Generated</span>
            </div>
            <button
              onClick={() => setCreatedTeamResult(null)}
              className="text-xs text-emerald-700 hover:underline font-semibold"
            >
              Dismiss
            </button>
          </div>

          <p className="text-xs text-emerald-800">
            A confirmation email was dispatched to <strong>{createdTeamResult.email}</strong>. For your records as course faculty, here are the generated access credentials:
          </p>

          <div className="bg-white p-3.5 rounded-xl border border-emerald-200 flex items-center justify-between font-mono text-xs text-slate-800">
            <div>
              <span>Team: <strong>{createdTeamResult.teamName}</strong> | Email: <strong>{createdTeamResult.email}</strong></span>
              <div className="mt-1 text-emerald-700 font-bold text-sm">Password: {createdTeamResult.password}</div>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(createdTeamResult.password);
                alert('Password copied to clipboard!');
              }}
              title="Copy Password"
              className="p-2 hover:bg-slate-100 rounded-lg text-slate-500"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Grid: 3 Columns Hierarchy */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Column 1: Academic Years (3 cols) */}
        <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm border-b border-slate-100 pb-3">
            <Calendar className="w-4 h-4 text-rgukt-600" />
            <span>Academic Years</span>
          </div>

          <form onSubmit={handleAddYear} className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. 2027"
              value={newYearInput}
              onChange={(e) => setNewYearInput(e.target.value)}
              className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-rgukt-600"
            />
            <button
              type="submit"
              className="p-2 bg-rgukt-800 text-white rounded-xl hover:bg-rgukt-900"
              title="Add Year"
            >
              <Plus className="w-4 h-4" />
            </button>
          </form>

          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {years.map((y) => (
              <div
                key={y._id}
                onClick={() => {
                  setSelectedYearId(y._id);
                  setSelectedSectionId('');
                }}
                className={`p-3 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition-all ${
                  selectedYearId === y._id
                    ? 'bg-rgukt-50 border-rgukt-300 text-rgukt-900 font-bold shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="text-sm font-bold">Year {y.year}</div>
                  <div className="text-[10px] text-slate-400 font-normal">
                    {y.sectionCount || 0} Sections · {y.teamCount || 0} Teams
                  </div>
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      triggerDelete('YEAR', y._id, `Year ${y.year}`);
                    }}
                    title="Delete Year (Cascading)"
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: Sections (3 cols) */}
        <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm border-b border-slate-100 pb-3">
            <Layers className="w-4 h-4 text-rgukt-600" />
            <span>Sections</span>
          </div>

          {selectedYearId ? (
            <form onSubmit={handleAddSection} className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. CSE-C"
                value={newSectionInput}
                onChange={(e) => setNewSectionInput(e.target.value)}
                className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-rgukt-600 uppercase"
              />
              <button
                type="submit"
                className="p-2 bg-rgukt-800 text-white rounded-xl hover:bg-rgukt-900"
                title="Add Section"
              >
                <Plus className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <p className="text-xs text-slate-400 italic">Select an Academic Year first.</p>
          )}

          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {filteredSections.length === 0 ? (
              <p className="text-xs text-slate-400 p-3 text-center">No sections created yet.</p>
            ) : (
              filteredSections.map((s) => (
                <div
                  key={s._id}
                  onClick={() => setSelectedSectionId(s._id)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition-all ${
                    selectedSectionId === s._id
                      ? 'bg-rgukt-50 border-rgukt-300 text-rgukt-900 font-bold shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <div className="text-sm font-bold">{s.name}</div>
                    <div className="text-[10px] text-slate-400 font-normal">
                      {s.teamCount || 0} Teams
                    </div>
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        triggerDelete('SECTION', s._id, s.name);
                      }}
                      title="Delete Section"
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 3: Team Creation & Teams List (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm border-b border-slate-100 pb-3">
            <Users className="w-4 h-4 text-rgukt-600" />
            <span>Create Team & Dispatch Lead Credentials</span>
          </div>

          {selectedYearId && selectedSectionId ? (
            <form onSubmit={handleCreateTeam} className="space-y-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Team Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Team Delta"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Team Lead Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Varma"
                    value={teamLeadName}
                    onChange={(e) => setTeamLeadName(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="text-xs">
                <label className="block font-bold text-slate-700 mb-1">
                  Team Lead College Email <span className="text-rgukt-600 font-normal">(@rguktsklm.ac.in)</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="ramesh@rguktsklm.ac.in"
                  value={teamLeadEmail}
                  onChange={(e) => setTeamLeadEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl"
                />
              </div>

              <div className="text-xs">
                <label className="block font-bold text-slate-700 mb-1">
                  Team Members <span className="text-slate-400 font-normal">(Comma-separated names)</span>
                </label>
                <input
                  type="text"
                  placeholder="Ramesh Varma, Swathi K, Naveen P"
                  value={membersInput}
                  onChange={(e) => setMembersInput(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-sm transition-all flex items-center justify-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Create Team & Dispatch Email Credentials</span>
              </button>
            </form>
          ) : (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-800">
              Please select both an <strong>Academic Year</strong> and a <strong>Section</strong> from the left columns to provision teams.
            </div>
          )}

          {/* Teams Table */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Existing Teams ({filteredTeams.length})
            </h4>

            <div className="space-y-2 max-h-[350px] overflow-y-auto">
              {filteredTeams.length === 0 ? (
                <p className="text-xs text-slate-400 p-4 text-center">No teams created in this selection.</p>
              ) : (
                filteredTeams.map((t) => (
                  <div
                    key={t._id}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                        <span>{t.name}</span>
                        {t.isSubmitted ? (
                          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                            Project Submitted
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">
                            Pending Upload
                          </span>
                        )}
                      </div>
                      <div className="text-slate-500 mt-0.5">
                        Lead: <span className="font-medium text-slate-700">{t.teamLeadName}</span> ({t.teamLeadEmail})
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">
                        Members: {t.members?.join(', ') || 'None'}
                      </div>
                    </div>

                    <button
                      onClick={() => triggerDelete('TEAM', t._id, t.name)}
                      title="Delete Team"
                      className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 ml-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalState.isOpen}
        title={deleteModalState.title}
        message={`Are you sure you want to permanently delete this ${deleteModalState.type.toLowerCase()}?`}
        warningNote={deleteModalState.warningNote}
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteModalState((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Mail Logs Modal */}
      {mailLogsOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Mail className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-sm">Dispatched Email Notification Logs</h3>
              </div>
              <button
                onClick={() => setMailLogsOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-3 flex-1">
              {mailLogs.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-8">No emails dispatched yet.</p>
              ) : (
                mailLogs.map((log, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{log.subject}</span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(log.date).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="text-slate-600 font-mono text-[11px]">To: {log.to}</div>
                    <pre className="p-2.5 bg-slate-100 rounded-xl text-[11px] font-mono text-slate-700 whitespace-pre-wrap">
                      {log.text}
                    </pre>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* SMTP Setup Guide Modal */}
      {smtpGuideOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Mail className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm">How to Enable Real Email Delivery</h3>
              </div>
              <button
                onClick={() => setSmtpGuideOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-700 leading-relaxed">
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900">
                <strong>Why are emails currently simulated?</strong>
                <p className="mt-1 text-slate-600">
                  Sending real emails over the internet to inboxes (@rguktsklm.ac.in or Gmail) requires a configured SMTP mail server. Without SMTP credentials, the application logs emails locally into <strong>Notification Logs</strong> to prevent crashes.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-sm">Option A: Using Any Gmail Account (Recommended)</h4>
                <ol className="list-decimal pl-5 space-y-1 text-slate-600">
                  <li>Open your Google Account $\rightarrow$ <strong>Security</strong>.</li>
                  <li>Enable <strong>2-Step Verification</strong> (if not enabled).</li>
                  <li>Search for <strong>"App Passwords"</strong> in the Google Account search bar.</li>
                  <li>Create an App Password named <em>"College Project Hub"</em>. Google will show a 16-character code (e.g. <code className="bg-slate-100 px-1 py-0.5 rounded">abcd efgh ijkl mnop</code>).</li>
                  <li>Open <code className="bg-slate-100 px-1 py-0.5 rounded">server/.env</code> in your editor and paste:</li>
                </ol>
                <pre className="p-3 bg-slate-900 text-emerald-300 rounded-xl font-mono text-[11px] overflow-x-auto">
{`SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_personal_or_department_email@gmail.com
SMTP_PASS=your_16_digit_app_password
SMTP_FROM="College Project Hub <noreply@rguktsklm.ac.in>"`}
                </pre>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <h4 className="font-bold text-slate-900 text-sm">Option B: College SMTP Server</h4>
                <p className="text-slate-600">
                  If the university provides internal SMTP relay credentials, configure them in <code className="bg-slate-100 px-1 py-0.5 rounded">server/.env</code>:
                </p>
                <pre className="p-3 bg-slate-900 text-slate-200 rounded-xl font-mono text-[11px] overflow-x-auto">
{`SMTP_HOST=mail.rguktsklm.ac.in
SMTP_PORT=587
SMTP_USER=cse-projects@rguktsklm.ac.in
SMTP_PASS=your_smtp_password`}
                </pre>
              </div>

              <div className="pt-2 text-center">
                <button
                  onClick={() => setSmtpGuideOpen(false)}
                  className="px-5 py-2.5 bg-rgukt-800 hover:bg-rgukt-900 text-white rounded-xl font-bold text-xs"
                >
                  Got It
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
