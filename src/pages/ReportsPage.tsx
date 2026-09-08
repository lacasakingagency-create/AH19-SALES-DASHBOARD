import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  FileBarChart,
  Download,
  Calendar,
  Layers,
  FileSpreadsheet,
  CheckCircle2,
  Share2,
  TrendingUp,
  DollarSign,
  Package,
} from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const {
    orders,
    products,
    transactions,
    countries,
    adPlatforms,
    formatCurrency,
    addToast,
    dateRangeLabel,
    t,
  } = useApp();

  const [reportType, setReportType] = useState('executive');
  const [exporting, setExporting] = useState(false);

  const handleExportCSV = (name: string) => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      addToast(
        'Relatório Exportado',
        `Arquivo ${name}.csv gerado com sucesso para download.`
      );
    }, 600);
  };

  const totalRevenue = orders.reduce(
    (sum, o) => sum + (o.status === 'Paid' ? o.rawAmount : 0),
    0
  );
  const totalCost = products.reduce((sum, p) => sum + p.cost * p.unitsSold, 0);
  const totalAdSpend = adPlatforms.reduce((sum, p) => sum + p.rawSpend, 0);
  const netEstimatedProfit = totalRevenue - totalCost - totalAdSpend;

  return (
    <div id="reports-page-container" className="space-y-6 select-none">
      {/* Header with Title & Quick Export */}
      <div className="flex items-center justify-between border-b border-[#1C1C1C] pb-4 flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            {t.rep_executive_summary}
            <span className="w-2 h-2 rounded-full bg-[#FFD000]" />
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Relatórios contábeis, auditoria de pedidos e demonstrações financeiras.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            id="export-full-csv-btn"
            onClick={() => handleExportCSV('AH19_Relatorio_Consolidado_2026')}
            disabled={exporting}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FFD000] hover:bg-[#E6BC00] text-black font-bold text-xs transition-colors shadow-sm cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{exporting ? 'Gerando Relatório...' : t.rep_export_csv}</span>
          </button>
        </div>
      </div>

      {/* Report Switcher Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            id: 'executive',
            title: 'Demonstrativo de Resultado (DRE)',
            desc: 'Receita líquida, deduções de marketing e margem real.',
            icon: TrendingUp,
          },
          {
            id: 'sales_audit',
            title: 'Auditoria de Pedidos & Checkout',
            desc: 'Detalhamento de volume, taxas e gateways.',
            icon: DollarSign,
          },
          {
            id: 'inventory',
            title: 'Margem & Curva ABC de Estoque',
            desc: 'Performance por SKU, giro e capital alocado.',
            icon: Package,
          },
        ].map((rep) => {
          const Icon = rep.icon;
          const isSelected = reportType === rep.id;
          return (
            <div
              key={rep.id}
              onClick={() => setReportType(rep.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer select-none ${
                isSelected
                  ? 'bg-[#0A0A0A] border-[#FFD000] ring-1 ring-[#FFD000]'
                  : 'bg-[#0A0A0A] border-[#1C1C1C] hover:border-[#2E2E2E]'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    isSelected
                      ? 'bg-[#FFD000] text-black'
                      : 'bg-[#141414] text-neutral-400 border border-[#2A2A2A]'
                  }`}
                >
                  <Icon className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white">{rep.title}</h3>
                  <p className="text-[11px] text-neutral-400 mt-0.5">{rep.desc}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Report Content Table */}
      <div className="bg-[#0A0A0A] rounded-xl border border-[#1C1C1C] p-6 space-y-6 shadow-lg">
        <div className="flex items-center justify-between border-b border-[#1C1C1C] pb-4">
          <div>
            <span className="text-[10px] font-mono text-[#FFD000] font-bold uppercase tracking-wider block">
              AH19 FINANCIAL AUDIT ENGINE
            </span>
            <h3 className="text-lg font-bold text-white tracking-tight mt-0.5">
              {reportType === 'executive' && 'Demonstrativo Consolidado de Resultados (DRE)'}
              {reportType === 'sales_audit' && 'Auditoria de Transações e Vendas'}
              {reportType === 'inventory' && 'Análise de Margem por Linha de Produto'}
            </h3>
          </div>
          <span className="text-xs font-mono text-neutral-400 bg-[#141414] px-3 py-1.5 rounded-lg border border-[#222222]">
            Período: {dateRangeLabel}
          </span>
        </div>

        {/* DRE Summary Table */}
        {reportType === 'executive' && (
          <div className="space-y-4">
            <div className="divide-y divide-[#1A1A1A] text-xs font-mono">
              <div className="py-3 flex justify-between items-center text-neutral-300">
                <span>(+) Faturamento Bruto de Vendas</span>
                <span className="font-bold text-white">{formatCurrency(totalRevenue)}</span>
              </div>
              <div className="py-3 flex justify-between items-center text-neutral-400">
                <span>(-) Custo dos Produtos Vendidos (COGS)</span>
                <span className="text-neutral-300">({formatCurrency(totalCost)})</span>
              </div>
              <div className="py-3 flex justify-between items-center text-neutral-400">
                <span>(-) Investimento em Tráfego Pago (Meta / Google / TikTok)</span>
                <span className="text-neutral-300">({formatCurrency(totalAdSpend)})</span>
              </div>
              <div className="py-3 flex justify-between items-center text-neutral-400">
                <span>(-) Taxas de Gateway & Meios de Pagamento (~2.9%)</span>
                <span className="text-neutral-300">
                  ({formatCurrency(totalRevenue * 0.029)})
                </span>
              </div>
              <div className="py-4 flex justify-between items-center text-sm font-bold bg-[#111111] px-3 rounded-lg border border-[#222222]">
                <span className="text-white">(=) LUCRO OPERACIONAL LÍQUIDO</span>
                <span className="text-[#FFD000] text-base">
                  {formatCurrency(netEstimatedProfit - totalRevenue * 0.029)}
                </span>
              </div>
            </div>
          </div>
        )}

        {reportType === 'sales_audit' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#1C1C1C] text-[11px] text-neutral-400 uppercase font-semibold">
                  <th className="py-2.5">Pedido</th>
                  <th className="py-2.5">Cliente</th>
                  <th className="py-2.5">País</th>
                  <th className="py-2.5 text-right">Valor</th>
                  <th className="py-2.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#141414]">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-[#141414]">
                    <td className="py-2.5 font-mono text-white font-bold">{o.orderNumber}</td>
                    <td className="py-2.5 text-neutral-300">
                      {typeof o.customer === 'object' ? o.customer?.name : String(o.customer)}
                    </td>
                    <td className="py-2.5 text-neutral-400">{o.country}</td>
                    <td className="py-2.5 text-right font-mono font-bold text-[#FFD000]">
                      {o.amount}
                    </td>
                    <td className="py-2.5 text-center">
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#141414] text-white border border-[#2A2A2A]">
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {reportType === 'inventory' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#1C1C1C] text-[11px] text-neutral-400 uppercase font-semibold">
                  <th className="py-2.5">Produto</th>
                  <th className="py-2.5">SKU</th>
                  <th className="py-2.5 text-right">Preço</th>
                  <th className="py-2.5 text-right">Custo</th>
                  <th className="py-2.5 text-right">Vendas</th>
                  <th className="py-2.5 text-right">Lucro Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#141414]">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-[#141414]">
                    <td className="py-2.5 font-bold text-white">{p.name}</td>
                    <td className="py-2.5 font-mono text-neutral-400">{p.sku}</td>
                    <td className="py-2.5 text-right font-mono text-white">
                      {formatCurrency(p.price)}
                    </td>
                    <td className="py-2.5 text-right font-mono text-neutral-400">
                      {formatCurrency(p.cost)}
                    </td>
                    <td className="py-2.5 text-right font-mono text-white">{p.unitsSold}</td>
                    <td className="py-2.5 text-right font-mono font-bold text-[#FFD000]">
                      {formatCurrency(p.profit)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
