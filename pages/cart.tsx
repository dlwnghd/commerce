/**
 * FILENAME   : cart.tsx
 * PURPOSE    : 장바구니 컴포넌트
 * AUTHOR     : Lee Juhong
 * CREATEDATE : 2023-10-13
 * UPDATEDATE : -
 */

import emotionStyled from '@emotion/styled'
import { Button } from '@mantine/core'
import { products } from '@prisma/client'
import { IconRefresh, IconX } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'

import { CountControl } from '@@components/CountControl'
import { CATEGORY_MAP } from '@@constants/products'

interface CartItem {
  name: string
  productId: number
  price: number
  quantity: number
  amount: number
  image_url: string
}

export default function Cart() {
  const router = useRouter()
  const [data, setData] = useState<CartItem[]>([])
  const amount = useMemo(() => {
    return data
      .map((item) => item.amount)
      .reduce((prev, curr) => prev + curr, 0)
  }, [data])
  const deliveryAmount = 5000
  const discountAmount = 0

  useEffect(() => {
    const mockData = [
      {
        name: '멋드러진 신발',
        productId: 105,
        price: 20000,
        quantity: 2,
        amount: 40000,
        image_url:
          'https://cdn.shopify.com/s/files/1/0282/5850/products/footwear_converse_chuck-70-hi_A00754C.view_1_720x.jpg',
      },
      {
        name: '느낌있는 후드',
        productId: 146,
        price: 102302,
        quantity: 1,
        amount: 102302,
        image_url:
          'https://cdn.shopify.com/s/files/1/0282/5850/products/apparel_tops_bape_color-camo-shark-wide-fit-full-zip-double_1H80-115-010.color_red.view_1_720x.jpg',
      },
    ]

    setData(mockData)
  }, [])

  const { data: products } = useQuery<
    { items: products[] },
    unknown,
    products[]
  >(
    ['/api/get-products?skip=0&take=3'],
    () => fetch('/api/get-products?skip=0&take=3').then((res) => res.json()),
    {
      select: (data) => data.items,
    },
  )

  const handleOrder = () => {
    //TODO: 주문하기 기능 구현
    alert(alert(`장바구니에 담긴 것들 ${JSON.stringify(data)} 주문`))
  }

  return (
    <div>
      <span className="text-2xl mb-3">Cart ({data.length})</span>
      <div className="flex">
        <div className="flex flex-col p-4 space-y-4 flex-1">
          {data?.length > 0 ? (
            data.map((item, idx) => <Item key={idx} {...item} />)
          ) : (
            <div>장바구니에 아무것도 없습니다.</div>
          )}
        </div>
        <div className="px-4">
          <div
            className="flex flex-col p-4 space-y-4"
            style={{ minWidth: 300, border: '1px solid grey' }}
          >
            <div>Info</div>
            <Row>
              <span>금액</span>
              <span>{amount.toLocaleString('ko-kr')} 원</span>
            </Row>
            <Row>
              <span>배송비</span>
              <span>{deliveryAmount.toLocaleString('ko-kr')} 원</span>
            </Row>
            <Row>
              <span>할인 금액</span>
              <span>{discountAmount.toLocaleString('ko-kr')} 원</span>
            </Row>
            <Row>
              <span className="font-semibold">결제 금액</span>
              <span className="font-semibold text-red-500">
                {(amount + deliveryAmount - discountAmount).toLocaleString(
                  'ko-kr',
                )}
                원
              </span>
            </Row>
            <Button
              style={{ backgroundColor: 'black' }}
              radius="xl"
              size="md"
              styles={{
                root: { paddingRight: 14, height: 48 },
              }}
              onClick={handleOrder}
            >
              구매하기
            </Button>
          </div>
        </div>
      </div>
      <div className="mt-32 mb-16 flex flex-col space-y-4">
        <p>추천상품</p>
        {products && (
          <div className="grid grid-cols-3 gap-5">
            {products.map((item) => (
              <div
                key={item.id}
                style={{ maxWidth: 310 }}
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
        )}
      </div>
    </div>
  )
}

const Item = (props: CartItem) => {
  const router = useRouter()
  const [quantity, setQuantity] = useState<number | undefined>(props.quantity)
  const [amount, setAmount] = useState<number>(props.quantity)
  useEffect(() => {
    if (quantity != null) {
      setAmount(quantity * props.price)
    }
  }, [quantity, props.price])

  const handleUpdate = () => {
    //TODO: 장바구니에서 수정 기능 구현
    alert(`장바구니에서 ${props.name} 수정`)
  }

  const handleDelete = () => {
    //TODO: 장바구니에서 삭제 기능 구현
    alert(`장바구니에서 ${props.name} 삭제`)
  }

  return (
    <div className="w-full flex p-4" style={{ borderBottom: '1px solid grey' }}>
      <Image
        src={props.image_url}
        width={155}
        height={195}
        alt={props.name}
        onClick={() => router.push(`/products/${props.productId}`)}
      />
      <div className="flex flex-col ml-4">
        <span className="font-semibold mb-2">{props.name}</span>
        <span className="mb-auto">
          가격: {props.price.toLocaleString('ko-kr')}원
        </span>
        <div className="flex items-center space-x-4">
          <CountControl value={quantity} setValue={setQuantity} max={20} />
          <IconRefresh onClick={handleUpdate} />
        </div>
      </div>
      <div className="flex ml-auto space-x-4">
        <span>{amount.toLocaleString('ko-kr')} 원</span>
        <IconX onClick={handleDelete} />
      </div>
    </div>
  )
}

const Row = emotionStyled.div`
  display: flex;
  * ~ * {
    margin-left: auto;
  }
`
