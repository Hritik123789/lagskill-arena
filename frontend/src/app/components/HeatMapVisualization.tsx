import { useEffect, useRef } from 'react';

interface HeatMapProps {
  data: number[][];
  width?: number;
  height?: number;
}

export function HeatMapVisualization({ data, width = 600, height = 400 }: HeatMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !data || data.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    const rows = data.length;
    const cols = data[0]?.length || 0;
    if (cols === 0) return;

    const cellWidth = width / cols;
    const cellHeight = height / rows;

    // Find max value for normalization
    const maxValue = Math.max(...data.flat());

    // Draw heat map
    data.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value > 0) {
          // Normalize value to 0-1
          const intensity = value / maxValue;
          
          // Create color gradient from blue (low) to red (high)
          const hue = (1 - intensity) * 240; // 240 = blue, 0 = red
          const saturation = 100;
          const lightness = 50 + (intensity * 20); // Brighter for higher values
          
          ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
          ctx.fillRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
          
          // Add slight border for visibility
          if (intensity > 0.3) {
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.strokeRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
          }
        }
      });
    });

    // Add overlay grid for better visibility
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= cols; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellWidth, 0);
      ctx.lineTo(i * cellWidth, height);
      ctx.stroke();
    }
    for (let i = 0; i <= rows; i++) {
      ctx.beginPath();
      ctx.moveTo(0, i * cellHeight);
      ctx.lineTo(width, i * cellHeight);
      ctx.stroke();
    }
  }, [data, width, height]);

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-[#0d1117] border border-[#30363d] rounded-lg">
        <p className="text-gray-500">No heat map data available</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="w-full h-auto bg-[#0d1117] border border-[#30363d] rounded-lg"
      />
      
      {/* Legend */}
      <div className="mt-4 space-y-3">
        <div className="flex items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-12 h-4 bg-gradient-to-r from-blue-500 via-yellow-500 to-red-500 rounded"></div>
            <span className="text-xs text-gray-400">Low Activity → High Activity</span>
          </div>
        </div>
        
        {/* Simple explanation */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            <span className="text-blue-400">■</span> Rarely seen enemies here | 
            <span className="text-yellow-400"> ■</span> Sometimes | 
            <span className="text-red-400"> ■</span> Enemies appear here often
          </p>
        </div>
      </div>
    </div>
  );
}
