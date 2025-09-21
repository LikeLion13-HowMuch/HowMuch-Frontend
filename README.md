# HowMuch? - Frontend

React + Vite + JavaScript 기반, '얼마야?' 프론트엔드 레포입니다.

---

## 📌 Tech Stack

- React (Vite + JavaScript)
- Node.js **20.19.0**
- npm (패키지 매니저 통일)
- 주요 패키지들 : tailwindcss 4.1.13 : (v3과는 다른 설치 방법 필요) / axios / react-router-dom / prettier(vscode prettier보다 우선 순위, husky 이용해서 pre-commit에서 적용) / ESLint

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
