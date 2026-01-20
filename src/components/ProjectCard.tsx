import React from 'react';
import { Link } from 'react-router-dom';
import { Project } from '../types';
import { ImageWithFallback } from './ui/ImageWithFallback';

interface ProjectCardProps {
  project: Project;
  onSupport?: () => void;
}

// Minimal, dependency-free ProjectCard for featured projects on the landing page
const ProjectCard: React.FC<ProjectCardProps> = ({ project, onSupport }) => {
  const { title, description, thumbnail, location } = project;
  const img = thumbnail || '/images/placeholder-generic.svg';

  return (
    <div className="rounded-lg border overflow-hidden bg-white" style={{ borderColor: 'var(--color-border)' }}>
      <div className="w-full aspect-[4/3] bg-background-light border-b" style={{ borderColor: 'var(--rose-200)' }}>
        <ImageWithFallback src={img} alt={title} />
      </div>
      <div className="p-4 space-y-2">
        <div className="text-sm font-semibold text-[var(--rose-700)]">{location || '—'}</div>
        <h3 className="font-bold text-[18px]" style={{ color: 'var(--color-text-primary)' }}>{title}</h3>
        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          {description?.length ? (description.length > 120 ? description.slice(0, 117) + '…' : description) : '—'}
        </p>
        <div className="flex items-center gap-2 pt-2">
          <Link to={`/projects`} className="btn-outline-rose text-sm">Details</Link>
          <Link
            to="/donate"
            className="btn-donate text-sm"
            onClick={() => {
              if (onSupport) {
                // allow callback for future donate modal; keep navigation default
                try { onSupport(); } catch (_) { /* noop */ }
              }
            }}
          >
            Support
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
