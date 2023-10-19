/**
 * FILENAME   : get-comments.ts
 * PURPOSE    : 다중 후기 글 조회 API
 * AUTHOR     : Lee Juhong
 * CREATEDATE : 2023-10-19
 * UPDATEDATE : -
 */

import { PrismaClient, products } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

async function getComments(productId: number) {
  try {
    const orderItems = await prisma.orderItem.findMany({
      where: {
        productId,
      },
    })

    console.log('orderItems')
    console.log(orderItems)

    const response = []

    // orderItemId를 기반으로 Comment를 조회한다.
    for (const orderItem of orderItems) {
      const res = await prisma.comment.findUnique({
        where: {
          orderItemId: orderItem.id,
        },
      })
      if (res) {
        response.push({ ...orderItem, ...res })
      }
    }

    console.log('response')
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
  const { productId } = req.query
  if (productId == null) {
    res.status(200).json({ message: 'no productId' })
    return
  }

  try {
    const order = await getComments(Number(productId))
    res.status(200).json({ items: order, message: 'Success Get Comments' })
  } catch (error) {
    res.status(400).json({ message: 'Failed Get Comments' })
  }
}
