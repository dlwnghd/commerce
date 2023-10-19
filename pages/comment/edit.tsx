/**
 * FILENAME   : edit.tsx
 * PURPOSE    : 후기 글 작성 페이지
 * AUTHOR     : Lee Juhong
 * CREATEDATE : 2023-10-19
 * UPDATEDATE : -
 */

import { Slider } from '@mantine/core'
import { convertFromRaw, convertToRaw, EditorState } from 'draft-js'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import CustomEditor from '@@components/Editor'
import {
  GET_COMMENT_QUERY_KEY,
  UPDATE_COMMENT_QUERY_KEY,
} from '@@constants/QueryKey'

const marks = [
  { value: 1, label: '매우 나쁨' },
  { value: 2, label: '나쁨' },
  { value: 3, label: '보통' },
  { value: 4, label: '좋음' },
  { value: 5, label: '매우 좋음' },
]

export default function CommentEdit() {
  const router = useRouter()
  const [rate, setRate] = useState(5)
  const { orderItemId } = router.query
  const [editorState, setEditorState] = useState<EditorState | undefined>(
    undefined,
  )

  useEffect(() => {
    if (orderItemId != null) {
      fetch(`${GET_COMMENT_QUERY_KEY}?orderItemId=${orderItemId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.items?.contents) {
            setEditorState(
              EditorState.createWithContent(
                convertFromRaw(JSON.parse(data.items.contents)),
              ),
            )
            setRate(data.items.rate)
          } else {
            setEditorState(EditorState.createEmpty())
          }
        })
    }
  }, [orderItemId])

  const handleSave = () => {
    if (editorState) {
      fetch(UPDATE_COMMENT_QUERY_KEY, {
        method: 'POST',
        body: JSON.stringify({
          orderItemId: Number(orderItemId),
          rate: rate,
          contents: JSON.stringify(
            convertToRaw(editorState.getCurrentContent()),
          ),
          images: [],
        }),
      })
        .then((res) => res.json())
        .then(() => {
          alert('Success')
          router.back()
        })
    }
  }

  return (
    <div>
      {editorState != null && (
        <CustomEditor
          editorState={editorState}
          onEditorStateChange={setEditorState}
          onSave={handleSave}
        />
      )}
      <Slider
        defaultValue={5}
        min={1}
        max={5}
        step={1}
        marks={marks}
        onChange={setRate}
      />
    </div>
  )
}
