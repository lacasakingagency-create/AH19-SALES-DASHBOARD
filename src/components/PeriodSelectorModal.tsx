import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Clock,
  CalendarRange,
  Layers,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DateFilterRange } from '../types';
import { DATE_RANGE_CONFIGS } from '../data/mockData';

interface PeriodSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PeriodSelectorModal: React.FC<PeriodSelectorModalProps> = ({ isOpen, onClose }) => {
  const { dateRange, setDateRange, customDateRange, setCustomDateRange, formatCurrency, t, language } = useApp();

  const [activeTab, setActiveTab] = useState<'presets' | 'calendar' | 'specific'>('presets');
  const [tempRange, setTempRange] = useState<DateFilterRange>(dateRange);
  const [startDateInput, setStartDateInput] = useState(customDateRange.start || '2026-08-01');
  const [endDateInput, setEndDateInput] = useState(customDateRange.end || '2026-08-21');

  // Calendar state for month navigation
  const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date(2026, 7, 1)); // Aug 2026
  const [selectedSpecificYear, setSelectedSpecificYear] = useState<number>(2026);
  const [selectedSpecificMonth, setSelectedSpecificMonth] = useState<number>(7); // 0-indexed, 7 = Aug

  useEffect(() => {
    if (isOpen) {
      setTempRange(dateRange);
      setStartDateInput(customDateRange.start || '2026-08-01');
      setEndDateInput(customDateRange.end || '2026-08-21');
    }
  }, [isOpen, dateRange, customDateRange]);

  if (!isOpen) return null;

  const monthsPt = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ];
  const monthsEn = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const months = language === 'pt' ? monthsPt : monthsEn;

  const daysPt = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const daysEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weekDays = language === 'pt' ? daysPt : daysEn;

  const availableYears = [2026, 2025, 2024, 2023];

  const presetsGrouped = [
    {
      category: language === 'pt' ? 'Diário' : 'Daily',
      items: [
        { id: 'today' as DateFilterRange, label: t.period_today, sub: language === 'pt' ? 'Hoje (21 de Ago)' : 'Today (Aug 21)' },
        { id: 'yesterday' as DateFilterRange, label: t.period_yesterday, sub: language === 'pt' ? 'Ontem (20 de Ago)' : 'Yesterday (Aug 20)' },
        { id: 'specific_day' as DateFilterRange, label: t.period_specific_day, sub: language === 'pt' ? 'Dia 21 de Ago' : 'Day Aug 21' },
      ],
    },
    {
      category: language === 'pt' ? 'Semanal' : 'Weekly',
      items: [
        { id: 'this_week' as DateFilterRange, label: t.period_this_week, sub: language === 'pt' ? '17 – 21 de Ago' : 'Aug 17 – 21' },
        { id: 'last_week' as DateFilterRange, label: t.period_last_week, sub: language === 'pt' ? '10 – 16 de Ago' : 'Aug 10 – 16' },
        { id: '7d' as DateFilterRange, label: t.period_7d, sub: language === 'pt' ? '15 – 21 de Ago' : 'Aug 15 – 21' },
        { id: '14d' as DateFilterRange, label: t.period_14d, sub: language === 'pt' ? '08 – 21 de Ago' : 'Aug 08 – 21' },
        { id: 'specific_week' as DateFilterRange, label: t.period_specific_week, sub: language === 'pt' ? 'Semana 34' : 'Week 34' },
      ],
    },
    {
      category: language === 'pt' ? 'Mensal' : 'Monthly',
      items: [
        { id: 'this_month' as DateFilterRange, label: t.period_this_month, sub: language === 'pt' ? '01 – 21 de Ago' : 'Aug 01 – 21' },
        { id: 'last_month' as DateFilterRange, label: t.period_last_month, sub: language === 'pt' ? '01 – 31 de Jul' : 'Jul 01 – 31' },
        { id: '30d' as DateFilterRange, label: t.period_30d, sub: language === 'pt' ? '23 Jul – 21 Ago' : 'Jul 23 – Aug 21' },
        { id: '3_months' as DateFilterRange, label: t.period_3m, sub: language === 'pt' ? '23 Mai – 21 Ago' : 'May 23 – Aug 21' },
        { id: '6_months' as DateFilterRange, label: t.period_6m, sub: language === 'pt' ? '21 Fev – 21 Ago' : 'Feb 21 – Aug 21' },
        { id: 'specific_month' as DateFilterRange, label: t.period_specific_month, sub: language === 'pt' ? 'Agosto 2026' : 'August 2026' },
      ],
    },
    {
      category: language === 'pt' ? 'Anual' : 'Yearly',
      items: [
        { id: 'this_year' as DateFilterRange, label: t.period_this_year, sub: language === 'pt' ? '01 Jan – 21 Ago' : 'Jan 01 – Aug 21' },
        { id: 'last_year' as DateFilterRange, label: t.period_last_year, sub: language === 'pt' ? 'Ano de 2025' : 'Year 2025' },
        { id: '12_months' as DateFilterRange, label: t.period_12m, sub: language === 'pt' ? 'Últimos 365 dias' : 'Last 365 days' },
        { id: 'specific_year' as DateFilterRange, label: t.period_specific_year, sub: language === 'pt' ? 'Ano 2026' : 'Year 2026' },
      ],
    },
  ];

  // Calendar rendering helpers
  const year = currentCalendarDate.getFullYear();
  const month = currentCalendarDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentCalendarDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentCalendarDate(new Date(year, month + 1, 1));
  };

  const handleDateClick = (dayNumber: number) => {
    const formattedDay = dayNumber < 10 ? `0${dayNumber}` : `${dayNumber}`;
    const formattedMonth = month + 1 < 10 ? `0${month + 1}` : `${month + 1}`;
    const clickedDateStr = `${year}-${formattedMonth}-${formattedDay}`;

    if (!startDateInput || (startDateInput && endDateInput)) {
      setStartDateInput(clickedDateStr);
      setEndDateInput('');
      setTempRange('custom');
    } else if (startDateInput && !endDateInput) {
      if (new Date(clickedDateStr) >= new Date(startDateInput)) {
        setEndDateInput(clickedDateStr);
      } else {
        setEndDateInput(startDateInput);
        setStartDateInput(clickedDateStr);
      }
      setTempRange('custom');
    }
  };

  const isDateSelected = (dayNumber: number) => {
    const formattedDay = dayNumber < 10 ? `0${dayNumber}` : `${dayNumber}`;
    const formattedMonth = month + 1 < 10 ? `0${month + 1}` : `${month + 1}`;
    const dateStr = `${year}-${formattedMonth}-${formattedDay}`;

    if (startDateInput === dateStr || endDateInput === dateStr) return 'exact';
    if (startDateInput && endDateInput) {
      const current = new Date(dateStr);
      const start = new Date(startDateInput);
      const end = new Date(endDateInput);
      if (current > start && current < end) return 'between';
    }
    return 'none';
  };

  const handleApply = () => {
    if (tempRange === 'custom') {
      const validStart = startDateInput || '2026-08-01';
      const validEnd = endDateInput || startDateInput || '2026-08-21';
      setCustomDateRange({ start: validStart, end: validEnd });
      setDateRange('custom');
    } else {
      setDateRange(tempRange);
    }
    onClose();
  };

  const currentConfig = DATE_RANGE_CONFIGS[tempRange] || DATE_RANGE_CONFIGS['7d'];
  const previewRevenue = currentConfig?.revenue || 78452.36;
  const previewOrders = currentConfig?.orders || 614;

  return (
    <div
      id="period-selector-overlay"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150 cursor-pointer"
    >
      <div
        id="period-selector-modal"
        onClick={(e) => e.stopPropagation()}
        className="bg-[#0A0A0A] border border-[#222222] rounded-2xl w-full max-w-4xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-200 cursor-default"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#1C1C1C] flex items-center justify-between bg-[#0E0E0E]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl icon-badge-blend flex items-center justify-center text-white shadow-md">
              <CalendarIcon className="w-5 h-5 drop-shadow-[0_0_5px_rgba(255,208,0,0.8)]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                {t.rep_select_period}
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded badge-gold-blend shadow-sm">
                  AH19 Engine
                </span>
              </h2>
              <p className="text-xs text-neutral-400">
                {language === 'pt'
                  ? 'Filtre KPIs, receitas, transações e gráficos pelo intervalo temporal desejado.'
                  : 'Filter KPIs, revenues, transactions, and charts by your desired timeframe.'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-[#1A1A1A] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 border-b border-[#1C1C1C] bg-[#0E0E0E] flex items-center gap-2">
          <button
            onClick={() => setActiveTab('presets')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'presets'
                ? 'border-[#FFD000] text-[#FFF4A3] font-bold'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            {language === 'pt' ? 'Predefinições Rápidas' : 'Quick Presets'}
          </button>

          <button
            onClick={() => setActiveTab('calendar')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'calendar'
                ? 'border-[#FFD000] text-[#FFF4A3] font-bold'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <CalendarRange className="w-3.5 h-3.5" />
            {language === 'pt' ? 'Calendário & Personalizado' : 'Calendar & Custom Range'}
          </button>

          <button
            onClick={() => setActiveTab('specific')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'specific'
                ? 'border-[#FFD000] text-[#FFF4A3] font-bold'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            {language === 'pt' ? 'Ano / Mês / Semana Específicos' : 'Specific Year / Month / Week'}
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto max-h-[58vh] space-y-6">
          {/* TAB 1: PRESETS */}
          {activeTab === 'presets' && (
            <div className="space-y-6">
              {presetsGrouped.map((group, gIdx) => (
                <div key={gIdx} className="space-y-2.5">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono">
                    {group.category}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                    {group.items.map((item) => {
                      const isSelected = tempRange === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => setTempRange(item.id)}
                          className={`p-3 rounded-xl text-left border transition-all flex flex-col justify-between ${
                            isSelected
                              ? 'btn-gold-secondary border-[#FFF4A3] text-white shadow-lg'
                              : 'bg-[#121212] border-[#222222] text-neutral-300 hover:border-[#333333] hover:bg-[#161616]'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className={`text-xs font-bold ${isSelected ? 'text-[#FFF8B0]' : 'text-white'}`}>
                              {item.label}
                            </span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-[#FFE76A] stroke-[3]" />}
                          </div>
                          <span className="text-[10px] text-neutral-400 font-mono">{item.sub}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: INTERACTIVE CALENDAR */}
          {activeTab === 'calendar' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Calendar Column */}
              <div className="md:col-span-7 bg-[#121212] p-5 rounded-2xl border border-[#222222] space-y-4">
                {/* Month Navigator Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white font-mono">
                      {months[month]} {year}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={handlePrevMonth}
                      className="p-1.5 rounded-lg bg-[#1A1A1A] hover:bg-[#252525] text-neutral-300 hover:text-white transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleNextMonth}
                      className="p-1.5 rounded-lg bg-[#1A1A1A] hover:bg-[#252525] text-neutral-300 hover:text-white transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Weekday Names */}
                <div className="grid grid-cols-7 gap-1 text-center">
                  {weekDays.map((wd, i) => (
                    <div key={i} className="text-[10px] font-bold text-neutral-400 uppercase font-mono py-1">
                      {wd}
                    </div>
                  ))}
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 gap-1.5 text-center">
                  {/* Empty cells for starting offset */}
                  {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                    <div key={`empty-${i}`} className="h-8" />
                  ))}

                  {/* Days */}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const dayNum = i + 1;
                    const state = isDateSelected(dayNum);
                    const isToday = dayNum === 21 && month === 7 && year === 2026;

                    return (
                      <button
                        key={`day-${dayNum}`}
                        onClick={() => handleDateClick(dayNum)}
                        className={`h-8 rounded-lg text-xs font-mono font-medium transition-all relative ${
                          state === 'exact'
                            ? 'bg-[#FFD000] text-black font-bold shadow-lg scale-105 z-10'
                            : state === 'between'
                            ? 'bg-[#FFD000]/20 text-[#FFD000] rounded-none'
                            : isToday
                            ? 'bg-[#1C1C1C] text-white border border-[#FFD000]/50'
                            : 'text-neutral-300 hover:bg-[#1A1A1A] hover:text-white'
                        }`}
                      >
                        {dayNum}
                        {isToday && state === 'none' && (
                          <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#FFD000]" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Date Form & Shortcuts */}
              <div className="md:col-span-5 space-y-4">
                <div className="bg-[#121212] p-4 rounded-xl border border-[#222222] space-y-3">
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <CalendarRange className="w-3.5 h-3.5 text-[#FFD000]" />
                    {t.period_custom_range}
                  </div>

                  <div className="space-y-2">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-neutral-400 font-mono block mb-1">
                        {t.period_start_date} (AAAA-MM-DD)
                      </label>
                      <input
                        type="date"
                        value={startDateInput}
                        onChange={(e) => {
                          setStartDateInput(e.target.value);
                          setTempRange('custom');
                        }}
                        className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg px-3 py-2 text-xs font-mono text-white focus:border-[#FFD000] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] uppercase font-bold text-neutral-400 font-mono block mb-1">
                        {t.period_end_date} (AAAA-MM-DD)
                      </label>
                      <input
                        type="date"
                        value={endDateInput}
                        onChange={(e) => {
                          setEndDateInput(e.target.value);
                          setTempRange('custom');
                        }}
                        className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg px-3 py-2 text-xs font-mono text-white focus:border-[#FFD000] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Shortcuts */}
                <div className="bg-[#121212] p-4 rounded-xl border border-[#222222] space-y-2.5">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 font-mono">
                    {language === 'pt' ? 'Atalhos de Intervalo' : 'Range Shortcuts'}
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        setStartDateInput('2026-08-15');
                        setEndDateInput('2026-08-21');
                        setTempRange('7d');
                      }}
                      className="px-2.5 py-1.5 text-xs bg-[#1A1A1A] hover:bg-[#252525] text-neutral-300 rounded-lg border border-[#282828] text-left font-medium"
                    >
                      7 Dias (Ago 15-21)
                    </button>
                    <button
                      onClick={() => {
                        setStartDateInput('2026-08-01');
                        setEndDateInput('2026-08-21');
                        setTempRange('this_month');
                      }}
                      className="px-2.5 py-1.5 text-xs bg-[#1A1A1A] hover:bg-[#252525] text-neutral-300 rounded-lg border border-[#282828] text-left font-medium"
                    >
                      Este Mês (Ago 01-21)
                    </button>
                    <button
                      onClick={() => {
                        setStartDateInput('2026-07-23');
                        setEndDateInput('2026-08-21');
                        setTempRange('30d');
                      }}
                      className="px-2.5 py-1.5 text-xs bg-[#1A1A1A] hover:bg-[#252525] text-neutral-300 rounded-lg border border-[#282828] text-left font-medium"
                    >
                      30 Dias (Jul 23-Ago 21)
                    </button>
                    <button
                      onClick={() => {
                        setStartDateInput('2026-01-01');
                        setEndDateInput('2026-08-21');
                        setTempRange('this_year');
                      }}
                      className="px-2.5 py-1.5 text-xs bg-[#1A1A1A] hover:bg-[#252525] text-neutral-300 rounded-lg border border-[#282828] text-left font-medium"
                    >
                      Este Ano (Jan-Ago)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SPECIFIC YEAR / MONTH / WEEK / DAY */}
          {activeTab === 'specific' && (
            <div className="space-y-6">
              {/* Year Selector */}
              <div className="bg-[#121212] p-4 rounded-xl border border-[#222222] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">1. {t.period_specific_year}</span>
                  <span className="text-[10px] text-neutral-400 font-mono">Consolidado Anual</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {availableYears.map((yr) => (
                    <button
                      key={yr}
                      onClick={() => {
                        setSelectedSpecificYear(yr);
                        if (yr === 2026) {
                          setTempRange('this_year');
                          setStartDateInput('2026-01-01');
                          setEndDateInput('2026-08-21');
                        } else if (yr === 2025) {
                          setTempRange('last_year');
                          setStartDateInput('2025-01-01');
                          setEndDateInput('2025-12-31');
                        } else {
                          setTempRange('specific_year');
                          setStartDateInput(`${yr}-01-01`);
                          setEndDateInput(`${yr}-12-31`);
                        }
                      }}
                      className={`py-3 px-4 rounded-xl border text-center font-mono font-bold transition-all ${
                        selectedSpecificYear === yr && (tempRange === 'this_year' || tempRange === 'last_year' || tempRange === 'specific_year')
                          ? 'bg-[#FFD000] text-black border-[#FFD000] shadow-lg'
                          : 'bg-[#181818] border-[#2A2A2A] text-neutral-300 hover:border-[#444444]'
                      }`}
                    >
                      {yr}
                    </button>
                  ))}
                </div>
              </div>

              {/* Month Selector */}
              <div className="bg-[#121212] p-4 rounded-xl border border-[#222222] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">2. {t.period_specific_month}</span>
                  <span className="text-[10px] text-neutral-400 font-mono">Ano: {selectedSpecificYear}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {months.map((mName, mIdx) => {
                    const isSelectedMonth = selectedSpecificMonth === mIdx && tempRange === 'specific_month';
                    return (
                      <button
                        key={mIdx}
                        onClick={() => {
                          setSelectedSpecificMonth(mIdx);
                          setTempRange(mIdx === 7 ? 'this_month' : mIdx === 6 ? 'last_month' : 'specific_month');
                          const lastDay = new Date(selectedSpecificYear, mIdx + 1, 0).getDate();
                          const mStr = mIdx + 1 < 10 ? `0${mIdx + 1}` : `${mIdx + 1}`;
                          setStartDateInput(`${selectedSpecificYear}-${mStr}-01`);
                          setEndDateInput(`${selectedSpecificYear}-${mStr}-${lastDay < 10 ? '0' + lastDay : lastDay}`);
                        }}
                        className={`p-2.5 rounded-lg border text-left text-xs font-medium transition-all ${
                          isSelectedMonth
                            ? 'bg-[#FFD000]/15 border-[#FFD000] text-[#FFD000] font-bold'
                            : 'bg-[#181818] border-[#2A2A2A] text-neutral-300 hover:border-[#3A3A3A]'
                        }`}
                      >
                        {mName}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Summary & Action Bar */}
        <div className="px-6 py-4 border-t border-[#1C1C1C] bg-[#0E0E0E] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg icon-badge-blend text-white shadow-sm">
              <Sparkles className="w-4 h-4 drop-shadow-[0_0_4px_rgba(255,208,0,0.8)]" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <span>{DATE_RANGE_CONFIGS[tempRange]?.label || `${startDateInput} → ${endDateInput}`}</span>
              </div>
              <p className="text-[11px] text-neutral-400 font-mono">
                {language === 'pt' ? 'Estimativa' : 'Estimate'}: {formatCurrency(previewRevenue)} • {previewOrders} {language === 'pt' ? 'vendas' : 'orders'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-[#1A1A1A] hover:bg-[#252525] border border-[#2A2A2A] rounded-xl text-xs font-bold text-neutral-300 transition-colors"
            >
              {t.action_cancel}
            </button>

            <button
              id="apply-period-btn"
              onClick={handleApply}
              className="flex-1 sm:flex-none px-6 py-2.5 btn-gold-blend rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg active:scale-95"
            >
              <span>{t.period_apply}</span>
              <ArrowRight className="w-3.5 h-3.5 text-black stroke-[3]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
