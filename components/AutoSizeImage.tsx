/**
 * FILENAME   : AutoSizeImage.tsx
 * PURPOSE    : 이미지 크기 자동조절 컴포넌트
 * AUTHOR     : Lee Juhong
 * CREATEDATE : 2023-10-20
 * UPDATEDATE : -
 */

import styled from '@emotion/styled'
import Image from 'next/image'

export default function AutoSizeImage({
  src,
  size = 500,
}: {
  src: string
  size?: number
}) {
  return (
    <AutoSizeImageWrapper size={size}>
      <Image src={src} layout="fill" objectFit="contain" alt="" />
    </AutoSizeImageWrapper>
  )
}

const AutoSizeImageWrapper = styled.div<{ size: number }>`
  width: ${(props) => (props.size ? `${props.size}px` : '500px')};
  height: ${(props) => (props.size ? `${props.size}px` : '500px')};
  position: relative;
`
