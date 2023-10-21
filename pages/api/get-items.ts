/**
 * FILENAME   : get-items.ts
 * PURPOSE    : 전체 아이템 조회 API
 * AUTHOR     : Lee Juhong
 * CREATEDATE : 2023-10-10
 * UPDATEDATE : 2023-10-21 / typecheck 미사용 파라미터 수정 / Lee Juhong
 */

import { Client } from '@notionhq/client'
import type { NextApiRequest, NextApiResponse } from 'next'

const notion = new Client({
  auth: process.env.NotionAuthSecertKey,
})

const databaseId = String(process.env.NotionDatabaseId)

async function getItems() {
  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      sorts: [
        {
          property: 'price',
          direction: 'ascending',
        },
      ],
    })
    console.log(response)
    return response
  } catch (error) {
    console.error(JSON.stringify(error))
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
    const response = await getItems()
    res
      .status(200)
      .json({ items: response?.results, message: 'Success get Items' })
  } catch (error) {
    res.status(400).json({ message: 'Failed get Items' })
  }
}
