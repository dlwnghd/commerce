/* eslint-disable indent */
import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

async function getProductsCount(category: number) {
  const where =
    category && category !== -1
      ? {
          where: {
            category_id: category,
          },
        }
      : undefined

  try {
    const response = await prisma.products.count(where)
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
  const { category } = req.query
  try {
    const products = await getProductsCount(Number(category))
    res.status(200).json({ items: products, message: 'Success get Items' })
  } catch (error) {
    res.status(400).json({ message: 'Failed get Items' })
  }
}
