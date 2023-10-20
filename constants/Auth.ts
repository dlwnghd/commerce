/**
 * FILENAME   : Auth.ts
 * PURPOSE    : OAuth 클라이언트 정보 호출
 * AUTHOR     : Lee Juhong
 * CREATEDATE : 2023-10-10
 * UPDATEDATE : 2023-10-18 / AuthSignIn Query키 호출형 추가 / Lee Juhong
 * UPDATEDATE : 2023-10-20 / env파일 변수명 수정(CSR) / Lee Juhong
 */

// GOOGLE
export const NEXT_PUBLIC_GOOGLE_CLIENT_ID = String(
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
)
export const NEXT_PUBLIC_GOOGLE_CLIENT_SECRET = String(
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
)

// KAKAO
export const NEXT_PUBLIC_KAKAO_CLIENT_ID = String(
  process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID,
)
export const NEXT_PUBLIC_KAKAO_CLIENT_SECRET = String(
  process.env.NEXT_PUBLIC_KAKAO_CLIENT_SECRET,
)

// NAVER
export const NEXT_PUBLIC_NAVER_CLIENT_ID = String(
  process.env.NEXT_PUBLIC_NAVER_CLIENT_ID,
)
export const NEXT_PUBLIC_NAVER_CLIENT_SECRET = String(
  process.env.NEXT_PUBLIC_NAVER_CLIENT_SECRET,
)

// AUTH_API_QUERY
export const AUTH_SIGNIN_QUERY_KEY = '/api/auth/sign-in'
