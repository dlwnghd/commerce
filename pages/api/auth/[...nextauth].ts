/**
 * FILENAME   : [...nextauth].tsx
 * PURPOSE    : Auth.js의 Prisma Adapter 추가
 * AUTHOR     : Lee Juhong
 * CREATEDATE : 2023-10-11
 * UPDATEDATE : -
 */

import { PrismaAdapter } from '@auth/prisma-adapter'
import { PrismaClient } from '@prisma/client'
import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

import { CLIENT_ID, CLIENT_PW } from '@@constants/googleAuth'

const prisma = new PrismaClient()

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: CLIENT_ID,
      clientSecret: CLIENT_PW,
    }),
  ],
})
