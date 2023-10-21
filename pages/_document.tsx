/**
 * FILENAME   : _document.tsx
 * PURPOSE    : 커스텀 document
 * AUTHOR     : Lee Juhong
 * CREATEDATE : 2023-10-10
 * UPDATEDATE : 2023-10-21 / language(en => ko) 수정 / Lee Juhong
 */

import { Head, Html, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="ko">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
