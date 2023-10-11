/**
 * FILENAME   : login.tsx
 * PURPOSE    : 로그인 페이지
 * AUTHOR     : Lee Juhong
 * CREATEDATE : 2023-10-11
 * UPDATEDATE : -
 */

import GoogleLogin from '@@components/GoogleLogin'

export default function Login() {
  return (
    <div
      style={{
        display: 'flex',
        width: '100vw',
        height: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <GoogleLogin />
    </div>
  )
}
