import TestButton from '@components/TestButton'
import { css } from '@emotion/react'
import { Inter } from 'next/font/google'
import { useEffect, useRef, useState } from 'react'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const inputRef = useRef<HTMLInputElement>(null)
  // const [products, setProducts] = useState<
  //   { id: string; properties: { id: string }[] }[]
  // >([])
  const [products, setProducts] = useState<
    {
      id: number
      name: string
      image_url: string
      category_id: number
      createdAt: string
    }[]
  >([])
  // useEffect(() => {
  //   fetch('/api/get-items')
  //     .then((res) => res.json())
  //     .then((data) => setProducts(data.items))
  // }, [])
  useEffect(() => {
    fetch('/api/get-products')
      .then((res) => res.json())
      .then((data) => setProducts(data.items))
  }, [])

  const handleClick = () => {
    if (inputRef.current == null || inputRef.current.value === '') {
      return alert('name을 넣어주세요.')
    }

    fetch(`/api/add-item?name=${inputRef.current.value}`)
      .then((res) => res.json())
      .then((data) => alert(data.message))
  }

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <div>
        <input
          className="placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 pl-3 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
          ref={inputRef}
          type="text"
          placeholder="name"
        />
        <button
          css={css`
            background-color: hotpink;
            padding: 16px;
            border-radius: 8px;
          `}
          onClick={handleClick}
        >
          Add Jacket
        </button>
        <TestButton onClick={handleClick}>Add Jacket2</TestButton>
        <div>
          <p>Product List</p>
          {products &&
            products.map((item) => (
              <div key={item.id}>
                {item.name}
                <span>{item.createdAt}</span>
              </div>
            ))}
          {/* {products &&
            products.map((item) => (
              <div key={item.id}>
                {JSON.stringify(item)}
                {item.properties &&
                  Object.entries(item.properties).map(([key, value]) => (
                    <button
                      key={key}
                      onClick={() => {
                        fetch(
                          `api/get-detail?pageId=${item.id}&propertyId=${value.id}`,
                        )
                          .then((res) => res.json())
                          .then((data) => alert(JSON.stringify(data.detail)))
                      }}
                    >
                      {key}
                    </button>
                  ))}
                <br />
                <br />
              </div>
            ))} */}
        </div>
      </div>
    </main>
  )
}
