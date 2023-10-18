/**
 * FILENAME   : google.tsx
 * PURPOSE    : 구글 로그인 컴포넌트
 * AUTHOR     : Lee Juhong
 * CREATEDATE : 2023-10-10
 * UPDATEDATE : 2023-10-12 / GoggleOAuthProvider 이동 / Lee Juhong
 * UPDATEDATE : 2023-10-17 / Auth 명칭 변경 / Lee Juhong
 * UPDATEDATE : 2023-10-17 / AUTH API 호출 추가 / Lee Juhong
 */

import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google'

import { AUTH_SIGNIN_QUERY_KEY, GOOGLE_CLIENT_ID } from '@@constants/Auth'

export default function Google() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div style={{ display: 'flex' }}>
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            fetch(
              `${AUTH_SIGNIN_QUERY_KEY}?credential=${credentialResponse.credential}`,
            )
              .then((res) => res.json())
              .then((data) => console.log(data))
          }}
          onError={() => {
            console.log('Login Failed')
          }}
        />
      </div>
    </GoogleOAuthProvider>
  )
}
