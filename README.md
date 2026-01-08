# Band9 Web

IELTS 공부용 서비스 Frontend 레포지터리입니다.
Author : junoshon

## 기술 스택

- **Node.js**: 22.x (LTS)
- **React**: 18.x (LTS)
- **Vite**: 5.x
- **TypeScript**: 5.x
- **패키지 매니저**: pnpm
- **스타일링**: Emotion (@emotion/react, @emotion/styled)
- **애니메이션**: Framer Motion
- **린팅**: ESLint v9+ (Airbnb 스타일 가이드)

## 시작하기

### 의존성 설치

```bash
pnpm install
```

### 개발 서버 실행

```bash
pnpm dev
```

### 빌드

```bash
pnpm build
```

### 린트 검사

```bash
pnpm lint
```

## 프로젝트 구조

```
src/
├── domains/          # Feature-based organization
│   └── user/        # User domain
│       ├── components/
│       ├── hooks/
│       └── index.ts
├── App.tsx
└── main.tsx
```

## 개발 가이드라인

- Airbnb JavaScript/React Style Guide 준수
- Feature-based 디렉토리 구조 사용
- 모든 경로는 절대 경로 사용
- Proxy를 통한 백엔드 API 호출






















