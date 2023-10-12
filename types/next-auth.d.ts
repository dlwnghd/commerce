// FILENAME   : next-auth.d.ts
// PURPOSE    : TS / Auth.js 타입 선언
// AUTHOR     : Lee Juhong
// CREATEDATE : 2023-10-12
// UPDATEDATE : -
import 'next-auth'

declare module 'next-auth' {
  interface Session {
    id: string
  }
}
