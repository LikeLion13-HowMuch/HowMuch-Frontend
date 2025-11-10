import { useEffect, useState } from 'react';
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
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [regionData, setRegionData] = useState([]);
  const [isRegionLoading, setIsRegionLoading] = useState(true);
  const [regionError, setRegionError] = useState(null);
  const [deviceOptions, setDeviceOptions] = useState(null);
  const [isDeviceLoading, setIsDeviceLoading] = useState(true);
  const [deviceError, setDeviceError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const fetchRegions = async () => {
      try {
        const response = await fetch('/locations_final.json');
        if (!response.ok) {
          throw new Error(`행정구역 데이터를 불러오지 못했습니다. (status: ${response.status})`);
        }

        const data = await response.json();
        if (isMounted) {
          setRegionData(data);
          setRegionError(null);
        }
      } catch (error) {
        if (isMounted) {
          setRegionError(
            error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
          );
        }
      } finally {
        if (isMounted) {
          setIsRegionLoading(false);
        }
      }
    };

    fetchRegions(); // regionData안에 이제 각종 행정구역 json이 저장되어있는 것.

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchDeviceOptions = async () => {
      try {
        const response = await fetch('/device_options.json');
        if (!response.ok) {
          throw new Error(`제품 옵션 데이터를 불러오지 못했습니다. (status: ${response.status})`);
        }

        const data = await response.json();
        if (isMounted) {
          setDeviceOptions(data);
          setDeviceError(null);
        }
      } catch (error) {
        if (isMounted) {
          setDeviceError(
            error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
          );
        }
      } finally {
        if (isMounted) {
          setIsDeviceLoading(false);
        }
      }
    };

    fetchDeviceOptions();

    return () => {
      isMounted = false;
    };
  }, []);

  const resetRegionSelections = () => {
    setSelectedProvince('');
    setSelectedCity('');
    setSelectedDistrict('');
  };

  useEffect(() => {
    // 행정구역 데이터 로딩 실패 시 선택값 초기화
    if (!isRegionLoading && regionError) {
      resetRegionSelections();
    }
  }, [isRegionLoading, regionError]);

  useEffect(() => {
    // 시/도를 바꾸면 시군구, 읍면동 초기화
    setSelectedCity('');
    setSelectedDistrict('');
  }, [selectedProvince]);

  useEffect(() => {
    // 시군구를 바꾸면 읍면동 초기화
    setSelectedDistrict('');
  }, [selectedCity]);

  const provinceOptions = regionData.map((province) => ({
    label: province.name,
    value: province.name,
  }));

  const cityOptions =
    regionData
      .find((province) => province.name === selectedProvince)
      ?.cities.map((city) => ({
        label: city.name,
        value: city.name,
      })) ?? [];

  const districtOptions =
    regionData
      .find((province) => province.name === selectedProvince)
      ?.cities.find((city) => city.name === selectedCity)
      ?.districts.map((district) => ({
        label: district,
        value: district,
      })) ?? [];

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
    if (!selectedCategory || !selectedProvince || !selectedCity || !selectedDistrict) {
      alert('카테고리와 모든 지역 정보를 선택해주세요.');
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
        location: {
          province: selectedProvince,
          city: selectedCity,
          district: selectedDistrict,
        },
      },
    });
  };

  const renderIphoneOptions = () => {
    const iphone = deviceOptions?.iphone;
    if (!iphone) return null;

    return (
      <div id="iphone-options" className="animate-fadeIn flex flex-col gap-5">
        <label className="mb-[-0.5rem] text-left text-sm font-semibold text-[#86868b]">
          iPhone 세부 사양
        </label>
        <div className="relative w-full">
          <select
            className="w-full cursor-pointer appearance-none rounded-lg border border-[#d2d2d7] bg-transparent py-4 pr-10 pl-5 text-base text-[#1d1d1f] transition-all focus:border-[#0071e3] focus:shadow-[0_0_0_4px_rgba(0,113,227,0.15)] focus:outline-none [&:invalid]:text-[#6e6e73]"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
          >
            <option value="" disabled hidden>
              모델 시리즈
            </option>
            {iphone.modelGroups?.map((group) => (
              <optgroup key={group.label} label={group.label}>
                {group.options.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
        <div className="relative w-full">
          <select
            className="w-full cursor-pointer appearance-none rounded-lg border border-[#d2d2d7] bg-transparent py-4 pr-10 pl-5 text-base text-[#1d1d1f] transition-all focus:border-[#0071e3] focus:shadow-[0_0_0_4px_rgba(0,113,227,0.15)] focus:outline-none [&:invalid]:text-[#6e6e73]"
            value={selectedStorage}
            onChange={(e) => setSelectedStorage(e.target.value)}
          >
            <option value="" disabled hidden>
              저장 용량
            </option>
            {iphone.storages?.map((storage) => (
              <option key={storage}>{storage}</option>
            ))}
          </select>
        </div>
        <div className="relative w-full">
          <select
            className="w-full cursor-pointer appearance-none rounded-lg border border-[#d2d2d7] bg-transparent py-4 pr-10 pl-5 text-base text-[#1d1d1f] transition-all focus:border-[#0071e3] focus:shadow-[0_0_0_4px_rgba(0,113,227,0.15)] focus:outline-none [&:invalid]:text-[#6e6e73]"
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
          >
            <option value="" disabled hidden>
              색상
            </option>
            {iphone.colors?.map((color) => (
              <option key={color}>{color}</option>
            ))}
          </select>
        </div>
      </div>
    );
  };

  const renderIpadOptions = () => {
    const ipad = deviceOptions?.ipad;
    if (!ipad) return null;

    return (
      <div id="ipad-options" className="animate-fadeIn flex flex-col gap-5">
        <label className="mb-[-0.5rem] text-left text-sm font-semibold text-[#86868b]">
          iPad 세부 사양
        </label>
        <div className="relative w-full">
          <select
            className="w-full cursor-pointer appearance-none rounded-lg border border-[#d2d2d7] bg-transparent py-4 pr-10 pl-5 text-base text-[#1d1d1f] transition-all focus:border-[#0071e3] focus:shadow-[0_0_0_4px_rgba(0,113,227,0.15)] focus:outline-none [&:invalid]:text-[#6e6e73]"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
          >
            <option value="" disabled hidden>
              모델 시리즈
            </option>
            {ipad.modelGroups?.map((group) => (
              <optgroup key={group.label} label={group.label}>
                {group.options.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
        <div className="relative w-full">
          <select
            className="w-full cursor-pointer appearance-none rounded-lg border border-[#d2d2d7] bg-transparent py-4 pr-10 pl-5 text-base text-[#1d1d1f] transition-all focus:border-[#0071e3] focus:shadow-[0_0_0_4px_rgba(0,113,227,0.15)] focus:outline-none [&:invalid]:text-[#6e6e73]"
            value={selectedConnection}
            onChange={(e) => setSelectedConnection(e.target.value)}
          >
            <option value="" disabled hidden>
              연결
            </option>
            {ipad.connections?.map((connection) => (
              <option key={connection}>{connection}</option>
            ))}
          </select>
        </div>
      </div>
    );
  };

  const renderMacbookOptions = () => {
    const macbook = deviceOptions?.macbook;
    if (!macbook) return null;

    return (
      <div id="macbook-options" className="animate-fadeIn flex flex-col gap-5">
        <label className="mb-[-0.5rem] text-left text-sm font-semibold text-[#86868b]">
          MacBook 세부 사양
        </label>
        <div className="relative w-full">
          <select
            className="w-full cursor-pointer appearance-none rounded-lg border border-[#d2d2d7] bg-transparent py-4 pr-10 pl-5 text-base text-[#1d1d1f] transition-all focus:border-[#0071e3] focus:shadow-[0_0_0_4px_rgba(0,113,227,0.15)] focus:outline-none [&:invalid]:text-[#6e6e73]"
            value={selectedChipset}
            onChange={(e) => setSelectedChipset(e.target.value)}
          >
            <option value="" disabled hidden>
              칩셋 모델
            </option>
            {macbook.chipsetGroups?.map((group) => (
              <optgroup key={group.label} label={group.label}>
                {group.options.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
        <div className="relative w-full">
          <select
            className="w-full cursor-pointer appearance-none rounded-lg border border-[#d2d2d7] bg-transparent py-4 pr-10 pl-5 text-base text-[#1d1d1f] transition-all focus:border-[#0071e3] focus:shadow-[0_0_0_4px_rgba(0,113,227,0.15)] focus:outline-none [&:invalid]:text-[#6e6e73]"
            value={selectedRam}
            onChange={(e) => setSelectedRam(e.target.value)}
          >
            <option value="" disabled hidden>
              통합 메모리 (RAM)
            </option>
            {macbook.rams?.map((ram) => (
              <option key={ram}>{ram}</option>
            ))}
          </select>
        </div>
        <div className="relative w-full">
          <select
            className="w-full cursor-pointer appearance-none rounded-lg border border-[#d2d2d7] bg-transparent py-4 pr-10 pl-5 text-base text-[#1d1d1f] transition-all focus:border-[#0071e3] focus:shadow-[0_0_0_4px_rgba(0,113,227,0.15)] focus:outline-none [&:invalid]:text-[#6e6e73]"
            value={selectedSsd}
            onChange={(e) => setSelectedSsd(e.target.value)}
          >
            <option value="" disabled hidden>
              저장공간 (SSD)
            </option>
            {macbook.ssds?.map((ssd) => (
              <option key={ssd}>{ssd}</option>
            ))}
          </select>
        </div>
      </div>
    );
  };

  const renderWatchOptions = () => {
    const watch = deviceOptions?.watch;
    if (!watch) return null;

    return (
      <div id="watch-options" className="animate-fadeIn flex flex-col gap-5">
        <label className="mb-[-0.5rem] text-left text-sm font-semibold text-[#86868b]">
          Apple Watch 세부 사양
        </label>
        <div className="relative w-full">
          <select
            className="w-full cursor-pointer appearance-none rounded-lg border border-[#d2d2d7] bg-transparent py-4 pr-10 pl-5 text-base text-[#1d1d1f] transition-all focus:border-[#0071e3] focus:shadow-[0_0_0_4px_rgba(0,113,227,0.15)] focus:outline-none [&:invalid]:text-[#6e6e73]"
            value={selectedSeries}
            onChange={(e) => setSelectedSeries(e.target.value)}
          >
            <option value="" disabled hidden>
              시리즈
            </option>
            {watch.series?.map((series) => (
              <option key={series}>{series}</option>
            ))}
          </select>
        </div>
        <div className="relative w-full">
          <select
            className="w-full cursor-pointer appearance-none rounded-lg border border-[#d2d2d7] bg-transparent py-4 pr-10 pl-5 text-base text-[#1d1d1f] transition-all focus:border-[#0071e3] focus:shadow-[0_0_0_4px_rgba(0,113,227,0.15)] focus:outline-none [&:invalid]:text-[#6e6e73]"
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
          >
            <option value="" disabled hidden>
              크기(mm)
            </option>
            {watch.sizes?.map((size) => (
              <option key={size}>{size}</option>
            ))}
          </select>
        </div>
        <div className="relative w-full">
          <select
            className="w-full cursor-pointer appearance-none rounded-lg border border-[#d2d2d7] bg-transparent py-4 pr-10 pl-5 text-base text-[#1d1d1f] transition-all focus:border-[#0071e3] focus:shadow-[0_0_0_4px_rgba(0,113,227,0.15)] focus:outline-none [&:invalid]:text-[#6e6e73]"
            value={selectedMaterial}
            onChange={(e) => setSelectedMaterial(e.target.value)}
          >
            <option value="" disabled hidden>
              본체 소재
            </option>
            {watch.materials?.map((material) => (
              <option key={material}>{material}</option>
            ))}
          </select>
        </div>
      </div>
    );
  };

  const renderAirpodsOptions = () => {
    const airpods = deviceOptions?.airpods;
    if (!airpods) return null;

    return (
      <div id="airpods-options" className="animate-fadeIn flex flex-col gap-5">
        <label className="mb-[-0.5rem] text-left text-sm font-semibold text-[#86868b]">
          AirPods 세부 사양
        </label>
        <div className="relative w-full">
          <select
            className="w-full cursor-pointer appearance-none rounded-lg border border-[#d2d2d7] bg-transparent py-4 pr-10 pl-5 text-base text-[#1d1d1f] transition-all focus:border-[#0071e3] focus:shadow-[0_0_0_4px_rgba(0,113,227,0.15)] focus:outline-none [&:invalid]:text-[#6e6e73]"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
          >
            <option value="" disabled hidden>
              모델
            </option>
            {airpods.models?.map((model) => (
              <option key={model}>{model}</option>
            ))}
          </select>
        </div>
      </div>
    );
  };

  const renderCategoryOptions = () => {
    if (!selectedCategory) return null;

    if (isDeviceLoading) {
      return <p className="text-sm text-[#86868b]">제품 옵션을 불러오는 중입니다…</p>;
    }

    if (deviceError) {
      return (
        <p className="text-sm text-red-500">
          제품 옵션을 불러오지 못했습니다. 새로고침 후 다시 시도해주세요.
        </p>
      );
    }

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
              className="w-full cursor-pointer appearance-none rounded-lg border border-[#d2d2d7] bg-transparent py-4 pr-10 pl-5 text-base text-[#1d1d1f] transition-all focus:border-[#0071e3] focus:shadow-[0_0_0_4px_rgba(0,113,227,0.15)] focus:outline-none [&:invalid]:text-[#6e6e73]"
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

          <div className="grid w-full gap-4 md:grid-cols-3">
            <div className="relative w-full">
              <select
                id="province-select"
                className="w-full cursor-pointer appearance-none rounded-lg border border-[#d2d2d7] bg-transparent py-4 pr-10 pl-5 text-base text-[#1d1d1f] transition-all focus:border-[#0071e3] focus:shadow-[0_0_0_4px_rgba(0,113,227,0.15)] focus:outline-none [&:invalid]:text-[#6e6e73]"
                required
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
                disabled={isRegionLoading || !!regionError}
              >
                <option value="" disabled hidden>
                  시 / 도
                </option>
                {provinceOptions.map((province) => (
                  <option key={province.value} value={province.value}>
                    {province.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative w-full">
              <select
                id="city-select"
                className="w-full cursor-pointer appearance-none rounded-lg border border-[#d2d2d7] bg-transparent py-4 pr-10 pl-5 text-base text-[#1d1d1f] transition-all focus:border-[#0071e3] focus:shadow-[0_0_0_4px_rgba(0,113,227,0.15)] focus:outline-none [&:invalid]:text-[#6e6e73]"
                required
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                disabled={!selectedProvince || isRegionLoading || !!regionError}
              >
                <option value="" disabled hidden>
                  시 / 군 / 구
                </option>
                {cityOptions.map((city) => (
                  <option key={city.value} value={city.value}>
                    {city.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative w-full">
              <select
                id="district-select"
                className="w-full cursor-pointer appearance-none rounded-lg border border-[#d2d2d7] bg-transparent py-4 pr-10 pl-5 text-base text-[#1d1d1f] transition-all focus:border-[#0071e3] focus:shadow-[0_0_0_4px_rgba(0,113,227,0.15)] focus:outline-none [&:invalid]:text-[#6e6e73]"
                required
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                disabled={!selectedCity || isRegionLoading || !!regionError}
              >
                <option value="" disabled hidden>
                  읍 / 면 / 동
                </option>
                {districtOptions.map((district) => (
                  <option key={district.value} value={district.value}>
                    {district.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {isRegionLoading && (
            <p className="text-sm text-[#86868b]">행정구역 데이터를 불러오는 중입니다…</p>
          )}
          {regionError && (
            <p className="text-sm text-red-500">
              행정구역 정보를 가져오는 데 실패했습니다. 새로고침 후 다시 시도해주세요.
            </p>
          )}

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
