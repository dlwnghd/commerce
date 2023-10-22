/**
 * FILENAME   : wishlist.tsx
 * PURPOSE    : 찜목록 컴포넌트
 * AUTHOR     : Lee Juhong
 * CREATEDATE : 2023-10-13
 * UPDATEDATE : 2023-10-16 / 파일명 변경 및 UI 수정 / Lee Juhong
 * UPDATEDATE : 2023-10-18 / QUERY 키 호출 추가 / Lee Juhong
 * UPDATEDATE : 2023-10-22 / 찜하기 호출 api 수정 / Lee Juhong
 * UPDATEDATE : 2023-10-22 / 이미지 cursor 추가 / Lee Juhong
 */

import { SegmentedControl } from '@mantine/core'
import { categories, products } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState } from 'react'

import { CATEGORY_MAP } from '@@constants/products'
import {
  GET_CATEGORY_QUERY_KEY,
  GET_WISHLISTS_QUERY_KEY,
} from '@@constants/QueryKey'

export default function Wishlist() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState<string>('-1')

  const { data: categories } = useQuery<
    { items: categories[] },
    unknown,
    categories[]
  >(
    [GET_CATEGORY_QUERY_KEY],
    () => fetch(GET_CATEGORY_QUERY_KEY).then((res) => res.json()),
    { select: (data) => data.items },
  )

  const { data: products } = useQuery<
    { items: products[] },
    unknown,
    products[]
  >(
    [`${GET_WISHLISTS_QUERY_KEY}?category=${selectedCategory}`],
    () =>
      fetch(`${GET_WISHLISTS_QUERY_KEY}?category=${selectedCategory}`).then(
        (res) => res.json(),
      ),
    {
      select: (data) => data.items,
    },
  )

  // 전체 카테고리 페이지 개수 != 특정 카테고리 페이지 개수
  const handleCategoryChange = (e: string) => {
    setSelectedCategory(e)
  }

  return (
    <div>
      <span className="text-2xl mb-4">
        내가 찜한 상품 ({products ? `${products.length}` : '0'})
      </span>
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
        {products && products?.length > 0 ? (
          <div className="grid grid-cols-3 gap-5">
            {products.map((item) => (
              <div
                key={item.id}
                style={{ maxWidth: 310, cursor: 'pointer' }}
                onClick={() => router.push(`/products/${item.id}`)}
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
    </div>
  )
}
