interface TimelineData {
  frame: number;
  time: number;
  persons: number;
  motion: number;
  detections: Array<{ x: number; y: number; confidence: number }>;
}

interface TimelineProps {
  data: TimelineData[];
}

export function TimelineVisualization({ data }: TimelineProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 bg-[#0d1117] border border-[#30363d] rounded-lg">
        <p className="text-gray-500">No timeline data available</p>
      </div>
    );
  }

  const maxPersons = Math.max(...data.map(d => d.persons), 1);
  const maxMotion = Math.max(...data.map(d => d.motion), 1);

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4">
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-white mb-2">Frame-by-Frame Analysis</h4>
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>Character Detection</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span>Motion Intensity</span>
          </div>
        </div>
      </div>

      <div className="relative h-32 bg-[#0d1117] rounded-lg overflow-hidden">
        <svg width="100%" height="100%" className="absolute inset-0">
          {/* Grid lines */}
          <line x1="0" y1="64" x2="100%" y2="64" stroke="#30363d" strokeWidth="1" />
          <line x1="0" y1="32" x2="100%" y2="32" stroke="#30363d" strokeWidth="0.5" strokeDasharray="2,2" />
          <line x1="0" y1="96" x2="100%" y2="96" stroke="#30363d" strokeWidth="0.5" strokeDasharray="2,2" />

          {/* Character detection bars */}
          {data.map((point, i) => {
            const x = (i / data.length) * 100;
            const height = (point.persons / maxPersons) * 60;
            const y = 128 - height;
            
            return (
              <rect
                key={`persons-${i}`}
                x={`${x}%`}
                y={y}
                width={`${100 / data.length}%`}
                height={height}
                fill="rgba(34, 197, 94, 0.6)"
                className="hover:fill-green-400 transition-colors"
              >
                <title>{`Frame ${point.frame}: ${point.persons} characters`}</title>
              </rect>
            );
          })}

          {/* Motion intensity line */}
          <polyline
            points={data.map((point, i) => {
              const x = (i / data.length) * 100;
              const y = 128 - (point.motion / maxMotion) * 60;
              return `${x}%,${y}`;
            }).join(' ')}
            fill="none"
            stroke="rgba(59, 130, 246, 0.8)"
            strokeWidth="2"
          />
        </svg>

        {/* Time markers */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 pb-1 text-xs text-gray-500">
          <span>0s</span>
          <span>{(data[data.length - 1]?.time || 0).toFixed(1)}s</span>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-2xl font-bold text-green-400">{maxPersons}</div>
          <div className="text-xs text-gray-400">Peak Characters</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-blue-400">
            {(data.reduce((sum, d) => sum + d.persons, 0) / data.length).toFixed(1)}
          </div>
          <div className="text-xs text-gray-400">Avg Characters</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-purple-400">{data.length}</div>
          <div className="text-xs text-gray-400">Frames Analyzed</div>
        </div>
      </div>
    </div>
  );
}
