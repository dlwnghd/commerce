// 구글 OAuth의 클라이언트 파일과 패스워드를 간결하게 호출하여 사용하기 위해 만든 파일

export const CLIENT_ID = String(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_KEY)
export const CLIENT_PW = String(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET_PW)
