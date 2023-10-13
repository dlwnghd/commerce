/**
 * FILENAME   : GoogleLogin.tsx
 * PURPOSE    : 구글 로그인 컴포넌트
 * AUTHOR     : Lee Juhong
 * CREATEDATE : 2023-10-11
 * UPDATEDATE : 2023-10-13 / 컴포넌트명 변경 / Lee Juhong
 */

import { signIn, signOut, useSession } from 'next-auth/react'

import Button from './Button'

export default function GoogleLogin() {
  const { data: session } = useSession()

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {session ? (
        <>
          Signed in as {session.user?.email}
          <br />
          <br />
          <Button onClick={() => signOut()}>Sign out</Button>
        </>
      ) : (
        <>
          Not signed in
          <br />
          <br />
          <Button onClick={() => signIn()}>Sign in</Button>
        </>
      )}
    </div>
  )
}
