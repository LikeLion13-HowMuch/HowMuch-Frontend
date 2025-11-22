import axios from 'axios';

// API Base URL (환경변수로 관리 가능)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
// 없으면 그냥 로컬호스트로 관리됨.

// 실제 연결시에 쓸 API 함수
/**
 * 시세 분석 데이터 조회 API
 * @param {Object} requestData - API 요청 데이터
 * @returns {Promise<Object>} - API 응답 데이터
 */
export const getPriceAnalysis = async (requestData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/v1/products/price`, requestData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
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

  // 더미 데이터 반환
  return {
    status: 'success',
    data: {
      summary_info: {
        model_name: requestData.spec?.model || 'iPhone 16 Pro',
        average_price: 1250000,
        highest_listing_price: 1400000,
        lowest_listing_price: 1050000,
        listing_count: 104,
        data_date: '2025-10-31 11:00',
      },
      regional_analysis: {
        detail_by_district: [
          {
            emd: requestData.region?.emd || '신림동',
            average_price: 1250000,
            listing_count: 20,
          },
          {
            emd: '봉천동',
            average_price: 1280000,
            listing_count: 18,
          },
          {
            emd: '남현동',
            average_price: 1220000,
            listing_count: 22,
          },
          {
            emd: '사당동',
            average_price: 1300000,
            listing_count: 15,
          },
          {
            emd: '대학동',
            average_price: 1180000,
            listing_count: 25,
          },
        ],
      },
      price_trend: {
        trend_period: 7,
        change_rate: -4.5,
        chart_data: [
          { period: '1월 1주', price: 1320000 },
          { period: '1월 2주', price: 1280000 },
          { period: '1월 3주', price: 1250000 },
          { period: '1월 4주', price: 1230000 },
          { period: '2월 1주', price: 1240000 },
          { period: '2월 2주', price: 1255000 },
          { period: '2월 3주', price: 1260000 },
        ],
      },
      lowest_price_listings: [
        {
          listing_price: 1150000,
          district_detail: `${requestData.region?.sgg || '관악구'} ${requestData.region?.emd || '신림동'}`,
          source: '당근마켓',
          source_url: 'https://www.daangn.com/articles/12345',
        },
        {
          listing_price: 1155000,
          district_detail: `${requestData.region?.sgg || '관악구'} ${requestData.region?.emd || '신림동'}`,
          source: '번개장터',
          source_url: 'https://www.bunjang.co.kr/products/12345',
        },
        {
          listing_price: 1160000,
          district_detail: `${requestData.region?.sgg || '관악구'} ${requestData.region?.emd || '신림동'}`,
          source: '중고나라',
          source_url: 'https://web.joongna.com/product/12345',
        },
        {
          listing_price: 1160000,
          district_detail: `${requestData.region?.sgg || '관악구'} ${requestData.region?.emd || '신림동'}`,
          source: '당근마켓',
          source_url: 'https://www.daangn.com/articles/67890',
        },
        {
          listing_price: 1165000,
          district_detail: `${requestData.region?.sgg || '관악구'} ${requestData.region?.emd || '신림동'}`,
          source: '번개장터',
          source_url: 'https://www.bunjang.co.kr/products/67890',
        },
      ],
    },
  };
};
