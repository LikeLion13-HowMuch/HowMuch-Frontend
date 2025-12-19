import axios from 'axios';

// API Base URL (환경변수로 관리 가능)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
// 없으면 그냥 로컬호스트로 관리됨.

const WEEKS_TO_DISPLAY = 4;

const clampWeekNumber = (weekNumber) => Math.min(4, weekNumber);

const getWeekLabel = (date) => {
  const month = date.getMonth() + 1;
  const weekNumber = clampWeekNumber(Math.ceil(date.getDate() / 7));
  return `${month}월 ${weekNumber}주`;
};

const generatePriceTrendData = () => {
  const today = new Date();
  const basePrices = [1340000, 1310000, 1275000, 1240000];

  return Array.from({ length: WEEKS_TO_DISPLAY }, (_, idx) => {
    const weeksAgo = WEEKS_TO_DISPLAY - 1 - idx;
    const date = new Date(today);
    date.setDate(date.getDate() - weeksAgo * 7);

    return {
      period: getWeekLabel(date),
      price: basePrices[idx],
    };
  });
};

// 실제 연결시에 쓸 API 함수
/**
 * 시세 분석 데이터 조회 API
 * @param {Object} requestData - API 요청 데이터
 * @returns {Promise<Object>} - API 응답 데이터
 */
export const getPriceAnalysis = async (requestData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/v1/analytics/summary`, requestData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    // 네트워크 오류인 경우 더 명확한 메시지 제공
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      const networkError = new Error(
        `백엔드 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.\n` +
          `요청 URL: ${API_BASE_URL}/v1/analytics/summary`,
      );
      networkError.isNetworkError = true;
      networkError.originalError = error;
      console.error('네트워크 오류:', networkError.message);
      throw networkError;
    }

    // 기타 오류
    console.error('API 호출 오류:', error);
    throw error;
  }
};

/**
 * 더미 데이터 반환 함수 (백엔드 준비 전 테스트용)
 * @param {Object} requestData - API 요청 데이터
 * @returns {Promise<Object>} - 더미 응답 데이터
 */
export const getPriceAnalysisMock = async (requestData) => {
  // 실제 API 호출 시뮬레이션 (0.5초 딜레이)
  await new Promise((resolve) => setTimeout(resolve, 500));

  const districtDetail = `${requestData.region?.sgg || '관악구'} ${requestData.region?.emd || '신림동'}`;

  // locations_final.json에서 해당 구의 동 목록 가져오기
  let districts = [];
  try {
    const locationsResponse = await fetch('/locations_final.json');
    if (locationsResponse.ok) {
      const locationsData = await locationsResponse.json();
      const province = locationsData.find(
        (p) => p.name === (requestData.region?.sd || '서울특별시'),
      );
      if (province) {
        const city = province.cities?.find((c) => c.name === (requestData.region?.sgg || '관악구'));
        if (city && city.districts && Array.isArray(city.districts)) {
          districts = city.districts;
        }
      }
    }
  } catch (error) {
    console.warn('행정구역 데이터를 불러오지 못했습니다. 기본값을 사용합니다.', error);
  }

  // 동 목록이 비어있으면 기본값 사용 (fallback)
  if (districts.length === 0) {
    districts = ['신림동', '봉천동', '남현동', '사당동', '대학동'];
  }

  // 각 동에 대한 더미 시세 데이터 생성
  const detailByDistrict = districts.map((district, index) => {
    // 기본 가격에서 랜덤하게 변동 (-5% ~ +10%)
    const basePrice = 1250000;
    const variation = (Math.random() * 0.15 - 0.05) * basePrice;
    const averagePrice = Math.round(basePrice + variation);

    // 매물 수도 랜덤하게 생성 (10~30개)
    const listingCount = Math.floor(Math.random() * 21) + 10;

    return {
      emd: district,
      average_price: averagePrice,
      listing_count: listingCount,
    };
  });

  // 최저가와 최고가 계산
  const prices = detailByDistrict.map((d) => d.average_price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const totalListingCount = detailByDistrict.reduce((sum, d) => sum + d.listing_count, 0);
  const averagePrice = Math.round(prices.reduce((sum, p) => sum + p, 0) / prices.length);

  const mockListings = Array.from({ length: 70 }, (_, index) => {
    const basePrice = 1150000;
    const priceStep = 5000;
    const price = basePrice + (index % 10) * priceStep;
    const sources = ['당근', '번개장터', '중고나라'];

    return {
      listing_price: price,
      district_detail: districtDetail,
      source: sources[index % sources.length],
      source_url: `https://example.com/mock-listing-${index + 1}`,
    };
  });

  // 더미 데이터 반환
  return {
    status: 'success',
    data: {
      summary_info: {
        model_name: requestData.spec?.model || 'iPhone 16 Pro',
        average_price: averagePrice,
        highest_listing_price: maxPrice + 100000,
        lowest_listing_price: minPrice - 50000,
        listing_count: totalListingCount,
        data_date: '2025-10-31 11:00',
      },
      regional_analysis: {
        detail_by_district: detailByDistrict,
      },
      price_trend: {
        trend_period: WEEKS_TO_DISPLAY,
        change_rate: -3.5,
        chart_data: generatePriceTrendData(),
      },
      lowest_price_listings: mockListings,
    },
  };
};
