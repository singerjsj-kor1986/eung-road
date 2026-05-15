'use client';

import React, { useState, useEffect } from 'react';

// --- 1. 상세 데이터 정의 ---
const SERVICE_DETAILS = {
  "01": {
    title: "융착식 도색",
    description: "고온(약 180°C~220°C)으로 녹인 융착형 도료를 사용하여 노면에 강력하게 부착시키는 공법입니다. 건조 속도가 빠르고 내구성이 뛰어나 통행량이 많은 도로에 최적입니다.",
    features: ["야간 시인성 극대화", "사계절 기온 변화에 강한 부착력", "KS 표준 규격 준수 시공"],
    img: "/images/service01.jpg"
  },
  "02": {
    title: "상온식 페인트 도색",
    description: "상온에서 자연 건조되는 도료를 사용하는 경제적인 공법입니다. 시공이 간편하여 주차장, 단지 내 도로, 보수 도색 등에 널리 사용됩니다.",
    features: ["경제적인 시공 비용", "다양한 색상 선택 가능", "신속한 당일 시공 및 개통"],
    img: "/images/service02.jpg"
  },
  "03": {
    title: "수용성 페인트 도색",
    description: "친환경 수성 도료를 사용하여 유해 물질 배출을 최소화한 공법입니다. 어린이 보호구역, 공원, 보행자 전용 도로 등에 가장 적합합니다.",
    features: ["친환경 및 저독성 소재", "우수한 부착력과 색상 유지", "냄새 없는 쾌적한 시공 환경"],
    img: "/images/service03.jpg"
  },
  "04": {
    title: "이액형 페인트 도색",
    description: "주제와 경화제를 혼합 시공하여 화학적 결합을 유도하는 고성능 공법입니다. 일반 페인트보다 월등한 내마모성과 접착력을 제공합니다.",
    features: ["반영구적인 내구성", "초강력 노면 밀착력", "고급스러운 외관 품질"],
    img: "/images/service04.jpg"
  },
  "05": {
    title: "미끄럼방지 포장",
    description: "급경사, 교차로 등 사고 위험 지역에 특수 골재를 시공하여 마찰력을 높입니다. 우천 시에도 짧은 제동 거리를 확보하여 안전을 지킵니다.",
    features: ["우수한 미끄럼 저항성", "시인성 높은 컬러 포장", "강력한 사고 예방 효과"],
    img: "/images/service05.jpg"
  },
  "06": {
    title: "도로 시설물",
    description: "규제봉, 방지턱, 카스토퍼, 도로 표지판 등 안전을 위한 시설물을 정밀 설치합니다. 현장 조건에 맞춰 가장 견고한 방식으로 시공합니다.",
    features: ["표준 규격 제품 사용", "정밀한 위치 선정 및 설치", "노후 시설 보수 및 유지관리"],
    img: "/images/service06.jpg"
  }
};

// --- 2. 블로그 섹션 컴포넌트 (모바일 가독성 강화 버전) ---
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
    <section className="py-24 md:py-52 bg-[#0F172A] border-t border-white/5">
      <div className="px-4 md:px-32 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-12 md:mb-24">
          <div>
            <h3 className="text-4xl md:text-6xl font-[1000] tracking-tighter uppercase italic opacity-10 mb-6 text-white">Field Journal.</h3>
            <div className="flex items-center gap-3">
              <span className="w-8 h-[1px] bg-[#22C55E]"></span>
              <p className="text-[#22C55E] text-[10px] font-black tracking-[0.4em] uppercase">최신 시공 사례</p>
            </div>
          </div>
          <a 
            href="https://blog.naver.com/lee_eung1446" 
            target="_blank"
            rel="noopener noreferrer"
            className="group px-6 py-3 md:px-8 md:py-4 border border-white/10 hover:border-[#22C55E] transition-all text-[9px] md:text-[10px] font-bold tracking-widest uppercase text-white rounded-full"
          >
            Visit Official Blog
          </a>
        </div>

        {/* 모바일 2열 그리드 유지 & 간격 최적화 */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {loading ? (
            <div className="col-span-full py-20 text-center text-white/20 text-xs tracking-widest uppercase animate-pulse">Loading Journals...</div>
          ) : (
            posts.map((post) => (
              <a 
                key={post.id} 
                href={post.link} 
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-col bg-[#020617]/50 border border-white/5 hover:border-[#22C55E]/50 transition-all duration-500 rounded-2xl overflow-hidden shadow-xl"
              >
                {/* 이미지 높이 확보 */}
                <div className="relative h-36 md:h-56 overflow-hidden">
                  <div className="absolute inset-0 bg-[#22C55E]/5 group-hover:bg-transparent transition-colors z-10"></div>
                  <img 
                    src={post.thumbnail || "https://images.unsplash.com/photo-1599700403969-fcf00ad77ea3?q=80&w=800"} 
                    alt={post.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                
                {/* 텍스트 영역 가독성 강화 */}
                <div className="p-4 md:p-6 flex flex-col flex-grow">
                  <span className="text-[10px] md:text-[11px] font-bold text-[#22C55E] mb-2 tracking-tight">
                    {post.date}
                  </span>
                  {/* 제목 크기를 14px로 키우고 줄간격을 확보함 */}
                  <h4 className="text-[14px] md:text-lg font-bold text-white leading-[1.5] group-hover:text-white transition-colors line-clamp-2 break-keep">
                    {post.title}
                  </h4>
                  
                  <div className="mt-auto pt-6 flex items-center justify-between">
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

// --- 3. 서비스 카드 컴포넌트 ---
const ServiceCard = ({ num, title, tag, imgSrc, onDetail }) => (
  <div 
    onClick={onDetail}
    className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-[#22C55E]/50 transition-all duration-500 cursor-pointer"
  >
    <div className="h-32 md:h-52 overflow-hidden relative">
      <img 
        src={imgSrc || "https://images.unsplash.com/photo-1545143333-6382f1d5b893?q=80&w=800"} 
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-100"
        alt={title}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent"></div>
    </div>
    <div className="p-4 md:p-8">
      <div className="flex items-center gap-1.5 mb-2 md:mb-4">
        <span className="text-[#22C55E] text-[8px] md:text-[10px] font-bold uppercase tracking-widest">{num}</span>
        <span className="text-white/30 text-[8px] md:text-[10px] font-bold uppercase tracking-widest">{tag}</span>
      </div>
      <h3 className="text-sm md:text-xl font-bold text-white group-hover:text-[#22C55E] transition-colors leading-tight">{title}</h3>
    </div>
  </div>
);

// --- 4. 메인 홈 컴포넌트 ---
export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main className="min-h-screen bg-[#0F172A] text-white font-sans selection:bg-[#22C55E]/30 overflow-x-hidden">
      
      {/* NAV */}
      <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 px-6 md:px-16 flex justify-between items-center ${
        isScrolled || isMobileMenuOpen ? 'bg-[#0F172A]/95 backdrop-blur-md py-5 border-b border-white/5 shadow-2xl' : 'bg-transparent py-10'
      }`}>
        <a href="#home" className="flex items-center gap-5 z-[110] cursor-pointer group">
          <div className="flex gap-2 items-center">
            <div className="w-1.5 h-7 bg-[#EF4444] rounded-full shadow-[0_0_12px_rgba(239,68,68,0.8)]"></div>
            <div className="w-1.5 h-7 bg-[#FACC15] rounded-full shadow-[0_0_12px_rgba(250,204,21,0.8)]"></div>
            <div className="w-1.5 h-7 bg-[#22C55E] rounded-full shadow-[0_0_12px_rgba(34,197,94,0.8)]"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl md:text-3xl font-[1000] tracking-tighter uppercase italic leading-none text-white group-hover:text-[#22C55E] transition-colors">이응도로안전</span>
            <span className="text-[10px] font-black tracking-[0.45em] text-white/40 uppercase mt-1.5 leading-none">Safety First Engineering</span>
          </div>
        </a>
        
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden fixed top-10 right-8 flex flex-col gap-1.5 z-[160] p-2 bg-black/20 rounded-lg backdrop-blur-sm">
          <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>

        <div className={`fixed inset-0 w-full h-screen bg-[#0F172A] z-[150] flex flex-col items-center justify-start pt-48 gap-10 transition-all duration-500 lg:hidden ${isMobileMenuOpen ? 'visible opacity-100' : 'invisible opacity-0'}`}>
          {['About', 'Services', 'Portfolio', 'Contact'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setIsMobileMenuOpen(false)} className="text-[28px] font-black tracking-[0.25em] text-white hover:text-[#22C55E]">
              {item === 'About' ? '회사소개' : item === 'Services' ? '사업분야' : item === 'Portfolio' ? '시공사례' : '견적문의'}
            </a>
          ))}
        </div>

        <div className="hidden lg:flex gap-14 text-[15px] font-bold tracking-wider text-white/70">
          {['About', 'Services', 'Portfolio', 'Contact'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-[#22C55E] transition-colors">
              {item === 'About' ? '회사소개' : item === 'Services' ? '사업분야' : item === 'Portfolio' ? '시공사례' : '견적문의'}
            </a>
          ))}
        </div>
      </nav>

      {/* HERO */}
      <section id="home" className="relative h-screen flex items-center px-6 md:px-32 bg-[#0F172A]">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1545143333-6382f1d5b893?q=80&w=2000" className="w-full h-full object-cover opacity-10 grayscale" alt="Hero" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A] via-transparent to-[#0F172A]"></div>
        </div>
        <div className="relative z-10 w-full max-w-5xl">
          <div className="inline-flex items-center gap-3 mb-12">
            <span className="h-[1px] w-12 bg-[#22C55E]"></span>
            <span className="text-[#22C55E] text-[10px] font-black tracking-[0.5em] uppercase">The Art of Road Marking</span>
          </div>
          <h1 className="text-[10vw] md:text-[6.2vw] font-black leading-[1.05] tracking-[-0.05em] mb-12 text-white">
            The Precision <br /><span className="text-white/20 italic">Marking Solution.</span>
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-end">
            <p className="text-white/40 text-base md:text-lg font-medium leading-relaxed break-keep max-w-sm">
              가장 선명한 가이드라인으로 도로의 질서를 만듭니다. <br /> 대구·경북·경남 지역 도로안전의 새로운 기준입니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full mt-8">
              <a href="https://open.kakao.com/o/sv4661ui" target="_blank" rel="noopener noreferrer" className="flex-[1.2] px-6 py-5 bg-[#FAE100] text-[#3C1E1E] font-extrabold text-[15px] hover:bg-white transition-all rounded-sm text-center">카톡 견적 상담</a>
              <a href="tel:010-8339-6557" className="flex-1 px-6 py-5 border border-white/20 text-white font-extrabold text-[15px] hover:bg-[#22C55E] transition-all rounded-sm text-center">전화 상담 바로가기</a>
            </div>
          </div>
        </div>
      </section>

      {/* IDENTITY */}
      <section id="about" className="py-32 md:py-52 px-6 md:px-32 max-w-7xl mx-auto border-t border-white/5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-start">
          <div className="lg:col-span-6">
            <h2 className="text-[#22C55E] text-[9px] font-black tracking-[0.8em] uppercase mb-8 italic opacity-60">Company Identity</h2>
            <h3 className="text-4xl md:text-5xl font-black tracking-tighter text-white">단순한 도색이 아닌 <br /><span className="text-white/30 italic">생명선을 긋습니다.</span></h3>
          </div>
          <div className="lg:col-span-6 text-white/40 text-lg leading-relaxed">
            이응도로안전은 젊은 감각과 숙련된 노하우를 결합했습니다. 대구·경북·경남 지역을 거점으로 완벽한 시공을 보장합니다.
            <div className="grid grid-cols-3 gap-8 border-t border-white/5 pt-12 mt-12">
              <StatItem title="Precision" value="0.1mm" />
              <StatItem title="Region" value="Dae-Gyeong" />
              <StatItem title="Standard" value="KS-Mark" />
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-24 px-4 md:px-12 bg-[#020617]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <span className="text-[#22C55E] text-[10px] font-black tracking-[0.5em] uppercase">What we do</span>
            <h2 className="text-3xl md:text-5xl font-black mt-4 text-white">사업분야</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
            {Object.entries(SERVICE_DETAILS).map(([id, service]) => (
              <ServiceCard 
                key={id}
                num={id} 
                title={service.title} 
                tag={id === "01" ? "Durability" : id === "03" ? "Eco" : "Safety"} 
                imgSrc={service.img} 
                onDetail={() => setSelectedId(id)} 
              />
            ))}
          </div>
        </div>
      </section>

      {/* 모달 팝업 */}
      {selectedId && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#020617]/95 backdrop-blur-md" onClick={() => setSelectedId(null)}></div>
          <div className="relative bg-[#0F172A] border border-white/10 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
            <button onClick={() => setSelectedId(null)} className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center bg-black/50 hover:bg-[#22C55E] backdrop-blur-md rounded-full border border-white/20 text-white transition-all duration-300">✕</button>
            <div className="h-56 md:h-72 overflow-hidden">
              <img src={SERVICE_DETAILS[selectedId].img} className="w-full h-full object-cover" alt="detail" />
            </div>
            <div className="p-8">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">{SERVICE_DETAILS[selectedId].title}</h2>
              <p className="text-white/60 mb-8 leading-relaxed break-keep text-sm md:text-base">{SERVICE_DETAILS[selectedId].description}</p>
              <div className="space-y-4">
                <h4 className="text-[#22C55E] font-bold text-xs uppercase tracking-widest">핵심 특징</h4>
                <ul className="grid grid-cols-1 gap-3">
                  {SERVICE_DETAILS[selectedId].features.map((f, i) => (
                    <li key={i} className="text-white/80 text-sm flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#22C55E] rounded-full"></span> {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PORTFOLIO (강화된 가독성 적용) */}
      <section id="portfolio">
        <BlogSection />
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-60 px-6 text-center bg-[#020617] relative overflow-hidden border-t border-white/5">
        <div className="max-w-4xl mx-auto space-y-16 relative z-10">
          <h2 className="text-[#22C55E] text-[10px] font-black tracking-[1.2em] uppercase opacity-60">Get in touch</h2>
          <p className="text-5xl md:text-7xl font-black tracking-tight text-white">가장 선명하고 안전한 <br />길의 시작.</p>
          <a href="tel:010-8339-6557" className="text-4xl md:text-6xl font-black border-b border-[#22C55E] hover:text-[#22C55E] transition-all pb-2 text-white inline-block">010.8339.6557</a>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[45vw] font-black text-white/[0.015] select-none pointer-events-none uppercase italic">EUNG</div>
      </section>

      {/* FOOTER */}
      <footer className="py-20 px-6 md:px-32 bg-[#0F172A] border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
           <div className="flex items-center gap-8">
             <div className="flex gap-2 items-center">
               <div className="w-1.5 h-7 bg-[#EF4444] rounded-full"></div>
               <div className="w-1.5 h-7 bg-[#FACC15] rounded-full"></div>
               <div className="w-1.5 h-7 bg-[#22C55E] rounded-full"></div>
             </div>
             <div className="flex flex-col text-white">
               <span className="text-xl font-black uppercase italic">이응도로안전</span>
               <span className="text-[8px] font-bold text-white/20 tracking-[0.2em]">Precision Engineering Group</span>
             </div>
           </div>
           <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">© 2026 Eung Road Safety</p>
        </div>
      </footer>
    </main>
  );
}

function StatItem({ title, value }: { title: string, value: string }) {
  return (
    <div>
      <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] mb-2">{title}</p>
      <p className="text-2xl font-black tracking-tighter text-white/90">{value}</p>
    </div>
  );
}