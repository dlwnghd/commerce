/**
 * FILENAME   : products.ts
 * PURPOSE    : 상품 정보
 * AUTHOR     : Lee Juhong
 * CREATEDATE : 2023-10-10
 * UPDATEDATE : -
 */

/* eslint-disable indent */
export const CATEGORY_MAP = ['Sneakers', 'T-Shirt', 'Pants', 'Cap', 'Hoodie']

export const TAKE = 9

export const FILTERS = [
  {
    label: '최신순',
    value: 'latest',
  },
  {
    label: '가격 높은 순',
    value: 'expensive',
  },
  {
    label: '가격 낮은 순',
    value: 'cheap',
  },
]

export const getOrderBy = (orderBy?: string) => {
  return orderBy
    ? orderBy === 'latest'
      ? { orderBy: { createdAt: 'desc' } }
      : orderBy === 'expensive'
      ? { orderBy: { price: 'desc' } }
      : { orderBy: { price: 'asc' } }
    : undefined
}
