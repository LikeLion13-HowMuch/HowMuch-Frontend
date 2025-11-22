import csv
import json
import re

csv_file_path = 'HowMuch-Frontend/public/202510_202510_주민등록인구및세대현황_월간.csv'
json_file_path = 'HowMuch-Frontend/public/locations_final.json'

# 데이터 구조를 담을 딕셔너리
# { "경기도": { "수원시 장안구": ["파장동", ...], ... }, ... }
data_map = {}

def parse_location():
    with open(csv_file_path, 'r', encoding='utf-8') as f:
        # CSV 리더 사용 (큰따옴표 처리 등)
        reader = csv.reader(f)
        next(reader) # 헤더 건너뛰기 (행정구역, 2025년10월_총인구수...)

        for row in reader:
            if not row: continue
            
            # 1열: "서울특별시 종로구 청운효자동(1111051500)"
            raw_text = row[0]
            
            # 정규식으로 이름과 코드 분리
            # 예: "서울특별시 종로구 청운효자동(1111051500)" -> name="서울특별시 종로구 청운효자동", code="1111051500"
            match = re.match(r'^(.*)\((\d+)\)$', raw_text)
            if not match:
                continue
            
            full_name = match.group(1).strip()
            code = match.group(2)
            
            # 행정동 코드 분석 (읍면동 레벨만 처리)
            # 시/도: 뒤 8자리가 0 (xx00000000)
            # 시/군/구: 뒤 5자리가 0 (xxxxx00000)
            # 읍/면/동: 뒤 5자리가 0이 아님 (xxxxxnnnnn)
            # 세종시 예외: 3611000000 (세종특별자치시) -> 시군구 레벨로 취급되지만 실제론 더미일 수 있음
            
            if code.endswith("00000"):
                continue
                
            # 공백으로 분리
            parts = full_name.split()
            
            if len(parts) < 2:
                continue
                
            province = parts[0] # 시/도 (예: 서울특별시, 경기도)
            district = parts[-1] # 읍/면/동 (예: 청운효자동, 파장동)
            
            # 시/군/구 추출 (중간 부분)
            if province == "세종특별자치시":
                # 세종시는 중간에 시군구가 없음. "세종특별자치시 조치원읍" -> parts=["세종특별자치시", "조치원읍"]
                # 기존 구조 유지를 위해 city를 "세종시"로 고정
                city = "세종시"
                # parts가 2개인 경우 district는 parts[1]
                # parts가 3개인 경우 (혹시 모를 예외) district는 parts[-1]
                district = parts[-1] 
            else:
                # 일반적인 경우: "경기도 수원시 장안구 파장동" -> city="수원시 장안구"
                # "서울특별시 종로구 청운효자동" -> city="종로구"
                city_parts = parts[1:-1]
                if not city_parts:
                    # 예외: "제주특별자치도 (5000...)" 같은게 아니라
                    # 혹시라도 "시도 읍면동" 바로 나오는 케이스가 있다면? (세종 제외하곤 거의 없음)
                    continue
                city = " ".join(city_parts)
            
            # 데이터 담기
            if province not in data_map:
                data_map[province] = {}
            
            if city not in data_map[province]:
                data_map[province][city] = []
                
            if district not in data_map[province][city]:
                data_map[province][city].append(district)

    # JSON 구조로 변환
    result = []
    
    # 시/도 순서 보장을 위해 정렬 (가나다순 or 원본 데이터 순서가 좋으나 여기선 가나다순)
    for province in sorted(data_map.keys()):
        cities_list = []
        
        for city in sorted(data_map[province].keys()):
            districts = sorted(data_map[province][city])
            cities_list.append({
                "name": city,
                "districts": districts
            })
            
        result.append({
            "name": province,
            "cities": cities_list
        })
        
    return result

def save_json(data):
    with open(json_file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"Successfully saved to {json_file_path}")

if __name__ == "__main__":
    try:
        data = parse_location()
        save_json(data)
    except Exception as e:
        print(f"Error: {e}")
