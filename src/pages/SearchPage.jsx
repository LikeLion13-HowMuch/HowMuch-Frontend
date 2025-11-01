import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SearchPage() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedStorage, setSelectedStorage] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedConnection, setSelectedConnection] = useState('');
  const [selectedChipset, setSelectedChipset] = useState('');
  const [selectedRam, setSelectedRam] = useState('');
  const [selectedSsd, setSelectedSsd] = useState('');
  const [selectedSeries, setSelectedSeries] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const navigate = useNavigate();

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    // 카테고리 변경 시 세부 옵션 초기화
    setSelectedModel('');
    setSelectedStorage('');
    setSelectedColor('');
    setSelectedConnection('');
    setSelectedChipset('');
    setSelectedRam('');
    setSelectedSsd('');
    setSelectedSeries('');
    setSelectedSize('');
    setSelectedMaterial('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedCategory || !selectedLocation) {
      alert('카테고리와 지역을 모두 선택해주세요.');
      return;
    }

    // 상세 시세 페이지로 이동
    navigate('/detail', {
      state: {
        category: selectedCategory,
        model: selectedModel,
        storage: selectedStorage,
        color: selectedColor,
        connection: selectedConnection,
        chipset: selectedChipset,
        ram: selectedRam,
        ssd: selectedSsd,
        series: selectedSeries,
        size: selectedSize,
        material: selectedMaterial,
        location: selectedLocation,
      },
    });
  };

  const renderIphoneOptions = () => (
    <div id="iphone-options" className="animate-fadeIn flex flex-col gap-5">
      <label className="mb-[-0.5rem] text-left text-sm font-semibold text-[#86868b]">
        iPhone 세부 사양
      </label>
      <div className="relative w-full">
        <select
          className="w-full cursor-pointer appearance-none rounded-lg border border-[#d2d2d7] bg-transparent py-4 pr-10 pl-5 text-base text-[#1d1d1f] transition-all focus:border-[#0071e3] focus:shadow-[0_0_0_4px_rgba(0,113,227,0.15)] focus:outline-none [&:invalid]:text-[#b0b0b5]"
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
        >
          <option value="" disabled hidden>
            모델 시리즈
          </option>
          <optgroup label="iPhone 17">
            <option>iPhone 17 Pro Max</option>
            <option>iPhone 17 Pro</option>
            <option>iPhone 17</option>
            <option>iPhone Air</option>
          </optgroup>
          <optgroup label="iPhone 16">
            <option>iPhone 16 Pro Max</option>
            <option>iPhone 16 Pro</option>
            <option>iPhone 16 +</option>
            <option>iPhone 16</option>
            <option>iPhone 16e</option>
          </optgroup>
        </select>
      </div>
      <div className="relative w-full">
        <select
          className="w-full cursor-pointer appearance-none rounded-lg border border-[#d2d2d7] bg-transparent py-4 pr-10 pl-5 text-base text-[#1d1d1f] transition-all focus:border-[#0071e3] focus:shadow-[0_0_0_4px_rgba(0,113,227,0.15)] focus:outline-none [&:invalid]:text-[#b0b0b5]"
          value={selectedStorage}
          onChange={(e) => setSelectedStorage(e.target.value)}
        >
          <option value="" disabled hidden>
            저장 용량
          </option>
          <option>128GB</option>
          <option>256GB</option>
          <option>512GB</option>
          <option>1TB</option>
          <option>2TB</option>
        </select>
      </div>
      <div className="relative w-full">
        <select
          className="w-full cursor-pointer appearance-none rounded-lg border border-[#d2d2d7] bg-transparent py-4 pr-10 pl-5 text-base text-[#1d1d1f] transition-all focus:border-[#0071e3] focus:shadow-[0_0_0_4px_rgba(0,113,227,0.15)] focus:outline-none [&:invalid]:text-[#b0b0b5]"
          value={selectedColor}
          onChange={(e) => setSelectedColor(e.target.value)}
        >
          <option value="" disabled hidden>
            색상
          </option>
          <option>내추럴 티타늄</option>
          <option>화이트 티타늄</option>
          <option>스페이스 블랙</option>
          <option>미드나이트</option>
          <option>스타라이트</option>
        </select>
      </div>
    </div>
  );

  const renderIpadOptions = () => (
    <div id="ipad-options" className="animate-fadeIn flex flex-col gap-5">
      <label className="mb-[-0.5rem] text-left text-sm font-semibold text-[#86868b]">
        iPad 세부 사양
      </label>
      <div className="relative w-full">
        <select
          className="w-full cursor-pointer appearance-none rounded-lg border border-[#d2d2d7] bg-transparent py-4 pr-10 pl-5 text-base text-[#1d1d1f] transition-all focus:border-[#0071e3] focus:shadow-[0_0_0_4px_rgba(0,113,227,0.15)] focus:outline-none [&:invalid]:text-[#b0b0b5]"
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
        >
          <option value="" disabled hidden>
            모델 시리즈
          </option>
          <optgroup label="Pro">
            <option>아이패드 프로 13 (M4)</option>
            <option>아이패드 프로 11 (M4)</option>
            <option>아이패드 프로 12.9 (6세대)</option>
          </optgroup>
          <optgroup label="Air">
            <option>아이패드 에어 13 (M2)</option>
            <option>아이패드 에어 11 (M2)</option>
          </optgroup>
        </select>
      </div>
      <div className="relative w-full">
        <select
          className="w-full cursor-pointer appearance-none rounded-lg border border-[#d2d2d7] bg-transparent py-4 pr-10 pl-5 text-base text-[#1d1d1f] transition-all focus:border-[#0071e3] focus:shadow-[0_0_0_4px_rgba(0,113,227,0.15)] focus:outline-none [&:invalid]:text-[#b0b0b5]"
          value={selectedConnection}
          onChange={(e) => setSelectedConnection(e.target.value)}
        >
          <option value="" disabled hidden>
            연결
          </option>
          <option>Wi-Fi</option>
          <option>Wi-Fi + Cellular</option>
        </select>
      </div>
    </div>
  );

  const renderMacbookOptions = () => (
    <div id="macbook-options" className="animate-fadeIn flex flex-col gap-5">
      <label className="mb-[-0.5rem] text-left text-sm font-semibold text-[#86868b]">
        MacBook 세부 사양
      </label>
      <div className="relative w-full">
        <select
          className="w-full cursor-pointer appearance-none rounded-lg border border-[#d2d2d7] bg-transparent py-4 pr-10 pl-5 text-base text-[#1d1d1f] transition-all focus:border-[#0071e3] focus:shadow-[0_0_0_4px_rgba(0,113,227,0.15)] focus:outline-none [&:invalid]:text-[#b0b0b5]"
          value={selectedChipset}
          onChange={(e) => setSelectedChipset(e.target.value)}
        >
          <option value="" disabled hidden>
            칩셋 모델
          </option>
          <optgroup label="Apple Silicon">
            <option>M4 Max</option>
            <option>M4 Pro</option>
            <option>M4</option>
            <option>M3 Max</option>
            <option>M3 Pro</option>
            <option>M3</option>
          </optgroup>
          <optgroup label="Intel">
            <option>Intel Core i9</option>
            <option>Intel Core i7</option>
          </optgroup>
        </select>
      </div>
      <div className="relative w-full">
        <select
          className="w-full cursor-pointer appearance-none rounded-lg border border-[#d2d2d7] bg-transparent py-4 pr-10 pl-5 text-base text-[#1d1d1f] transition-all focus:border-[#0071e3] focus:shadow-[0_0_0_4px_rgba(0,113,227,0.15)] focus:outline-none [&:invalid]:text-[#b0b0b5]"
          value={selectedRam}
          onChange={(e) => setSelectedRam(e.target.value)}
        >
          <option value="" disabled hidden>
            통합 메모리 (RAM)
          </option>
          <option>8GB</option>
          <option>16GB</option>
          <option>24GB</option>
          <option>32GB</option>
          <option>36GB</option>
          <option>64GB</option>
        </select>
      </div>
      <div className="relative w-full">
        <select
          className="w-full cursor-pointer appearance-none rounded-lg border border-[#d2d2d7] bg-transparent py-4 pr-10 pl-5 text-base text-[#1d1d1f] transition-all focus:border-[#0071e3] focus:shadow-[0_0_0_4px_rgba(0,113,227,0.15)] focus:outline-none [&:invalid]:text-[#b0b0b5]"
          value={selectedSsd}
          onChange={(e) => setSelectedSsd(e.target.value)}
        >
          <option value="" disabled hidden>
            저장공간 (SSD)
          </option>
          <option>256GB</option>
          <option>512GB</option>
          <option>1TB</option>
          <option>2TB</option>
        </select>
      </div>
    </div>
  );

  const renderWatchOptions = () => (
    <div id="watch-options" className="animate-fadeIn flex flex-col gap-5">
      <label className="mb-[-0.5rem] text-left text-sm font-semibold text-[#86868b]">
        Apple Watch 세부 사양
      </label>
      <div className="relative w-full">
        <select
          className="w-full cursor-pointer appearance-none rounded-lg border border-[#d2d2d7] bg-transparent py-4 pr-10 pl-5 text-base text-[#1d1d1f] transition-all focus:border-[#0071e3] focus:shadow-[0_0_0_4px_rgba(0,113,227,0.15)] focus:outline-none [&:invalid]:text-[#b0b0b5]"
          value={selectedSeries}
          onChange={(e) => setSelectedSeries(e.target.value)}
        >
          <option value="" disabled hidden>
            시리즈
          </option>
          <option>워치 울트라 2</option>
          <option>워치 9</option>
          <option>워치 8</option>
          <option>워치 SE 2</option>
        </select>
      </div>
      <div className="relative w-full">
        <select
          className="w-full cursor-pointer appearance-none rounded-lg border border-[#d2d2d7] bg-transparent py-4 pr-10 pl-5 text-base text-[#1d1d1f] transition-all focus:border-[#0071e3] focus:shadow-[0_0_0_4px_rgba(0,113,227,0.15)] focus:outline-none [&:invalid]:text-[#b0b0b5]"
          value={selectedSize}
          onChange={(e) => setSelectedSize(e.target.value)}
        >
          <option value="" disabled hidden>
            크기(mm)
          </option>
          <option>49mm</option>
          <option>45mm</option>
          <option>44mm</option>
          <option>41mm</option>
          <option>40mm</option>
        </select>
      </div>
      <div className="relative w-full">
        <select
          className="w-full cursor-pointer appearance-none rounded-lg border border-[#d2d2d7] bg-transparent py-4 pr-10 pl-5 text-base text-[#1d1d1f] transition-all focus:border-[#0071e3] focus:shadow-[0_0_0_4px_rgba(0,113,227,0.15)] focus:outline-none [&:invalid]:text-[#b0b0b5]"
          value={selectedMaterial}
          onChange={(e) => setSelectedMaterial(e.target.value)}
        >
          <option value="" disabled hidden>
            본체 소재
          </option>
          <option>알루미늄</option>
          <option>스테인리스스틸</option>
          <option>티타늄</option>
        </select>
      </div>
    </div>
  );

  const renderAirpodsOptions = () => (
    <div id="airpods-options" className="animate-fadeIn flex flex-col gap-5">
      <label className="mb-[-0.5rem] text-left text-sm font-semibold text-[#86868b]">
        AirPods 세부 사양
      </label>
      <div className="relative w-full">
        <select
          className="w-full cursor-pointer appearance-none rounded-lg border border-[#d2d2d7] bg-transparent py-4 pr-10 pl-5 text-base text-[#1d1d1f] transition-all focus:border-[#0071e3] focus:shadow-[0_0_0_4px_rgba(0,113,227,0.15)] focus:outline-none [&:invalid]:text-[#b0b0b5]"
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
        >
          <option value="" disabled hidden>
            모델
          </option>
          <option>에어팟 프로 2세대 C타입</option>
          <option>에어팟 프로 2세대</option>
          <option>에어팟 3세대</option>
          <option>에어팟 맥스</option>
          <option>에어팟 2세대</option>
        </select>
      </div>
    </div>
  );

  const renderCategoryOptions = () => {
    if (!selectedCategory) return null;

    switch (selectedCategory) {
      case 'iphone':
        return renderIphoneOptions();
      case 'ipad':
        return renderIpadOptions();
      case 'macbook':
        return renderMacbookOptions();
      case 'watch':
        return renderWatchOptions();
      case 'airpods':
        return renderAirpodsOptions();
      default:
        return null;
    }
  };

  return (
    <div className="box-border flex min-h-screen w-full items-center justify-center py-24 text-center">
      <div className="animate-fadeIn w-full max-w-[600px] p-5">
        <h1 className="mb-6 font-['Inter'] text-[3.5rem] font-extrabold">How Much, Apple?</h1>
        <p className="mb-14 text-lg leading-relaxed text-[#86868b]">
          당신의 중고 Apple 제품, 제 가치를 알고 있나요?
          <br /> 데이터가 알려주는 가장 정확한 현재의 가치.
        </p>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <div className="relative w-full">
            <select
              id="category-select"
              className="w-full cursor-pointer appearance-none rounded-lg border border-[#d2d2d7] bg-transparent py-4 pr-10 pl-5 text-base text-[#1d1d1f] transition-all focus:border-[#0071e3] focus:shadow-[0_0_0_4px_rgba(0,113,227,0.15)] focus:outline-none [&:invalid]:text-[#b0b0b5]"
              required
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              <option value="" disabled hidden>
                제품 카테고리 선택
              </option>
              <option value="iphone">iPhone</option>
              <option value="ipad">iPad</option>
              <option value="macbook">MacBook</option>
              <option value="watch">Apple Watch</option>
              <option value="airpods">AirPods</option>
            </select>
          </div>

          <div id="dynamic-options-container" className="flex w-full flex-col gap-5">
            {renderCategoryOptions()}
          </div>

          <div className="relative w-full">
            <select
              id="location-select"
              className="w-full cursor-pointer appearance-none rounded-lg border border-[#d2d2d7] bg-transparent py-4 pr-10 pl-5 text-base text-[#1d1d1f] transition-all focus:border-[#0071e3] focus:shadow-[0_0_0_4px_rgba(0,113,227,0.15)] focus:outline-none [&:invalid]:text-[#b0b0b5]"
              required
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              <option value="" disabled hidden>
                지역 선택
              </option>
              <option value="seoul">서울특별시</option>
              <option value="gyeonggi">경기도</option>
              <option value="incheon">인천광역시</option>
              <option value="busan">부산광역시</option>
              <option value="daegu">대구광역시</option>
              <option value="gwangju">광주광역시</option>
              <option value="daejeon">대전광역시</option>
              <option value="ulsan">울산광역시</option>
              <option value="sejong">세종특별자치시</option>
              <option value="gangwon">강원도</option>
              <option value="chungbuk">충청북도</option>
              <option value="chungnam">충청남도</option>
              <option value="jeonbuk">전라북도</option>
              <option value="jeonnam">전라남도</option>
              <option value="gyeongbuk">경상북도</option>
              <option value="gyeongnam">경상남도</option>
              <option value="jeju">제주특별자치도</option>
            </select>
          </div>

          <button
            type="submit"
            className="mt-6 cursor-pointer rounded-lg border border-[#1d1d1f] bg-transparent py-4 text-base font-medium tracking-wide text-[#1d1d1f] transition-all hover:border-[#1d1d1f] hover:bg-[#1d1d1f] hover:text-white"
          >
            ANALYZE
          </button>
        </form>
      </div>
    </div>
  );
}
