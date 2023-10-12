/**
 * FILENAME   : update-product.ts
 * PURPOSE    : 단일 상품 수정 API
 * AUTHOR     : Lee Juhong
 * CREATEDATE : 2023-10-10
 * UPDATEDATE : 2023-10-12 / API 결과 메세지 수정 / Lee Juhong
 */

import { PrismaClient, products } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

async function updateProduct(id: number, contents: string) {
  try {
    const response = await prisma.products.update({
      where: {
        id: id,
      },
      data: {
        contents: contents,
      },
    })
    console.log(response)
    return response
  } catch (error) {
    console.error(error)
  }
}

type Data = {
  items?: products | null
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const { id, contents } = JSON.parse(req.body)
  if (id == null || contents == null) {
    return res.status(400).json({ message: 'no id or contents' })
  }
  try {
    const products = await updateProduct(Number(id), contents)
    res
      .status(200)
      .json({ items: products ?? null, message: 'Success update Product' })
  } catch (error) {
    res.status(400).json({ message: 'Failed update Product' })
  }
}
