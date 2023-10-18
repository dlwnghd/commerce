/**
 * FILENAME   : get-wishlists.ts
 * PURPOSE    : 찜 품목 조회 API
 * AUTHOR     : Lee Juhong
 * CREATEDATE : 2023-10-10
 * UPDATEDATE : 2023-10-16 / 파일명 변경 및 API 기능 수정 / Lee Juhong
 * UPDATEDATE : 2023-10-18 / response응답 수정 및 타입 변경 / Lee Juhong
 */

import { PrismaClient, products } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'

import { authOptions } from './auth/[...nextauth]'

const prisma = new PrismaClient()

async function getWishLists(userId: string, category: number) {
  try {
    const wishlist = await prisma.wishList.findUnique({
      where: {
        userId: userId,
      },
    })

    console.log(`wishlist: ${JSON.stringify(wishlist)}`)

    const productsId = wishlist?.productIds
      .split(',')
      .map((item) => Number(item))

    if (productsId && productsId.length > 0) {
      const where =
        category && category !== -1
          ? {
              id: {
                in: productsId,
              },
              category_id: category,
            }
          : {
              id: {
                in: productsId,
              },
            }

      const response = await prisma.products.findMany({
        where: where,
      })
      console.log(response)
      return response
    }

    return []
  } catch (error) {
    console.error(error)
  }
}

type Data = {
  items?: products[]
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const { category } = req.query
  const session = await getServerSession(req, res, authOptions)
  if (session == null) {
    res.status(200).json({ message: 'No Session' })
    return
  }

  try {
    const wishlist = await getWishLists(String(session.id), Number(category))
    res.status(200).json({ items: wishlist, message: 'Success Get WishList' })
  } catch (error) {
    res.status(400).json({ message: 'Failed Get WishList' })
  }
}
