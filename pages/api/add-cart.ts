/**
 * FILENAME   : add-cart.ts
 * PURPOSE    : 장바구니 추가 API
 * AUTHOR     : Lee Juhong
 * CREATEDATE : 2023-10-16
 * UPDATEDATE : -
 */

import { Cart, PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'

import { authOptions } from './auth/[...nextauth]'

const prisma = new PrismaClient()

async function addCart(userId: string, item: Omit<Cart, 'id' | 'userId'>) {
  try {
    const response = await prisma.cart.upsert({
      where: {
        userId_productId: {
          userId,
          productId: item.productId,
        },
      },
      update: {
        quantity: {
          increment: item.quantity,
        },
        amount: {
          increment: item.amount,
        },
      },
      create: {
        userId,
        productId: item.productId,
        quantity: item.quantity,
        amount: item.amount,
      },
    })

    console.log(response)

    return response
  } catch (error) {
    console.error(error)
  }
}

type Data = {
  items?: Cart | string[]
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const session = await getServerSession(req, res, authOptions)
  const { item } = JSON.parse(req.body)
  if (session == null) {
    res.status(200).json({ items: [], message: 'no Session' })
    return
  }

  try {
    const wishlist = await addCart(String(session.id), item)
    res.status(200).json({ items: wishlist, message: 'Success get WishList' })
  } catch (error) {
    res.status(400).json({ message: 'Failed get Product' })
  }
}
