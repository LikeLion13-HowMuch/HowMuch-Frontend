import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function DetailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  // 가격 변동 추이 데이터 (7주) - 100만원 넘는 상품에 맞게 조정
  const priceHistory = [
    { week: '1월 1주', price: 1320000 },
    { week: '1월 2주', price: 1280000 },
    { week: '1월 3주', price: 1250000 },
    { week: '1월 4주', price: 1230000 },
    { week: '2월 1주', price: 1240000 },
    { week: '2월 2주', price: 1255000 },
    { week: '2월 3주', price: 1260000 },
  ];

  // 자치구별 상세 시세 데이터
  const districtData = [
    { district: '강남구', average: 1350000, count: 25 },
    { district: '마포구', average: 1280000, count: 18 },
    { district: '영등포구', average: 1230000, count: 22 },
    { district: '관악구', average: 1180000, count: 31 },
    { district: '서초구', average: 1320000, count: 15 },
    { district: '동작구', average: 1200000, count: 20 },
  ];

  const [sortedDistrictData, setSortedDistrictData] = useState(districtData);

  const formatPrice = (price) => {
    return price.toLocaleString('ko-KR');
  };

  // 지역명 변환 함수
  const convertLocationName = (locationCode) => {
    const locationMap = {
      seoul: '서울특별시',
      gyeonggi: '경기도',
      incheon: '인천광역시',
      busan: '부산광역시',
      daegu: '대구광역시',
      gwangju: '광주광역시',
      daejeon: '대전광역시',
      ulsan: '울산광역시',
      sejong: '세종특별자치시',
      gangwon: '강원도',
      chungbuk: '충청북도',
      chungnam: '충청남도',
      jeonbuk: '전라북도',
      jeonnam: '전라남도',
      gyeongbuk: '경상북도',
      gyeongnam: '경상남도',
      jeju: '제주특별자치도',
    };
    return locationMap[locationCode] || locationCode;
  };

  const handleSort = (column) => {
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
  const priceChange = (
    ((priceHistory[priceHistory.length - 1].price - priceHistory[0].price) /
      priceHistory[0].price) *
    100
  ).toFixed(1);

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-[#d2d2d7] p-6">
        <button
          onClick={() => navigate('/')}
          className="mb-2 cursor-pointer border-none bg-transparent text-base text-[#0071e3] transition-colors hover:text-[#0051a2]"
        >
          ← 다시 검색하기
        </button>
      </header>

      <div className="mx-auto max-w-[1200px] p-10">
        {/* 페이지 타이틀 */}
        <header className="animate-fadeIn mb-[60px] text-center">
          <h1 className="m-0 text-[3.25rem] font-bold tracking-tight">
            &apos;<span className="text-[#1d1d1f]">{location.state?.model || 'iPhone 14 Pro'}</span>
            &apos; 시세
          </h1>
          <p className="mt-5 text-lg text-[#86868b]">
            <span className="font-semibold text-[#1d1d1f]">
              {convertLocationName(location.state?.location || '서울특별시')}
            </span>{' '}
            기준 실시간 데이터
          </p>
        </header>

        {/* 1. 상단 요약 섹션 */}
        <section className="animate-fadeIn mb-20" style={{ animationDelay: '0.1s' }}>
          <div className="mb-5 box-border rounded-xl bg-[#f5f5f7] p-8 text-center">
            <div className="mb-6 border-b border-[#d2d2d7] pb-6">
              <h3 className="m-0 mb-3 text-xl font-semibold text-[#1d1d1f]">
                현재 평균 시세 (중고)
              </h3>
              <p className="m-0 text-[2.75rem] font-extrabold text-[#0071e3]">
                ₩{formatPrice(1250000)}
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <h4 className="m-0 mb-2 text-base font-semibold text-[#86868b]">최고가 매물</h4>
                <p className="m-0 text-2xl font-bold text-[#1d1d1f]">₩{formatPrice(1400000)}</p>
              </div>
              <div>
                <h4 className="m-0 mb-2 text-base font-semibold text-[#86868b]">최저가 매물</h4>
                <p className="m-0 text-2xl font-bold text-[#1d1d1f]">₩{formatPrice(1050000)}</p>
              </div>
              <div>
                <h4 className="m-0 mb-2 text-base font-semibold text-[#86868b]">
                  다나와 최저가 (신품)
                </h4>
                <p className="m-0 text-2xl font-bold text-[#86868b]">₩{formatPrice(1550000)}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5 text-center">
            <div className="rounded-xl bg-[#f5f5f7] px-6 py-4">
              <h4 className="m-0 mb-2 text-sm font-semibold text-[#86868b]">분석된 총 매물 수</h4>
              <p className="m-0 text-lg font-semibold">
                104개{' '}
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
              <p className="m-0 text-lg font-semibold">10월 31일 11:00</p>
            </div>
          </div>
        </section>

        {/* 2. 상단 2단 대시보드 */}
        <div
          className="animate-fadeIn mb-20 grid grid-cols-[40%_1fr] items-start gap-10"
          style={{ animationDelay: '0.2s' }}
        >
          {/* 2-1. 핵심 시세 (좌측) */}
          <section className="mb-0">
            <h2 className="mb-10 text-left text-3xl font-semibold tracking-tight">
              지역별 시세 분석
            </h2>
            <div className="flex flex-col gap-6">
              <div className="rounded-xl bg-[#f5f5f7] p-6">
                <div className="mb-4 flex items-baseline justify-between">
                  <h3 className="m-0 text-lg font-semibold text-[#1d1d1f]">
                    최고 시세 지역 (강남구)
                  </h3>
                  <p className="text-xl font-bold whitespace-nowrap">₩{formatPrice(1350000)}</p>
                </div>
                <div className="h-2 w-full overflow-hidden rounded bg-[#d2d2d7]">
                  <div
                    className="animate-growBar h-full origin-left rounded bg-[#1d1d1f]"
                    style={{ width: '100%', animation: 'growBar 1s 0.5s ease-out forwards' }}
                  ></div>
                </div>
              </div>
              <div className="rounded-xl bg-[#f5f5f7] p-6">
                <div className="mb-4 flex items-baseline justify-between">
                  <h3 className="m-0 text-lg font-semibold text-[#1d1d1f]">
                    최저 시세 지역 (관악구)
                  </h3>
                  <p className="text-xl font-bold whitespace-nowrap">₩{formatPrice(1180000)}</p>
                </div>
                <div className="h-2 w-full overflow-hidden rounded bg-[#d2d2d7]">
                  <div
                    className="animate-growBar h-full origin-left rounded bg-[#1d1d1f]"
                    style={{ width: '87.4%', animation: 'growBar 1s 0.5s ease-out forwards' }}
                  ></div>
                </div>
              </div>
            </div>
          </section>

          {/* 2-2. 시세 변동 그래프 (우측) - SVG로 정갈하게 재구현 */}
          <section className="mb-0">
            <h2 className="mb-10 text-left text-3xl font-semibold tracking-tight">
              가격 변동 추이 (최근 7주)
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
                    <text key={idx} x="55" y={y + 5} textAnchor="end" fontSize="12" fill="#86868b">
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
                  <span key={index}>{point.week}</span>
                ))}
              </div>
            </div>
            <div className="mt-6 rounded-xl bg-[#f5f5f7] p-4 text-center font-medium text-[#1d1d1f]">
              최근 7주간 약 {Math.abs(priceChange)}% {priceChange > 0 ? '상승' : '하락'}세를 보이고
              있습니다
            </div>
          </section>
        </div>

        {/* 3. 하단 2단 대시보드 */}
        <div
          className="animate-fadeIn mb-20 grid grid-cols-[60%_1fr] items-start gap-10"
          style={{ animationDelay: '0.3s' }}
        >
          {/* 3-1. 자치구별 상세 시세 */}
          <section className="mb-0">
            <h2 className="mb-10 text-left text-3xl font-semibold tracking-tight">
              자치구별 상세 시세
            </h2>
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border-b border-[#d2d2d7] py-5 text-left text-sm font-semibold text-[#86868b] uppercase">
                    자치구
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
                {sortedDistrictData.map((item, index) => (
                  <tr key={index} className="transition-colors hover:bg-[#f5f5f7]">
                    <td className="border-b border-[#d2d2d7] py-5 text-left text-base font-semibold">
                      {item.district}
                    </td>
                    <td className="border-b border-[#d2d2d7] py-5 text-left text-base">
                      ₩{formatPrice(item.average)}
                    </td>
                    <td className="border-b border-[#d2d2d7] py-5 text-left text-base">
                      {item.count}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* 3-2. 최저가 매물 */}
          <section className="mb-0">
            <h2 className="mb-10 text-left text-3xl font-semibold tracking-tight">
              현재 최저가 매물
            </h2>
            <div className="flex flex-col gap-4">
              {[
                { price: 1150000, location: '관악구 신림동', source: '당근마켓' },
                { price: 1155000, location: '영등포구 당산동', source: '번개장터' },
                { price: 1160000, location: '관악구 봉천동', source: '중고나라' },
                { price: 1160000, location: '마포구 아현동', source: '당근마켓' },
                { price: 1165000, location: '서초구 방배동', source: '번개장터' },
              ].map((listing, index) => (
                <div
                  key={index}
                  className="flex cursor-pointer items-center rounded-xl p-4 transition-colors hover:bg-[#f5f5f7]"
                >
                  <img
                    src="/iphone.jpeg"
                    alt="상품 이미지"
                    className="mr-4 h-15 w-15 flex-shrink-0 rounded-lg object-cover"
                  />
                  <div className="flex-grow">
                    <p className="m-0 mb-1 text-lg font-bold">₩{formatPrice(listing.price)}</p>
                    <p className="m-0 text-sm text-[#86868b]">{listing.location}</p>
                    <p className="m-0 mt-1 text-xs font-semibold text-[#0071e3]">
                      출처: {listing.source}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <footer className="mt-25 text-center text-[#86868b] opacity-80">
          <p>{/* footer는 아직 빈칸 */}</p>
        </footer>
      </div>
    </div>
  );
}
