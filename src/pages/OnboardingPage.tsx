import React, { useState } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Package,
  Layers,
  ShoppingBag,
  TrendingUp,
  Target,
  Rocket,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  BarChart3,
  Globe,
  DollarSign,
  Briefcase,
  Zap,
} from 'lucide-react';
import { AH19Logo } from '../components/brand/AH19Logo';
import { useApp } from '../context/AppContext';
import { OnboardingResponses } from '../types';

export const OnboardingPage: React.FC = () => {
  const { currentUser, completeOnboarding, language, setLanguage, t } = useApp();

  // Current Step: 1 to 6 for quiz, 7 for Welcome Screen
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Form State
  const [products, setProducts] = useState<string[]>([]);
  const [customProduct, setCustomProduct] = useState<string>('');

  const [niche, setNiche] = useState<string>('');
  const [customNiche, setCustomNiche] = useState<string>('');

  const [channels, setChannels] = useState<string[]>([]);
  const [customChannel, setCustomChannel] = useState<string>('');

  const [strategy, setStrategy] = useState<string>('');
  const [adChannels, setAdChannels] = useState<string[]>([]);
  const [customAdChannel, setCustomAdChannel] = useState<string>('');
  const [organicChannels, setOrganicChannels] = useState<string[]>([]);
  const [customOrganicChannel, setCustomOrganicChannel] = useState<string>('');

  const [goal, setGoal] = useState<string>('');
  const [stage, setStage] = useState<string>('');

  // Step 1 Options
  const productOptions = [
    { id: 'physical', label: 'Produtos físicos', icon: Package },
    { id: 'digital', label: 'Produtos digitais', icon: Zap },
    { id: 'courses', label: 'Cursos online', icon: Globe },
    { id: 'ebooks', label: 'E-books', icon: Layers },
    { id: 'services', label: 'Serviços', icon: Briefcase },
    { id: 'consulting', label: 'Consultoria', icon: Target },
    { id: 'saas', label: 'Software / SaaS', icon: Rocket },
    { id: 'subscriptions', label: 'Assinaturas', icon: DollarSign },
    { id: 'affiliates', label: 'Afiliados', icon: TrendingUp },
    { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
    { id: 'other', label: 'Outro', icon: HelpCircle },
  ];

  // Step 2 Options
  const nicheOptions = [
    'Moda',
    'Beleza',
    'Saúde e bem-estar',
    'Fitness',
    'Tecnologia',
    'Educação',
    'Finanças',
    'Casa',
    'Pets',
    'Alimentação',
    'Negócios',
    'Marketing',
    'Desenvolvimento pessoal',
    'Outro',
  ];

  // Step 3 Options
  const channelOptions = [
    'Website próprio',
    'Shopify',
    'Instagram',
    'Facebook',
    'TikTok',
    'WhatsApp',
    'YouTube',
    'Marketplace',
    'Loja física',
    'Outro',
  ];

  // Step 4 Strategy Options
  const strategyOptions = [
    {
      id: 'organic',
      title: 'Tráfego orgânico',
      desc: 'Criação de conteúdo, redes sociais, SEO e comunidades.',
    },
    {
      id: 'paid',
      title: 'Anúncios pagos',
      desc: 'Campanhas de tráfego pago em plataformas como Meta, Google e TikTok.',
    },
    {
      id: 'both',
      title: 'Orgânico + anúncios pagos',
      desc: 'Estratégia combinada de tráfego orgânico e investimento em tráfego pago.',
    },
  ];

  const adChannelOptions = [
    'Meta Ads',
    'Google Ads',
    'TikTok Ads',
    'YouTube Ads',
    'Outro',
  ];

  const organicChannelOptions = [
    'Instagram',
    'TikTok',
    'YouTube',
    'Facebook',
    'Google / SEO',
    'WhatsApp',
    'Outro',
  ];

  // Step 5 Options
  const goalOptions = [
    'Aumentar vendas',
    'Aumentar conversão',
    'Encontrar produtos vencedores',
    'Monitorar anúncios',
    'Monitorar checkout',
    'Entender meus clientes',
    'Acompanhar receita',
    'Escalar meu negócio',
    'Organizar minhas vendas',
  ];

  // Step 6 Options
  const stageOptions = [
    {
      title: 'Ainda estou começando',
      desc: 'Planejando o modelo e preparando os primeiros produtos.',
    },
    {
      title: 'Já tenho produto, mas poucas vendas',
      desc: 'Produto pronto, em busca de consistência e primeiros clientes.',
    },
    {
      title: 'Já faço vendas regularmente',
      desc: 'Fluxo diário de pedidos e faturamento recorrente.',
    },
    {
      title: 'Já invisto em anúncios',
      desc: 'Campanhas ativas de tráfego pago rodando diariamente.',
    },
    {
      title: 'Tenho uma operação estabelecida',
      desc: 'Equipe, fornecedores e processos de vendas consolidados.',
    },
    {
      title: 'Quero escalar',
      desc: 'Buscando expansão agressiva nacional e internacional.',
    },
  ];

  // Toggle helper for multi-select
  const toggleMultiSelect = (
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>,
    value: string
  ) => {
    if (list.includes(value)) {
      setList(list.filter((item) => item !== value));
    } else {
      setList([...list, value]);
    }
  };

  // Validation per step
  const isStepValid = (): boolean => {
    switch (currentStep) {
      case 1:
        if (products.length === 0) return false;
        if (products.includes('Outro') && !customProduct.trim()) return false;
        return true;
      case 2:
        if (!niche) return false;
        if (niche === 'Outro' && !customNiche.trim()) return false;
        return true;
      case 3:
        if (channels.length === 0) return false;
        if (channels.includes('Outro') && !customChannel.trim()) return false;
        return true;
      case 4:
        if (!strategy) return false;
        if (strategy === 'paid' || strategy === 'both') {
          if (adChannels.length === 0) return false;
          if (adChannels.includes('Outro') && !customAdChannel.trim()) return false;
        }
        if (strategy === 'organic' || strategy === 'both') {
          if (organicChannels.length === 0) return false;
          if (organicChannels.includes('Outro') && !customOrganicChannel.trim()) return false;
        }
        return true;
      case 5:
        return Boolean(goal);
      case 6:
        return Boolean(stage);
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!isStepValid()) return;
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (currentStep === 6) {
      // Advance to Welcome Screen (Step 7)
      setCurrentStep(7);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentStep > 1 && currentStep <= 6) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleFinishOnboarding = async () => {
    setIsSubmitting(true);
    const compiledProducts = products.map((p) =>
      p === 'Outro' && customProduct.trim() ? `Outro (${customProduct.trim()})` : p
    );
    const compiledNiche =
      niche === 'Outro' && customNiche.trim() ? `Outro (${customNiche.trim()})` : niche;
    const compiledChannels = channels.map((c) =>
      c === 'Outro' && customChannel.trim() ? `Outro (${customChannel.trim()})` : c
    );

    const responses: OnboardingResponses = {
      products: compiledProducts,
      customProduct: customProduct.trim() || undefined,
      niche: compiledNiche,
      customNiche: customNiche.trim() || undefined,
      channels: compiledChannels,
      customChannel: customChannel.trim() || undefined,
      strategy,
      adChannels: adChannels.length > 0 ? adChannels : undefined,
      customAdChannel: customAdChannel.trim() || undefined,
      organicChannels: organicChannels.length > 0 ? organicChannels : undefined,
      customOrganicChannel: customOrganicChannel.trim() || undefined,
      goal,
      stage,
      completedAt: new Date().toISOString(),
    };

    await completeOnboarding(responses);
    setIsSubmitting(false);
  };

  const userName = currentUser?.name || 'Empreendedor';
  const progressPercent = Math.min(Math.round((currentStep / 6) * 100), 100);

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col selection:bg-[#FFD000] selection:text-black">
      {/* Top Header */}
      <header className="w-full border-b border-[#1A1A1A] bg-[#0A0A0A]/90 backdrop-blur-md sticky top-0 z-30 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AH19Logo size="sm" showSlogan={false} />
            <div className="hidden sm:block h-4 w-[1px] bg-[#222222]" />
            <span className="hidden sm:inline-block text-xs font-mono text-neutral-400">
              Setup Inicial do Sistema
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-[#141414] border border-[#222222] rounded-lg p-1 text-xs">
              <Globe className="w-3.5 h-3.5 text-neutral-400 ml-1" />
              <button
                type="button"
                onClick={() => setLanguage('pt')}
                className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                  language === 'pt' ? 'bg-[#FFD000] text-black' : 'text-neutral-400 hover:text-white'
                }`}
              >
                PT
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                  language === 'en' ? 'bg-[#FFD000] text-black' : 'text-neutral-400 hover:text-white'
                }`}
              >
                EN
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 max-w-4xl mx-auto w-full">
        {currentStep <= 6 ? (
          /* ============================================================ */
          /* ONBOARDING QUIZ STEPS 1 TO 6                                  */
          /* ============================================================ */
          <div className="w-full bg-[#0A0A0A] border border-[#1E1E1E] rounded-2xl p-6 sm:p-10 shadow-2xl space-y-8 relative overflow-hidden">
            {/* Top gold bar progress */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#141414]">
              <div
                className="h-full bg-gradient-to-r from-[#FFD000] via-[#FFE566] to-[#FFD000] transition-all duration-400 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Step indicator header */}
            <div className="flex items-center justify-between pt-2 border-b border-[#1A1A1A] pb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FFD000] animate-pulse" />
                <span className="text-xs font-bold text-[#FFD000] uppercase tracking-wider font-mono">
                  Etapa {currentStep} de 6
                </span>
              </div>
              <span className="text-xs text-neutral-400 font-mono">
                {progressPercent}% Concluído
              </span>
            </div>

            {/* Titles */}
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Vamos preparar o seu sistema.
              </h1>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-2xl">
                Conte-nos um pouco sobre o que você vende e como pretende vender. Isso nos ajuda a configurar o seu dashboard.
              </p>
            </div>

            {/* STEP 1: PRODUTOS */}
            {currentStep === 1 && (
              <div className="space-y-4" id="onboarding-step-1">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Package className="w-4 h-4 text-[#FFD000]" />
                    <span>O que você pretende vender?</span>
                  </h2>
                  <span className="text-[11px] text-neutral-400 font-mono">
                    (Selecione uma ou mais opções)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {productOptions.map((opt) => {
                    const selected = products.includes(opt.label);
                    const Icon = opt.icon;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        id={`step1-product-${opt.id}`}
                        onClick={() => toggleMultiSelect(products, setProducts, opt.label)}
                        className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                          selected
                            ? 'bg-[#1A180E] border-[#FFD000] text-white shadow-md'
                            : 'bg-[#121212] border-[#222222] text-neutral-300 hover:border-neutral-600 hover:bg-[#161616]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              selected ? 'bg-[#FFD000] text-black' : 'bg-[#1A1A1A] text-neutral-400'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className="text-xs font-semibold">{opt.label}</span>
                        </div>
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                            selected
                              ? 'bg-[#FFD000] border-[#FFD000] text-black'
                              : 'border-neutral-600 bg-transparent'
                          }`}
                        >
                          {selected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {products.includes('Outro') && (
                  <div className="pt-2">
                    <label
                      htmlFor="step1-custom-product-input"
                      className="block text-xs font-semibold text-neutral-300 mb-1"
                    >
                      Especifique o tipo de produto: <span className="text-[#FFD000]">*</span>
                    </label>
                    <input
                      id="step1-custom-product-input"
                      type="text"
                      value={customProduct}
                      onChange={(e) => setCustomProduct(e.target.value)}
                      placeholder="Ex: Franquias, Artesanato sustentável, NFT..."
                      className="w-full px-4 py-2.5 rounded-lg bg-[#141414] border border-[#2A2A2A] text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-[#FFD000]"
                    />
                  </div>
                )}
              </div>
            )}

            {/* STEP 2: NICHO */}
            {currentStep === 2 && (
              <div className="space-y-4" id="onboarding-step-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Target className="w-4 h-4 text-[#FFD000]" />
                    <span>Qual é o seu nicho?</span>
                  </h2>
                  <span className="text-[11px] text-neutral-400 font-mono">
                    (Selecione o segmento principal)
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
                  {nicheOptions.map((item) => {
                    const selected = niche === item;
                    return (
                      <button
                        key={item}
                        type="button"
                        id={`step2-niche-${item.toLowerCase().replace(/\s+/g, '-')}`}
                        onClick={() => setNiche(item)}
                        className={`p-3 rounded-xl border text-center transition-all cursor-pointer text-xs font-semibold flex items-center justify-center gap-2 ${
                          selected
                            ? 'bg-[#FFD000] border-[#FFD000] text-black font-bold shadow-md'
                            : 'bg-[#121212] border-[#222222] text-neutral-300 hover:border-neutral-600 hover:bg-[#161616]'
                        }`}
                      >
                        {selected && <Check className="w-3.5 h-3.5 text-black stroke-[3]" />}
                        <span>{item}</span>
                      </button>
                    );
                  })}
                </div>

                {niche === 'Outro' && (
                  <div className="pt-2">
                    <label
                      htmlFor="step2-custom-niche-input"
                      className="block text-xs font-semibold text-neutral-300 mb-1"
                    >
                      Especifique o seu nicho: <span className="text-[#FFD000]">*</span>
                    </label>
                    <input
                      id="step2-custom-niche-input"
                      type="text"
                      value={customNiche}
                      onChange={(e) => setCustomNiche(e.target.value)}
                      placeholder="Ex: Energia Solar, Agro, Automotivo..."
                      className="w-full px-4 py-2.5 rounded-lg bg-[#141414] border border-[#2A2A2A] text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-[#FFD000]"
                    />
                  </div>
                )}
              </div>
            )}

            {/* STEP 3: CANAIS DE VENDA */}
            {currentStep === 3 && (
              <div className="space-y-4" id="onboarding-step-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-[#FFD000]" />
                    <span>Em quais canais você vende?</span>
                  </h2>
                  <span className="text-[11px] text-neutral-400 font-mono">
                    (Selecione todos os que utiliza)
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {channelOptions.map((item) => {
                    const selected = channels.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        id={`step3-channel-${item.toLowerCase().replace(/\s+/g, '-')}`}
                        onClick={() => toggleMultiSelect(channels, setChannels, item)}
                        className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                          selected
                            ? 'bg-[#1A180E] border-[#FFD000] text-white shadow-md'
                            : 'bg-[#121212] border-[#222222] text-neutral-300 hover:border-neutral-600 hover:bg-[#161616]'
                        }`}
                      >
                        <span className="text-xs font-semibold">{item}</span>
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center ${
                            selected
                              ? 'bg-[#FFD000] border-[#FFD000] text-black'
                              : 'border-neutral-600 bg-transparent'
                          }`}
                        >
                          {selected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {channels.includes('Outro') && (
                  <div className="pt-2">
                    <label
                      htmlFor="step3-custom-channel-input"
                      className="block text-xs font-semibold text-neutral-300 mb-1"
                    >
                      Especifique o canal: <span className="text-[#FFD000]">*</span>
                    </label>
                    <input
                      id="step3-custom-channel-input"
                      type="text"
                      value={customChannel}
                      onChange={(e) => setCustomChannel(e.target.value)}
                      placeholder="Ex: Representantes comerciais, Televendas..."
                      className="w-full px-4 py-2.5 rounded-lg bg-[#141414] border border-[#2A2A2A] text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-[#FFD000]"
                    />
                  </div>
                )}
              </div>
            )}

            {/* STEP 4: ESTRATÉGIA DE ATRAÇÃO */}
            {currentStep === 4 && (
              <div className="space-y-6" id="onboarding-step-4">
                <div className="space-y-1">
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#FFD000]" />
                    <span>Como você pretende atrair clientes?</span>
                  </h2>
                  <p className="text-xs text-neutral-400">
                    Selecione o modelo de aquisição principal para o seu tráfego.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {strategyOptions.map((opt) => {
                    const selected = strategy === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        id={`step4-strat-${opt.id}`}
                        onClick={() => setStrategy(opt.id)}
                        className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer space-y-2 ${
                          selected
                            ? 'bg-[#1A180E] border-[#FFD000] text-white shadow-md ring-1 ring-[#FFD000]'
                            : 'bg-[#121212] border-[#222222] text-neutral-300 hover:border-neutral-600 hover:bg-[#161616]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white">{opt.title}</span>
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              selected
                                ? 'border-[#FFD000] bg-[#FFD000] text-black'
                                : 'border-neutral-600'
                            }`}
                          >
                            {selected && <div className="w-2 h-2 rounded-full bg-black" />}
                          </div>
                        </div>
                        <p className="text-[11px] text-neutral-400 leading-snug">{opt.desc}</p>
                      </button>
                    );
                  })}
                </div>

                {/* Sub-question: Anúncios Pagos */}
                {(strategy === 'paid' || strategy === 'both') && (
                  <div className="p-4 rounded-xl bg-[#111111] border border-[#222222] space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-[#FFD000] flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Quais canais de anúncios pagos você utiliza ou pretende utilizar?</span>
                      </p>
                      <span className="text-[10px] text-neutral-400 font-mono">
                        (Múltipla escolha)
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      {adChannelOptions.map((ad) => {
                        const sel = adChannels.includes(ad);
                        return (
                          <button
                            key={ad}
                            type="button"
                            onClick={() => toggleMultiSelect(adChannels, setAdChannels, ad)}
                            className={`px-3 py-2 rounded-lg border text-xs font-semibold transition-all cursor-pointer flex items-center justify-between ${
                              sel
                                ? 'bg-[#FFD000] border-[#FFD000] text-black'
                                : 'bg-[#181818] border-[#2A2A2A] text-neutral-300 hover:border-neutral-600'
                            }`}
                          >
                            <span>{ad}</span>
                            {sel && <Check className="w-3 h-3 stroke-[3]" />}
                          </button>
                        );
                      })}
                    </div>

                    {adChannels.includes('Outro') && (
                      <input
                        type="text"
                        value={customAdChannel}
                        onChange={(e) => setCustomAdChannel(e.target.value)}
                        placeholder="Especifique outros canais de anúncios (ex: Pinterest Ads, LinkedIn Ads)..."
                        className="w-full px-3 py-2 rounded-lg bg-[#181818] border border-[#2A2A2A] text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-[#FFD000] mt-2"
                      />
                    )}
                  </div>
                )}

                {/* Sub-question: Tráfego Orgânico */}
                {(strategy === 'organic' || strategy === 'both') && (
                  <div className="p-4 rounded-xl bg-[#111111] border border-[#222222] space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-[#FFD000]" />
                        <span>Onde você pretende gerar tráfego orgânico?</span>
                      </p>
                      <span className="text-[10px] text-neutral-400 font-mono">
                        (Múltipla escolha)
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {organicChannelOptions.map((org) => {
                        const sel = organicChannels.includes(org);
                        return (
                          <button
                            key={org}
                            type="button"
                            onClick={() => toggleMultiSelect(organicChannels, setOrganicChannels, org)}
                            className={`px-3 py-2 rounded-lg border text-xs font-semibold transition-all cursor-pointer flex items-center justify-between ${
                              sel
                                ? 'bg-[#FFD000] border-[#FFD000] text-black'
                                : 'bg-[#181818] border-[#2A2A2A] text-neutral-300 hover:border-neutral-600'
                            }`}
                          >
                            <span>{org}</span>
                            {sel && <Check className="w-3 h-3 stroke-[3]" />}
                          </button>
                        );
                      })}
                    </div>

                    {organicChannels.includes('Outro') && (
                      <input
                        type="text"
                        value={customOrganicChannel}
                        onChange={(e) => setCustomOrganicChannel(e.target.value)}
                        placeholder="Especifique outros canais orgânicos (ex: Blog especializado, Twitter/X, Podcast)..."
                        className="w-full px-3 py-2 rounded-lg bg-[#181818] border border-[#2A2A2A] text-white placeholder-neutral-500 text-xs focus:outline-none focus:border-[#FFD000] mt-2"
                      />
                    )}
                  </div>
                )}
              </div>
            )}

            {/* STEP 5: OBJETIVO */}
            {currentStep === 5 && (
              <div className="space-y-4" id="onboarding-step-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Target className="w-4 h-4 text-[#FFD000]" />
                    <span>Qual é o seu principal objetivo?</span>
                  </h2>
                  <span className="text-[11px] text-neutral-400 font-mono">
                    (Escolha sua prioridade atual)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {goalOptions.map((item) => {
                    const selected = goal === item;
                    return (
                      <button
                        key={item}
                        type="button"
                        id={`step5-goal-${item.toLowerCase().replace(/\s+/g, '-')}`}
                        onClick={() => setGoal(item)}
                        className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                          selected
                            ? 'bg-[#FFD000] border-[#FFD000] text-black font-bold shadow-md'
                            : 'bg-[#121212] border-[#222222] text-neutral-300 hover:border-neutral-600 hover:bg-[#161616]'
                        }`}
                      >
                        <span className="text-xs">{item}</span>
                        {selected && <Check className="w-4 h-4 text-black stroke-[3]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 6: ESTÁGIO DO NEGÓCIO */}
            {currentStep === 6 && (
              <div className="space-y-4" id="onboarding-step-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-[#FFD000]" />
                    <span>Em que estágio está o seu negócio?</span>
                  </h2>
                  <span className="text-[11px] text-neutral-400 font-mono">
                    (Nos ajuda a calibrar as métricas)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {stageOptions.map((opt) => {
                    const selected = stage === opt.title;
                    return (
                      <button
                        key={opt.title}
                        type="button"
                        id={`step6-stage-${opt.title.toLowerCase().replace(/\s+/g, '-')}`}
                        onClick={() => setStage(opt.title)}
                        className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer space-y-1.5 ${
                          selected
                            ? 'bg-[#1A180E] border-[#FFD000] text-white ring-1 ring-[#FFD000] shadow-md'
                            : 'bg-[#121212] border-[#222222] text-neutral-300 hover:border-neutral-600 hover:bg-[#161616]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white">{opt.title}</span>
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              selected
                                ? 'border-[#FFD000] bg-[#FFD000] text-black'
                                : 'border-neutral-600'
                            }`}
                          >
                            {selected && <div className="w-2 h-2 rounded-full bg-black" />}
                          </div>
                        </div>
                        <p className="text-[11px] text-neutral-400 leading-snug">{opt.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Footer Navigation Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-[#1C1C1C]">
              <button
                type="button"
                id="onboarding-back-btn"
                onClick={handleBack}
                disabled={currentStep === 1}
                className="px-5 py-2.5 rounded-xl border border-[#2A2A2A] text-xs font-bold text-neutral-300 hover:text-white hover:border-neutral-500 transition-colors flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar</span>
              </button>

              <button
                type="button"
                id="onboarding-next-btn"
                onClick={handleNext}
                disabled={!isStepValid()}
                className="px-6 py-2.5 rounded-xl bg-[#FFD000] hover:bg-[#E6BC00] text-black font-extrabold text-xs tracking-wide transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span>{currentStep === 6 ? 'Finalizar e Ver Resumo' : 'Continuar'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* ============================================================ */
          /* STEP 7: TELA DE BOAS-VINDAS                                   */
          /* ============================================================ */
          <div
            id="onboarding-welcome-screen"
            className="w-full bg-[#0A0A0A] border border-[#1E1E1E] rounded-2xl p-6 sm:p-10 shadow-2xl space-y-8 relative overflow-hidden"
          >
            {/* Top gold bar accent */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#FFD000] via-[#FFE566] to-[#FFD000]" />

            {/* Welcome Heading */}
            <div className="text-center space-y-3 pt-2">
              <div className="w-14 h-14 rounded-2xl bg-[#FFD000]/10 border border-[#FFD000]/30 mx-auto flex items-center justify-center text-[#FFD000] shadow-lg shadow-[#FFD000]/5">
                <Sparkles className="w-7 h-7" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Bem-vindo ao AH19, <span className="text-[#FFD000]">{userName}</span>.
              </h1>
              <p className="text-sm font-semibold text-neutral-300">
                Seu espaço está pronto.
              </p>
              <p className="text-xs text-neutral-400 max-w-md mx-auto leading-relaxed">
                Configuramos o seu ambiente de acordo com o seu perfil. Suas respostas foram salvas com segurança na sua conta.
              </p>
            </div>

            {/* Summary Card of User Choices */}
            <div className="bg-[#121212] border border-[#222222] rounded-xl p-5 sm:p-6 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-[#1E1E1E]">
                <CheckCircle2 className="w-4 h-4 text-[#FFD000]" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Resumo das Suas Escolhas
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* O que você vende */}
                <div className="space-y-1">
                  <span className="text-neutral-500 text-[11px] font-mono block">Você vende:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {products.map((p) => (
                      <span
                        key={p}
                        className="px-2.5 py-1 rounded-md bg-[#1A1A1A] border border-[#2A2A2A] text-white font-medium text-[11px]"
                      >
                        {p === 'Outro' && customProduct ? customProduct : p}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Nicho */}
                <div className="space-y-1">
                  <span className="text-neutral-500 text-[11px] font-mono block">Nicho de atuação:</span>
                  <span className="inline-block px-2.5 py-1 rounded-md bg-[#1A1A1A] border border-[#2A2A2A] text-[#FFD000] font-semibold text-[11px]">
                    {niche === 'Outro' && customNiche ? customNiche : niche}
                  </span>
                </div>

                {/* Canais */}
                <div className="space-y-1">
                  <span className="text-neutral-500 text-[11px] font-mono block">Seus canais de venda:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {channels.map((c) => (
                      <span
                        key={c}
                        className="px-2.5 py-1 rounded-md bg-[#1A1A1A] border border-[#2A2A2A] text-neutral-200 text-[11px]"
                      >
                        {c === 'Outro' && customChannel ? customChannel : c}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Estratégia de atração */}
                <div className="space-y-1">
                  <span className="text-neutral-500 text-[11px] font-mono block">Sua estratégia:</span>
                  <div className="text-neutral-200 text-[11px]">
                    {strategy === 'paid' && 'Anúncios pagos'}
                    {strategy === 'organic' && 'Tráfego orgânico'}
                    {strategy === 'both' && 'Orgânico + Anúncios pagos'}
                    {adChannels.length > 0 && (
                      <span className="text-neutral-400 block text-[10px] mt-0.5">
                        Ads: {adChannels.join(', ')}
                      </span>
                    )}
                    {organicChannels.length > 0 && (
                      <span className="text-neutral-400 block text-[10px] mt-0.5">
                        Orgânico: {organicChannels.join(', ')}
                      </span>
                    )}
                  </div>
                </div>

                {/* Objetivo */}
                <div className="space-y-1 sm:col-span-2 pt-2 border-t border-[#1C1C1C]">
                  <span className="text-neutral-500 text-[11px] font-mono block">Seu principal objetivo:</span>
                  <span className="text-white font-bold text-xs flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-[#FFD000]" />
                    {goal}
                  </span>
                </div>
              </div>
            </div>

            {/* Call to action button */}
            <div className="pt-2 text-center space-y-3">
              <button
                type="button"
                id="enter-dashboard-btn"
                onClick={handleFinishOnboarding}
                disabled={isSubmitting}
                className="w-full sm:w-auto px-10 py-3.5 rounded-xl bg-[#FFD000] hover:bg-[#E6BC00] text-black font-extrabold text-sm tracking-wide transition-all shadow-xl shadow-[#FFD000]/10 flex items-center justify-center gap-2 mx-auto cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Preparando seu dashboard...</span>
                ) : (
                  <>
                    <span>Entrar no meu dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="text-[11px] text-neutral-500 font-mono">
                Ambiente de alta precisão • Life4Billion Technologies
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Simple Clean Footer */}
      <footer className="w-full max-w-4xl mx-auto px-6 py-4 text-center text-xs text-neutral-500 font-mono flex items-center justify-between border-t border-[#141414]">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FFD000]" />
          <span>AH19 SaaS Onboarding Engine</span>
        </div>
        <div>Strict Authentication & Data Isolation</div>
      </footer>
    </div>
  );
};
