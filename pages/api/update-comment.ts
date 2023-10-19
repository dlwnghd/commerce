/**
 * FILENAME   : update-comment.ts
 * PURPOSE    : 후기 글 업데이트 API
 * AUTHOR     : Lee Juhong
 * CREATEDATE : 2023-10-19
 * UPDATEDATE : -
 */

import { Comment, PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'

import { authOptions } from './auth/[...nextauth]'

const prisma = new PrismaClient()

async function updateComment({
  userId,
  orderItemId,
  rate,
  contents,
}: {
  userId: string
  orderItemId: number
  rate: number
  contents: string
}) {
  try {
    const response = await prisma.comment.upsert({
      where: {
        orderItemId,
      },
      update: {
        contents,
        rate,
      },
      create: {
        userId,
        orderItemId,
        contents,
        rate,
      },
    })
    console.log(response)
    return response
  } catch (error) {
    console.error(error)
  }
}

type Data = {
  items?: Comment
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const session = await getServerSession(req, res, authOptions)
  const { orderItemId, rate, contents } = JSON.parse(req.body)
  if (session == null) {
    res.status(200).json({ message: 'no Session' })
    return
  }

  try {
    const comment = await updateComment({
      userId: String(session.id),
      orderItemId: Number(orderItemId),
      rate: rate,
      contents: contents,
    })
    res.status(200).json({ items: comment, message: 'Success Update Comment' })
  } catch (error) {
    res.status(400).json({ message: 'Failed Update Comment' })
  }
}
