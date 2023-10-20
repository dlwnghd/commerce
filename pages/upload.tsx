/**
 * FILENAME   : upload.tsx
 * PURPOSE    : 이미지 업로드 테스트 페이지
 * AUTHOR     : Lee Juhong
 * CREATEDATE : 2023-10-20
 * UPDATEDATE : -
 */

import styled from '@emotion/styled'
import Image from 'next/image'
import { useRef, useState } from 'react'

import Button from '@@components/Button'

export default function ImageUpload() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [image, setImage] = useState('')

  const handleUpload = () => {
    if (inputRef.current && inputRef.current.files) {
      const fd = new FormData()

      fd.append(
        'image',
        inputRef.current.files[0],
        inputRef.current.files[0].name,
      )
      fetch(
        `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}&expiration=15552000`,
        {
          method: 'POST',
          body: fd,
        },
      )
        .then((res) => res.json())
        .then((data) => {
          console.log(data)

          setImage(data.data.image.url)
        })
        .catch((error) => console.log(error))
    }
  }

  return (
    <div>
      <input ref={inputRef} type="file" accept="image/*" />
      <Button onClick={handleUpload}>업로드</Button>
      {image !== '' && (
        <AutoSizeImageWrapper>
          <Image src={image} layout="fill" objectFit="contain" alt="" />
        </AutoSizeImageWrapper>
      )}
    </div>
  )
}

const AutoSizeImageWrapper = styled.div`
  width: 500px;
  height: 500px;
  position: relative;
`
