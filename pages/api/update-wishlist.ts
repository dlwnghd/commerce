/**
 * FILENAME   : update-wishlist.ts
 * PURPOSE    : 찜 품목 업데이트 API
 * AUTHOR     : Lee Juhong
 * CREATEDATE : 2023-10-12
 * UPDATEDATE : 2023-
 */

import { PrismaClient, WishList } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'

import { authOptions } from './auth/[...nextauth]'

const prisma = new PrismaClient()

async function updateWishList(userId: string, productId: string) {
  try {
    const wishlist = await prisma.wishList.findUnique({
      where: {
        userId: userId,
      },
    })

    const originWishlist =
      wishlist?.productIds != null && wishlist.productIds !== ''
        ? wishlist?.productIds.split(',')
        : []

    const isWished = originWishlist.includes(productId)

    const newWishlist = isWished
      ? originWishlist.filter((id) => id !== productId)
      : [...originWishlist, productId]

    const response = await prisma.wishList.upsert({
      where: {
        userId,
      },
      update: {
        productIds: newWishlist.join(','),
      },
      create: {
        userId,
        productIds: newWishlist.join(','),
      },
    })

    return response?.productIds.split(',')
  } catch (error) {
    console.error(error)
  }
}

type Data = {
  items?: WishList | string[]
  // items?: any
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const session = await getServerSession(req, res, authOptions)
  const { productId } = JSON.parse(req.body)
  if (session == null) {
    res.status(200).json({ items: [], message: 'no Session' })
    return
  }

  try {
    const wishlist = await updateWishList(String(session.id), String(productId))
    res.status(200).json({ items: wishlist, message: 'Success get WishList' })
  } catch (error) {
    res.status(400).json({ message: 'Failed get Product' })
  }
}
