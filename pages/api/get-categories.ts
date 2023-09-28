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
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  try {
    const products = await getCategories()
    res.status(200).json({ items: products, message: 'Success get Categories' })
  } catch (error) {
    res.status(400).json({ message: 'Failed get Categories' })
  }
}
