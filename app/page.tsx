'use client';

import React, { useState, useEffect } from 'react';
// 스마트 셀프견적 컴포넌트를 불러옵니다.
import SmartEstimator from '@/components/SmartEstimator';

// --- [4대 핵심 분야] 데이터 정의 ---
const SERVICE_DETAILS = {
  "01": {
    title: "융착식 도색",
    description: "약 180°C~220°C의 고온 용융 공법을 사용하여 노면과의 강력한 결합력을 확보합니다. 작업이 다소 지연되더라도 도로교통법 및 시방서 표준 규격에 맞춘 정확한 글라스비드 살포량을 철저히 준수하여, 야간과 우천 시에도 운전자의 시인성을 완벽하게 확보하고 추돌 사고를 방지합니다.",
    features: ["시방서 기준 정량 시공 원칙", "야간·우천 시 운전자 시인성 확보", "도로교통법 표준 규격 100% 준수"],
    subTypes: null,
    img: "/images/service_fusion.jpg"
  },
  "02": {
    title: "페인트 도색",
    description: "현장 상황 및 목적에 맞는 최적의 도료를 선택하여 도로의 가이드라인을 선명하게 구축합니다. 공기를 맞추기 위해 공정을 건너뛰지 않으며, 규정된 두께와 선명도를 바르게 준수하여 도로 위 안전을 책임집니다.",
    features: ["상황별 맞춤형 전문 도료 적용", "규정된 도료 두께 및 선명도 사수", "단지 내 주의 구간 표준 시공"],
    subTypes: [
      {
        name: "상온식 페인트 도색",
        desc: "상온 자연 건조 도료를 사용하여 주차장 및 단지 내 보행자 동선을 명확히 분리하고, 생활 속 안전 가이드라인을 바르게 도색합니다."
      },
      {
        name: "수용성 페인트 도색",
        desc: "유해 물질 배출이 없는 친환경 저독성 도료를 사용하여 어린이 보호구역(스쿨존) 및 교통약자 보호구역의 미끄럼 방지와 시인성을 준수합니다."
      },
      {
        name: "이액형 페인트 도색",
        desc: "화학적 결합을 통해 내마모성을 극대화하는 공법으로, 통행량이 많아 차선 마모와 교통 혼선 우려가 큰 구간에 엄격한 배합 비율로 시공합니다."
      }
    ],
    img: "/images/service_paint.jpg"
  },
  "03": {
    title: "미끄럼방지 포장",
    description: "제동 거리 확보가 필수적인 사고 위험 지역 및 급경사 구간에 특수 골재를 시공합니다. 1㎡당 규정된 골재 투입량과 결합재 규격을 정직하게 지켜 우천 및 동절기 노면 슬립 현상을 방지하고 차량과 보행자를 두터이 보호합니다.",
    features: ["우천·동절기 제동 거리 확보", "규정된 골재 투입량 정직한 준수", "노면 밀착을 위한 표준 공정 사수"],
    subTypes: null,
    img: "/images/service_slip.jpg"
  },
  "04": {
    title: "도로 시설물 설치",
    description: "규제봉, 과속방지턱, 카스토퍼 등 도로 위 필수 안전 인프라를 설치합니다. 속도전 위주로 대충 고정하는 시공이 아니라, 차량 충격에도 쉽게 이탈되어 2차 사고를 유발하지 않도록 시방서 지침 규격에 맞춘 견고한 고정 공법만을 고집합니다.",
    features: ["국토교통부 지침 표준 규격 제품", "2차 사고를 방지하는 견고한 고정", "보행자 및 차량 동선 고려 표준 배치"],
    subTypes: null,
    img: "/images/service_facility.jpg"
  }
};

// --- 블로그 섹션 컴포넌트 ---
function BlogSection() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/blog')
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("블로그 로딩 실패:", err);
        setLoading(false);
      });
  }, []);

  return (
    <section className="pt-14 pb-20 md:pt-20 md:pb-28 bg-[#0F172A] border-t border-white/5">
      <div className="px-4 md:px-32 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-10 md:mb-14">
          <div>
            <h3 className="text-4xl md:text-5xl font-[1000] tracking-tighter uppercase italic opacity-10 mb-3 text-white">Field Journal.</h3>
            <div className="flex items-center gap-3">
              <span className="w-8 h-[1px] bg-[#22C55E]"></span>
              <p className="text-[#22C55E] text-[10px] font-black tracking-[0.4em] uppercase">최신 시공 사례</p>
            </div>
          </div>
          <a 
            href="https://blog.naver.com/lee_eung1446" 
            target="_blank"
            rel="noopener noreferrer"
            className="group px-6 py-2.5 md:px-8 md:py-3.5 border border-white/10 hover:border-[#22C55E] transition-all text-[9px] md:text-[10px] font-bold tracking-widest uppercase text-white rounded-full"
          >
            Visit Official Blog
          </a>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {loading ? (
            <div className="col-span-full py-12 text-center text-white/20 text-xs tracking-widest uppercase animate-pulse">Loading Journals...</div>
          ) : (
            posts.map((post) => (
              <a 
                key={post.id} 
                href={post.link} 
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-col bg-[#020617]/50 border border-white/5 hover:border-[#22C55E]/50 transition-all duration-500 rounded-2xl overflow-hidden shadow-xl"
              >
                <div className="relative h-36 md:h-56 overflow-hidden">
                  <div className="absolute inset-0 bg-[#22C55E]/5 group-hover:bg-transparent transition-colors z-10"></div>
                  <img 
                    src={post.thumbnail || "https://images.unsplash.com/photo-1599700403969-fcf00ad77ea3?q=80&w=800"} 
                    alt={post.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                
                <div className="p-4 md:p-6 flex flex-col flex-grow">
                  <span className="text-[10px] md:text-[11px] font-bold text-[#22C55E] mb-2 tracking-tight">
                    {post.date}
                  </span>
                  <h4 className="text-[14px] md:text-lg font-bold text-white leading-[1.5] group-hover:text-white transition-colors line-clamp-2 break-keep">
                    {post.title}
                  </h4>
                  <div className="mt-auto pt-4 flex items-center justify-between">
                    <span className="hidden md:inline text-[11px] font-bold text-white/20 group-hover:text-white/50 transition-colors uppercase tracking-widest">Read More</span>
                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-[#22C55E] group-hover:border-[#22C55E] transition-all ml-auto">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="md:w-[12px] md:h-[12px]">
                        <line x1="7" y1="17" x2="17" y2="7"></line>
                        <polyline points="7 7 17 7 17 17"></polyline>
                      </svg>
                    </div>
                  </div>
                </div>
              </a>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

// --- 서비스 카드 컴포넌트 ---
const ServiceCard = ({ num, title, tag, imgSrc, onDetail }: { num: string; title: string; tag: string; imgSrc: string; onDetail: () => void }) => (
  <div onClick={onDetail} className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-[#22C55E]/50 transition-all cursor-pointer">
    <div className="h-32 md:h-48 overflow-hidden relative bg-slate-900">
      <img src={imgSrc} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-100 min-h-full" alt={title} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
      <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent"></div>
    </div>
    <div className="p-4 md:p-6">
      <div className="flex items-center gap-1.5 mb-1.5 md:mb-3">
        <span className="text-[#22C55E] text-[8px] md:text-[10px] font-bold uppercase tracking-widest">{num}</span>
        <span className="text-white/30 text-[8px] md:text-[10px] font-bold uppercase tracking-widest">{tag}</span>
      </div>
      <h3 className="text-sm md:text-lg font-bold text-white group-hover:text-[#22C55E] transition-colors leading-tight">{title}</h3>
    </div>
  </div>
);

// --- 메인 홈 컴포넌트 ---
export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // TypeScript 빌드 에러 방지를 위해 객체 Key 타입을 엄격하게 정의합니다.
  const [selectedId, setSelectedId] = useState<keyof typeof SERVICE_DETAILS | null>(null);
  const [isEstimatorOpen, setIsEstimatorOpen] = useState(false);

  // 공지사항 상태 관리
  const [isNoticeOpen, setIsNoticeOpen] = useState(false);
  const [dontShowToday, setDontShowToday] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    
    // 오늘 하루 열지 않기 체크
    const expiryTime = localStorage.getItem('hideNoticePopup');
    const currentTime = new Date().getTime();

    if (!expiryTime || currentTime > parseInt(expiryTime)) {
      localStorage.removeItem('hideNoticePopup');
      setIsNoticeOpen(true);
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 팝업 닫기 기능 및 로컬 스토리지 기한 저장
  const closeNoticePopup = () => {
    if (dontShowToday) {
      const expiryTime = new Date().getTime() + (24 * 60 * 60 * 1000); // 24시간 계산
      localStorage.setItem('hideNoticePopup', expiryTime.toString());
    }
    setIsNoticeOpen(false);
  };

  return (
    <main className="min-h-screen bg-[#0F172A] text-white font-sans selection:bg-[#22C55E]/30 overflow-x-hidden">
      
      {/* NAV */}
      <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 px-6 md:px-16 flex justify-between items-center ${
        isScrolled || isMobileMenuOpen ? 'bg-[#0F172A]/95 backdrop-blur-md py-4 border-b border-white/5 shadow-2xl' : 'bg-transparent py-6 md:py-8'
      }`}>
        <a href="#home" className="flex items-center gap-4 z-[110] cursor-pointer group">
          <div className="flex gap-1.5 items-center">
            <div className="w-1 h-6 bg-[#EF4444] rounded-full shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>
            <div className="w-1 h-6 bg-[#FACC15] rounded-full shadow-[0_0_10px_rgba(250,204,21,0.8)]"></div>
            <div className="w-1 h-6 bg-[#22C55E] rounded-full shadow-[0_0_10px_rgba(34,197,94,0.8)]"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl md:text-2xl font-[1000] tracking-tighter uppercase italic leading-none text-white group-hover:text-[#22C55E] transition-colors">이응도로안전</span>
            <span className="text-[9px] font-black tracking-[0.45em] text-white/40 uppercase mt-1 leading-none">Safety First Engineering</span>
          </div>
        </a>
        
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden fixed top-6 right-6 flex flex-col gap-1.5 z-[160] p-2 bg-black/20 rounded-lg backdrop-blur-sm">
          <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>

        <div className={`fixed inset-0 w-full h-screen bg-[#0F172A] z-[150] flex flex-col items-center justify-start pt-36 gap-8 transition-all duration-500 lg:hidden ${isMobileMenuOpen ? 'visible opacity-100' : 'invisible opacity-0'}`}>
          {['About', 'Services', 'Estimator', 'Portfolio', 'Contact'].map((item) => (
            <button 
              key={item} 
              onClick={() => {
                setIsMobileMenuOpen(false);
                if (item === 'Estimator') {
                  setIsEstimatorOpen(true);
                } else {
                  const element = document.getElementById(item.toLowerCase());
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                }
              }} 
              className="text-[24px] font-black tracking-[0.25em] text-white hover:text-[#22C55E] cursor-pointer bg-transparent border-none"
            >
              {item === 'About' ? '회사소개' : item === 'Services' ? '사업분야' : item === 'Estimator' ? '스마트셀프견적' : item === 'Portfolio' ? '시공사례' : '견적문의'}
            </button>
          ))}
        </div>

        <div className="hidden lg:flex gap-10 text-[14px] font-bold tracking-wider text-white/70">
          <a href="#about" className="hover:text-[#22C55E] transition-colors">회사소개</a>
          <a href="#services" className="hover:text-[#22C55E] transition-colors">사업분야</a>
          <button onClick={() => setIsEstimatorOpen(true)} className="hover:text-[#22C55E] transition-colors font-bold bg-transparent border-none p-0 cursor-pointer text-white/70">스마트셀프견적</button>
          <a href="#portfolio" className="hover:text-[#22C55E] transition-colors">시공사례</a>
          <a href="#contact" className="hover:text-[#22C55E] transition-colors">견적문의</a>
        </div>
      </nav>

      {/* HERO */}
      <section id="home" className="relative min-h-[55vh] md:h-[70vh] flex items-center px-6 md:px-32 bg-[#0F172A] pt-16">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1545143333-6382f1d5b893?q=80&w=2000" className="w-full h-full object-cover opacity-10 grayscale" alt="Hero" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A] via-transparent to-[#0F172A]"></div>
        </div>
        <div className="relative z-10 w-full max-w-5xl">
          <div className="inline-flex items-center gap-3 mb-6 md:mb-8">
            <span className="h-[1px] w-12 bg-[#22C55E]"></span>
            <span className="text-[#22C55E] text-[10px] font-black tracking-[0.5em] uppercase">Road Safety & Principle</span>
          </div>
          <h1 className="text-[9vw] md:text-[5.5vw] font-black leading-[1.1] tracking-[-0.04em] mb-6 text-white break-keep">
            안전을 긋다, <br /><span className="text-[#22C55E] italic">원칙을 세우다.</span>
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
            <p className="text-white/50 text-sm md:text-base font-medium leading-relaxed break-keep max-w-sm">
              속도보다 안전을, 마감보다 원칙을 우선합니다. <br /> 
              타협하지 않는 <span className="text-white">규격 시공</span>으로 <br />
              도로 위 소중한 생명을 지킵니다.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-2.5 w-full mt-4 md:mt-0">
              <a href="https://open.kakao.com/o/sv4661ui" target="_blank" rel="noopener noreferrer" className="flex-1 px-2 py-3.5 bg-[#FAE100] text-[#3C1E1E] font-[900] text-[15px] sm:text-[15px] hover:bg-white transition-all rounded-xl text-center shadow-md tracking-tight block">
                카톡 견적 상담
              </a>
              <a href="tel:010-8339-6557" className="flex-1 px-2 py-3.5 border border-white/10 bg-white/5 text-white font-[900] text-[15px] sm:text-[15px] hover:bg-white hover:text-black transition-all rounded-xl text-center tracking-tight block">
                전화 상담하기
              </a>
              <button onClick={() => setIsEstimatorOpen(true)} className="flex-1 px-2 py-3.5 bg-[#22C55E] text-white font-[900] text-[15px] sm:text-[15px] hover:bg-[#16a34a] transition-all rounded-xl text-center shadow-[0_0_15px_rgba(34,197,94,0.4)] tracking-tight block animate-pulse hover:animate-none cursor-pointer border-none">
                ⚡ 스마트 셀프견적 ⚡
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* IDENTITY */}
      <section id="about" className="pt-14 pb-16 md:pt-20 md:pb-24 px-6 md:px-32 max-w-7xl mx-auto border-t border-white/5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-12">
          <div className="lg:col-span-6">
            <h2 className="text-[#22C55E] text-[9px] font-black tracking-[0.8em] uppercase mb-4 italic opacity-60">Company Identity</h2>
            <h3 className="text-3xl md:text-4xl font-black tracking-tighter text-white leading-[1.2]">
             
              <span className="text-[#22C55E]">안전 수칙</span>과 <span className="text-white/30 italic">규격 시공은 타협하지 않습니다.</span>
            </h3>
          </div>
          <div className="lg:col-span-6 text-white/50 text-sm md:text-base font-medium leading-relaxed break-keep pt-1">
            이응도로안전의 최우선 가치는 속도가 아닌 '원칙'입니다. 이윤을 위해 공정을 생략하거나 하자와 타협하지 않습니다. 정해진 안전 수칙을 완벽히 지키고, 표준 시방서 규격을 미련할 만큼 바르게 준수하는 것만이 장기적으로 신뢰받는 기업을 만드는 유일한 길임을 약속드립니다.
          </div>
        </div>

        <div className="bg-[#020617]/60 border border-white/5 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#22C55E]/5 rounded-full blur-3xl"></div>
          <div className="max-w-4xl mx-auto relative z-10">
            <p className="text-[#22C55E] text-center text-[10px] font-black tracking-[0.4em] uppercase mb-6 md:mb-8">이응도로안전의 변치 않는 원칙 지표</p>
            <div className="grid grid-cols-2 gap-4 md:gap-8 divide-x divide-white/5">
              <div className="flex flex-col items-center text-center px-2 sm:px-6">
                <span className="text-2xl sm:text-4xl md:text-5xl font-[1000] text-white mb-1 md:mb-3 tracking-tight italic">0건</span>
                <span className="text-[9px] sm:text-xs font-bold text-slate-200 mb-2 md:mb-3 bg-white/5 px-2 sm:px-4 py-1 rounded-full border border-white/10 tracking-tighter">현장 안전수칙 위반</span>
                <p className="text-[9px] sm:text-xs text-white/40 max-w-sm leading-relaxed break-keep">철저한 신호수 배치와 안전 장비 착용 등 기본 수칙을 절대 생략하지 않겠습니다.</p>
              </div>
              <div className="flex flex-col items-center text-center px-2 sm:px-6">
                <span className="text-2xl sm:text-4xl md:text-5xl font-[1000] text-white mb-1 md:mb-3 tracking-tight italic">0%</span>
                <span className="text-[9px] sm:text-xs font-bold text-slate-200 mb-2 md:mb-3 bg-white/5 px-2 sm:px-4 py-1 rounded-full border border-white/10 tracking-tighter">표준 규격 오차율</span>
                <p className="text-[9px] sm:text-xs text-white/40 max-w-sm leading-relaxed break-keep">적정 도포 온도 및 정량 원료 사용 등 시방서 기준을 있는 그대로 수호하겠습니다.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-14 md:py-20 px-4 md:px-12 bg-[#020617] border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <span className="text-[#22C55E] text-[10px] font-black tracking-[0.5em] uppercase">Expertise</span>
            <h2 className="text-2xl md:text-4xl font-black mt-2 text-white">사업분야</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {Object.entries(SERVICE_DETAILS).map(([id, service]) => (
              <ServiceCard key={id} num={id} title={service.title} tag="Professional" imgSrc={service.img} onDetail={() => setSelectedId(id as keyof typeof SERVICE_DETAILS)} />
            ))}
          </div>
        </div>
      </section>

      {/* 사업분야 상세 모달 */}
      {selectedId && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#020617]/95 backdrop-blur-md" onClick={() => setSelectedId(null)}></div>
          <div className="relative bg-[#0F172A] border border-white/10 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
            <button onClick={() => setSelectedId(null)} className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center bg-black/50 hover:bg-[#22C55E] backdrop-blur-md rounded-full border border-white/20 text-white transition-all duration-300">✕</button>
            <div className="h-44 md:h-60 flex-shrink-0 overflow-hidden bg-slate-900">
              <img src={SERVICE_DETAILS[selectedId].img} className="w-full h-full object-cover min-h-full" alt="detail" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            </div>
            <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">{SERVICE_DETAILS[selectedId].title}</h2>
              <p className="text-white/60 mb-5 leading-relaxed break-keep text-sm">{SERVICE_DETAILS[selectedId].description}</p>
              {SERVICE_DETAILS[selectedId].subTypes ? (
                <div className="space-y-4 pt-1">
                  <h4 className="text-[#22C55E] font-black text-xs uppercase tracking-widest flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#22C55E] rounded-full animate-pulse"></span> 페인트 도색 분류 및 특징
                  </h4>
                  <div className="grid grid-cols-1 gap-3">
                    {SERVICE_DETAILS[selectedId].subTypes?.map((sub, i) => (
                      <div key={i} className="bg-white/5 border border-white/5 rounded-xl p-3.5 hover:border-[#22C55E]/30 transition-all">
                        <h5 className="text-white font-bold text-sm mb-1 flex items-center gap-2"><span className="text-[#22C55E] text-xs">◆</span> {sub.name}</h5>
                        <p className="text-white/50 text-xs leading-relaxed break-keep">{sub.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <h4 className="text-[#22C55E] font-bold text-xs uppercase tracking-widest">핵심 준수 원칙</h4>
                  <ul className="grid grid-cols-1 gap-2">
                    {SERVICE_DETAILS[selectedId].features.map((f, i) => (
                      <li key={i} className="text-white/80 text-sm flex items-center gap-2"><span className="w-1.5 h-1.5 bg-[#22C55E] rounded-full"></span> {f}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 스마트 셀프견적 모달 창 구역 */}
      {isEstimatorOpen && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#020617]/95 backdrop-blur-md" onClick={() => setIsEstimatorOpen(false)}></div>
          <div className="relative bg-[#0F172A] border border-white/10 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl max-h-[92vh] flex flex-col text-white">
            <button onClick={() => setIsEstimatorOpen(false)} className="absolute top-4 right-4 z-50 w-8 h-8 flex items-center justify-center bg-black/50 hover:bg-red-500 backdrop-blur-md rounded-full border border-white/10 text-white transition-all text-xs border-none cursor-pointer">✕</button>
            <div className="p-2 md:p-4 overflow-y-auto custom-scrollbar">
              <SmartEstimator />
            </div>
          </div>
        </div>
      )}

      {/* 중요 공지사항 팝업 레이어 */}
      {isNoticeOpen && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsNoticeOpen(false)}></div>
          <div className="relative bg-[#1E293B] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col text-white animate-in fade-in zoom-in duration-200">
            <div className="bg-[#22C55E] px-5 py-3 flex items-center gap-2">
              <span className="text-sm">📢</span>
              <span className="text-xs font-black tracking-wider uppercase text-slate-900">Notice</span>
            </div>
            <div className="p-6 md:p-8 space-y-4">
              <h3 className="text-xl font-extrabold text-white tracking-tight break-keep">
                이응도로안전 안내 말씀
              </h3>
              <div className="text-slate-300 text-sm leading-relaxed space-y-2 break-keep">
                <p>안녕하세요. 이응도로안전입니다.</p>
                <p>현재 스마트 셀프견적 시스템 연동이 정상 완료되어 실시간 가견적 조회가 원활하게 가능합니다.</p>
                <p>도로 차선 도색, 미끄럼방지 포장 등 표준 시방서 규격을 엄격히 지키는 고품질 책임 시공을 약속드립니다. 궁금한 사항은 언제든 문의해 주시기 바랍니다.</p>
              </div>
            </div>
            <div className="bg-slate-900/50 px-5 py-3.5 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
              <label className="flex items-center gap-2 cursor-pointer select-none group">
                <input 
                  type="checkbox" 
                  checked={dontShowToday}
                  onChange={(e) => setDontShowToday(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-[#22C55E] focus:ring-[#22C55E] focus:ring-offset-slate-900 transition-colors cursor-pointer"
                />
                <span className="group-hover:text-white transition-colors">오늘 하루 이 창 열지 않기</span>
              </label>
              <button 
                onClick={closeNoticePopup} 
                className="px-4 py-1.5 bg-white/10 hover:bg-[#22C55E] hover:text-white rounded-lg text-white font-bold transition-all text-xs border-none cursor-pointer"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PORTFOLIO */}
      <section id="portfolio">
        <BlogSection />
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-28 md:py-36 px-6 text-center bg-[#020617] relative overflow-hidden border-t border-white/5">
        <div className="max-w-4xl mx-auto space-y-10 relative z-10">
          <h2 className="text-[#22C55E] text-[10px] font-black tracking-[1.2em] uppercase opacity-60">Get in touch</h2>
          <p className="text-4xl md:text-6xl font-black tracking-tight text-white">가장 선명하고 안전한 <br />길의 시작.</p>
          <a href="tel:010-8339-6557" className="text-3xl md:text-5xl font-black border-b border-[#22C55E] hover:text-[#22C55E] transition-all pb-1 text-white inline-block">010.8339.6557</a>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[45vw] font-black text-white/[0.012] select-none pointer-events-none uppercase italic">EUNG</div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-6 md:px-32 bg-[#0F172A] border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
           <div className="flex items-center gap-6">
             <div className="flex gap-1.5 items-center">
               <div className="w-1 h-6 bg-[#EF4444] rounded-full shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>
               <div className="w-1 h-6 bg-[#FACC15] rounded-full shadow-[0_0_10px_rgba(250,204,21,0.8)]"></div>
               <div className="w-1 h-6 bg-[#22C55E] rounded-full shadow-[0_0_10px_rgba(34,197,94,0.8)]"></div>
             </div>
             <div className="flex flex-col text-white">
               <span className="text-lg font-black uppercase italic">이응도로안전</span>
               <span className="text-[8px] font-bold text-white/20 tracking-[0.2em]">Precision Engineering Group</span>
             </div>
           </div>
           <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">© 2026 Eung Road Safety</p>
        </div>
      </footer>
    </main>
  );
}