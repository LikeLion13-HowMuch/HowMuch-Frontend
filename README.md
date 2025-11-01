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

프로젝트의 주요 폴더 구조는 다음과 같습니다.

```
/
├── public/
│   └── (정적 에셋 - 참조 이미지 등)
├── src/
│   ├── components/
│   │   └── (공통 컴포넌트)
│   ├── pages/
│   │   ├── SearchPage.jsx
│   │   └── DetailPage.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .gitignore
├── package.json
└── vite.config.js
```

- **`public/`**: 빌드 과정에 포함되지 않고 원본 그대로 유지될 정적 파일들을 위치시킵니다. (예: `index.html`에서 직접 참조하는 이미지, `robots.txt` 등)
- **`src/`**: 프로젝트의 핵심 소스 코드가 위치하는 곳입니다.
  - **`components/`**: 여러 페이지에서 공통으로 재사용될 UI 컴포넌트(예: Button, Header, Modal)를 관리합니다.
  - **`pages/`**: 애플리케이션의 각 페이지를 구성하는 컴포넌트(예: `SearchPage`, `DetailPage`)를 관리합니다.
  - **`App.jsx`**: 애플리케이션의 최상위 컴포넌트입니다. 라우팅 설정 및 전체 레이아웃 구조를 정의합니다.
  - **`main.jsx`**: React 애플리케이션의 진입점(Entry Point)으로, `App` 컴포넌트를 DOM에 렌더링하는 역할을 합니다.
  - **`index.css`**: 전역적으로 적용될 스타일을 정의합니다.

## 🌱 브랜치 전략

해당 프로젝트는 각 개발자의 작업 공간을 분리하는 브랜치 전략을 사용합니다. 이를 통해 작업 독립성을 보장하고, 코드 충돌을 최소화합니다.

- **`main`**: 항상 최종 배포 가능한 상태를 유지하는 **메인 브랜치**입니다. 모든 기능이 테스트되고 안정화된 코드만 이 브랜치에 병합됩니다.

- **`dev/{이름}`**: 각 개발자가 자신의 작업을 진행하는 **개인 개발 브랜치**입니다.
  - 예시: `dev/moo`, `dev/eunsung`
  - 이 브랜치에서 자유롭게 기능을 개발하고, 자신의 작업물을 관리합니다.

#### 👩‍💻 개발 프로세스

1.  **개인 개발 브랜치 생성 (최초 1회)**: `main` 브랜치를 기준으로 자신의 개인 개발 브랜치를 생성합니다.

    ```bash
    # 'moo' 개발자의 경우
    git checkout -b dev/moo
    git push origin dev/moo
    ```

2.  **개발 진행**: 자신의 개인 개발 브랜치에서 자유롭게 코드를 추가하고 커밋하며 기능을 완성해 나갑니다.

    ```bash
    git checkout dev/moo
    # ... 코드 작업 및 커밋 ...
    git push origin dev/moo
    ```

3.  **`main` 브랜치와 동기화**: 다른 팀원의 작업물이 `main`에 병합되면, 자신의 개인 개발 브랜치에 최신 코드를 반영하여 충돌을 방지합니다.

    ```bash
    # 1. main 브랜치의 최신 코드를 가져옵니다.
    git checkout main
    git pull origin main

    # 2. 내 개인 개발 브랜치로 이동하여 main의 변경사항을 병합합니다.
    git checkout dev/moo
    git merge main
    ```

    > ❗️ **Tip**: `main`으로 통합(PR)하기 전에 이 과정을 진행하면 좋습니다.

4.  **Pull Request (PR) 생성**: 개인 브랜치에서 기능 개발이 완료되면, `main` 브랜치로 병합하기 위해 **Pull Request**를 생성합니다.
    - PR의 제목과 설명에 어떤 기능이 추가되었는지 명확하게 작성합니다.
    - 팀원들의 코드 리뷰를 거친 후 `main` 브랜치에 병합합니다.

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
