/**
 * FILENAME   : get-product.ts
 * PURPOSE    : 단일 상품 조회 API
 * AUTHOR     : Lee Juhong
 * CREATEDATE : 2023-10-10
 * UPDATEDATE : 2023-10-12 / API 결과 메세지 수정 / Lee Juhong
 */

import { PrismaClient, products } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

async function getProduct(id: number) {
  try {
    const response = await prisma.products.findUnique({
      where: {
        id: id,
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
  const { id } = req.query
  if (id == null) {
    return res.status(400).json({ message: 'no id' })
  }
  try {
    const products = await getProduct(Number(id))
    res
      .status(200)
      .json({ items: products ?? null, message: 'Success get Product' })
  } catch (error) {
    res.status(400).json({ message: 'Failed get Product' })
  }
}
