/**
 * FILENAME   : get-comment.ts
 * PURPOSE    : 단일 후기 글 조회 API
 * AUTHOR     : Lee Juhong
 * CREATEDATE : 2023-10-19
 * UPDATEDATE : -
 */

import { Comment, PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'

import { authOptions } from './auth/[...nextauth]'

const prisma = new PrismaClient()

async function getComment(userId: string, orderItemId: number) {
  try {
    const response = await prisma.comment.findUnique({
      where: {
        orderItemId: orderItemId,
      },
    })

    console.log(response)

    if (response?.userId === userId) {
      return response
    }
    return { message: 'userId is not matched' }
  } catch (error) {
    console.error(error)
  }
}

type Data = {
  items?: Comment | { message: string }
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const { orderItemId } = req.query
  const session = await getServerSession(req, res, authOptions)
  if (session == null) {
    res.status(200).json({ message: 'No Session' })
    return
  }
  if (orderItemId == null) {
    res.status(200).json({ message: 'No orderItemId' })
    return
  }

  try {
    const comments = await getComment(String(session.id), Number(orderItemId))
    res.status(200).json({ items: comments, message: 'Success Get Comment' })
  } catch (error) {
    res.status(400).json({ message: 'Failed Get Comment' })
  }
}
