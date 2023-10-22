/**
 * FILENAME   : get-wishlist.ts
 * PURPOSE    : 찜 품목 번호 조회 API
 * AUTHOR     : Lee Juhong
 * CREATEDATE : 2023-10-22
 * UPDATEDATE : -
 */

import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'

import { authOptions } from './auth/[...nextauth]'

const prisma = new PrismaClient()

async function getWishlist(userId: string) {
  try {
    const response = await prisma.wishList.findUnique({
      where: {
        userId: userId,
      },
    })
    console.log(response)
    return response?.productIds.split(',')
  } catch (error) {
    console.error(error)
  }
}

type Data = {
  items?: string[]
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const session = await getServerSession(req, res, authOptions)
  if (session == null) {
    res.status(200).json({ message: 'No Session' })
    return
  }

  try {
    const wishlist = await getWishlist(String(session.id))
    res.status(200).json({ items: wishlist, message: 'Success Get WishList' })
  } catch (error) {
    res.status(400).json({ message: 'Failed Get WishList' })
  }
}
