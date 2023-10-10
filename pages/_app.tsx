import '@@styles/globals.css'

import { GoogleOAuthProvider } from '@react-oauth/google'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { AppProps } from 'next/app'

import { CLIENT_ID } from '@@constants/googleAuth'

export default function App({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { staleTime: Infinity },
    },
  })

  return (
    <>
      {CLIENT_ID && (
        <GoogleOAuthProvider clientId={CLIENT_ID}>
          <QueryClientProvider client={queryClient}>
            <Component {...pageProps} />
          </QueryClientProvider>
        </GoogleOAuthProvider>
      )}
    </>
  )
}
