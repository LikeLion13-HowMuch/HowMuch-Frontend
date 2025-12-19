import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const ITEMS_PER_PAGE = 7;

/**
 * 최저가 매물 리스트 컴포넌트
 * @param {Object} props
 * @param {Array} props.listings - 매물 배열
 * @param {string} props.district - 동 이름 (선택사항)
 * @param {string} props.city - 시/구 이름 (선택사항)
 * @param {string} props.province - 시/도 이름 (선택사항)
 */
export default function LowestPriceListings({ listings = [], district, city, province }) {
  const [currentPage, setCurrentPage] = useState(1);

  // listings가 변경되면 첫 페이지로 리셋
  useEffect(() => {
    setCurrentPage(1);
  }, [listings]);

  const totalPages = Math.ceil(listings.length / ITEMS_PER_PAGE) || 1;
  const paginatedListings = listings.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const formatPrice = (price) => {
    return price.toLocaleString('ko-KR');
  };

  // 지역 표시명 생성 (서울특별시만 선택했을 때 "서울"로 표시)
  const getLocationDisplayName = () => {
    if (district) return district;
    if (city) return city;
    // province만 있는 경우 (예: 서울특별시 -> 서울)
    if (province === '서울특별시') return '서울';
    return province || '';
  };

  const title = `${getLocationDisplayName()}의 현재 최저가 매물`;

  // 출처에 따른 플랫폼 정보 가져오기
  const getPlatformInfo = (source) => {
    const sourceLower = source?.toLowerCase() || '';

    if (sourceLower.includes('당근')) {
      return {
        color: '#FF7E32', // 당근마켓 오렌지
        logo: '/carrot.png',
        hoverBg: '#FFF4ED', // 어두운 파스텔톤 오렌지
        isBunjang: false,
      };
    } else if (sourceLower.includes('번개')) {
      return {
        color: '#FF1439', // 번개장터 빨간색
        logo: '/bunjang.png',
        hoverBg: '#FFEBED', // 어두운 파스텔톤 빨간색
        isBunjang: true,
      };
    } else if (sourceLower.includes('중고나라') || sourceLower.includes('중고나라')) {
      return {
        color: '#2DB400', // 중고나라 초록색
        logo: '/nara.png',
        hoverBg: '#EDF9E8', // 어두운 파스텔톤 초록색
        isBunjang: false,
      };
    }

    // 기본값
    return {
      color: '#0071e3',
      logo: null,
      hoverBg: '#f5f5f7',
      isBunjang: false,
    };
  };

  return (
    <section className="mb-0">
      <h2 className="mb-10 text-left text-3xl font-semibold tracking-tight">{title}</h2>
      <div className="flex flex-col gap-4">
        {paginatedListings.map((listing, index) => {
          const platformInfo = getPlatformInfo(listing.source);

          return (
            <a
              key={`${listing.source}-${listing.source_url}-${index}`}
              href={listing.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="relative flex cursor-pointer items-center rounded-xl p-4 transition-colors"
              style={{
                backgroundColor: 'transparent',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = platformInfo.hoverBg;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              {platformInfo.logo && (
                <img
                  src={platformInfo.logo}
                  alt={`${listing.source} 로고`}
                  className={`mr-4 flex-shrink-0 ${platformInfo.isBunjang ? 'h-15 w-15' : 'h-15 w-15'}`}
                />
              )}
              <div className="flex-grow">
                <p className="m-0 mb-1 text-lg font-bold">₩{formatPrice(listing.listing_price)}</p>
                <p className="m-0 text-sm text-[#86868b]">{listing.district_detail}</p>
                <p className="m-0 mt-1 text-xs font-semibold" style={{ color: platformInfo.color }}>
                  출처: {listing.source}
                </p>
              </div>
            </a>
          );
        })}
      </div>
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-1 text-sm font-semibold text-[#6e6e73]">
          <button
            type="button"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-2 py-1 transition-all ${
              currentPage === 1 ? 'cursor-not-allowed text-[#d2d2d7]' : 'hover:text-[#1d1d1f]'
            }`}
          >
            &#60;
          </button>
          {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => handlePageChange(page)}
              className={`px-2 py-1 text-base transition-all ${
                currentPage === page ? 'text-[#1d1d1f]' : 'text-[#6e6e73] hover:text-[#1d1d1f]'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            type="button"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-2 py-1 transition-all ${
              currentPage === totalPages
                ? 'cursor-not-allowed text-[#d2d2d7]'
                : 'hover:text-[#1d1d1f]'
            }`}
          >
            &#62;
          </button>
        </div>
      )}
    </section>
  );
}

LowestPriceListings.propTypes = {
  listings: PropTypes.arrayOf(
    PropTypes.shape({
      listing_price: PropTypes.number.isRequired,
      district_detail: PropTypes.string.isRequired,
      source: PropTypes.string.isRequired,
      source_url: PropTypes.string.isRequired,
    }),
  ),
  district: PropTypes.string,
  city: PropTypes.string,
  province: PropTypes.string,
};
