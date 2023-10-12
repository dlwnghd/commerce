/**
 * FILENAME   : _app.tsx
 * PURPOSE    : 페이지 & 레이아웃 관리
 * AUTHOR     : Lee Juhong
 * CREATEDATE : 2023-10-10
 * UPDATEDATE : 2023-10-11 / next-auth의 Sesstion Provider 추가 / Lee Juhong
 * UPDATEDATE : 2023-10-12 / GoggleOAuthProvider 이동 / Lee Juhong
 */

import '@@styles/globals.css'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { staleTime: Infinity },
    },
  })

  return (
    <>
      <SessionProvider session={session}>
        <QueryClientProvider client={queryClient}>
          <Component {...pageProps} />
        </QueryClientProvider>
      </SessionProvider>
    </>
  )
}
