"""행정구역 CSV를 계층형 JSON 구조로 변환하는 스크립트."""

import csv
import json
from collections import defaultdict
from pathlib import Path


CSV_FILENAME = "국토교통부_전국 법정동_20250807.csv"
OUTPUT_FILENAME = "locations_final.json"


def load_rows(csv_path: Path):
  """CSV 파일을 불러와 공백이 제거된 행 딕셔너리를 생성한다."""
  with csv_path.open(encoding="utf-8-sig", newline="") as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
      yield {key: (value or "").strip() for key, value in row.items()}


def format_city_name(name: str) -> str:
  """구/군 이름을 포함한 시 명칭에 가독성 있는 공백을 추가한다."""
  if not name:
    return name

  if " " in name:
    return name

  # e.g. 고양시덕양구 → 고양시 덕양구
  if "시" in name and "구" in name:
    si_index = name.find("시")
    return f"{name[:si_index + 1]} {name[si_index + 1:]}"

  if "시" in name and "군" in name:
    si_index = name.find("시")
    return f"{name[:si_index + 1]} {name[si_index + 1:]}"

  return name


def build_hierarchy(rows):
  """시도 → 시군구 → 읍면동 계층 구조를 생성한다."""
  hierarchy = defaultdict(lambda: defaultdict(set))

  for row in rows:
    # 삭제일자가 존재하면 이미 폐지된 행정구역이므로 제외
    if row.get("삭제일자"):
      continue

    province = row.get("시도명")
    city = row.get("시군구명")
    district = row.get("읍면동명")

    # 시도/시군구 정보가 비어 있으면 계층 구조를 만들 수 없음
    if not province or not city:
      continue

    if district:
      hierarchy[province][city].add(district)
    else:
      # 읍면동이 비어 있으면, 해당 시군구만 등록 (set 초기화 목적)
      hierarchy[province][city]

  sorted_hierarchy = []

  for province in sorted(hierarchy):
    cities = []
    for city in sorted(hierarchy[province]):
      districts = sorted(hierarchy[province][city])
      if not districts:
        # 실질적으로 하위 구가 있는 시(예: 고양시)와 구 단위 항목을 분리하기 위해
        # 동/읍/면 정보가 없는 항목은 옵션에서 제외한다.
        continue

      cities.append(
        {
          "name": format_city_name(city),
          "districts": districts,
        }
      )

    sorted_hierarchy.append(
      {
        "name": province,
        "cities": cities,
      }
    )

  return sorted_hierarchy


def write_json(data, output_path: Path):
  """계층 구조 데이터를 JSON 파일로 저장한다."""
  with output_path.open("w", encoding="utf-8") as jsonfile:
    json.dump(data, jsonfile, ensure_ascii=False, indent=2)


def main():
  """CSV → JSON 변환 전체 흐름을 수행한다."""
  base_path = Path(__file__).resolve().parent
  csv_path = base_path / CSV_FILENAME
  output_path = base_path / OUTPUT_FILENAME

  if not csv_path.exists():
    raise FileNotFoundError(f"CSV 파일을 찾을 수 없습니다: {csv_path}")

  rows = load_rows(csv_path)
  hierarchy = build_hierarchy(rows)
  write_json(hierarchy, output_path)
  print(f"행정구역 JSON 생성 완료: {output_path}")


if __name__ == "__main__":
  main()

