/**
 * FILENAME   : SessionLogin.tsx
 * PURPOSE    : 세션 로그인 컴포넌트
 * AUTHOR     : Lee Juhong
 * CREATEDATE : 2023-10-17
 * UPDATEDATE : 2023-10-22 / 버튼 텍스트 수정 / Lee Juhong
 */

import { signIn, signOut, useSession } from 'next-auth/react'

import Button from './Button'

export default function SessionLogin() {
  const { data: session } = useSession()

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {session ? (
        <>
          Signed in as {session.user?.email}
          <br />
          <br />
          <Button onClick={() => signOut()}>로그아웃</Button>
        </>
      ) : (
        <>
          로그인이 필요합니다.
          <br />
          <br />
          <Button onClick={() => signIn()}>소셜 로그인</Button>
        </>
      )}
    </div>
  )
}
