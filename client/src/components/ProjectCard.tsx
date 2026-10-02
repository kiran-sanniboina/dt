import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Project } from '../types';
import { ProjectPreviewModal } from './ProjectPreviewModal';
import {
  ExternalLink,
  Eye,
  Star,
  Users,
  Calendar,
  Layers,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const [previewOpen, setPreviewOpen] = useState(false);

  const isRated = project.status === 'RATED' && project.ratingId;
  const score = isRated ? project.ratingId?.totalScore : null;

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between overflow-hidden group">
        <div className="p-6">
          {/* Top meta tags */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rgukt-50 text-rgukt-700 border border-rgukt-200">
                <Calendar className="w-3 h-3" />
                <span>{typeof project.yearId === 'object' ? project.yearId.year : '2026'}</span>
              </span>

              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                <Layers className="w-3 h-3" />
                <span>{typeof project.sectionId === 'object' ? project.sectionId.name : 'Section'}</span>
              </span>
            </div>

            {/* Rating or Review Status */}
            {isRated ? (
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 shadow-xs">
                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                <span>{score}/100</span>
              </span>
            ) : (
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                <Clock className="w-3 h-3" />
                <span>Submitted</span>
              </span>
            )}
          </div>

          {/* Project Title */}
          <Link to={`/project/${project._id}`}>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-rgukt-700 transition-colors line-clamp-1">
              {project.title}
            </h3>
          </Link>

          {/* Project Description */}
          <p className="text-sm text-slate-600 mt-2 line-clamp-2 leading-relaxed">
            {project.description}
          </p>

          {/* Team Context */}
          <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold text-slate-700">Team:</span>
              <span className="text-slate-900 font-medium">{project.teamId?.name || 'Academic Team'}</span>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold text-slate-700">Lead:</span>
              <span className="text-slate-900 font-medium">{project.teamId?.teamLeadName || 'Student Lead'}</span>
            </div>

            {/* Team Members List */}
            {project.teamId?.members && project.teamId.members.length > 0 && (
              <div className="flex items-start space-x-1.5 pt-1 text-xs">
                <Users className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                <div className="flex flex-wrap gap-1">
                  {project.teamId.members.slice(0, 3).map((member, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-slate-50 text-slate-600 text-[11px] border border-slate-200"
                    >
                      {member}
                    </span>
                  ))}
                  {project.teamId.members.length > 3 && (
                    <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 text-[10px]">
                      +{project.teamId.members.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Card Footer Actions */}
        <div className="bg-slate-50/80 px-6 py-3 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={() => setPreviewOpen(true)}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-rgukt-700 hover:text-rgukt-900 hover:underline"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Live Preview</span>
          </button>

          <div className="flex items-center space-x-2">
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Open external deployment"
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <Link
              to={`/project/${project._id}`}
              className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-rgukt-800 hover:bg-rgukt-900 text-white text-xs font-medium shadow-xs transition-colors"
            >
              <span>Details</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Embedded Live Preview Modal */}
      <ProjectPreviewModal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title={project.title}
        url={project.liveUrl}
      />
    </>
  );
};
