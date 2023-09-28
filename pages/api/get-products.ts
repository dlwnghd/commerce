/* eslint-disable indent */
import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

async function getProducts(skip: number, take: number, category: number) {
  const where =
    category && category !== -1
      ? {
          where: {
            category_id: category,
          },
        }
      : undefined
  try {
    const response = await prisma.products.findMany({
      skip: skip,
      take: take,
      ...where,
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
  const { skip, take, category } = req.query
  if (skip == null || take == null) {
    return res.status(400).json({ message: 'no skip or take' })
  }
  try {
    const products = await getProducts(
      Number(skip),
      Number(take),
      Number(category),
    )
    res.status(200).json({ items: products, message: 'Success get Items' })
  } catch (error) {
    res.status(400).json({ message: 'Failed get Items' })
  }
}
