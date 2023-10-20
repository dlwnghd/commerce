/**
 * FILENAME   : [...nextauth].ts
 * PURPOSE    : Auth.js의 Prisma Adapter 추가
 * AUTHOR     : Lee Juhong
 * CREATEDATE : 2023-10-11
 * UPDATEDATE : 2023-10-12 / Session 만료 기간 1일로 수정 / Lee Juhong
 * UPDATEDATE : 2023-10-14 / KaKaoProvider 추가 / Lee Juhong
 * UPDATEDATE : 2023-10-17 / NaverProvider 추가 / Lee Juhong
 * UPDATEDATE : 2023-10-20 / env파일 변수명 수정(CSR) / Lee Juhong
 */

import { PrismaAdapter } from '@auth/prisma-adapter'
import { PrismaClient } from '@prisma/client'
import NextAuth, { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import KakaoProvider from 'next-auth/providers/kakao'
import NaverProvider from 'next-auth/providers/naver'

import {
  NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
  NEXT_PUBLIC_KAKAO_CLIENT_ID,
  NEXT_PUBLIC_KAKAO_CLIENT_SECRET,
  NEXT_PUBLIC_NAVER_CLIENT_ID,
  NEXT_PUBLIC_NAVER_CLIENT_SECRET,
} from '@@constants/Auth'

const prisma = new PrismaClient()

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      clientSecret: NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
    }),
    KakaoProvider({
      clientId: NEXT_PUBLIC_KAKAO_CLIENT_ID,
      clientSecret: NEXT_PUBLIC_KAKAO_CLIENT_SECRET,
      style: {
        logo: 'https://developers.kakao.com/tool/resource/static/img/button/kakaotalksharing/kakaotalk_sharing_btn_small.png',
        logoDark:
          'https://developers.kakao.com/tool/resource/static/img/button/kakaotalksharing/kakaotalk_sharing_btn_small.png',
        bgDark: '#FEE500',
        bg: '#FEE500',
        text: '#191919',
        textDark: '#191919',
      },
    }),
    NaverProvider({
      clientId: NEXT_PUBLIC_NAVER_CLIENT_ID,
      clientSecret: NEXT_PUBLIC_NAVER_CLIENT_SECRET,
      style: {
        logo: 'https://logoproject.naver.com/favicon.ico',
        logoDark: 'https://logoproject.naver.com/favicon.ico',
        bgDark: '#03C75A',
        bg: '#03C75A',
        text: '#FFFFFF',
        textDark: '#FFFFFF',
      },
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
