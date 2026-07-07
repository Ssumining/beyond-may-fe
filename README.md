# Beyond May — Frontend

광주 5·18 테마 여행 앱 프론트엔드.

## 기술 스택

### 핵심

| 분류       | 기술                                                                                                                    | 용도                               |
| ---------- | ----------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| 프레임워크 | ![Next.js](<https://img.shields.io/badge/Next.js_(App_Router)-000000?style=flat-square&logo=nextdotjs&logoColor=white>) | 파일 기반 라우팅 · SSR · 배포      |
| 언어       | ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)         | 정적 타입으로 인터페이스 계약 강제 |
| 스타일     | ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)    | 유틸리티 퍼스트 CSS                |

### 상태 관리

| 분류              | 기술                                                                                                                    | 용도                               |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| 서버 상태         | ![React Query](https://img.shields.io/badge/React_Query-FF4154?style=flat-square&logo=reactquery&logoColor=white)       | 데이터 캐싱 · 로딩 · 에러 · 재시도 |
| 서버 상태(디버깅) | ![Devtools](https://img.shields.io/badge/React_Query_Devtools-FF4154?style=flat-square&logo=reactquery&logoColor=white) | 캐시 상태 시각화                   |
| 클라이언트 상태   | ![Zustand](https://img.shields.io/badge/Zustand-443E38?style=flat-square&logo=react&logoColor=white)                    | 세션 · 선택 장소 · UI 상태         |

### 통신

| 분류   | 기술                                                                                                                   | 용도                                      |
| ------ | ---------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| HTTP   | ![axios](https://img.shields.io/badge/axios-5A29E4?style=flat-square&logo=axios&logoColor=white)                       | REST API 통신 · 인터셉터로 토큰 자동 첨부 |
| 실시간 | ![Socket.io](https://img.shields.io/badge/socket.io--client-010101?style=flat-square&logo=socketdotio&logoColor=white) | 팀원 현황 · 방문 인증 전파                |

### 핵심 기능

| 분류          | 기술                                                                                                                                                                                                                    | 용도                                                 |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| 지도          | ![Kakao Maps](https://img.shields.io/badge/react--kakao--maps--sdk-FFCD00?style=flat-square&logo=kakao&logoColor=black)                                                                                                 | 코스 · 탐험 · 밝힌 지도                              |
| 애니메이션    | ![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=flat-square&logo=framer&logoColor=white)                                                                                                       | 스와이프 · 게이미피케이션                            |
| 드래그앤드롭  | ![dnd-kit](https://img.shields.io/badge/dnd--kit-2C2C2A?style=flat-square&logo=react&logoColor=white)                                                                                                                   | 코스 순서 변경                                       |
| 폼 · 검증     | ![React Hook Form](https://img.shields.io/badge/React_Hook_Form-EC5990?style=flat-square&logo=reacthookform&logoColor=white) ![Zod](https://img.shields.io/badge/Zod-3E67B1?style=flat-square&logo=zod&logoColor=white) | 입력 관리 · 스키마 검증 (@hookform/resolvers로 연결) |
| 날짜          | ![date-fns](https://img.shields.io/badge/date--fns-770C56?style=flat-square&logo=datefns&logoColor=white)                                                                                                               | 시간 계산 · 정렬                                     |
| 조건부 스타일 | ![clsx](https://img.shields.io/badge/clsx-2C2C2A?style=flat-square) ![tailwind-merge](https://img.shields.io/badge/tailwind--merge-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)                           | 흑백↔컬러 전환 등                                    |
| 에러 처리     | ![React Error Boundary](https://img.shields.io/badge/react--error--boundary-61DAFB?style=flat-square&logo=react&logoColor=black)                                                                                        | 컴포넌트 단위 에러 폴백                              |

### 개발 · 협업

| 분류      | 기술                                                                                                                                                                                                          | 용도                  |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| 코드 품질 | ![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=flat-square&logo=eslint&logoColor=white) ![Prettier](https://img.shields.io/badge/Prettier-F7B93E?style=flat-square&logo=prettier&logoColor=black) | 검사 · 포맷 자동화    |
| Git Hook  | ![Husky](https://img.shields.io/badge/Husky-42B983?style=flat-square&logo=git&logoColor=white) ![lint-staged](https://img.shields.io/badge/lint--staged-2C2C2A?style=flat-square)                             | 커밋 전 자동 검사     |
| API 모킹  | ![MSW](https://img.shields.io/badge/MSW-FF6A33?style=flat-square&logo=mockserviceworker&logoColor=white)                                                                                                      | 백엔드 없이 병렬 개발 |
| 배포      | ![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)                                                                                                           | push 자동 배포        |

---

## 개발 환경 세팅

### 0. 사전 준비

- Node.js 20 이상 권장 (LTS)
- **Node.js** 설치 (LTS 버전 권장). 설치 확인:
  ```bash
  node -v
  npm -v
  ```

### 1. 저장소 가져오기 (Fork 워크플로우)

```bash
# 1) GitHub에서 팀 레포(theTemperatureOfMay/beyond-may-fe)를 본인 계정으로 Fork

# 2) 본인 fork를 clone
git clone https://github.com/본인계정/beyond-may-fe.git
cd beyond-may-fe

# 3) 팀 레포를 upstream으로 연결 (최신 코드 받아오기용)
git remote add upstream https://github.com/theTemperatureOfMay/beyond-may-fe.git

# 4) 연결 확인 (origin=내 fork / upstream=팀 레포)
git remote -v
```

### 2. 패키지 설치

```bash
npm install
```

> `package-lock.json` 기준으로 설치되어 전원이 동일한 버전. husky(커밋 훅)도 자동 설정됨.

### 3. 환경변수 설정

`.env.example`을 복사해 `.env.local`을 만들고 값을 채운다.

```bash
# Windows
copy .env.example .env.local
# Mac/Linux
cp .env.example .env.local
```

```
NEXT_PUBLIC_KAKAO_MAP_KEY=     # 카카오 개발자 사이트 발급(JavaScript 키)
NEXT_PUBLIC_SOCKET_URL=        # 백엔드 WebSocket 주소 (백엔드 문의)
NEXT_PUBLIC_API_BASE_URL=      # 백엔드 REST API 주소 (백엔드 문의)
```

> `.env.local`은 git에 올리지 않는다(각자 본인 PC에만). 카카오 키는 발급 후 플랫폼에 `http://localhost:3000` 도메인 등록 필요.

### 4. 개발 서버 실행

```bash
npm run dev
```

`http://localhost:3000` 접속 → 화면이 뜨면 성공.

<br/>

---

## 협업 흐름 (Git Flow)

- **origin** = 내 fork (push하는 곳)
- **upstream** = 팀 레포 (pull로 최신 받기)
- 기본 브랜치: **develop** / 배포 브랜치: **main**

```bash
git pull upstream develop              # 1. 팀 최신 받기
git checkout -b feature/기능명          # 2. 기능 브랜치 생성 (develop에서)
git add . && git commit -m "feat: ..."  # 3. 작업·커밋
git push origin feature/기능명          # 4. 내 fork에 push
# 5. GitHub에서 팀 레포(develop)로 PR → 리뷰 → merge
```

<br/>

---

## 자주 쓰는 명령어

| 명령어                   | 설명                            |
| ------------------------ | ------------------------------- |
| `npm run dev`            | 개발 서버 실행 (localhost:3000) |
| `npm run build`          | 프로덕션 빌드                   |
| `npm run start`          | 빌드 결과 실행                  |
| `npm run lint`           | ESLint 검사                     |
| `npx prettier --write .` | 전체 코드 포맷 정리             |

> 커밋 시 ESLint·Prettier가 자동 실행 (husky + lint-staged)
> 포맷·lint 문제가 있으면 커밋이 막히거나 자동 수정

---

## 폴더 구조

```
app/          # 라우팅 (page.tsx, layout.tsx)
features/     # 기능별 모듈 (onboarding, places, course, explore, record)
components/   # 공용 컴포넌트 (map, place-detail, share-sheet, ui)
lib/          # 유틸 (cn, env, queryClient, socket)
services/     # API 계층 (lib/axios, constant/endpoint, api/*)
stores/       # Zustand 스토어
hooks/        # 공용 훅
types/        # 공유 타입 (인터페이스 계약)
mocks/        # msw 핸들러
data/         # 정적 데이터
```

---

### 담당 분배

| 담당   | 영역                                                                  |
| ------ | --------------------------------------------------------------------- |
| 김혜진 | 디자인 (리드) + features/onboarding · places · record + 공용 컴포넌트 |
| 조서연 | 디자인 + features/course + components/map (지도 베이스)               |
| 강수민 | features/explore + 실시간(socket)·GPS                                 |
