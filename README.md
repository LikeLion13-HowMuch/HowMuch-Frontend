# HowMuch? - Frontend

React + Vite + JavaScript 기반, '얼마야?' 프론트엔드 레포입니다.

---

## 📌 Tech Stack

- React (Vite + JavaScript)
- Node.js **20.19.0**
- npm (패키지 매니저 통일)
- 주요 패키지들 : tailwindcss 4.1.13 : (v3과는 다른 설치 방법 필요) / axios / react-router-dom / prettier / husky / ESLint
- pre-commit 이용해서 git commit만 해도 모두 동일한 형식으로 prettier & ESLint 적용

---

## 🛠️ Development Setup

### 1. Node.js 버전 맞추기

```bash
nvm install 20.19.0
nvm use 20.19.0
node -v   # v20.19.0 확인
npm -v    # 예: 10.8.2
```

### 2. 프로젝트 클론 & 의존성 설치

```bash
git clone https://github.com/LikeLion13-HowMuch/HowMuch-Frontend.git
cd HowMuch-Frontend

# 의존성 설치 (lock 파일 기준, 재현 가능한 설치)
npm ci
```

### 3. 개발 서버 실행

```bash
npm run dev
```

실행 후 브라우저에서 http://localhost:5173
확인

## 📂 폴더 구조

- src/assets/react.svg 같은 필요 없는 파일들 삭제 완료.

## 🌱 브랜치 전략

## ✍️ 커밋 메시지 컨벤션

### 타입

- `feat` : 새로운 기능 추가
- `fix` : 버그 수정
- `docs` : 문서 수정
- `style` : 코드 포맷팅 (세미콜론, 띄어쓰기 등 비즈니스 로직에 영향 없는 변경)
- `refactor` : 코드 리팩토링
- `test` : 테스트 코드 추가/수정
- `chore` : 빌드/패키지 관리 변경 등 기타 잡무
- `comment` : 주석 추가/수정
- `rename` : 파일 혹은 폴더명을 수정하거나 옮기는 작업

### 예시

- feat: 로그인 페이지 UI 구현
- fix: 헤더 네비게이션 버그 수정
- docs: README 설치 방법 업데이트
- style: prettier 적용
- refactor: API 호출 로직 공통 함수로 분리
