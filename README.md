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

| 분류            | 기술                                                                                                              | 용도                               |
| --------------- | ----------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| 서버 상태       | ![React Query](https://img.shields.io/badge/React_Query-FF4154?style=flat-square&logo=reactquery&logoColor=white) | 데이터 캐싱 · 로딩 · 에러 · 재시도 |
| 클라이언트 상태 | ![Zustand](https://img.shields.io/badge/Zustand-443E38?style=flat-square&logo=react&logoColor=white)              | 세션 · 선택 장소 · UI 상태         |

### 핵심 기능

| 분류          | 기술                                                                                                                                                                                                                    | 용도                       |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| 지도          | ![Kakao Maps](https://img.shields.io/badge/react--kakao--maps--sdk-FFCD00?style=flat-square&logo=kakao&logoColor=black)                                                                                                 | 코스 · 탐험 · 밝힌 지도    |
| 실시간        | ![Socket.io](https://img.shields.io/badge/socket.io--client-010101?style=flat-square&logo=socketdotio&logoColor=white)                                                                                                  | 팀원 현황 · 방문 인증 전파 |
| 애니메이션    | ![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=flat-square&logo=framer&logoColor=white)                                                                                                       | 스와이프 · 게이미피케이션  |
| 드래그앤드롭  | ![dnd-kit](https://img.shields.io/badge/dnd--kit-2C2C2A?style=flat-square&logo=react&logoColor=white)                                                                                                                   | 코스 순서 변경             |
| 폼 · 검증     | ![React Hook Form](https://img.shields.io/badge/React_Hook_Form-EC5990?style=flat-square&logo=reacthookform&logoColor=white) ![Zod](https://img.shields.io/badge/Zod-3E67B1?style=flat-square&logo=zod&logoColor=white) | 입력 관리 · 스키마 검증    |
| 날짜          | ![date-fns](https://img.shields.io/badge/date--fns-770C56?style=flat-square&logo=datefns&logoColor=white)                                                                                                               | 시간 계산 · 정렬           |
| 조건부 스타일 | ![clsx](https://img.shields.io/badge/clsx-2C2C2A?style=flat-square) ![tailwind-merge](https://img.shields.io/badge/tailwind--merge-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)                           | 흑백↔컬러 전환 등          |

### 개발 · 협업

| 분류      | 기술                                                                                                                                                                                                          | 용도                  |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| 코드 품질 | ![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=flat-square&logo=eslint&logoColor=white) ![Prettier](https://img.shields.io/badge/Prettier-F7B93E?style=flat-square&logo=prettier&logoColor=black) | 검사 · 포맷 자동화    |
| Git Hook  | ![Husky](https://img.shields.io/badge/Husky-42B983?style=flat-square&logo=git&logoColor=white) ![lint-staged](https://img.shields.io/badge/lint--staged-2C2C2A?style=flat-square)                             | 커밋 전 자동 검사     |
| API 모킹  | ![MSW](https://img.shields.io/badge/MSW-FF6A33?style=flat-square&logo=mockserviceworker&logoColor=white)                                                                                                      | 백엔드 없이 병렬 개발 |
| 에러 처리 | ![React Error Boundary](https://img.shields.io/badge/react--error--boundary-61DAFB?style=flat-square&logo=react&logoColor=black)                                                                              | 컴포넌트 단위 폴백    |
| 배포      | ![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)                                                                                                           | push 자동 배포        |

---

## 개발 환경 세팅

### 0. 사전 준비

- **Node.js** 설치 (LTS 버전 권장). 설치 확인:
  ```bash
  node -v
  npm -v
  ```

### 1. 저장소 가져오기

fork 워크플로우를 쓰는 경우:

1. GitHub에서 팀 레포(`theTemperatureOfMay/beyond-may-fe`)를 본인 계정으로 **Fork**
2. 본인 fork를 clone:
   ```bash
   git clone https://github.com/본인계정/beyond-may-fe.git
   cd beyond-may-fe
   ```
3. 팀 레포를 upstream으로 연결 (최신 코드 받아오기용):
   ```bash
   git remote add upstream https://github.com/theTemperatureOfMay/beyond-may-fe.git
   ```
4. 연결 확인 (origin=내 fork / upstream=팀 레포, 4줄 나오면 정상):
   ```bash
   git remote -v
   ```

### 2. 패키지 설치

```bash
npm install
```

> husky(커밋 전 자동 검사)도 `npm install` 시 자동 설정됩니다.

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000` 접속. 화면이 뜨면 성공.

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

## 협업 흐름 (fork 워크플로우)

```bash
# 1. 팀 레포 최신 코드 받기
git pull upstream main

# 2. 기능 브랜치 생성 (main에서 직접 작업하지 않기)
git checkout -b feature/기능명

# 3. 작업 후 커밋
git add .
git commit -m "feat: 작업 내용"

# 4. 내 fork에 push
git push origin feature/기능명

# 5. GitHub에서 팀 레포로 Pull Request 생성 → 리뷰 → merge
```

---

## 폴더 구조

```
app/          # 라우팅 (page.tsx, layout.tsx)
features/     # 기능별 모듈 (onboarding, places, course, explore, record)
components/   # 공용 컴포넌트 (map, place-detail, share-sheet, ui)
lib/          # 유틸 (cn, env, queryClient, api, socket)
stores/       # Zustand 스토어
hooks/        # 공용 훅
types/        # 공유 타입 (인터페이스 계약)
mocks/        # msw 핸들러
data/         # 정적 데이터 (성향 검사 질문 등)
```
