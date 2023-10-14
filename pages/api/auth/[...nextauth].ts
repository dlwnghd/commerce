/**
 * FILENAME   : [...nextauth].ts
 * PURPOSE    : Auth.js의 Prisma Adapter 추가
 * AUTHOR     : Lee Juhong
 * CREATEDATE : 2023-10-11
 * UPDATEDATE : 2023-10-12 / Session 만료 기간 1일로 수정 / Lee Juhong
 * UPDATEDATE : 2023-10-14 / KaKaoProvider 추가 / Lee Juhong
 */

import { PrismaAdapter } from '@auth/prisma-adapter'
import { PrismaClient } from '@prisma/client'
import NextAuth, { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import KakaoProvider from 'next-auth/providers/kakao'

import { CLIENT_ID, CLIENT_PW } from '@@constants/googleAuth'
import { KAKAO_CLIENT_ID, KAKAO_CLIENT_SECRET } from '@@constants/kakaoAuth'

const prisma = new PrismaClient()

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: CLIENT_ID,
      clientSecret: CLIENT_PW,
    }),
    KakaoProvider({
      clientId: KAKAO_CLIENT_ID,
      clientSecret: KAKAO_CLIENT_SECRET,
    }),
  ],
  session: {
    strategy: 'database',
    maxAge: 1 * 24 * 60 * 60,
  },
  callbacks: {
    session: async ({ session, user }) => {
      session.id = user.id
      return Promise.resolve(session)
    },
  },
}

export default NextAuth(authOptions)
