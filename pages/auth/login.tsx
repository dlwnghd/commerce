/**
 * FILENAME   : login.tsx
 * PURPOSE    : 로그인 페이지
 * AUTHOR     : Lee Juhong
 * CREATEDATE : 2023-10-11
 * UPDATEDATE : 2023-10-13 / UI 수정 / Lee Juhong
 * UPDATEDATE : 2023-10-17 / 컴포넌트 명칭 수정 / Lee Juhong
 */

import SessionLogin from '@@components/SessionLogin'

export default function Login() {
  return (
    <div
      style={{
        display: 'flex',
        height: '70vh',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <SessionLogin />
    </div>
  )
}
