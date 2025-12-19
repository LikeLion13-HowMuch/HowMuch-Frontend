/**
 * null, undefined, 빈 문자열("") 필드를 제거하는 유틸 함수
 */
const removeNullFields = (obj) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v !== null && v !== '' && v !== undefined),
  );
};

/**
 * 영어 모델명을 → 서버가 인식하는 한국어 모델명으로 변환
 */
const modelKoreanMap = {
  'iPhone 17 Pro Max': '아이폰 17 프로 맥스',
  'iPhone 17 Pro': '아이폰 17 프로',
  'iPhone 17': '아이폰 17',
  'iPhone Air': '아이폰 에어',
  'iPhone 16': '아이폰 16',
  'iPhone 16 Pro': '아이폰 16 프로',
  'iPhone 16 Pro Max': '아이폰 16 프로 맥스',
  'iPhone 16 +': '아이폰 16 플러스',
  'iPhone 16e': '아이폰 16e',
  'iPhone 15': '아이폰 15',
  'iPhone 15 Pro': '아이폰 15 프로',
  'iPhone 15 Pro Max': '아이폰 15 프로 맥스',
  'iPhone 15 +': '아이폰 15 플러스',
  'iPhone 14': '아이폰 14',
  'iPhone 14 Pro': '아이폰 14 프로',
  'iPhone 14 Pro Max': '아이폰 14 프로 맥스',
  'iPhone 14+': '아이폰 14 플러스',
  'iPhone 13': '아이폰 13',
  'iPhone 13 Pro': '아이폰 13 프로',
  'iPhone 13 Pro Max': '아이폰 13 프로 맥스',
  'iPhone 13 Mini': '아이폰 13 미니',
  'iPhone 12': '아이폰 12',
  'iPhone 12 Pro': '아이폰 12 프로',
  'iPhone 12 Pro Max': '아이폰 12 프로 맥스',
  'iPhone 12 Mini': '아이폰 12 미니',
};

/**
 * SearchPage → DetailPage → API Body 변환
 */
export const mapFormDataToApiRequest = (formData) => {
  const {
    category,
    model,
    macbookModel,
    storage,
    color,
    connection,
    pencilSupport,
    chipset,
    ram,
    ssd,
    series,
    size,
    material,
    location,
  } = formData;

  const productMap = {
    iphone: 'iPhone',
    ipad: 'iPad',
    macbook: 'MacBook',
    watch: 'AppleWatch',
    airpods: 'AirPods',
  };

  // 실제 사용할 model 선택
  const rawModel = model || macbookModel || series || null;

  // 영어 → 한국어 모델명 변환
  const convertedModel = modelKoreanMap[rawModel] || rawModel;

  // 1) 공통 스펙
  let spec = {
    model: convertedModel,
    storage: storage || null,
    color: color || null,
    chip: chipset || null,
    ram: ram || null,
    ssd: ssd || null,
    screen_size: null,
    size: size || null,
    material: material || null,
    connectivity: connection || null,
    cellular: connection || null,
    pencil_support: pencilSupport ? pencilSupport === 'true' : null,
  };

  // 2) null 제거
  spec = removeNullFields(spec);

  // 최종 API 요청 body
  return {
    product: productMap[category],

    spec,

    region: removeNullFields({
      sd: location?.province || null,
      sgg: location?.city || null,
      emd: location?.district || null,
    }),
  };
};
