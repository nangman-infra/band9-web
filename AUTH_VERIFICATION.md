# 인증 시스템 확인 가이드

## 1. Axios 설정 확인 ✅

`src/services/authService.ts` 파일에서 `withCredentials: true`가 설정되어 있는지 확인:

```typescript
export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // ✅ 쿠키 자동 전송 설정됨
  headers: {
    'Content-Type': 'application/json',
  },
});
```

**현재 상태**: ✅ 올바르게 설정되어 있습니다.

## 2. 브라우저 개발자 도구에서 쿠키 확인

### Chrome/Edge 개발자 도구
1. 브라우저에서 `F12` 또는 `Cmd+Option+I` (Mac) / `Ctrl+Shift+I` (Windows)로 개발자 도구 열기
2. **Application** 탭 클릭
3. 왼쪽 사이드바에서 **Cookies** 확장
4. `http://localhost:3000` 또는 백엔드 도메인 선택
5. 다음 쿠키가 있는지 확인:
   - `accessToken` (HttpOnly 쿠키)
   - `refreshToken` (HttpOnly 쿠키)

### Firefox 개발자 도구
1. `F12`로 개발자 도구 열기
2. **Storage** 탭 클릭
3. 왼쪽에서 **Cookies** 확장
4. `http://localhost:3000` 선택
5. 쿠키 목록 확인

### 확인 사항
- ✅ `accessToken` 쿠키가 존재하는가?
- ✅ `refreshToken` 쿠키가 존재하는가?
- ✅ 쿠키의 `HttpOnly` 플래그가 설정되어 있는가? (보안상 중요)
- ✅ 쿠키의 `Secure` 플래그가 설정되어 있는가? (HTTPS 사용 시)
- ✅ 쿠키의 `SameSite` 속성이 적절한가? (보통 `Lax` 또는 `None`)

## 3. 네트워크 요청에서 쿠키 전송 확인

### 개발자 도구 Network 탭 확인
1. 개발자 도구에서 **Network** 탭 열기
2. Google 로그인 후 API 요청 선택
3. **Headers** 섹션 확인
4. **Request Headers**에서 `Cookie` 헤더 확인:
   ```
   Cookie: accessToken=...; refreshToken=...
   ```

### 확인 사항
- ✅ 요청 헤더에 `Cookie`가 포함되어 있는가?
- ✅ `accessToken`과 `refreshToken`이 쿠키에 포함되어 있는가?

## 4. 서버 로그 확인

백엔드 서버 콘솔에서 다음 로그를 확인:

### 쿠키 전송 확인
```
Cookies: { accessToken: '...', refreshToken: '...' }
```

### Access Token 확인
```
AccessToken from cookie: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 확인 사항
- ✅ 서버 로그에 쿠키가 전송되는가?
- ✅ `accessToken`이 쿠키에서 추출되는가?
- ✅ 토큰 검증이 성공하는가?

## 5. 인증 플로우 테스트

### 테스트 시나리오

1. **로그인 테스트**
   - `/login` 페이지 접속
   - "Google로 로그인" 버튼 클릭
   - Google 로그인 완료
   - ✅ 쿠키가 설정되고 홈으로 리다이렉트되는가?

2. **인증 상태 확인 테스트**
   - 로그인 후 페이지 새로고침
   - ✅ 인증 상태가 유지되는가?
   - ✅ 쿠키가 여전히 존재하는가?

3. **보호된 페이지 접근 테스트**
   - 로그아웃 후 보호된 페이지 접근 시도
   - ✅ 로그인 페이지로 리다이렉트되는가?

4. **토큰 갱신 테스트**
   - Access Token 만료 후 API 호출
   - ✅ 자동으로 토큰이 갱신되는가?
   - ✅ 원래 요청이 재시도되는가?

5. **로그아웃 테스트**
   - 로그아웃 버튼 클릭
   - ✅ 쿠키가 삭제되는가?
   - ✅ 로그인 페이지로 리다이렉트되는가?

## 6. CORS 설정 확인

백엔드에서 CORS 설정이 올바른지 확인:

```typescript
// 백엔드 예시 (NestJS)
app.enableCors({
  origin: 'http://localhost:5173', // 프론트엔드 URL
  credentials: true, // ✅ 쿠키 전송 허용 필수!
});
```

### 확인 사항
- ✅ `credentials: true`가 설정되어 있는가?
- ✅ `origin`이 프론트엔드 URL과 일치하는가?

## 7. 환경 변수 확인

프론트엔드 환경 변수 확인:

```bash
# .env 파일 또는 환경 변수
VITE_API_BASE_URL=http://localhost:3000
```

### 확인 사항
- ✅ `VITE_API_BASE_URL`이 올바르게 설정되어 있는가?
- ✅ 개발 환경과 프로덕션 환경의 URL이 올바른가?

## 8. 문제 해결

### 쿠키가 전송되지 않는 경우

1. **브라우저 설정 확인**
   - 쿠키가 차단되어 있지 않은지 확인
   - 시크릿 모드에서 테스트

2. **도메인 확인**
   - 프론트엔드와 백엔드 도메인이 다른 경우 CORS 설정 확인
   - `localhost`와 `127.0.0.1`은 다른 도메인으로 인식됨

3. **HTTPS/HTTP 확인**
   - `Secure` 플래그가 설정된 쿠키는 HTTPS에서만 전송됨
   - 개발 환경에서는 HTTP 사용 시 `Secure` 플래그 제거 필요

4. **SameSite 설정 확인**
   - `SameSite=None`인 경우 `Secure` 플래그 필수
   - 크로스 사이트 요청 시 `SameSite=None` 필요

## 9. 디버깅 팁

### 콘솔 로그 추가
```typescript
// authService.ts에 추가
api.interceptors.request.use((config) => {
  console.log('[Axios Request]', config.url, 'withCredentials:', config.withCredentials);
  return config;
});
```

### 네트워크 요청 확인
- 개발자 도구 Network 탭에서 요청 상세 정보 확인
- Request Headers에서 `Cookie` 헤더 확인
- Response Headers에서 `Set-Cookie` 헤더 확인

## 10. 체크리스트

- [ ] Axios `withCredentials: true` 설정 확인
- [ ] 브라우저 개발자 도구에서 쿠키 확인
- [ ] Network 탭에서 쿠키 전송 확인
- [ ] 서버 로그에서 쿠키 수신 확인
- [ ] 로그인 플로우 테스트
- [ ] 토큰 갱신 테스트
- [ ] 로그아웃 테스트
- [ ] CORS 설정 확인
- [ ] 환경 변수 확인

