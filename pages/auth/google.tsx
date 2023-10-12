/**
 * FILENAME   : google.tsx
 * PURPOSE    : 구글 로그인 컴포넌트
 * AUTHOR     : Lee Juhong
 * CREATEDATE : 2023-10-10
 * UPDATEDATE : 2023-10-12 / GoggleOAuthProvider 이동 / Lee Juhong
 */

import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google'

import { CLIENT_ID } from '@@constants/googleAuth'

export default function Google() {
  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <div style={{ display: 'flex' }}>
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            fetch(
              `/api/auth/sign-in?credential=${credentialResponse.credential}`,
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
