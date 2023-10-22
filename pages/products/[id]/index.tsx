/**
 * FILENAME   : index.tsx
 * PURPOSE    : 상품 상세 페이지 컴포넌트
 * AUTHOR     : Lee Juhong
 * CREATEDATE : 2023-10-10
 * UPDATEDATE : 2023-10-12 / 상세 페이지 찜하기 버튼 및 레이아웃 추가 / Lee Juhong
 * UPDATEDATE : 2023-10-13 / 장바구니 버튼 UI 추가 / Lee Juhong
 * UPDATEDATE : 2023-10-16 / 장바구니 기능 추가 / Lee Juhong
 * UPDATEDATE : 2023-10-18 / 주문하기 기능 추가 / Lee Juhong
 * UPDATEDATE : 2023-10-19 / 후기 글 조회 기능 추가 / Lee Juhong
 * UPDATEDATE : 2023-10-21 / SEO 상향(<title>, <meta> 추가 및 typecheck 미사용 파라미터 수정) / Lee Juhong
 * UPDATEDATE : 2023-10-22 / 후기 UI 수정 / Lee Juhong
 */

import { Button } from '@mantine/core'
import { Cart, Comment, OrderItem, products } from '@prisma/client'
import { IconHeart, IconHeartbeat, IconShoppingCart } from '@tabler/icons-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { convertFromRaw, EditorState } from 'draft-js'
import { GetServerSidePropsContext } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import Carousel from 'nuka-carousel'
import { useState } from 'react'

import CommentItem from '@@components/CommentItem'
import { CountControl } from '@@components/CountControl'
import CustomEditor from '@@components/Editor'
import { CATEGORY_MAP } from '@@constants/products'
import {
  ADD_CART_QUERY_KEY,
  ADD_ORDER_QUERY_KEY,
  GET_CART_QUERY_KEY,
  GET_COMMENTS_QUERY_KEY,
  GET_ORDER_QUERY_KEY,
  GET_PRODUCT_QUERY_KEY,
  GET_WISHLIST_QUERY_KEY,
  UPDATE_WISHLIST_QUERY_KEY,
} from '@@constants/QueryKey'

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const product = await fetch(
    `${process.env.NEXTAUTH_URL}${GET_PRODUCT_QUERY_KEY}?id=${context.params?.id}`,
  )
    .then((res) => res.json())
    .then((data) => data.items)

  const comments = await fetch(
    `${process.env.NEXTAUTH_URL}${GET_COMMENTS_QUERY_KEY}?productId=${context.params?.id}`,
  )
    .then((res) => res.json())
    .then((data) => data.items)
  return {
    props: {
      product: { ...product, images: [product.image_url, product.image_url] },
      comments,
    },
  }
}

export interface CommentItemType extends Comment, OrderItem {}

export default function Products(props: {
  product: products & { images: string[] }
  comments: CommentItemType[]
}) {
  const [index, setIndex] = useState(0)
  const { data: session } = useSession()
  const [quantity, setQuantity] = useState<number | undefined>(1)

  const router = useRouter()
  const queryClient = useQueryClient()
  const { id: productId } = router.query

  const [editorState] = useState<EditorState | undefined>(() =>
    props.product.contents
      ? EditorState.createWithContent(
          convertFromRaw(JSON.parse(props.product.contents)),
        )
      : EditorState.createEmpty(),
  )

  const { data: wishlist } = useQuery([GET_WISHLIST_QUERY_KEY], () =>
    fetch(GET_WISHLIST_QUERY_KEY)
      .then((res) => res.json())
      .then((data) => data.items),
  )

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { mutate } = useMutation<unknown, unknown, string, any>(
    (productId) =>
      fetch(UPDATE_WISHLIST_QUERY_KEY, {
        method: 'POST',
        body: JSON.stringify({ productId }),
      })
        .then((res) => res.json())
        .then((data) => data.items),
    {
      onMutate: async (productId) => {
        await queryClient.cancelQueries({ queryKey: [GET_WISHLIST_QUERY_KEY] })

        const previous = queryClient.getQueryData([GET_WISHLIST_QUERY_KEY])

        queryClient.setQueryData<string[]>([GET_WISHLIST_QUERY_KEY], (old) =>
          old
            ? old.includes(String(productId))
              ? old.filter((id) => id !== String(productId))
              : old.concat(String(productId))
            : [],
        )

        // Return a context object with the snapshotted value
        return { previousTodos: previous }
      },
      onError: (__, _, context) => {
        queryClient.setQueryData([GET_WISHLIST_QUERY_KEY], context.previous)
      },
      onSuccess: () => {
        queryClient.invalidateQueries([GET_WISHLIST_QUERY_KEY])
      },
    },
  )

  const { mutate: addCart /*, isLoading*/ } = useMutation<
    unknown,
    unknown,
    Omit<Cart, 'id' | 'userId'>,
    unknown
  >(
    (item) =>
      fetch(ADD_CART_QUERY_KEY, {
        method: 'POST',
        body: JSON.stringify({ item }),
      })
        .then((res) => res.json())
        .then((data) => data.items),
    {
      onMutate: () => {
        queryClient.invalidateQueries([GET_CART_QUERY_KEY])
      },
      onSuccess: () => {
        router.push('/cart')
      },
    },
  )

  const { mutate: addOrder } = useMutation<
    unknown,
    unknown,
    Omit<OrderItem, 'id'>[],
    unknown
  >(
    (items) =>
      fetch(ADD_ORDER_QUERY_KEY, {
        method: 'POST',
        body: JSON.stringify({ items }),
      })
        .then((data) => data.json())
        .then((res) => res.items),
    {
      onMutate: () => {
        queryClient.invalidateQueries([GET_ORDER_QUERY_KEY])
      },
      onSuccess: () => {
        router.push('/my')
      },
    },
  )

  const product = props.product

  const validate = (type: 'cart' | 'order') => {
    if (quantity == null) {
      alert('최소 수량을 선택하세요.')
      return
    }

    // TODO: 장바구니에 등록하는 기능 추가
    if (type === 'cart') {
      addCart({
        productId: product.id,
        quantity: quantity,
        amount: product.price * quantity,
      })
    }
    if (type === 'order') {
      addOrder([
        {
          productId: product.id,
          quantity: quantity,
          price: product.price,
          amount: product.price * quantity,
        },
      ])
    }
  }

  const isWished =
    wishlist != null && productId != null
      ? wishlist.includes(String(productId))
      : false

  return (
    <>
      {product != null && productId != null ? (
        <div className="flex flex-row justify-center">
          <Head>
            <title>{product.name}</title>
            <meta name="desciprtion" content="commerce service LeeJuhong" />
          </Head>
          <div style={{ maxWidth: 600, marginRight: 52 }}>
            <Carousel
              animation="fade"
              withoutControls={true}
              wrapAround
              speed={10}
              slideIndex={index}
            >
              {product.images.map((url, idx) => (
                <Image
                  key={`${url}-carousel-${idx}`}
                  src={url}
                  alt="image"
                  width={620}
                  height={780}
                  priority={true}
                />
              ))}
            </Carousel>
            <div className="flex space-x-4 mt-2">
              {product.images.map((url, idx) => (
                <div key={`${url}-thumb-${idx}`} onClick={() => setIndex(idx)}>
                  <Image
                    src={url}
                    alt="image"
                    height={155}
                    width={195}
                    priority={false}
                  />
                </div>
              ))}
            </div>
            {editorState != null && (
              <CustomEditor editorState={editorState} readOnly />
            )}
            <div className="flex flex-col gap-2 mb-6">
              <p className="text-2xl font-semibold">후기</p>
              {props.comments && props.comments.length > 0 ? (
                props.comments.map((comment, idx) => (
                  <CommentItem key={idx} item={comment} />
                ))
              ) : (
                <>아직 작성된 후기가 없습니다.</>
              )}
            </div>
          </div>
          <div style={{ maxWidth: 600 }} className="flex flex-col space-y-6">
            <div className="text-lg text-zinc-400">
              {CATEGORY_MAP[product.category_id ? product.category_id - 1 : 0]}
            </div>
            <div className="text-4xl font-semibold">{product.name}</div>
            <div className="text-lg">
              {product.price.toLocaleString('ko-kr')}원
            </div>
            <div>
              <span className="text-lg">수량</span>
              <CountControl value={quantity} setValue={setQuantity} max={200} />
            </div>
            <div className="flex space-x-3">
              <Button
                leftIcon={<IconShoppingCart size={20} stroke={1.5} />}
                style={{ backgroundColor: 'black' }}
                radius="xl"
                size="md"
                styles={{
                  root: { paddingRight: 14, height: 48 },
                }}
                onClick={() => {
                  if (session == null) {
                    alert('로그인이 필요해요')
                    router.push('/auth/login')
                    return
                  }
                  validate('cart')
                  mutate(String(productId))
                }}
              >
                장바구니
              </Button>
              <Button
                disabled={session == null}
                leftIcon={
                  isWished ? (
                    <IconHeart size={20} stroke={1.5} />
                  ) : (
                    <IconHeartbeat size={20} stroke={1.5} />
                  )
                }
                style={{ backgroundColor: isWished ? 'red' : 'grey' }}
                radius="xl"
                size="md"
                styles={{
                  root: { paddingRight: 14, height: 48 },
                }}
                onClick={() => {
                  if (session == null) {
                    alert('로그인이 필요해요')
                    router.push('/auth/login')
                    return
                  }
                  mutate(String(productId))
                }}
              >
                찜하기
              </Button>
            </div>
            <Button
              style={{ backgroundColor: 'black' }}
              radius="xl"
              size="md"
              styles={{
                root: { paddingRight: 14, height: 48 },
              }}
              onClick={() => {
                if (session == null) {
                  alert('로그인이 필요해요')
                  router.push('/auth/login')
                  return
                }
                validate('order')
              }}
            >
              구매하기
            </Button>
            <div className="text-sm text-zinc-300">
              등록 : {format(new Date(product.createdAt), 'yyyy년 M월 d일')}
            </div>
          </div>
        </div>
      ) : (
        <div>로딩중...</div>
      )}
    </>
  )
}
