/**
 * FILENAME   : wish.tsx
 * PURPOSE    : 찜목록 컴포넌트
 * AUTHOR     : Lee Juhong
 * CREATEDATE : 2023-10-13
 * UPDATEDATE : -
 */

import { Pagination, SegmentedControl } from '@mantine/core'
import { categories } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import { CATEGORY_MAP, TAKE } from '@@constants/products'

interface WishItem {
  name: string
  productId: number
  category_id: number
  price: number
  quantity: number
  amount: number
  image_url: string
}

export default function Cart() {
  const router = useRouter()
  const [data, setData] = useState<WishItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('-1')
  const [activePage, setPage] = useState(1)

  const { data: categories } = useQuery<
    { items: categories[] },
    unknown,
    categories[]
  >(
    ['/api/get-categories'],
    () => fetch('/api/get-categories').then((res) => res.json()),
    { select: (data) => data.items },
  )

  const { data: total } = useQuery(
    [`/api/get-products-count?category=${selectedCategory}&contains=`],
    () =>
      fetch(`/api/get-products-count?category=${selectedCategory}&contains=`)
        .then((res) => res.json())
        .then((data) => Math.ceil(data.items / TAKE)),
  )

  useEffect(() => {
    const mockData = [
      {
        name: '찜한 후드1',
        productId: 145,
        category_id: 5,
        price: 171810,
        quantity: 2,
        amount: 343620,
        image_url:
          'https://cdn.shopify.com/s/files/1/0282/5850/products/apparel_tops_undefeated_la_kings-chrome-hoodie_70025.color_black.view_1_720x.jpg',
      },
      {
        name: '찜한 후드1',
        productId: 145,
        category_id: 5,
        price: 171810,
        quantity: 2,
        amount: 343620,
        image_url:
          'https://cdn.shopify.com/s/files/1/0282/5850/products/apparel_tops_undefeated_la_kings-chrome-hoodie_70025.color_black.view_1_720x.jpg',
      },
      {
        name: '찜한 후드1',
        productId: 145,
        category_id: 5,
        price: 171810,
        quantity: 2,
        amount: 343620,
        image_url:
          'https://cdn.shopify.com/s/files/1/0282/5850/products/apparel_tops_undefeated_la_kings-chrome-hoodie_70025.color_black.view_1_720x.jpg',
      },
      {
        name: '찜한 후드1',
        productId: 145,
        category_id: 5,
        price: 171810,
        quantity: 2,
        amount: 343620,
        image_url:
          'https://cdn.shopify.com/s/files/1/0282/5850/products/apparel_tops_undefeated_la_kings-chrome-hoodie_70025.color_black.view_1_720x.jpg',
      },
      {
        name: '찜한 후드1',
        productId: 145,
        category_id: 5,
        price: 171810,
        quantity: 2,
        amount: 343620,
        image_url:
          'https://cdn.shopify.com/s/files/1/0282/5850/products/apparel_tops_undefeated_la_kings-chrome-hoodie_70025.color_black.view_1_720x.jpg',
      },
      {
        name: '찜한 후드1',
        productId: 145,
        category_id: 5,
        price: 171810,
        quantity: 2,
        amount: 343620,
        image_url:
          'https://cdn.shopify.com/s/files/1/0282/5850/products/apparel_tops_undefeated_la_kings-chrome-hoodie_70025.color_black.view_1_720x.jpg',
      },
      {
        name: '찜한 후드1',
        productId: 145,
        category_id: 5,
        price: 171810,
        quantity: 2,
        amount: 343620,
        image_url:
          'https://cdn.shopify.com/s/files/1/0282/5850/products/apparel_tops_undefeated_la_kings-chrome-hoodie_70025.color_black.view_1_720x.jpg',
      },
    ]

    setData(mockData)
  }, [])

  // 전체 카테고리 페이지 개수 != 특정 카테고리 페이지 개수
  const handleCategoryChange = (e: string) => {
    setSelectedCategory(e)
  }

  return (
    <div>
      <span className="text-2xl">Wish ({data.length})</span>
      {categories && (
        <div className="mt-4 mb-4">
          <SegmentedControl
            value={selectedCategory}
            onChange={handleCategoryChange}
            data={[
              { label: 'ALL', value: '-1' },
              ...categories.map((category) => ({
                label: category.name,
                value: String(category.id),
              })),
            ]}
            color="dark"
          />
        </div>
      )}
      <div className="mt-4 mb-16 flex flex-col space-y-4">
        {data?.length > 0 ? (
          <div className="grid grid-cols-3 gap-5">
            {data.map((item) => (
              <div
                key={item.productId}
                style={{ maxWidth: 310 }}
                onClick={() => router.push(`/products/${item.productId}`)}
              >
                <Image
                  className="rounded"
                  alt={item.name}
                  src={item.image_url ?? ''}
                  width={300}
                  height={200}
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mM0tbSsBwACegEoriWGfgAAAABJRU5ErkJggg=="
                />
                <div className="flex">
                  <span>{item.name}</span>
                  <span className="ml-auto">
                    {item.price.toLocaleString('ko-KR')}원
                  </span>
                </div>
                <span className="text-zinc-400">
                  {item.category_id != null
                    ? CATEGORY_MAP[item.category_id - 1]
                    : 1}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div>찜목록에 아무것도 없습니다.</div>
        )}
      </div>
      {total && (
        <div className="w-full flex mt-5">
          <Pagination
            className="m-auto"
            page={activePage}
            onChange={setPage}
            total={total}
          />
        </div>
      )}
    </div>
  )
}
