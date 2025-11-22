import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getPriceAnalysis } from '../api/priceApi';
import { mapFormDataToApiRequest } from '../utils/apiMapper';

export default function DetailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [districtData, setDistrictData] = useState([]);
  const [sortedDistrictData, setSortedDistrictData] = useState([]);

  // API 데이터 상태
  const [apiData, setApiData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // API에서 받아온 가격 변동 추이 데이터 (기본값)
  const priceHistory = apiData?.price_trend?.chart_data || [];

  const formatPrice = (price) => {
    return price.toLocaleString('ko-KR');
  };

  // 지역 정보 추출
  const locationInfo = location.state?.location || {}; // 직전 페이지인 searchpage에서 넘어온 state!
  const province = locationInfo.province || '';
  const city = locationInfo.city || '';
  const district = locationInfo.district || '';

  // 모델 정보 추출
  const modelName = apiData?.summary_info?.model_name || location.state?.model || 'Apple 제품';

  // 행정구역 JSON 로드 및 동일 시/구의 동 목록 생성
  // SearchPage에서도 쓴 행정구역 json을 여기서도 사용
  useEffect(() => {
    const fetchPriceData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // SearchPage에서 넘어온 모든 state를 API 요청 형식으로 변환
        const requestData = mapFormDataToApiRequest(location.state);

        console.log('📩 requestData:', requestData); // 디버깅용

        // 실제 API 호출
        const response = await getPriceAnalysis(requestData);

        console.log('📥 API Response:', response);

        console.log('📥 RAW RESPONSE:', response);
        console.log('📥 response.data:', response?.data);
        console.log('📥 response.data.data:', response?.data?.data);
        console.log('📥 response.data.status:', response?.data?.status);

        // response 또는 response.data가 null일 경우 방어 처리
        if (!response || !response.data) {
          throw new Error('API returned empty data (response.data is null)');
        }

        setApiData(response.data);

        // 지역별 시세 데이터 설정
        const districtList =
          response.data.regional_analysis?.detail_by_district?.map((item) => ({
            district: item.emd,
            average: item.average_price,
            count: item.listing_count,
          })) || [];

        setDistrictData(districtList);
        setSortedDistrictData(districtList);
      } catch (err) {
        console.error('API 호출 실패:', err);
        setError('데이터를 불러오는데 실패했습니다. 다시 시도해주세요.');
      } finally {
        setIsLoading(false);
      }
    };

    // location.state가 있을 때만 API 호출
    if (location.state) {
      fetchPriceData();
    }
  }, [location.state]);

  const handleSort = (column) => {
    // sorting하는 함수
    let newDirection = 'asc';
    if (sortColumn === column && sortDirection === 'asc') {
      newDirection = 'desc';
    }

    setSortColumn(column);
    setSortDirection(newDirection);

    const sorted = [...districtData].sort((a, b) => {
      if (column === 'price') {
        return newDirection === 'asc' ? a.average - b.average : b.average - a.average;
      } else if (column === 'count') {
        return newDirection === 'asc' ? a.count - b.count : b.count - a.count;
      }
      return 0;
    });

    setSortedDistrictData(sorted);
  };

  // 동 클릭 시 해당 동으로 페이지 이동
  const handleDistrictClick = (clickedDistrict) => {
    navigate('/detail', {
      state: {
        ...location.state, // 기존 state (모델, 색상 등) 유지
        location: {
          province,
          city,
          district: clickedDistrict, // 클릭한 동으로 변경
        },
      },
    });
  };

  // 가격 추이 그래프 계산 - 정갈한 그래프를 위한 정확한 계산
  const calculateGraphPoints = () => {
    const maxPrice = Math.max(...priceHistory.map((d) => d.price));
    const minPrice = Math.min(...priceHistory.map((d) => d.price));
    const range = maxPrice - minPrice;
    const padding = range * 0.1; // 상하 여백 추가

    // SVG 좌표 계산 (viewBox: 0 0 600 200)
    const graphArea = {
      left: 60,
      right: 560,
      top: 20,
      bottom: 160,
      width: 500,
      height: 140,
    };

    const points = priceHistory.map((point, index) => {
      // Y 좌표 계산 (상단이 높은 가격)
      const percentage = ((point.price - (minPrice - padding)) / (range + padding * 2)) * 100;
      const y = graphArea.top + (100 - percentage) * (graphArea.height / 100);

      // X 좌표 계산
      const x = graphArea.left + (index / (priceHistory.length - 1)) * graphArea.width;

      return { ...point, x, y };
    });

    // Y축 레이블 생성 (5개의 균등한 구간)
    const yAxisLabels = [];
    for (let i = 0; i < 5; i++) {
      const value = maxPrice + padding - ((range + padding * 2) / 4) * i;
      yAxisLabels.push(value);
    }

    return { points, maxPrice, minPrice, range, padding, yAxisLabels };
  };

  const graphData = calculateGraphPoints();

  // 최신 가격 대비 하락률 계산
  const priceChange = apiData?.price_trend?.change_rate || 0;

  // 지역별 최고/최저 시세 계산
  const getHighestAndLowestDistrict = () => {
    const districts = apiData?.regional_analysis?.detail_by_district;
    if (!districts || districts.length === 0) {
      return { highest: null, lowest: null };
    }

    const highest = districts.reduce(
      (max, district) => (district.average_price > max.average_price ? district : max),
      districts[0],
    );

    const lowest = districts.reduce(
      (min, district) => (district.average_price < min.average_price ? district : min),
      districts[0],
    );

    return { highest, lowest };
  };

  const { highest: highestDistrict, lowest: lowestDistrict } = getHighestAndLowestDistrict();

  // 로딩 중일 때
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="mb-4 text-2xl font-semibold text-[#1d1d1f]">
            데이터를 불러오는 중입니다...
          </div>
          <p className="text-lg text-[#86868b]">잠시만 기다려주세요</p>
        </div>
      </div>
    );
  }

  // 에러 발생 시
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="mb-4 text-2xl font-semibold text-red-500">오류가 발생했습니다</div>
          <p className="mb-6 text-lg text-[#86868b]">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="cursor-pointer rounded-lg border border-[#1d1d1f] bg-transparent px-6 py-3 text-base font-medium text-[#1d1d1f] transition-all hover:bg-[#1d1d1f] hover:text-white"
          >
            다시 검색하기
          </button>
        </div>
      </div>
    );
  }

  // 데이터가 없을 때
  if (!apiData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="mb-4 text-2xl font-semibold text-[#1d1d1f]">검색 결과가 없습니다</div>
          <p className="mb-6 text-lg text-[#86868b]">다시 검색해주세요</p>
          <button
            onClick={() => navigate('/')}
            className="cursor-pointer rounded-lg border border-[#1d1d1f] bg-transparent px-6 py-3 text-base font-medium text-[#1d1d1f] transition-all hover:bg-[#1d1d1f] hover:text-white"
          >
            검색 페이지로 이동
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 고정 헤더 */}
      <header className="sticky top-0 z-50 border-b border-[#d2d2d7] bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-10 py-4">
          {/* 로고 */}
          <div
            className="cursor-pointer text-2xl font-bold text-[#1d1d1f] transition-colors hover:text-[#0071e3]"
            onClick={() => navigate('/')}
          >
            How Much, Apple?
          </div>

          {/* 네비게이션 */}
          <nav className="flex items-center gap-8">
            <button
              className="cursor-pointer rounded-full border border-[#0071e3] bg-transparent px-5 py-2 text-sm font-medium text-[#0071e3] transition-all hover:bg-[#0071e3] hover:text-white"
              onClick={() => navigate('/')}
            >
              새로운 검색
            </button>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-[1200px] p-10">
        {/* 페이지 타이틀 */}
        <header className="animate-fadeIn mb-[60px] text-center">
          <h1 className="m-0 text-[3.25rem] font-bold tracking-tight">
            &apos;<span className="text-[#1d1d1f]">{modelName}</span>&apos; 시세
          </h1>
          <p className="mt-5 text-lg text-[#86868b]">
            <span className="font-semibold text-[#1d1d1f]">
              {province} {city} {district}
            </span>{' '}
            기준 실시간 데이터
          </p>
        </header>

        {/* 1. 상단 Hero 섹션 - 가격 정보 통합 */}
        <section className="animate-fadeIn mb-20" style={{ animationDelay: '0.1s' }}>
          {/* 통합된 가격 정보 섹션 */}
          <div className="mb-8 box-border rounded-2xl bg-gradient-to-br from-[#f5f5f7] to-[#e8e8ed] p-10">
            <div className="flex items-center justify-center gap-12">
              {/* 최저가 매물 */}
              <div className="flex-1 text-center">
                <h4 className="m-0 mb-3 text-base font-semibold text-[#86868b]">최저가 매물</h4>
                <p className="m-0 text-3xl font-bold text-[#1d1d1f]">
                  ₩{formatPrice(apiData.summary_info.lowest_listing_price)}
                </p>
              </div>

              {/* 구분선 */}
              <div className="h-20 w-px bg-[#d2d2d7]"></div>

              {/* 평균 시세 (강조) */}
              <div className="flex-1 text-center">
                <h3 className="m-0 mb-4 text-xl font-semibold text-[#1d1d1f]">평균 시세 (중고)</h3>
                <p className="m-0 text-5xl font-extrabold text-[#0071e3]">
                  ₩{formatPrice(apiData.summary_info.average_price)}
                </p>
              </div>

              {/* 구분선 */}
              <div className="h-20 w-px bg-[#d2d2d7]"></div>

              {/* 최고가 매물 */}
              <div className="flex-1 text-center">
                <h4 className="m-0 mb-3 text-base font-semibold text-[#86868b]">최고가 매물</h4>
                <p className="m-0 text-3xl font-bold text-[#1d1d1f]">
                  ₩{formatPrice(apiData.summary_info.highest_listing_price)}
                </p>
              </div>
            </div>
          </div>

          {/* 부가 정보 */}
          <div className="grid grid-cols-2 gap-5 text-center">
            <div className="rounded-xl bg-[#f5f5f7] px-6 py-4">
              <h4 className="m-0 mb-2 text-sm font-semibold text-[#86868b]">분석된 총 매물 수</h4>
              <p className="m-0 text-lg font-semibold">
                {apiData.summary_info.listing_count}개{' '}
                <span
                  className="ml-1.5 inline-block h-3.5 w-3.5 cursor-pointer rounded-full bg-[#d2d2d7] text-xs leading-[14px] font-bold text-[#86868b]"
                  title="최근 3일 이내, 거래 완료 제외"
                >
                  i
                </span>
              </p>
            </div>
            <div className="rounded-xl bg-[#f5f5f7] px-6 py-4">
              <h4 className="m-0 mb-2 text-sm font-semibold text-[#86868b]">데이터 기준일</h4>
              <p className="m-0 text-lg font-semibold">{apiData.summary_info.data_date}</p>
            </div>
          </div>
        </section>

        {/* 2. 중단 2단 레이아웃 - 그래프(좌) + 매물 리스트(우) */}
        <div
          className="animate-fadeIn mb-20 grid grid-cols-[55%_1fr] items-start gap-10"
          style={{ animationDelay: '0.2s' }}
        >
          {/* 2-1. 좌측 컬럼: 가격 변동 추이 + 읍면동별 상세 시세 */}
          <div className="flex flex-col gap-10">
            {/* 가격 변동 추이 그래프 */}
            <section className="mb-0">
              <h2 className="mb-10 text-left text-3xl font-semibold tracking-tight">
                {district}의 가격 변동 추이 (최근 7주)
              </h2>
              <div className="relative mb-5 box-border rounded-xl bg-[#f5f5f7] p-8">
                <svg viewBox="0 0 600 200" className="h-[200px] w-full">
                  {/* 그리드 라인 (Y축 기준) */}
                  {graphData.yAxisLabels.map((_, idx) => {
                    const y = 20 + (idx * 140) / 4;
                    return (
                      <line
                        key={idx}
                        x1="60"
                        y1={y}
                        x2="560"
                        y2={y}
                        stroke="#d2d2d7"
                        strokeWidth="1"
                        strokeDasharray="2,2"
                      />
                    );
                  })}

                  {/* 축 */}
                  <line x1="60" y1="20" x2="60" y2="160" stroke="#d2d2d7" strokeWidth="1" />
                  <line x1="60" y1="160" x2="560" y2="160" stroke="#d2d2d7" strokeWidth="1" />

                  {/* Y축 레이블 */}
                  {graphData.yAxisLabels.map((price, idx) => {
                    const y = 20 + (idx * 140) / 4;
                    return (
                      <text
                        key={idx}
                        x="55"
                        y={y + 5}
                        textAnchor="end"
                        fontSize="12"
                        fill="#86868b"
                      >
                        {price / 10000}만
                      </text>
                    );
                  })}

                  {/* 라인과 포인트 */}
                  <polyline
                    points={graphData.points.map((p) => `${p.x},${p.y}`).join(' ')}
                    fill="none"
                    stroke="#1d1d1f"
                    strokeWidth="2"
                  />
                  {graphData.points.map((point, index) => (
                    <circle key={index} cx={point.x} cy={point.y} r="4" fill="#1d1d1f" />
                  ))}
                </svg>

                {/* X축 레이블 */}
                <div className="flex justify-between px-[60px] pt-2 text-xs text-[#86868b]">
                  {priceHistory.map((point, index) => (
                    <span key={index}>{point.period}</span>
                  ))}
                </div>
              </div>
              <div className="mt-6 rounded-xl bg-[#f5f5f7] p-4 text-center font-medium text-[#1d1d1f]">
                최근 7주간 약{' '}
                <span
                  className={`text-center font-bold ${
                    priceChange > 0 ? 'text-red-500' : 'text-blue-500'
                  }`}
                >
                  {Math.abs(priceChange)}%
                </span>{' '}
                <span
                  className={`font-semibold ${priceChange > 0 ? 'text-red-500' : 'text-blue-500'}`}
                >
                  {priceChange > 0 ? '상승' : '하락'}세
                </span>
                를 보이고 있습니다
              </div>
            </section>

            {/* 읍면동별 상세 시세 (그래프 바로 아래) */}
            <section className="mb-0">
              <h2 className="mb-10 text-left text-3xl font-semibold tracking-tight">
                읍면동별 상세 시세
              </h2>
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border-b border-[#d2d2d7] py-5 text-left text-sm font-semibold text-[#86868b] uppercase">
                      읍면동
                    </th>
                    <th
                      className="cursor-pointer border-b border-[#d2d2d7] py-5 text-left text-sm font-semibold text-[#86868b] uppercase select-none hover:text-[#1d1d1f]"
                      onClick={() => handleSort('price')}
                    >
                      평균가{' '}
                      <span className="ml-1 inline-block w-4 text-xs text-[#d2d2d7] group-hover:text-[#1d1d1f]">
                        ▲▼
                      </span>
                    </th>
                    <th
                      className="cursor-pointer border-b border-[#d2d2d7] py-5 text-left text-sm font-semibold text-[#86868b] uppercase select-none hover:text-[#1d1d1f]"
                      onClick={() => handleSort('count')}
                    >
                      매물 수{' '}
                      <span className="ml-1 inline-block w-4 text-xs text-[#d2d2d7] group-hover:text-[#1d1d1f]">
                        ▲▼
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedDistrictData.map((item, index) => {
                    const maxPrice = Math.max(...sortedDistrictData.map((d) => d.average));
                    const minPrice = Math.min(...sortedDistrictData.map((d) => d.average));
                    const isHighest = item.average === maxPrice;
                    const isLowest = item.average === minPrice;

                    return (
                      <tr
                        key={index}
                        className={`cursor-pointer transition-all ${
                          isHighest
                            ? 'bg-red-50 hover:bg-red-100'
                            : isLowest
                              ? 'bg-blue-50 hover:bg-blue-100'
                              : 'hover:bg-[#f5f5f7]'
                        }`}
                        onClick={() => handleDistrictClick(item.district)}
                      >
                        <td className="border-b border-[#d2d2d7] py-5 text-left text-base">
                          <div className="flex items-center gap-2">
                            <span className={isHighest || isLowest ? 'font-bold' : 'font-semibold'}>
                              {item.district}
                            </span>
                            {isHighest && (
                              <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
                                최고가
                              </span>
                            )}
                            {isLowest && (
                              <span className="rounded-full bg-blue-500 px-2 py-0.5 text-xs font-bold text-white">
                                최저가
                              </span>
                            )}
                          </div>
                        </td>
                        <td
                          className={`border-b border-[#d2d2d7] py-5 text-left text-base ${
                            isHighest || isLowest ? 'font-bold' : ''
                          }`}
                        >
                          ₩{formatPrice(item.average)}
                        </td>
                        <td
                          className={`border-b border-[#d2d2d7] py-5 text-left text-base ${
                            isHighest || isLowest ? 'font-bold' : ''
                          }`}
                        >
                          {item.count}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </section>
          </div>

          {/* 2-2. 우측 컬럼: 현재 최저가 매물 */}
          <section className="mb-0">
            <h2 className="mb-10 text-left text-3xl font-semibold tracking-tight">
              {district}의 현재 최저가 매물
            </h2>
            <div className="flex flex-col gap-4">
              {apiData.lowest_price_listings.map((listing, index) => (
                <a
                  key={index}
                  href={listing.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex cursor-pointer items-center rounded-xl p-4 transition-colors hover:bg-[#f5f5f7]"
                >
                  <img
                    src="/iphone.jpeg"
                    alt="상품 이미지"
                    className="mr-4 h-15 w-15 flex-shrink-0 rounded-lg object-cover"
                  />
                  <div className="flex-grow">
                    <p className="m-0 mb-1 text-lg font-bold">
                      ₩{formatPrice(listing.listing_price)}
                    </p>
                    <p className="m-0 text-sm text-[#86868b]">{listing.district_detail}</p>
                    <p className="m-0 mt-1 text-xs font-semibold text-[#0071e3]">
                      출처: {listing.source}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </section>
        </div>

        {/* 3. 지역별 시세 비교 */}
        <section className="animate-fadeIn mb-20" style={{ animationDelay: '0.3s' }}>
          <h2 className="mb-10 text-left text-3xl font-semibold tracking-tight">
            {city}의 지역별 시세 비교
          </h2>
          <div className="grid grid-cols-2 gap-5">
            <div className="rounded-xl bg-red-50 p-6">
              <h4 className="m-0 mb-3 text-lg font-semibold text-red-500">
                최고가 지역: {highestDistrict?.emd || '-'}
              </h4>
              <p className="m-0 text-2xl font-bold text-[#1d1d1f]">
                {highestDistrict ? `₩${formatPrice(highestDistrict.average_price)}` : '-'}
              </p>
            </div>
            <div className="rounded-xl bg-blue-50 p-6">
              <h4 className="m-0 mb-3 text-lg font-semibold text-blue-500">
                최저가 지역: {lowestDistrict?.emd || '-'}
              </h4>
              <p className="m-0 text-2xl font-bold text-[#1d1d1f]">
                {lowestDistrict ? `₩${formatPrice(lowestDistrict.average_price)}` : '-'}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
