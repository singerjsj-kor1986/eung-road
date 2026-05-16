'use client';

import React, { useState } from 'react';

interface BasketItem {
  id: string;
  category: 'paint' | 'slip' | 'safety'; 
  method?: string;
  glassBead?: string;
  materialType?: string;
  color: string; 
  workType: string; 
  quantity: number; 
  unitPrice: number; 
  dimensions?: {
    width: number;
    height: number;
    count?: number; 
  };
  safetyType?: 'install' | 'remove'; 
  itemDetail?: string; 
}

export default function SmartEstimator() {
  const [activeTab, setActiveTab] = useState<'paint' | 'slip' | 'safety'>('paint');

  // --- [01. 도색 옵션 상태] ---
  const [method, setMethod] = useState<'fusion' | 'paint'>('fusion');
  const [glassBead, setGlassBead] = useState<'normal' | 'high'>('normal');
  const [materialType, setMaterialType] = useState<string>('융착식-R3');
  const [paintColor, setPaintColor] = useState<string>('백색 (구분선, 주차선 등)'); 
  const [customColor, setCustomColor] = useState<string>(''); 
  const [paintWorkType, setPaintWorkType] = useState<string>('line'); 
  const [paintInputType, setPaintInputType] = useState<'qty' | 'dimensions'>('qty'); 
  const [paintQuantity, setPaintQuantity] = useState<number>(0); 
  const [paintWidth, setPaintWidth] = useState<number>(0); 
  const [paintHeight, setPaintHeight] = useState<number>(0); 
  const [paintCount, setPaintCount] = useState<number>(1); 

  // --- [02. 미끄럼방지 옵션 상태] ---
  const [slipColor, setSlipColor] = useState<string>('적색 (기본형)');
  const [slipCustomColor, setSlipCustomColor] = useState<string>('');
  const [slipInputType, setSlipInputType] = useState<'m2' | 'dimensions'>('m2'); 
  const [slipM2Quantity, setSlipM2Quantity] = useState<number>(0); 
  const [slipWidth, setSlipWidth] = useState<number>(0); 
  const [slipHeight, setSlipHeight] = useState<number>(0); 
  const [slipCount, setSlipCount] = useState<number>(1); 

  // --- [03. 안전 시설물 옵션 상태] ---
  const [safetyCategory, setSafetyCategory] = useState<string>('post'); 
  const [safetyAction, setSafetyAction] = useState<'install' | 'remove'>('install'); 
  const [safetyQty, setSafetyQty] = useState<number>(0); 
  
  const [postHeight, setPostHeight] = useState<string>('450mm');
  const [stopperMaterial, setStopperMaterial] = useState<string>('플라스틱재질');
  const [studType, setStudType] = useState<string>('일반노면등');
  const [studOption, setStudOption] = useState<string>('백색양면');

  // --- [통합 장바구니 및 모달 상태] ---
  const [basket, setBasket] = useState<BasketItem[]>([]);
  const [isNightWork, setIsNightWork] = useState<boolean>(false); 
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); 
  const [customerPhone, setCustomerPhone] = useState<string>(''); 

  // --- [도색 단가 계산 엔진] ---
  const getPaintUnitPrice = (workType: string, material: string, colorOption: string, isHighBead: boolean) => {
    let colorGroup: 'white' | 'yellow' | 'etc' = 'etc';
    if (colorOption.includes('백색') && !colorOption.includes('황,백색')) colorGroup = 'white';
    else if (colorOption.includes('황색') || colorOption.includes('황,백색')) colorGroup = 'yellow';

    let targetMaterial = material === '페인트-이액형도료' ? '융착식-R3' : material;
    let basePrice = 0;

    switch (targetMaterial) {
      case '페인트-수용성도료': basePrice = colorGroup === 'white' ? 4500 : colorGroup === 'yellow' ? 5000 : 8000; break;
      case '페인트-상온형도료': basePrice = colorGroup === 'white' ? 5000 : colorGroup === 'yellow' ? 5500 : 9000; break;
      case '융착식-R3': basePrice = colorGroup === 'white' ? 13000 : colorGroup === 'yellow' ? 14000 : 18000; break;
      case '융착식-R5': basePrice = colorGroup === 'white' ? 15000 : colorGroup === 'yellow' ? 16000 : 20000; break;
    }
    if (isHighBead) basePrice += 1000;
    if (workType === 'text') basePrice *= 2;
    return basePrice;
  };

  const handleAddPaintToBasket = () => {
    const isCustomArea = paintInputType === 'dimensions';
    
    if (isCustomArea && (paintWidth <= 0 || paintHeight <= 0 || paintCount <= 0)) {
      alert('가로, 세로, 수량을 모두 정확히 입력해주세요.'); return;
    } else if (!isCustomArea && paintQuantity <= 0) {
      alert('시공 물량을 정확히 입력해주세요.'); return;
    }

    let finalColor = paintColor === 'custom' ? `기타 (${customColor.trim()})` : paintColor;
    const actualWorkType = isCustomArea ? 'custom_area' : paintWorkType;
    const price = getPaintUnitPrice(actualWorkType, materialType, paintColor, glassBead === 'high');
    const finalQuantity = isCustomArea ? (paintWidth * paintHeight * paintCount) : paintQuantity;

    setBasket([...basket, {
      id: Date.now().toString(),
      category: 'paint',
      method, glassBead, materialType,
      color: finalColor, workType: actualWorkType,
      quantity: finalQuantity, unitPrice: price,
      ...(isCustomArea && { dimensions: { width: paintWidth, height: paintHeight, count: paintCount } })
    }]);
    
    setPaintQuantity(0); setPaintWidth(0); setPaintHeight(0); setPaintCount(1); setCustomColor('');
  };

  const handleAddSlipToBasket = () => {
    if (slipInputType === 'm2' && slipM2Quantity <= 0) {
      alert('시공하실 해배(㎡) 수를 입력해주세요.'); return;
    }
    if (slipInputType === 'dimensions' && (slipWidth <= 0 || slipHeight <= 0 || slipCount <= 0)) {
      alert('올바른 가로, 세로, 수량을 모두 입력해주세요.'); return;
    }

    let finalColor = slipColor === 'custom' ? `기타 (${slipCustomColor.trim()})` : slipColor;
    const price = slipColor === '적색 (기본형)' ? 18000 : 20000;
    const finalQuantity = slipInputType === 'dimensions' ? (slipWidth * slipHeight * slipCount) : slipM2Quantity;

    setBasket([...basket, {
      id: Date.now().toString(),
      category: 'slip',
      color: finalColor,
      workType: slipInputType === 'm2' ? 'slip_m2' : 'slip_custom',
      quantity: finalQuantity,
      unitPrice: price,
      ...(slipInputType === 'dimensions' && { dimensions: { width: slipWidth, height: slipHeight, count: slipCount } })
    }]);
    setSlipM2Quantity(0); setSlipWidth(0); setSlipHeight(0); setSlipCount(1); setSlipCustomColor('');
  };

  const handleAddSafetyToBasket = () => {
    if (safetyQty <= 0) {
      alert('신설 또는 철거할 수량(물량)을 정확히 입력해 주세요.');
      return;
    }

    let itemName = '';
    let itemDetailText = '';
    let baseUnitPrice = 0;

    if (safetyAction === 'remove') {
      baseUnitPrice = 7000; 
      if (safetyCategory === 'post') { itemName = '차선 규제봉'; itemDetailText = '기존 규제봉 철거'; }
      if (safetyCategory === 'stopper') { itemName = '카스토퍼'; itemDetailText = '기존 카스토퍼 철거'; }
      if (safetyCategory === 'stud') { itemName = '노면등(표지병)'; itemDetailText = '기존 표지병 철거/추출'; }
      if (safetyCategory === 'bump') { itemName = '고무 과속방지턱'; itemDetailText = '방지턱 철거 공정'; baseUnitPrice = 15000; }
    } else {
      switch (safetyCategory) {
        case 'post':
          itemName = '차선 규제봉';
          itemDetailText = `높이 ${postHeight} 설치`;
          baseUnitPrice = postHeight === '450mm' ? 20000 : 25000;
          break;
        case 'stopper':
          itemName = '카스토퍼';
          itemDetailText = `${stopperMaterial} 설치`;
          baseUnitPrice = stopperMaterial === '플라스틱재질' ? 15000 : 22000;
          break;
        case 'stud':
          itemName = '노면등(표지병)';
          itemDetailText = `${studType} (${studOption}) 설치`;
          const isLed = studType === 'LED발광 노면등';
          baseUnitPrice = 45000;
          break;
        case 'bump':
          itemName = '고무 과속방지턱';
          itemDetailText = '표준 고무 방지턱 설치 (m 단위)';
          baseUnitPrice = 80000;
          break;
      }
    }

    setBasket([...basket, {
      id: Date.now().toString(),
      category: 'safety',
      color: itemName,
      workType: safetyCategory,
      quantity: safetyQty,
      unitPrice: baseUnitPrice,
      safetyType: safetyAction,
      itemDetail: itemDetailText
    }]);

    setSafetyQty(0);
  };

  const handleRemoveItem = (id: string) => setBasket(basket.filter(item => item.id !== id));
  const handleClearBasket = () => { if (confirm('시공 리스트를 비우시겠습니까?')) setBasket([]); };

  const calculateEstimate = () => {
    let total = 0;
    basket.forEach(item => {
      let area = item.quantity;
      if (item.category === 'paint') {
        if (item.workType === 'line') area = item.quantity * 0.15;
        else if (item.workType === 'parking') area = item.quantity * 1.5;
        else if (item.workType === 'crosswalk') area = item.quantity * 0.45;
        else if (item.workType === 'text') area = item.quantity * 0.5;
        else if (item.workType === 'guideline') area = item.quantity * 0.3;
      }
      total += item.unitPrice * area;
    });

    if (isNightWork) total *= 1.2;
    return total;
  };

  // --- [스마트 견적 전송 기능 수행 핸들러 - 팝업 메시지 구조 고도화] ---
  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerPhone.trim()) { alert('연락처를 입력해주세요.'); return; }
    if (basket.length === 0) { alert('선택된 시공 내역이 없습니다.'); return; }

    const totalPrice = Math.round(calculateEstimate());

    // 🔄 [신청 내역 요약 고도화 조립 파트]
    let summaryText = `[🔔 홈페이지 스마트 견적 신규 접수]\n`;
    summaryText += `지정된 홈페이지 관리자 카톡으로 아래 내용이 전송됩니다.\n\n`;
    summaryText += `• 고객 연락처: ${customerPhone}\n`;
    summaryText += `• 시공 작업 환경: ${isNightWork ? '🌙 야간 작업 (20% 할증 적용됨)' : '☀️ 주간 작업'}\n`;
    summaryText += `• 총 예상 산출 금액: ${totalPrice.toLocaleString()}원\n\n`;
    summaryText += `■ 세부 시공 항목 요약 리스트:\n`;

    basket.forEach((item, index) => {
      let area = item.quantity;
      let unitLabel = '개';
      let specSummary = ''; // 품목별 세부 스펙 조립란

      // 1. 도색 분류인 경우 세부 내용 정밀 정돈
      if (item.category === 'paint') {
        const beadText = item.glassBead === 'high' ? '고휘도유리알' : '일반유리알';
        specSummary = `[${item.materialType} / ${beadText} / ${item.color}]`;

        if (item.workType === 'line') { area = item.quantity * 0.15; unitLabel = `m (환산면적: ${area.toFixed(2)}㎡)`; }
        else if (item.workType === 'parking') { area = item.quantity * 1.5; unitLabel = `칸 (환산면적: ${area.toFixed(2)}㎡)`; }
        else if (item.workType === 'crosswalk') { area = item.quantity * 0.45; unitLabel = `m (환산면적: ${area.toFixed(2)}㎡)`; }
        else if (item.workType === 'text') { area = item.quantity * 0.5; unitLabel = `자 (환산면적: ${area.toFixed(2)}㎡)`; }
        else if (item.workType === 'custom_area') { 
          area = item.quantity; 
          unitLabel = `㎡ [가로 ${item.dimensions?.width}m × 세로 ${item.dimensions?.height}m × ${item.dimensions?.count}개소]`; 
        }
      } 
      // 2. 미끄럼방지 포장 분류인 경우
      else if (item.category === 'slip') {
        specSummary = `[미끄럼방지 포장재 / ${item.color}]`;
        if (item.workType === 'slip_m2') {
          unitLabel = '㎡';
        } else if (item.workType === 'slip_custom') {
          unitLabel = `㎡ [가로 ${item.dimensions?.width}m × 세로 ${item.dimensions?.height}m × ${item.dimensions?.count}개소]`;
        }
      } 
      // 3. 안전 시설물 분류인 경우
      else if (item.category === 'safety') {
        specSummary = `[${item.safetyType === 'remove' ? '❌ 기존철거' : '⚙️ 신설공정'} / ${item.itemDetail}]`;
        unitLabel = item.workType === 'bump' ? 'm' : '개';
      }

      // 품목 대표 이름 지정
      let itemTitle = item.color;
      if (item.category === 'paint') {
        itemTitle = item.workType === 'line' ? '일반 차선 시공' : 
                    item.workType === 'parking' ? '주차장 구획선' : 
                    item.workType === 'crosswalk' ? '횡단보도 도색' : 
                    item.workType === 'text' ? '문자/기호 도색' : '사용자 지정 면적 도색';
      }

      // 개별 항목 가독성 라인 조립
      const itemPrice = Math.round(item.unitPrice * area * (isNightWork ? 1.2 : 1));
      summaryText += `${index + 1}. 【${item.category === 'paint' ? '도색' : item.category === 'slip' ? '미방' : '시설'}】 ${itemTitle}\n`;
      summaryText += `   └ 상세: ${specSummary}\n`;
      summaryText += `   └ 수량: ${item.quantity.toLocaleString()}${unitLabel}\n`;
      summaryText += `   └ 금액: ${itemPrice.toLocaleString()}원\n\n`;
    });

    try {
      /* [실제 서버 전송 시 활용할 Fetch API 구조]
      await fetch('/api/send-admin-kakao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ summaryText, customerPhone, totalPrice, basket })
      });
      */

      alert(summaryText);
      
      setIsModalOpen(false);
      setCustomerPhone('');
      setBasket([]);

    } catch (error) {
      alert('전송 처리 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="w-full bg-[#0F172A] text-white rounded-2xl p-3 md:p-6 text-left grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <div className="lg:col-span-2 space-y-5">
        <div className="flex border-b border-white/10">
          <button type="button" onClick={() => setActiveTab('paint')} className={`flex-1 py-3 text-xs md:text-sm font-bold border-b-2 transition-all ${activeTab === 'paint' ? 'border-b-2 border-[#22C55E] text-[#22C55E]' : 'border-transparent text-white/40'}`}>
            01. 융착식 & 페인트
          </button>
          <button type="button" onClick={() => setActiveTab('slip')} className={`flex-1 py-3 text-xs md:text-sm font-bold border-b-2 transition-all ${activeTab === 'slip' ? 'border-b-2 border-[#22C55E] text-[#22C55E]' : 'border-transparent text-white/40'}`}>
            02. 미끄럼방지
          </button>
          <button type="button" onClick={() => setActiveTab('safety')} className={`flex-1 py-3 text-xs md:text-sm font-bold border-b-2 transition-all ${activeTab === 'safety' ? 'border-b-2 border-[#22C55E] text-[#22C55E]' : 'border-transparent text-white/40'}`}>
            03. 안전시설물 설치
          </button>
        </div>

        {activeTab === 'paint' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
              <span className="text-[10px] text-white/40 font-bold uppercase block mb-2">대분류 · 시공 공법</span>
              <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={() => { setMethod('fusion'); setMaterialType('융착식-R3'); }} className={`py-2 text-xs font-bold rounded-lg border transition-all ${method === 'fusion' ? 'bg-[#22C55E]/20 text-[#22C55E] border-[#22C55E]' : 'bg-black/20 border-white/10 text-white/40'}`}>🔥 융착식 도색 공법</button>
                <button type="button" onClick={() => { setMethod('paint'); setMaterialType('페인트-상온형도료'); }} className={`py-2 text-xs font-bold rounded-lg border transition-all ${method === 'paint' ? 'bg-[#22C55E]/20 text-[#22C55E] border-[#22C55E]' : 'bg-black/20 border-white/10 text-white/40'}`}>🎨 페인트 도색 공법</button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
              <div>
                <label className="block text-[10px] text-white/50 mb-1 font-bold">중분류 (반사성능)</label>
                <select value={glassBead} onChange={(e) => setGlassBead(e.target.value as any)} className="w-full bg-black/40 border border-white/10 rounded-lg px-2.5 py-2 text-xs text-white outline-none">
                  <option value="normal">일반유리알 (기본)</option>
                  <option value="high">고휘도 유리알 변경 (+1,000원)</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] text-white/50 mb-1 font-bold">소분류 (자재종류)</label>
                <select value={materialType} onChange={(e) => setMaterialType(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg px-2.5 py-2 text-xs text-white outline-none">
                  {method === 'fusion' ? (
                    <><option value="융착식-R3">융착식-R3</option><option value="융착식-R5">융착식-R5</option></>
                  ) : (
                    <><option value="페인트-상온형도료">페인트-상온형도료</option><option value="페인트-수용성도료">페인트-수용성도료</option><option value="페인트-이액형도료">페인트-이액형도료</option></>
                  )}
                </select>
              </div>
              <div>
                <label className="block text-[10px] text-white/50 mb-1 font-bold">색상 구분</label>
                <select value={paintColor} onChange={(e) => setPaintColor(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg px-2.5 py-2 text-xs text-white outline-none">
                  <option value="백색 (구분선, 주차선 등)">백색 (구분선, 주차선 등)</option>
                  <option value="황색 (중앙선, 안전지대 등)">황색 (중앙선, 안전지대 등)</option>
                  <option value="황,백색 (방지턱)">황,백색 (방지턱)</option>
                  <option value="청색 (장애인구역, 경차 등)">청색 (장애인구역, 경차 등)</option>
                  <option value="custom">그외 색상 (직접입력) ✏️</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] text-white/50 mb-1 font-bold">물량 입력 방식</label>
                <div className="grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => setPaintInputType('qty')} className={`py-1.5 text-xs font-bold rounded-lg transition-all ${paintInputType === 'qty' ? 'bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]' : 'bg-black/20 border border-white/10 text-white/40'}`}>일반 물량 입력</button>
                  <button type="button" onClick={() => setPaintInputType('dimensions')} className={`py-1.5 text-xs font-bold rounded-lg transition-all ${paintInputType === 'dimensions' ? 'bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]' : 'bg-black/20 border border-white/10 text-white/40'}`}>가로(m) x 세로(m) 입력</button>
                </div>
              </div>
            </div>

            {paintColor === 'custom' && (
              <div className="bg-white/5 border border-dashed border-[#22C55E]/40 p-3.5 rounded-xl">
                <input type="text" value={customColor} onChange={(e) => setCustomColor(e.target.value)} placeholder="원하시는 도색 색상 직접 입력" className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none" />
              </div>
            )}

            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
              {paintInputType === 'qty' ? (
                <div className="grid grid-cols-2 gap-4 items-end">
                  <div>
                    <label className="block text-[10px] text-white/50 mb-1 font-bold">세부 도색 공정 구분</label>
                    <select value={paintWorkType} onChange={(e) => setPaintWorkType(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg px-2.5 py-2 text-xs text-white outline-none">
                      <option value="line">차선 시공 (m)</option>
                      <option value="parking">주차장 구획 (칸)</option>
                      <option value="crosswalk">횡단보도 (m)</option>
                      <option value="text">문자 도색 (1자당)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] text-white/50 mb-1 font-bold">시공 물량 입력</label>
                    <div className="flex gap-2">
                      <input type="number" value={paintQuantity || ''} onChange={(e) => setPaintQuantity(Number(e.target.value))} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-right text-white focus:border-[#22C55E] outline-none" placeholder="물량 입력" />
                      <button type="button" onClick={handleAddPaintToBasket} className="bg-[#22C55E] text-black font-black text-xs py-2 px-5 rounded-lg hover:bg-[#16a34a] whitespace-nowrap transition-all shadow-md">추가</button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[10px] text-[#22C55E] mb-1 font-bold">가로 폭(m)</label>
                      <div className="relative">
                        <input type="number" step="0.1" value={paintWidth || ''} onChange={(e) => setPaintWidth(Number(e.target.value))} className="w-full bg-black/40 border border-white/10 rounded-lg px-2 py-2 text-xs text-right pr-7 outline-none focus:border-[#22C55E] text-white" placeholder="0.0" />
                        <span className="absolute right-2 top-2 text-[10px] text-white/40">m</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] text-[#22C55E] mb-1 font-bold">세로 길이(m)</label>
                      <div className="relative">
                        <input type="number" step="0.1" value={paintHeight || ''} onChange={(e) => setPaintHeight(Number(e.target.value))} className="w-full bg-black/40 border border-white/10 rounded-lg px-2 py-2 text-xs text-right pr-7 outline-none focus:border-[#22C55E] text-white" placeholder="0.0" />
                        <span className="absolute right-2 top-2 text-[10px] text-white/40">m</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] text-[#22C55E] mb-1 font-bold">수량(개소)</label>
                      <div className="relative">
                        <input type="number" min="1" value={paintCount || ''} onChange={(e) => setPaintCount(Number(e.target.value))} className="w-full bg-black/40 border border-white/10 rounded-lg px-2 py-2 text-xs text-right pr-8 outline-none focus:border-[#22C55E] text-white" placeholder="1" />
                        <span className="absolute right-2 top-2 text-[10px] text-white/40">개</span>
                      </div>
                    </div>
                  </div>
                  <button type="button" onClick={handleAddPaintToBasket} className="w-full bg-[#22C55E] text-black font-black text-xs py-2.5 rounded-lg transition-all shadow-md hover:bg-[#16a34a]">
                    🛒 사용자 직접지정 면적 리스트에 추가
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'slip' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
              <div>
                <label className="block text-[10px] text-[#22C55E] mb-1 font-bold">미끄럼방지 색상 선택</label>
                <select value={slipColor} onChange={(e) => setSlipColor(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg px-2.5 py-2 text-xs text-white outline-none focus:border-[#22C55E]">
                  <option value="적색 (기본형)">적색 (기본형)</option>
                  <option value="청색 (장애인통로 및 보행자 등)">청색 (장애인통로 및 보행자 등)</option>
                  <option value="황색 (보행자 등)">황색 (보행자 등)</option>
                  <option value="custom">그외 색상 (직접입력) ✏️</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-white/50 mb-1 font-bold">물량 입력 방식</label>
                <div className="grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => setSlipInputType('m2')} className={`py-1.5 text-xs font-bold rounded-lg transition-all ${slipInputType === 'm2' ? 'bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]' : 'bg-black/20 border border-white/10 text-white/40'}`}>해배(㎡) 직접입력</button>
                  <button type="button" onClick={() => setSlipInputType('dimensions')} className={`py-1.5 text-xs font-bold rounded-lg transition-all ${slipInputType === 'dimensions' ? 'bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]' : 'bg-black/20 border border-white/10 text-white/40'}`}>가로(m) x 세로(m) 입력</button>
                </div>
              </div>
            </div>

            {slipColor === 'custom' && (
              <div className="bg-white/5 border border-dashed border-[#22C55E]/40 p-3.5 rounded-xl">
                <label className="block text-[10px] text-[#22C55E] mb-1 font-bold">🎨 원하시는 미끄럼방지 포장 색상을 적어주세요</label>
                <input type="text" value={slipCustomColor} onChange={(e) => setSlipCustomColor(e.target.value)} placeholder="예: 녹색, 회색 등" className="w-full bg-black/60 border border-[#22C55E]/30 rounded-lg px-3 py-2 text-xs text-white outline-none" />
              </div>
            )}

            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
              {slipInputType === 'm2' ? (
                <div className="flex items-end gap-3">
                  <div className="flex-1">
                    <label className="block text-[10px] text-white/50 mb-1 font-bold">시공 총 면적 입력</label>
                    <div className="relative">
                      <input type="number" min="1" value={slipM2Quantity || ''} onChange={(e) => setSlipM2Quantity(Number(e.target.value))} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-right pr-12 outline-none text-white" placeholder="0" />
                      <span className="absolute right-3 top-2 text-[11px] text-white/40 font-bold">㎡</span>
                    </div>
                  </div>
                  <button type="button" onClick={handleAddSlipToBasket} className="bg-[#22C55E] text-black font-black text-xs py-2.5 px-6 rounded-lg">추가</button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[10px] text-[#22C55E] mb-1 font-bold">가로 폭(m)</label>
                      <div className="relative">
                        <input type="number" step="0.1" value={slipWidth || ''} onChange={(e) => setSlipWidth(Number(e.target.value))} className="w-full bg-black/40 border border-white/10 rounded-lg px-2 py-2 text-xs text-right pr-7 outline-none focus:border-[#22C55E] text-white" placeholder="0.0" />
                        <span className="absolute right-2 top-2 text-[10px] text-white/40">m</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] text-[#22C55E] mb-1 font-bold">세로 길이(m)</label>
                      <div className="relative">
                        <input type="number" step="0.1" value={slipHeight || ''} onChange={(e) => setSlipHeight(Number(e.target.value))} className="w-full bg-black/40 border border-white/10 rounded-lg px-2 py-2 text-xs text-right pr-7 outline-none focus:border-[#22C55E] text-white" placeholder="0.0" />
                        <span className="absolute right-2 top-2 text-[10px] text-white/40">m</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] text-[#22C55E] mb-1 font-bold">수량(개소)</label>
                      <div className="relative">
                        <input type="number" min="1" value={slipCount || ''} onChange={(e) => setSlipCount(Number(e.target.value))} className="w-full bg-black/40 border border-white/10 rounded-lg px-2 py-2 text-xs text-right pr-8 outline-none focus:border-[#22C55E] text-white" placeholder="1" />
                        <span className="absolute right-2 top-2 text-[10px] text-white/40">개</span>
                      </div>
                    </div>
                  </div>
                  <button type="button" onClick={handleAddSlipToBasket} className="w-full bg-[#22C55E] text-black font-black text-xs py-2.5 rounded-lg hover:bg-[#16a34a] transition-all shadow-md">
                    🛒 미끄럼방지 리스트에 추가
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'safety' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
              <div>
                <label className="block text-[10px] text-[#22C55E] mb-1 font-bold">安全시설물 대분류 항목</label>
                <select value={safetyCategory} onChange={(e) => setSafetyCategory(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg px-2.5 py-2 text-xs text-white outline-none focus:border-[#22C55E]">
                  <option value="post">차선 규제봉 (탄성봉)</option>
                  <option value="stopper">주차 카스토퍼</option>
                  <option value="stud">도로 노면등 (표지병)</option>
                  <option value="bump">고무 과속방지턱</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-white/50 mb-1 font-bold">시공 공정 구분</label>
                <div className="grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => setSafetyAction('install')} className={`py-1.5 text-xs font-bold rounded-lg transition-all ${safetyAction === 'install' ? 'bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]' : 'bg-black/20 border border-white/10 text-white/40'}`}>🛠️ 신설 / 설치</button>
                  <button type="button" onClick={() => setSafetyAction('remove')} className={`py-1.5 text-xs font-bold rounded-lg transition-all ${safetyAction === 'remove' ? 'bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]' : 'bg-black/20 border border-white/10 text-white/40'}`}>🗑️ 기존 철거</button>
                </div>
              </div>
            </div>

            {safetyAction === 'install' && (
              <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                <span className="text-[10px] text-white/40 font-bold block mb-2">⚙️ 제품별 상세 스펙 및 옵션 구성</span>
                
                {safetyCategory === 'post' && (
                  <div>
                    <label className="block text-[10px] text-white/50 mb-1">규제봉 규격(높이)</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['450mm', '750mm'].map((size) => (
                        <button key={size} type="button" onClick={() => setPostHeight(size)} className={`py-1.5 text-xs font-medium rounded-md border ${postHeight === size ? 'border-[#22C55E] text-[#22C55E] bg-[#22C55E]/5' : 'border-white/10 text-white/50'}`}>{size}</button>
                      ))}
                    </div>
                  </div>
                )}

                {safetyCategory === 'stopper' && (
                  <div>
                    <label className="block text-[10px] text-white/50 mb-1">카스토퍼 재질 유형</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['플라스틱재질', '탄소고무재질'].map((mat) => (
                        <button key={mat} type="button" onClick={() => setStopperMaterial(mat)} className={`py-1.5 text-xs font-medium rounded-md border ${stopperMaterial === mat ? 'border-[#22C55E] text-[#22C55E] bg-[#22C55E]/5' : 'border-white/10 text-white/50'}`}>{mat}</button>
                      ))}
                    </div>
                  </div>
                )}

                {safetyCategory === 'stud' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] text-white/50 mb-1">노면등 구동 방식</label>
                      <select value={studType} onChange={(e) => setStudType(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none">
                        <option value="일반노면등">일반 노면등 (반사체 방식)</option>
                        <option value="LED발광 노면등">LED 발광 노면등 (자체 발광형)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] text-white/50 mb-1">발광/반사 방향 및 색상 선택</label>
                      <select value={studOption} onChange={(e) => setStudOption(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none">
                        <option value="백색양면">백색 양면</option>
                        <option value="백색단면">백색 단면</option>
                        <option value="황색양면">황색 양면</option>
                        <option value="황색단면">황색 단면</option>
                        <option value="황백색">황백색</option>
                      </select>
                    </div>
                  </div>
                )}

                {safetyCategory === 'bump' && (
                  <p className="text-xs text-white/40 bg-black/20 p-2 rounded-lg border border-white/5">
                    💡 고무 과속방지턱은 가로폭 도로 연장 규격 기준 **M(미터)** 단위 조합으로 일괄 산출됩니다.
                  </p>
                )}
              </div>
            )}

            <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex items-end gap-3">
              <div className="flex-1">
                <label className="block text-[10px] text-white/50 mb-1 font-bold">
                  {safetyCategory === 'bump' ? '시공 연장 거리 입력' : '시공 수량 입력'}
                </label>
                <div className="relative">
                  <input type="number" min="1" value={safetyQty || ''} onChange={(e) => setSafetyQty(Number(e.target.value))} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-right pr-12 outline-none focus:border-[#22C55E] text-white" placeholder="0" />
                  <span className="absolute right-3 top-2 text-[11px] text-white/40 font-bold">
                    {safetyCategory === 'bump' ? 'm' : '개'}
                  </span>
                </div>
              </div>
              <button type="button" onClick={handleAddSafetyToBasket} className="bg-[#22C55E] text-black font-black text-xs py-2.5 px-6 rounded-lg hover:bg-[#16a34a] transition-all">
                추가
              </button>
            </div>
          </div>
        )}

        <div className="bg-white/5 p-3 rounded-xl border border-white/5">
          <label className="flex items-center gap-2.5 text-xs cursor-pointer text-white/60 select-none">
            <input type="checkbox" checked={isNightWork} onChange={(e) => setIsNightWork(e.target.checked)} className="accent-[#22C55E]" />
            <span>🌙 야간 현장 시공 특약 조건 반영 (총 도색·시설물 공사대금의 20% 할증)</span>
          </label>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-between h-full min-h-[440px]">
        <div>
          <div className="flex justify-between items-center border-b border-white/10 pb-2 mb-3">
            <h3 className="text-sm font-black text-[#22C55E]">📋 선택 조합 시공 내역서</h3>
            {basket.length > 0 && <button type="button" onClick={handleClearBasket} className="text-[11px] text-white/40 hover:text-red-400 font-bold">🗑️ 전체 삭제</button>}
          </div>

          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {basket.length === 0 ? (
              <p className="text-xs text-white/30 text-center py-16">선택하신 공정이 없습니다.<br/>상단 탭별 옵션을 선택하여 채워주세요.</p>
            ) : (
              basket.map((item) => {
                let area = item.quantity;
                if (item.category === 'paint') {
                  if (item.workType === 'line') area = item.quantity * 0.15;
                  else if (item.workType === 'parking') area = item.quantity * 1.5;
                  else if (item.workType === 'crosswalk') area = item.quantity * 0.45;
                  else if (item.workType === 'text') area = item.quantity * 0.5;
                  else if (item.workType === 'guideline') area = item.quantity * 0.3;
                }
                const itemTotal = item.unitPrice * area;

                return (
                  <div key={item.id} className="bg-black/40 p-2.5 rounded-lg border border-white/5 flex justify-between items-center text-xs">
                    <div className="flex-1">
                      <div className="font-bold text-white/90">
                        {item.category === 'paint' && `[도색] `}
                        {item.category === 'slip' && `[미끄럼방지] `}
                        {item.category === 'safety' && `[안전시설물] `}
                        {item.paint 
                          ? (item.workType === 'line' ? '차선 시공' : item.workType === 'parking' ? '주차 구획' : item.workType === 'crosswalk' ? '횡단보도' : item.workType === 'custom_area' ? '사용자 지정 면적' : '문자도색')
                          : item.color}
                      </div>
                      
                      <div className="text-[10px] text-white/40 mt-0.5">
                        {item.category === 'paint' && `${item.materialType} · `}
                        {item.category === 'safety' ? (
                          <span className="text-[#22C55E] font-semibold">{item.itemDetail}</span>
                        ) : (
                          <span className="text-[#22C55E] font-semibold">{item.color}</span>
                        )}
                      </div>

                      <div className="text-[11px] text-[#22C55E] mt-1">
                        {item.category === 'paint' && item.workType !== 'custom_area' && `${item.quantity.toLocaleString()}${item.workType === 'parking' ? '칸' : item.workType === 'text' ? '자' : 'm'} (${area.toFixed(2)}㎡)`}
                        {item.category === 'paint' && item.workType === 'custom_area' && `${item.dimensions?.width}m x ${item.dimensions?.height}m x [${item.dimensions?.count}개] (${area.toFixed(2)}㎡)`}
                        {item.category === 'slip' && item.workType === 'slip_m2' && `지정 면적: ${item.quantity.toLocaleString()}㎡`}
                        {item.category === 'slip' && item.workType === 'slip_custom' && `규격: ${item.dimensions?.width}m * ${item.dimensions?.height}m * [${item.dimensions?.count}개] (총 ${item.quantity.toFixed(2)}㎡)`}
                        {item.category === 'safety' && `${item.quantity.toLocaleString()}${item.workType === 'bump' ? 'm' : '개'}`}
                        {' x '}{item.unitPrice.toLocaleString()}원 = {Math.round(itemTotal).toLocaleString()}원
                      </div>
                    </div>
                    <button type="button" onClick={() => handleRemoveItem(item.id)} className="text-red-400 font-bold text-[11px] px-2">삭제</button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="flex justify-between items-end mb-4">
            <div>
              <span className="text-[10px] text-white/40 font-bold block">TOTAL ESTIMATE</span>
              <h4 className="text-2xl font-[1000] text-[#22C55E] tracking-tight">
                {Math.round(calculateEstimate()).toLocaleString()} <span className="text-xs font-bold text-white">원</span>
              </h4>
            </div>
            {isNightWork && <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded font-bold">야간할증 20%</span>}
          </div>
          <button type="button" onClick={() => { if(basket.length === 0) { alert('품목을 추가해 주세요.'); return; } setIsModalOpen(true); }} className="w-full bg-[#22C55E] text-black font-black text-xs py-3 rounded-xl text-center block">🚀 실시간 스마트 견적 발송 및 신청</button>
        </div>
      </div>

      {/* 팝업 모달 영역 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-[#1E293B] border border-white/10 p-5 rounded-2xl max-w-sm w-full space-y-4">
            <div>
              <h3 className="text-sm font-black text-white">📱 스마트 견적 문의 등록</h3>
              <p className="text-[11px] text-white/50 mt-1">입력하신 번호와 조립된 스마트견적 내용이 관리자 카톡으로 전송됩니다.</p>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/30 p-2.5 rounded-xl text-[10.5px] text-amber-400 leading-normal">
              📌 <strong>안내사항</strong> : 본 스마트 견적은 현장 상태에 따라 실측 방문 후 최종 금액이 조정 될 수 있습니다.
            </div>
            
            <form onSubmit={handleFinalSubmit} className="space-y-3">
              <input 
                type="tel" 
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="연락받을 연락처를 입력하세요 (예: 010-1234-5678)" 
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-[#22C55E]"
              />
              <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                <button type="button" onClick={() => setIsModalOpen(false)} className="bg-white/5 border border-white/10 py-2.5 rounded-xl text-white">취소</button>
                <button type="submit" className="bg-[#22C55E] text-black py-2.5 rounded-xl">스마트 견적 발송</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}