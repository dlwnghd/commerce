/**
 * FILENAME   : GoogleLogin.tsx
 * PURPOSE    : 구글 로그인 컴포넌트
 * AUTHOR     : Lee Juhong
 * CREATEDATE : 2023-10-11
 * UPDATEDATE : -
 */

import { signIn, signOut, useSession } from 'next-auth/react'

import TestButton from './TestButton'

export default function GoogleLogin() {
  const { data: session } = useSession()
  if (session) {
    return (
      <div>
        Signed in as {session.user?.email}
        <br />
        <br />
        <TestButton onClick={() => signOut()}>Sign out</TestButton>
      </div>
    )
  }
  return (
    <div>
      Not signed in
      <br />
      <br />
      <TestButton onClick={() => signIn()}>Sign in</TestButton>
    </div>
  )
}
