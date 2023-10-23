/**
 * FILENAME   : _app.tsx
 * PURPOSE    : 페이지 & 레이아웃 관리
 * AUTHOR     : Lee Juhong
 * CREATEDATE : 2023-10-10
 * UPDATEDATE : 2023-10-11 / next-auth의 Sesstion Provider 추가 / Lee Juhong
 * UPDATEDATE : 2023-10-12 / GoggleOAuthProvider 이동 / Lee Juhong
 * UPDATEDATE : 2023-10-13 / 공통 UI(Header) 추가 / Lee Juhong
 * UPDATEDATE : 2023-10-21 / SEO 상향(<title>, <meta> 추가) / Lee Juhong
 * UPDATEDATE : 2023-10-23 / <meta> 추가 및 오타 수정 / Lee Juhong
 */

import '@@styles/globals.css'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { SessionProvider } from 'next-auth/react'

import Header from '@@components/Header'

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
          <Head>
            <title>Commerce Service</title>
            <meta name="description" content="commerce service LeeJuhong" />
            <meta name="robots" content="all" />
          </Head>
          <div className="px-36">
            <Header />
            <Component {...pageProps} />
          </div>
        </QueryClientProvider>
      </SessionProvider>
    </>
  )
}
