import React from 'react';
import { WORLD_PATHS, WORLD_VIEWBOX, CountryPath } from '../data/worldPaths';

interface WorldMapProps {
  selected: string[];
  onToggle: (id: string) => void;
  highlightIds?: string[]; // optional subset to pre-highlight
}

export const WorldMap: React.FC<WorldMapProps> = ({ selected, onToggle, highlightIds }) => {
  return (
    <svg viewBox={WORLD_VIEWBOX} className="w-full h-auto" role="img" aria-label="World map">
      <title>World Coverage Map</title>
      <g>
        {WORLD_PATHS.map((c: CountryPath) => {
          const active = selected.includes(c.id);
          const highlight = highlightIds?.includes(c.id);
          return (
            <path
              key={c.id}
              d={c.d}
              onClick={() => onToggle(c.id)}
              className={`world-country ${active ? 'active' : ''} ${highlight && !active ? 'highlight' : ''}`}
              data-id={c.id}
            >
            </path>
          );
        })}
      </g>
    </svg>
  );
};
