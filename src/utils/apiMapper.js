/**
 * SearchPage의 폼 데이터를 API 요청 형식으로 변환
 * @param {Object} formData - SearchPage에서 넘어온 state 데이터
 * @returns {Object} - API 요청 body
 */
export const mapFormDataToApiRequest = (formData) => {
  const {
    category,
    model,
    macbookModel,
    storage,
    color,
    connection,
    chipset,
    ram,
    ssd,
    series,
    size,
    material,
    location,
  } = formData;

  // 카테고리 매핑
  const productMap = {
    iphone: 'iPhone',
    ipad: 'iPad',
    macbook: 'MacBook',
    watch: 'AppleWatch',
    airpods: 'AirPods',
  };

  return {
    product: productMap[category] || category,
    spec: {
      model: model || macbookModel || null,
      storage: storage || null,
      color: color || null,
      chip: chipset || null,
      ram: ram || null,
      screen_size: null, // 현재 프론트에서 미수집
      size: size || null,
      material: material || null,
      connectivity: connection || null,
      cellular: connection || null, // iPad connectivity
      pencil_support: null, // 현재 프론트에서 미수집
    },
    region: {
      sd: location?.province || null,
      sgg: location?.city || null,
      emd: location?.district || null,
    },
  };
};

/**
 * API 응답 데이터를 컴포넌트에서 사용하기 쉬운 형태로 변환 (선택적)
 * @param {Object} apiResponse - API 응답 데이터
 * @returns {Object} - 가공된 데이터
 */
export const mapApiResponseToViewModel = (apiResponse) => {
  if (!apiResponse || apiResponse.status !== 'success') {
    throw new Error('Invalid API response');
  }

  return apiResponse.data;
};
