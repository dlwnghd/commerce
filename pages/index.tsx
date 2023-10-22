/**
 * FILENAME   : index.tsx
 * PURPOSE    : Main / 상품 리스트 페이지
 * AUTHOR     : Lee Juhong
 * CREATEDATE : 2023-10-10
 * UPDATEDATE : 2023-10-13 / 메인 페이지 수정 / Lee Juhong
 * UPDATEDATE : 2023-10-18 / QUERY 키 호출 추가 / Lee Juhong
 * UPDATEDATE : 2023-10-22 / 이미지 cursor 추가 및 오타 수정 / Lee Juhong
 * UPDATEDATE : 2023-10-23 / SEO 최적화(aria-label 추가) / Lee Juhong
 */

import { Input, Pagination, SegmentedControl, Select } from '@mantine/core'
import { categories, products } from '@prisma/client'
import { IconSearch } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useState } from 'react'

import { CATEGORY_MAP, FILTERS, TAKE } from '@@constants/products'
import {
  GET_CATEGORY_QUERY_KEY,
  GET_PRODUCT_COUNT_QUERY_KEY,
  GET_PRODUCTS_QUERY_KEY,
} from '@@constants/QueryKey'
import useDebounce from '@@hooks/useDebounce'

export default function Home() {
  const router = useRouter()
  const [activePage, setPage] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState<string>('-1')
  const [selectedFilter, setSelectedFilter] = useState<string | null>(
    FILTERS[0].value,
  )
  const [keyword, setKeyword] = useState('')

  const debouncedKeyword = useDebounce<string>(keyword)

  const { data: categories } = useQuery<
    { items: categories[] },
    unknown,
    categories[]
  >(
    [GET_CATEGORY_QUERY_KEY],
    () => fetch(GET_CATEGORY_QUERY_KEY).then((res) => res.json()),
    { select: (data) => data.items },
  )

  const { data: total } = useQuery(
    [
      `${GET_PRODUCT_COUNT_QUERY_KEY}?category=${selectedCategory}&contains=${debouncedKeyword}`,
    ],
    () =>
      fetch(
        `${GET_PRODUCT_COUNT_QUERY_KEY}?category=${selectedCategory}&contains=${debouncedKeyword}`,
      )
        .then((res) => res.json())
        .then((data) => Math.ceil(data.items / TAKE)),
  )

  const { data: products } = useQuery<
    { items: products[] },
    unknown,
    products[]
  >(
    [
      `${GET_PRODUCTS_QUERY_KEY}?skip=${
        TAKE * (activePage - 1)
      }&take=${TAKE}&category=${selectedCategory}&orderBy=${selectedFilter}&contains=${debouncedKeyword}`,
    ],
    () =>
      fetch(
        `${GET_PRODUCTS_QUERY_KEY}?skip=${
          TAKE * (activePage - 1)
        }&take=${TAKE}&category=${selectedCategory}&orderBy=${selectedFilter}&contains=${debouncedKeyword}`,
      ).then((res) => res.json()),
    {
      select: (data) => data.items,
    },
  )

  // 핸들러
  const handleSearchTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value)
  }

  // 전체 카테고리 페이지 개수 != 특정 카테고리 페이지 개수
  const handleCategoryChange = (e: string) => {
    setPage(1)
    setSelectedCategory(e)
  }

  return (
    <div className="mt-36 mb-36">
      <div className="mb-4">
        <Input
          icon={<IconSearch />}
          placeholder="Search"
          value={keyword}
          onChange={handleSearchTextChange}
        />
      </div>
      <div className="mb-4">
        <Select
          aria-label="Select Filter"
          value={selectedFilter}
          onChange={setSelectedFilter}
          data={FILTERS}
        />
      </div>
      {categories && (
        <div className="mb-4">
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
      {products && (
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
              <span className="text-zinc-500">
                {item.category_id != null
                  ? CATEGORY_MAP[item.category_id - 1]
                  : 1}
              </span>
            </div>
          ))}
        </div>
      )}
      {total && (
        <div className="w-full flex mt-5">
          <Pagination
            aria-label="my pagination component"
            className="m-auto"
            page={activePage}
            onChange={setPage}
            total={total}
            getItemAriaLabel={(total) => {
              switch (total) {
                case 'dots':
                  return 'dots element aria-label'
                case 'prev':
                  return 'previous page button aria-label'
                case 'next':
                  return 'next page button aria-label'
                case 'first':
                  return 'first page button aria-label'
                case 'last':
                  return 'last page button aria-label'
                default:
                  return `${total} item aria-label`
              }
            }}
          />
        </div>
      )}
    </div>
  )
}
