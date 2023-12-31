/**
 * FILENAME   : CommentItem.tsx
 * PURPOSE    : 후기글 컴포넌트
 * AUTHOR     : Lee Juhong
 * CREATEDATE : 2023-10-19
 * UPDATEDATE : 2023-10-20 / 후기 이미지 추가 / Lee Juhong
 * UPDATEDATE : 2023-10-22 / 후기 UI 수정 / Lee Juhong
 */

import styled from '@emotion/styled'
import { IconStar } from '@tabler/icons-react'
import { format } from 'date-fns'
import { convertFromRaw, EditorState } from 'draft-js'
import { CommentItemType } from 'pages/products/[id]'

import AutoSizeImage from './AutoSizeImage'
import CustomEditor from './Editor'

export default function CommentItem({ item }: { item: CommentItemType }) {
  return (
    <Wrapper>
      <div>
        <div style={{ display: 'flex' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex' }}>
              {Array.from({ length: 5 }).map((_, idx) => (
                <IconStar
                  key={idx}
                  fill={idx < item.rate ? 'red' : 'none'}
                  stroke={idx < item.rate ? 0 : 1}
                />
              ))}
            </div>
            <span className="text-zinc-300 text-xs">
              {item.price.toLocaleString('ko-kr')} 원 * {item.quantity} 개 ={' '}
              {item.amount.toLocaleString('ko-kr')} 원
            </span>
          </div>
          <p className="text-zinc-500 ml-auto">
            {format(new Date(item.updatedAt), 'yyyy년 M월 d일')}
          </p>
        </div>
        <CustomEditor
          editorState={EditorState.createWithContent(
            convertFromRaw(JSON.parse(item.contents ?? '')),
          )}
          readOnly
          noPadding
        />
      </div>
      <div style={{ display: 'flex' }}>
        {item.images &&
          item.images.length > 1 &&
          item.images
            ?.split(',')
            .map((image, idx) => (
              <AutoSizeImage key={idx} src={image} size={150} />
            ))}
      </div>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  border: 1px solid #cccccc;
  border-radius: 8px;
  padding: 8px;
`
