/**
 * FILENAME   : Auth.ts
 * PURPOSE    : OAuth 클라이언트 정보 호출
 * AUTHOR     : Lee Juhong
 * CREATEDATE : 2023-10-10
 * UPDATEDATE : 2023-10-18 / AuthSignIn Query키 호출형 추가 / Lee Juhong
 */

// GOOGLE
export const GOOGLE_CLIENT_ID = String(process.env.GOOGLE_CLIENT_ID)
export const GOOGLE_CLIENT_SECRET = String(process.env.GOOGLE_CLIENT_SECRET)

// KAKAO
export const KAKAO_CLIENT_ID = String(process.env.KAKAO_CLIENT_ID)
export const KAKAO_CLIENT_SECRET = String(process.env.KAKAO_CLIENT_SECRET)

// NAVER
export const NAVER_CLIENT_ID = String(process.env.NAVER_CLIENT_ID)
export const NAVER_CLIENT_SECRET = String(process.env.NAVER_CLIENT_SECRET)

// AUTH_API_QUERY
export const AUTH_SIGNIN_QUERY_KEY = '/api/auth/sign-in'
