import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SearchPage() {
  const [selectedCategory, setSelectedCategory] = useState('iphone');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedStorage, setSelectedStorage] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedConnection, setSelectedConnection] = useState('');
  const [selectedChipset, setSelectedChipset] = useState('');
  const [selectedRam, setSelectedRam] = useState('');
  const [selectedSsd, setSelectedSsd] = useState('');
  const [selectedSeries, setSelectedSeries] = useState('');
  const [selectedMacbookModel, setSelectedMacbookModel] = useState('');
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
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredModels, setFilteredModels] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
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

  // 검색용 아이템을 카테고리별로 동적으로 생성하는 헬퍼 함수
  const buildSearchItemsByCategory = (options) => {
    if (!options) return {};

    // iPhone: modelGroups의 모든 options를 평탄화
    const iphoneItems =
      options.iphone?.modelGroups?.flatMap((group) =>
        group.options.map((name) => ({
          category: 'iphone',
          label: name,
          value: name,
        })),
      ) ?? [];

    // iPad: modelGroups의 모든 options를 평탄화
    const ipadItems =
      options.ipad?.modelGroups?.flatMap((group) =>
        group.options.map((name) => ({
          category: 'ipad',
          label: name,
          value: name,
        })),
      ) ?? [];

    // MacBook: models 배열을 그대로 사용 (모델 먼저 선택)
    const macbookItems =
      options.macbook?.models?.map((name) => ({
        category: 'macbook',
        label: name,
        value: name,
      })) ?? [];

    // Apple Watch: series 배열을 그대로 사용
    const watchItems =
      options.watch?.series?.map((name) => ({
        category: 'watch',
        label: name,
        value: name,
      })) ?? [];

    // AirPods: models 배열을 그대로 사용
    const airpodsItems =
      options.airpods?.models?.map((name) => ({
        category: 'airpods',
        label: name,
        value: name,
      })) ?? [];

    return {
      iphone: iphoneItems,
      ipad: ipadItems,
      macbook: macbookItems,
      watch: watchItems,
      airpods: airpodsItems,
    };
  };

  // deviceOptions가 로드되면 검색용 아이템 생성
  const searchItemsByCategory = useMemo(() => {
    const result = deviceOptions ? buildSearchItemsByCategory(deviceOptions) : {};
    return result;
  }, [deviceOptions]);

  useEffect(() => {
    if (!selectedCategory) {
      setFilteredModels([]);
      return;
    }

    const initialItems = searchItemsByCategory[selectedCategory] ?? [];

    if (initialItems.length > 0) {
      setFilteredModels(initialItems.slice(0, 10));
    } else {
      // searchItemsByCategory가 아직 준비되지 않았으면 빈 배열 설정
      setFilteredModels([]);
    }
  }, [selectedCategory, searchItemsByCategory]);

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
    setSelectedMacbookModel('');
    setSearchQuery('');
    setIsSearchFocused(false);
    // filteredModels는 useEffect에서 자동으로 설정됨
  };

  const handleSearchChange = (e) => {
    if (!selectedCategory) return;

    const query = e.target.value;
    setSearchQuery(query);

    const allItems = searchItemsByCategory[selectedCategory] ?? [];
    if (!query.trim()) {
      setFilteredModels(allItems.slice(0, 10));
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filtered = allItems.filter((item) => item.label.toLowerCase().includes(lowerQuery));
    setFilteredModels(filtered.slice(0, 20));
  };

  const handleSelectModel = (value) => {
    if (!selectedCategory) return;

    switch (selectedCategory) {
      case 'macbook':
        setSelectedMacbookModel(value);
        break;
      case 'watch':
        setSelectedSeries(value);
        break;
      default:
        setSelectedModel(value);
    }

    setSearchQuery(value);
    setIsSearchFocused(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedCategory) {
      alert('카테고리를 선택해주세요.');
      return;
    }

    // 상세 시세 페이지로 이동
    navigate('/detail', {
      state: {
        category: selectedCategory,
        model: selectedModel,
        macbookModel: selectedMacbookModel,
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

    // 맥북 모델이 선택되지 않았으면 아무것도 표시하지 않음 (검색창에서 모델 선택하도록)
    if (!selectedMacbookModel) {
      return null;
    }

    // 맥북 모델이 선택되었으면 칩셋, RAM, SSD 선택 드롭다운 표시
    return (
      <div id="macbook-options" className="animate-fadeIn flex flex-col gap-5">
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
    return null;
  };

  const searchLabelMap = {
    iphone: 'iPhone 세부 사양',
    ipad: 'iPad 세부 사양',
    macbook: 'MacBook 세부 사양',
    watch: 'Apple Watch 세부 사양',
    airpods: 'AirPods 세부 사양',
  };

  const searchPlaceholderMap = {
    iphone: '찾고 있는 iPhone 시리즈를 입력하세요',
    ipad: '찾고 있는 iPad 모델을 입력하세요',
    macbook: '찾고 있는 MacBook 모델을 입력하세요',
    watch: '찾고 있는 Apple Watch 시리즈를 입력하세요',
    airpods: '찾고 있는 AirPods 모델을 입력하세요',
  };

  const renderSearchInput = (options = { integrated: false }) => {
    const { integrated } = options;
    const placeholder = searchPlaceholderMap[selectedCategory] ?? '찾고 있는 제품명을 입력하세요';
    const hasOptions = (searchItemsByCategory[selectedCategory] ?? []).length > 0;

    const inputBaseClasses =
      'w-full bg-transparent py-4 pr-4 pl-5 text-base text-[#1d1d1f] transition-all focus:outline-none';
    const standaloneClasses =
      'rounded-lg border border-[#d2d2d7] focus:border-[#0071e3] focus:shadow-[0_0_0_4px_rgba(0,113,227,0.15)] disabled:cursor-not-allowed disabled:bg-[#f5f5f7] disabled:text-[#b0b0b5]';
    const integratedClasses =
      'border-none focus:border-none focus:shadow-none disabled:text-[#b0b0b5] disabled:bg-transparent';

    return (
      <div className={`relative w-full ${integrated ? '' : ''}`}>
        <input
          type="text"
          autoComplete="off"
          className={`${inputBaseClasses} ${integrated ? integratedClasses : standaloneClasses}`}
          placeholder={placeholder}
          value={searchQuery}
          onChange={handleSearchChange}
          onFocus={() => hasOptions && setIsSearchFocused(true)}
          onBlur={() => setTimeout(() => setIsSearchFocused(false), 100)}
          disabled={!hasOptions}
        />
        {isSearchFocused && (
          <div className="absolute z-20 mt-1 w-full rounded-lg border border-[#d2d2d7] bg-white text-left shadow-lg">
            {filteredModels.length > 0 ? (
              <ul className="max-h-60 overflow-y-auto py-1">
                {filteredModels.map((item) => (
                  <li
                    key={item.value}
                    className="cursor-pointer px-4 py-2 text-sm hover:bg-[#f5f5f7]"
                    onMouseDown={() => handleSelectModel(item.value)}
                  >
                    {item.label}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-4 py-3 text-sm text-[#86868b]">검색 결과가 없습니다.</p>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderAdditionalOptions = () => {
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

    const searchLabel = searchLabelMap[selectedCategory];
    const additionalContent = renderAdditionalOptions();
    if (!additionalContent) return null;

    const hasPrimarySelection = (() => {
      switch (selectedCategory) {
        case 'macbook':
          return Boolean(selectedMacbookModel);
        case 'watch':
          return Boolean(selectedSeries);
        default:
          return Boolean(selectedModel);
      }
    })();

    if (!hasPrimarySelection) {
      return null;
    }

    return (
      <div className="flex w-full flex-col gap-5">
        {searchLabel && (
          <label className="mb-[-0.5rem] text-left text-sm font-semibold text-[#86868b]">
            {searchLabel}
          </label>
        )}
        {additionalContent}
      </div>
    );
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
          <div className="flex w-full flex-col gap-3">
            <div className="flex w-full flex-col rounded-lg border border-[#d2d2d7] focus-within:border-[#0071e3] focus-within:shadow-[0_0_0_4px_rgba(0,113,227,0.15)] md:flex-row">
              <div className="relative border-b border-[#d2d2d7] bg-transparent md:w-[calc((100%-2rem)/3)] md:rounded-l-lg md:border-r md:border-b-0">
                <select
                  id="category-select"
                  className="w-full cursor-pointer appearance-none bg-transparent py-4 pr-8 pl-5 text-base text-[#1d1d1f] transition-all focus:outline-none"
                  required
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                >
                  <option value="iphone">iPhone</option>
                  <option value="ipad">iPad</option>
                  <option value="macbook">MacBook</option>
                  <option value="watch">Apple Watch</option>
                  <option value="airpods">AirPods</option>
                </select>
                <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-sm text-[#6e6e73]">
                  ▾
                </span>
              </div>
              <div className="flex-1 md:rounded-r-lg">
                {renderSearchInput({ integrated: true })}
              </div>
            </div>
          </div>

          <div id="dynamic-options-container" className="flex w-full flex-col gap-5">
            {renderCategoryOptions()}
          </div>

          {(() => {
            const hasPrimarySelection = (() => {
              switch (selectedCategory) {
                case 'macbook':
                  return Boolean(selectedMacbookModel);
                case 'watch':
                  return Boolean(selectedSeries);
                default:
                  return Boolean(selectedModel);
              }
            })();

            return (
              <div className="flex w-full flex-col gap-5">
                {hasPrimarySelection && (
                  <label className="mb-[-0.5rem] text-left text-sm font-semibold text-[#86868b]">
                    거래 지역
                  </label>
                )}
                <div className="grid w-full gap-4 md:grid-cols-3">
                  <div className="relative w-full">
                    <select
                      id="province-select"
                      className="w-full cursor-pointer appearance-none rounded-lg border border-[#d2d2d7] bg-transparent py-4 pr-10 pl-5 text-base text-[#1d1d1f] transition-all focus:border-[#0071e3] focus:shadow-[0_0_0_4px_rgba(0,113,227,0.15)] focus:outline-none [&:invalid]:text-[#6e6e73]"
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
              </div>
            );
          })()}

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
