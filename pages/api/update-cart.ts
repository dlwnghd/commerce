/**
 * FILENAME   : update-cart.ts
 * PURPOSE    : 장바구니 수정 API
 * AUTHOR     : Lee Juhong
 * CREATEDATE : 2023-10-16
 * UPDATEDATE : 2023-10-21 / typecheck 미사용 파라미터 수정 / Lee Juhong
 */

import { Cart, PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'

import { authOptions } from './auth/[...nextauth]'

const prisma = new PrismaClient()

async function updateCart(item: Cart) {
  try {
    const response = await prisma.cart.update({
      where: {
        id: item.id,
      },
      data: {
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
  if (session == null || session.id !== item.userId) {
    res
      .status(200)
      .json({ items: [], message: 'no Session or Invalid Session' })
    return
  }

  try {
    const wishlist = await updateCart(item)
    res.status(200).json({ items: wishlist, message: 'Success get WishList' })
  } catch (error) {
    res.status(400).json({ message: 'Failed get Product' })
  }
}
