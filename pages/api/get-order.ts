/**
 * FILENAME   : get-order.ts
 * PURPOSE    : 주문 조회 API
 * AUTHOR     : Lee Juhong
 * CREATEDATE : 2023-10-16
 * UPDATEDATE : -
 */

import { OrderItem, PrismaClient, products } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'

import { authOptions } from './auth/[...nextauth]'

const prisma = new PrismaClient()

async function getOrder(userId: string) {
  try {
    // orders 테이블에서 나의 주문들을 조회한다.
    const orders = await prisma.orders.findMany({
      where: {
        userId,
      },
    })

    console.log(orders)

    // eslint-disable-next-line prefer-const
    let response = []

    // orders 안에 있는 orderItemIds로 orderItem을 꺼내고 products 테이블에서 이미지 등 정보를 조합한다.
    for (const order of orders) {
      const orderItems: OrderItem[] = []
      for (const id of order.orderItemIds
        .split(',')
        .map((item) => Number(item))) {
        const res: OrderItem[] =
          await prisma.$queryRaw`SELECT i.id, quantity, amount, i.price, name, image_url, productId FROM OrderItem as i JOIN products as p ON i.productId=p.id WHERE i.id=${id};`
        // eslint-disable-next-line prefer-spread
        orderItems.push.apply(orderItems, res)
      }
      response.push({ ...order, orderItems })
    }

    console.log(response)
    return response
  } catch (error) {
    console.error(error)
  }
}

type Data = {
  items?: products[] | unknown
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const session = await getServerSession(req, res, authOptions)
  if (session == null) {
    res.status(200).json({ message: 'no Session' })
    return
  }

  try {
    const order = await getOrder(String(session.id))
    res.status(200).json({ items: order, message: 'Success Get Order' })
  } catch (error) {
    res.status(400).json({ message: 'Failed Get Order' })
  }
}
