/**
 * FILENAME   : get-products.ts
 * PURPOSE    : 전체 상품 조회 API
 * AUTHOR     : Lee Juhong
 * CREATEDATE : 2023-10-10
 * UPDATEDATE : 2023-10-12 / API 결과 메세지 수정 / Lee Juhong
 * UPDATEDATE : 2023-10-13 / API 요청 데이터 타입 수정 / Lee Juhong
 */

import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

import { getOrderBy } from '@@constants/products'

const prisma = new PrismaClient()

async function getProducts({
  skip,
  take,
  category,
  orderBy,
  contains,
}: {
  skip: number
  take: number
  category: number
  orderBy: string
  contains: string
}) {
  const containsCondition =
    contains && contains !== '' ? { name: { contains: contains } } : undefined
  const where =
    category && category !== -1
      ? { category_id: category, ...containsCondition }
      : containsCondition
      ? containsCondition
      : undefined

  const orderByCondition = getOrderBy(orderBy)

  try {
    const response = await prisma.products.findMany({
      skip: skip,
      take: take,
      ...orderByCondition,
      where: where,
    })
    console.log(response)
    return response
  } catch (error) {
    console.error(error)
  }
}

type Data = {
  items?: object
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const { skip, take, category, orderBy, contains } = req.query
  if (skip == null || take == null) {
    return res.status(400).json({ message: 'no skip or take' })
  }
  try {
    const products = await getProducts({
      skip: Number(skip),
      take: Number(take),
      category: Number(category),
      orderBy: String(orderBy),
      contains: contains ? String(contains) : '',
    })
    res.status(200).json({ items: products, message: 'Success get Products' })
  } catch (error) {
    res.status(400).json({ message: 'Failed get Products' })
  }
}
