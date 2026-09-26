import React from 'react';

interface SkillRadarProps {
  aptitude: number;
  logical: number;
  coding: number;
  technical: number;
  communication: number;
  size?: number;
  comparisonScores?: {
    aptitude: number;
    logical: number;
    coding: number;
    technical: number;
    communication: number;
  };
}

export const SkillRadar: React.FC<SkillRadarProps> = ({
  aptitude,
  logical,
  coding,
  technical,
  communication,
  size = 280,
  comparisonScores
}) => {
  const center = size / 2;
  const radius = (size / 2) - 40;

  const categories = [
    { name: 'Aptitude', value: aptitude, compValue: comparisonScores?.aptitude },
    { name: 'Logical', value: logical, compValue: comparisonScores?.logical },
    { name: 'Coding', value: coding, compValue: comparisonScores?.coding },
    { name: 'Technical', value: technical, compValue: comparisonScores?.technical },
    { name: 'Communication', value: communication, compValue: comparisonScores?.communication },
  ];

  const numPoints = categories.length;
  const angleStep = (Math.PI * 2) / numPoints;

  // Levels for the radar grid (25%, 50%, 75%, 100%)
  const levels = [0.25, 0.5, 0.75, 1];

  const getCoordinates = (value: number, index: number) => {
    const angle = index * angleStep - Math.PI / 2;
    const r = (value / 100) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  const currentPoints = categories
    .map((c, i) => {
      const { x, y } = getCoordinates(c.value, i);
      return `${x},${y}`;
    })
    .join(' ');

  const comparisonPoints = comparisonScores
    ? categories
        .map((c, i) => {
          const { x, y } = getCoordinates(c.compValue || 0, i);
          return `${x},${y}`;
        })
        .join(' ')
    : null;

  return (
    <div className="flex flex-col items-center justify-center p-2">
      <svg width={size} height={size} className="overflow-visible">
        {/* Background Grid Circles / Polygons */}
        {levels.map((lvl, idx) => {
          const gridPoints = Array.from({ length: numPoints })
            .map((_, i) => {
              const angle = i * angleStep - Math.PI / 2;
              const x = center + radius * lvl * Math.cos(angle);
              const y = center + radius * lvl * Math.sin(angle);
              return `${x},${y}`;
            })
            .join(' ');

          return (
            <polygon
              key={`grid-${idx}`}
              points={gridPoints}
              fill="none"
              stroke="currentColor"
              strokeDasharray={idx < 3 ? '2 2' : 'none'}
              className="text-slate-200 dark:text-slate-800"
              strokeWidth="1"
            />
          );
        })}

        {/* Axis Lines from Center to Edges */}
        {categories.map((_, i) => {
          const angle = i * angleStep - Math.PI / 2;
          const x = center + radius * Math.cos(angle);
          const y = center + radius * Math.sin(angle);
          return (
            <line
              key={`axis-${i}`}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="currentColor"
              className="text-slate-200 dark:text-slate-800"
              strokeWidth="1"
            />
          );
        })}

        {/* Comparison Polygon (e.g. Previous assessment in Before-and-After) */}
        {comparisonPoints && (
          <polygon
            points={comparisonPoints}
            fill="rgba(148, 163, 184, 0.25)"
            stroke="#94A3B8"
            strokeWidth="1.5"
            strokeDasharray="4 3"
          />
        )}

        {/* Current Student Skill Polygon */}
        <polygon
          points={currentPoints}
          fill="rgba(79, 70, 229, 0.25)"
          stroke="#4F46E5"
          strokeWidth="2.5"
          className="transition-all duration-700 ease-out"
        />

        {/* Vertex Dots & Value Labels */}
        {categories.map((c, i) => {
          const { x, y } = getCoordinates(c.value, i);
          const angle = i * angleStep - Math.PI / 2;
          const labelDist = radius + 22;
          const labelX = center + labelDist * Math.cos(angle);
          const labelY = center + labelDist * Math.sin(angle);

          return (
            <g key={`vertex-${i}`}>
              <circle
                cx={x}
                cy={y}
                r="4"
                className="fill-indigo-600 stroke-white dark:stroke-slate-900"
                strokeWidth="2"
              />
              <text
                x={labelX}
                y={labelY}
                textAnchor="middle"
                dominantBaseline="central"
                className="text-[11px] font-semibold fill-slate-700 dark:fill-slate-300"
              >
                {c.name} ({c.value}%)
              </text>
            </g>
          );
        })}
      </svg>

      {comparisonScores && (
        <div className="flex items-center gap-4 mt-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-slate-400 border-dashed"></span>
            <span className="text-slate-500">Initial Diagnostic</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-indigo-600 rounded"></span>
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">Current Readiness</span>
          </div>
        </div>
      )}
    </div>
  );
};
