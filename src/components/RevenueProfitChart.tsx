import React, { useState, useRef, useId } from 'react';
import { TimeRange, ChartDataPoint } from '../types';

interface RevenueProfitChartProps {
  data: ChartDataPoint[];
  selectedRange: TimeRange;
  onRangeChange: (range: TimeRange) => void;
  currencySymbol?: string;
}

export const RevenueProfitChart: React.FC<RevenueProfitChartProps> = ({
  data,
  selectedRange,
  onRangeChange,
  currencySymbol = '$',
}) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(data.length - 1);
  const containerRef = useRef<HTMLDivElement>(null);
  const chartId = useId();

  const ranges: TimeRange[] = ['7D', '30D', '90D', '1Y'];

  // Dimensions & scaling
  const width = 640;
  const height = 240;
  const padding = { top: 20, right: 20, bottom: 35, left: 50 };

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Max value calculation
  const maxVal = Math.max(...data.map((d) => Math.max(d.revenue, d.profit))) * 1.15 || 50000;
  const minVal = 0;

  const getX = (index: number) => {
    if (data.length <= 1) return padding.left;
    return padding.left + (index / (data.length - 1)) * chartWidth;
  };

  const getY = (value: number) => {
    return padding.top + chartHeight - ((value - minVal) / (maxVal - minVal)) * chartHeight;
  };

  // Generate smooth cubic bezier SVG curve
  const generateCurvedPath = (points: [number, number][]) => {
    if (points.length < 2) return '';
    let path = `M ${points[0][0]},${points[0][1]}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = i > 0 ? points[i - 1] : points[0];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = i !== points.length - 2 ? points[i + 2] : p2;

      const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
      const cp1y = p1[1] + (p2[1] - p0[1]) / 6;

      const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
      const cp2y = p2[1] - (p3[1] - p1[1]) / 6;

      path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2[0]},${p2[1]}`;
    }
    return path;
  };

  const revenuePoints: [number, number][] = data.map((d, i) => [getX(i), getY(d.revenue)]);
  const profitPoints: [number, number][] = data.map((d, i) => [getX(i), getY(d.profit)]);

  const revenuePath = generateCurvedPath(revenuePoints);
  const profitPath = generateCurvedPath(profitPoints);

  // Gradient area paths
  const revenueAreaPath = `${revenuePath} L ${revenuePoints[revenuePoints.length - 1][0]},${
    padding.top + chartHeight
  } L ${revenuePoints[0][0]},${padding.top + chartHeight} Z`;

  // Grid steps (4 horizontal lines)
  const gridSteps = [0, 0.25, 0.5, 0.75, 1];

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!containerRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const normalizedX = (x / rect.width) * width;

    let closestIdx = 0;
    let minDiff = Infinity;
    data.forEach((_, idx) => {
      const diff = Math.abs(getX(idx) - normalizedX);
      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = idx;
      }
    });
    setHoverIndex(closestIdx);
  };

  const activePoint = hoverIndex !== null && data[hoverIndex] ? data[hoverIndex] : data[data.length - 1];

  return (
    <div
      id="revenue-profit-chart-card"
      ref={containerRef}
      className="bg-[#0A0A0A] rounded-xl p-5 border border-[#1C1C1C] flex flex-col justify-between flex-1 shadow-lg select-none"
    >
      {/* Header with Title, Legend & Time Range Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#161616]">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            Evolução de Receita & Lucro
            <span className="w-2.5 h-2.5 rounded-full icon-badge-blend" />
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Demonstrativo diário de faturamento bruto versus resultado líquido operacional.
          </p>
        </div>

        {/* Legend & Range Buttons */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 text-xs font-semibold">
            <div className="flex items-center gap-1.5 text-white">
              <span className="w-3 h-3 rounded-sm bg-gradient-to-r from-white via-[#FFD000] to-[#B8860B] border border-[#FFF9C4]" />
              <span>Receita</span>
            </div>
            <div className="flex items-center gap-1.5 text-neutral-300">
              <span className="w-3 h-3 rounded-sm bg-gradient-to-r from-white to-[#D4AF37] border border-white" />
              <span>Lucro</span>
            </div>
          </div>

          <div className="flex items-center bg-[#141414] rounded-lg p-1 border border-[#222222]">
            {ranges.map((range) => (
              <button
                key={range}
                id={`chart-range-${range}`}
                onClick={() => onRangeChange(range)}
                className={`px-3 py-1 text-xs font-extrabold rounded transition-all ${
                  selectedRange === range
                    ? 'btn-gold-blend shadow-md'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SVG Dual-Line Chart */}
      <div className="relative w-full aspect-[16/7] min-h-[220px] mt-4">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full overflow-visible"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoverIndex(data.length - 1)}
        >
          <defs>
            {/* Multi-stop Area Gradient: White + Loaded Yellow + Loaded Gold */}
            <linearGradient id={`${chartId}-revGrad`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.45" />
              <stop offset="25%" stopColor="#FFF275" stopOpacity="0.30" />
              <stop offset="60%" stopColor="#FFD000" stopOpacity="0.18" />
              <stop offset="85%" stopColor="#B8860B" stopOpacity="0.06" />
              <stop offset="100%" stopColor="#7A5200" stopOpacity="0.0" />
            </linearGradient>

            {/* Revenue Line Stroke: White into Electric Yellow into Deep Gold */}
            <linearGradient id={`${chartId}-revStroke`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="25%" stopColor="#FFF275" />
              <stop offset="65%" stopColor="#FFD000" />
              <stop offset="100%" stopColor="#B8860B" />
            </linearGradient>

            {/* Profit Line Stroke: Pure White into Soft Gold */}
            <linearGradient id={`${chartId}-profitStroke`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="50%" stopColor="#FFF8B0" />
              <stop offset="100%" stopColor="#D4AF37" />
            </linearGradient>

            <filter id={`${chartId}-glow`} x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#FFD000" floodOpacity="0.6" />
            </filter>
          </defs>

          {/* Horizontal Grid lines */}
          {gridSteps.map((step) => {
            const y = padding.top + chartHeight * (1 - step);
            const val = minVal + (maxVal - minVal) * step;
            return (
              <g key={step}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="#1C1C1C"
                  strokeDasharray="3 3"
                />
                <text
                  x={padding.left - 8}
                  y={y + 3.5}
                  textAnchor="end"
                  className="text-[10px] fill-neutral-500 font-mono"
                >
                  {currencySymbol}
                  {val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val.toFixed(0)}
                </text>
              </g>
            );
          })}

          {/* Area Gradients */}
          {revenueAreaPath && <path d={revenueAreaPath} fill={`url(#${chartId}-revGrad)`} />}

          {/* Profit Line (White to Gold Blend) */}
          {profitPath && (
            <path
              d={profitPath}
              fill="none"
              stroke={`url(#${chartId}-profitStroke)`}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Revenue Line (Charged Yellow + Gold + White Blend) */}
          {revenuePath && (
            <path
              d={revenuePath}
              fill="none"
              stroke={`url(#${chartId}-revStroke)`}
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter={`url(#${chartId}-glow)`}
            />
          )}

          {/* Active Hover Guide & Points */}
          {hoverIndex !== null && data[hoverIndex] && (
            <g>
              <line
                x1={getX(hoverIndex)}
                y1={padding.top}
                x2={getX(hoverIndex)}
                y2={padding.top + chartHeight}
                stroke="#FFE066"
                strokeWidth="1.5"
                strokeDasharray="2 2"
              />

              {/* Profit circle point */}
              <circle
                cx={getX(hoverIndex)}
                cy={getY(data[hoverIndex].profit)}
                r="4.5"
                fill="#FFFFFF"
                stroke="#D4AF37"
                strokeWidth="2"
              />

              {/* Revenue circle point with white inner, yellow core and gold ring */}
              <circle
                cx={getX(hoverIndex)}
                cy={getY(data[hoverIndex].revenue)}
                r="6.5"
                fill="#FFD000"
                stroke="#FFFFFF"
                strokeWidth="2.5"
              />
              <circle
                cx={getX(hoverIndex)}
                cy={getY(data[hoverIndex].revenue)}
                r="3"
                fill="#FFFFFF"
              />
            </g>
          )}

          {/* X Axis Date Labels */}
          {data.map((d, idx) => {
            if (data.length > 7 && idx % Math.ceil(data.length / 7) !== 0 && idx !== data.length - 1) {
              return null;
            }
            return (
              <text
                key={idx}
                x={getX(idx)}
                y={height - 8}
                textAnchor="middle"
                className={`text-[10px] font-mono ${
                  hoverIndex === idx ? 'fill-[#FFD000] font-bold' : 'fill-neutral-400'
                }`}
              >
                {d.date}
              </text>
            );
          })}
        </svg>
      </div>

      {/* Floating Active Info Panel */}
      {activePoint && (
        <div className="mt-4 pt-3 border-t border-[#161616] flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-mono text-neutral-400">{activePoint.date}:</span>
          </div>
          <div className="flex items-center gap-6">
            <div>
              <span className="text-neutral-400 mr-2">Receita Bruta:</span>
              <span className="font-bold text-[#FFD000] font-mono">
                {currencySymbol}
                {activePoint.revenue.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-neutral-400 mr-2">Lucro Líquido:</span>
              <span className="font-bold text-white font-mono">
                {currencySymbol}
                {activePoint.profit.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-neutral-400 mr-2">Margem:</span>
              <span className="font-bold text-white font-mono">
                {Math.round((activePoint.profit / (activePoint.revenue || 1)) * 100)}%
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
