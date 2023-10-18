/**
 * FILENAME   : add-order.ts
 * PURPOSE    : 단일 주문 추가 API
 * AUTHOR     : Lee Juhong
 * CREATEDATE : 2023-10-17
 * UPDATEDATE : -
 */

import { OrderItem, Orders, PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'

import { authOptions } from './auth/[...nextauth]'

const prisma = new PrismaClient()

async function addOrder(
  userId: string,
  items: Omit<OrderItem, 'id'>[],
  orderInfo?: { receiver: string; address: string; phoneNumber: string },
) {
  try {
    // eslint-disable-next-line prefer-const
    let orderItemIds = []
    for (const item of items) {
      const orderItem = await prisma.orderItem.create({
        data: {
          ...item,
        },
      })
      console.log(`Created id: ${orderItem.id}`)
      orderItemIds.push(orderItem.id)
    }

    console.log(JSON.stringify(orderItemIds))

    const response = await prisma.orders.create({
      data: {
        userId,
        orderItemIds: orderItemIds.join(','),
        ...orderInfo,
        status: 0,
      },
    })

    console.log(response)

    return response
  } catch (error) {
    console.error(error)
  }
}

type Data = {
  items?: Orders
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const session = await getServerSession(req, res, authOptions)
  const { items, orderInfo } = JSON.parse(req.body)
  if (session == null) {
    res.status(200).json({ message: 'no Session' })
    return
  }

  try {
    const newOrder = await addOrder(String(session.id), items, orderInfo)
    res.status(200).json({ items: newOrder, message: 'Success Add Order' })
  } catch (error) {
    res.status(400).json({ message: 'Failed Add Order' })
  }
}
