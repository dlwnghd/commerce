/**
 * FILENAME   : get-products-count.ts
 * PURPOSE    : 전체 상품 갯수 조회 API
 * AUTHOR     : Lee Juhong
 * CREATEDATE : 2023-10-10
 * UPDATEDATE : 2023-10-12 / API 결과 메세지 수정 / Lee Juhong
 */

/* eslint-disable indent */
import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

async function getProductsCount(category: number, contains: string) {
  const containsCondition =
    contains && contains !== ''
      ? {
          name: { contains: contains },
        }
      : undefined

  const where =
    category && category !== -1
      ? {
          category_id: category,
          ...containsCondition,
        }
      : containsCondition
      ? containsCondition
      : undefined

  try {
    const response = await prisma.products.count({ where: where })
    console.log(response)
    return response
  } catch (error) {
    console.error(error)
  }
}

type Data = {
  items?: number
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const { category, contains } = req.query
  try {
    const products = await getProductsCount(Number(category), String(contains))
    res
      .status(200)
      .json({ items: products, message: 'Success get Products Counts' })
  } catch (error) {
    res.status(400).json({ message: 'Failed get Products Counts' })
  }
}
