/**
 * FILENAME   : get-categories.ts
 * PURPOSE    : 카테고리 조회 API
 * AUTHOR     : Lee Juhong
 * CREATEDATE : 2023-10-10
 * UPDATEDATE : 2023-10-21 / typecheck 미사용 파라미터 수정 / Lee Juhong
 */

import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

async function getCategories() {
  try {
    const response = await prisma.categories.findMany({})
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
  _: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  try {
    const products = await getCategories()
    res.status(200).json({ items: products, message: 'Success get Categories' })
  } catch (error) {
    res.status(400).json({ message: 'Failed get Categories' })
  }
}
