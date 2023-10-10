/**
 * FILENAME   : sign-in.ts
 * PURPOSE    : 구글 OAuth 로그인 API
 * AUTHOR     : Lee Juhong
 * CREATEDATE : 2023-10-10
 * UPDATEDATE : -
 */

/* eslint-disable indent */
import { PrismaClient } from '@prisma/client'
import jwtDecode from 'jwt-decode'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

async function signIn(credential: string) {
  const decoded: { name: string; email: string; picture: string } =
    jwtDecode(credential)

  try {
    const response = await prisma.users.upsert({
      where: {
        email: decoded.email,
      },
      update: {
        name: decoded.name,
        image: decoded.picture,
      },
      create: {
        email: decoded.email,
        name: decoded.name,
        image: decoded.picture,
      },
    })

    console.log(response)
    return response
  } catch (error) {
    console.error(error)
  }
}

type Data = {
  items?: number | unknown
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const { credential } = req.query
  try {
    const userInfo = await signIn(String(credential))
    res.status(200).json({ items: userInfo, message: 'Success get userInfo' })
  } catch (error) {
    res.status(400).json({ message: 'Failed get userInfo' })
  }
}
