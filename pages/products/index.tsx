/**
 * FILENAME   : index.tsx
 * PURPOSE    : 상품 리스트 컴포넌트
 * AUTHOR     : Lee Juhong
 * CREATEDATE : 2023-10-10
 * UPDATEDATE : 2023-10-18 / QUERY 키 호출 추가 / Lee Juhong
 * UPDATEDATE : 2023-10-22 / 이미지 cursor 추가 및 오타 수정 / Lee Juhong
 */

import { products } from '@prisma/client'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'

import { GET_PRODUCTS_QUERY_KEY } from '@@constants/QueryKey'

const TAKE = 9
export default function Products() {
  const [skip, setSkip] = useState(0)
  const [products, setProducts] = useState<products[]>([])

  useEffect(() => {
    fetch(`${GET_PRODUCTS_QUERY_KEY}?skip=0&take=${TAKE}`)
      .then((res) => res.json())
      .then((data) => setProducts(data.items))
  }, [])

  const getProducts = useCallback(() => {
    const next = skip + TAKE
    fetch(`${GET_PRODUCTS_QUERY_KEY}?skip=${next}&take=${TAKE}`)
      .then((res) => res.json())
      .then((data) => {
        const list = products.concat(data.items)
        setProducts(list)
      })
    setSkip(next)
  }, [skip, products])

  return (
    <div className="px-36 mt-36 mb-36">
      {products && (
        <div className="grid grid-cols-3 gap-5">
          {products.map((item) => (
            <div className="cursor-pointer" key={item.id}>
              <Image
                className="rounded"
                alt={item.name}
                src={item.image_url ?? ''}
                width={300}
                height={200}
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="
              />
              <div className="flex">
                <span>{item.name}</span>
                <span className="ml-auto">
                  {item.price.toLocaleString('ko-KR')}원
                </span>
              </div>
              <span className="text-zinc-400">
                {item.category_id === 1 && '의류'}
              </span>
            </div>
          ))}
        </div>
      )}
      <button
        className="w-full rounded mt-20 bg-zinc-200 p-4"
        onClick={getProducts}
      >
        더보기
      </button>
    </div>
  )
}
