import React from 'react';
import { KPICard } from './KPICard';
import { KPIData } from '../types';

interface KPISectionProps {
  kpis: KPIData[];
  selectedKpiId?: string;
  onSelectKpi?: (id: string) => void;
}

export const KPISection: React.FC<KPISectionProps> = ({
  kpis,
  selectedKpiId,
  onSelectKpi,
}) => {
  return (
    <section id="kpi-section" aria-label="Key Performance Indicators" className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {kpis.map((kpi) => (
          <KPICard
            key={kpi.id}
            kpi={kpi}
            isSelected={selectedKpiId === kpi.id}
            onClick={() => onSelectKpi && onSelectKpi(kpi.id)}
          />
        ))}
      </div>
    </section>
  );
};
