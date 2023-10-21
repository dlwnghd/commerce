/**
 * FILENAME   : my.tsx
 * PURPOSE    : 마이 페이지 컴포넌트
 * AUTHOR     : Lee Juhong
 * CREATEDATE : 2023-10-18
 * UPDATEDATE : 2023-10-19 / 후기 글 작성 기능 추가 / Lee Juhong
 * UPDATEDATE : 2023-10-21 / typecheck 미사용 파라미터 수정 / Lee Juhong
 */
import { Badge, Button } from '@mantine/core'
import { OrderItem, Orders } from '@prisma/client'
import { IconX } from '@tabler/icons-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import { CountControl } from '@@components/CountControl'
import {
  GET_ORDER_QUERY_KEY,
  UPDATE_ORDER_STATUS_QUERY_KEY,
} from '@@constants/QueryKey'

interface OrderItemDetail extends OrderItem {
  name: string
  image_url: string
}

interface OrderDetail extends Orders {
  orderItems: OrderItemDetail[]
}

const ORDER_STATUS_MAP = [
  '주문취소',
  '주문대기',
  '결제대기',
  '결제완료',
  '배송대기',
  '배송중',
  '배송완료',
  '환불대기',
  '환불완료',
  '반품대기',
  '반품완료',
  '교환대기',
  '교환완료',
]

export default function MyPage() {
  const { data } = useQuery<{ items: OrderDetail[] }, unknown, OrderDetail[]>(
    [GET_ORDER_QUERY_KEY],
    () =>
      fetch(GET_ORDER_QUERY_KEY)
        .then((res) => res.json())
        .then((data) => data.items),
  )

  return (
    <div>
      <span className="text-2xl mb-3">주문내역 ({data ? data.length : 0})</span>
      <div className="flex">
        <div className="flex flex-col p-4 space-y-4 flex-1">
          {data ? (
            data.length > 0 ? (
              data?.map((item, idx) => <DetailItem key={idx} {...item} />)
            ) : (
              <div>주문내역이 아무것도 없습니다.</div>
            )
          ) : (
            <div>불러오는 중...</div>
          )}
        </div>
      </div>
    </div>
  )
}

const DetailItem = (props: OrderDetail) => {
  const queryClient = useQueryClient()
  const { mutate: updateOrderStatus } = useMutation<
    unknown,
    unknown,
    number,
    unknown
  >(
    (status) =>
      fetch(UPDATE_ORDER_STATUS_QUERY_KEY, {
        method: 'POST',
        body: JSON.stringify({
          id: props.id,
          status: status,
          userId: props.userId,
        }),
      })
        .then((res) => res.json())
        .then((data) => data.items),
    {
      onMutate: async (status) => {
        await queryClient.cancelQueries({ queryKey: [GET_ORDER_QUERY_KEY] })

        const previous = queryClient.getQueryData([GET_ORDER_QUERY_KEY])

        queryClient.setQueryData<Orders[]>(
          [GET_ORDER_QUERY_KEY],
          (old) =>
            old?.map((c) => {
              if (c.id === props.id) {
                return { ...c, status: status }
              }
              return c
            }),
        )

        // Return a context object with the snapshotted value
        return { previousTodos: previous }
      },
      onError: (__, _, context) => {
        if (context) {
          queryClient.setQueryData([GET_ORDER_QUERY_KEY], context)
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries([GET_ORDER_QUERY_KEY])
      },
    },
  )

  const handlePayment = () => {
    //TODO: 주문상태를 5 로 바꿔주라
    updateOrderStatus(5)
  }

  const handleCancel = () => {
    //TODO: 주문상태를 -1 로 바꿔주라
    updateOrderStatus(-1)
  }
  return (
    <div
      className="w-full flex flex-col p-4 rounded-md"
      style={{ border: '1px solid grey' }}
    >
      <div className="flex">
        <Badge color={props.status < 1 ? 'red' : ''} className="mb-2">
          {ORDER_STATUS_MAP[props.status + 1]}
        </Badge>
        <IconX className="ml-auto" onClick={handleCancel} />
      </div>
      {props.orderItems.map((orderItem, idx) => (
        <Item key={idx} {...orderItem} status={props.status} />
      ))}
      <div className="flex mt-4">
        <div className="flex flex-col">
          <span className="mb-2">주문 정보</span>
          <span>받는 사람: {props.receiver ?? '입력필요'}</span>
          <span>주소: {props.address ?? '입력필요'}</span>
          <span>연락처: {props.phoneNumber ?? '입력필요'}</span>
        </div>
        <div className="flex flex-col ml-auto mr-4 text-right">
          <span className="font-semibold mb-2">
            합계 금액:{' '}
            <span className="text-red-500">
              {props.orderItems
                .map((item) => item.amount)
                .reduce((prev, curr) => prev + curr, 0)
                .toLocaleString('ko-kr')}
              원
            </span>
          </span>
          <span className="text-zinc-400 mt-auto mb-auto">
            주문일자:{' '}
            {format(new Date(props.createdAt), 'yyyy년 M월 d일 HH:mm:ss')}
          </span>
          <Button
            style={{ backgroundColor: 'black', color: 'white' }}
            onClick={handlePayment}
          >
            결제 처리
          </Button>
        </div>
      </div>
    </div>
  )
}

const Item = (props: OrderItemDetail & { status: number }) => {
  const router = useRouter()
  const [quantity, setQuantity] = useState<number | undefined>(props.quantity)
  const [amount, setAmount] = useState<number>(props.quantity)
  useEffect(() => {
    if (quantity != null) {
      setAmount(quantity * props.price)
    }
  }, [quantity, props.price])

  const handleComment = () => {
    router.push(`/comment/edit?orderItemId=${props.id}`)
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
        </div>
      </div>
      <div className="flex flex-col ml-auto space-x-4">
        <span>{amount.toLocaleString('ko-kr')} 원</span>
        {props.status === 5 && (
          <Button
            style={{
              backgroundColor: 'black',
              color: 'white',
              marginTop: 'auto',
            }}
            onClick={handleComment}
          >
            후기 작성
          </Button>
        )}
      </div>
    </div>
  )
}
