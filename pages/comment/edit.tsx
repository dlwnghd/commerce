/**
 * FILENAME   : edit.tsx
 * PURPOSE    : 후기 글 작성 페이지
 * AUTHOR     : Lee Juhong
 * CREATEDATE : 2023-10-19
 * UPDATEDATE : 2023-10-20 / 후기 이미지 추가 구현 / Lee Juhong
 */

import { Slider } from '@mantine/core'
import { convertFromRaw, convertToRaw, EditorState } from 'draft-js'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'

import AutoSizeImage from '@@components/AutoSizeImage'
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
  const inputRef = useRef<HTMLInputElement>(null)
  const [images, setImages] = useState<string[]>([])
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
            setImages(data.items.images?.split(',') ?? [])
          } else {
            setEditorState(EditorState.createEmpty())
          }
        })
    }
  }, [orderItemId])

  const handleChange = () => {
    if (
      inputRef.current &&
      inputRef.current.files &&
      inputRef.current.files.length > 0
    ) {
      for (let i = 0; i < inputRef.current.files.length; i++) {
        const fd = new FormData()

        fd.append(
          'image',
          inputRef.current.files[i],
          inputRef.current.files[i].name,
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

            setImages((prev) =>
              Array.from(new Set(prev.concat(data.data.image.url))),
            )
          })
          .catch((error) => console.log(error))
      }
    }
  }

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
          images: images.join(','),
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
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleChange}
      />
      <div style={{ display: 'flex' }}>
        {images &&
          images.length > 0 &&
          images.map((image, idx) => <AutoSizeImage key={idx} src={image} />)}
      </div>
    </div>
  )
}
