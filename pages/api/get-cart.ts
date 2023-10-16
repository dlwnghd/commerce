/**
 * FILENAME   : get-cart.ts
 * PURPOSE    : 장바구니 조회 API
 * AUTHOR     : Lee Juhong
 * CREATEDATE : 2023-10-16
 * UPDATEDATE : -
 */

import { PrismaClient, products } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'

import { authOptions } from './auth/[...nextauth]'

const prisma = new PrismaClient()

async function getCart(userId: string) {
  try {
    const cart =
      await prisma.$queryRaw`SELECT c.id, userId, quantity, amount, price, name, image_url, productId FROM Cart as c JOIN products as p WHERE c.productId=p.id AND c.userId = ${userId};`

    console.log(cart)
    return cart
  } catch (error) {
    console.error(error)
  }
}

type Data = {
  items?: products[] | [] | unknown
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const session = await getServerSession(req, res, authOptions)
  if (session == null) {
    res.status(200).json({ items: [], message: 'no Session' })
    return
  }

  try {
    const cartlist = await getCart(String(session.id))
    res.status(200).json({ items: cartlist, message: 'Success get WishList' })
  } catch (error) {
    res.status(400).json({ message: 'Failed get Product' })
  }
}
