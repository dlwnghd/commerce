/**
 * FILENAME   : Editor.tsx
 * PURPOSE    : 게시판 편집 컴포넌트
 * AUTHOR     : Lee Juhong
 * CREATEDATE : 2023-10-10
 * UPDATEDATE : 2023-10-13 / 컴포넌트명 변경 / Lee Juhong
 * UPDATEDATE : 2023-10-19 / noPadding 추가 / Lee Juhong
 */

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

import styled from '@emotion/styled'
import { EditorState } from 'draft-js'
import dynamic from 'next/dynamic'
import { Dispatch, SetStateAction } from 'react'
import { EditorProps } from 'react-draft-wysiwyg'

import Button from './Button'

const Editor = dynamic<EditorProps>(
  () => import('react-draft-wysiwyg').then((module) => module.Editor),
  {
    ssr: false,
  },
)

export default function CustomEditor({
  editorState,
  readOnly = false,
  noPadding = false,
  onSave,
  onEditorStateChange,
}: {
  editorState: EditorState
  readOnly?: boolean
  noPadding?: boolean
  onSave?: () => void
  onEditorStateChange?: Dispatch<SetStateAction<EditorState | undefined>>
}) {
  return (
    <Wrapper readOnly={readOnly} noPadding={noPadding}>
      <Editor
        readOnly={readOnly}
        editorState={editorState}
        toolbarHidden={readOnly}
        wrapperClassName="wrapper-class"
        toolbarClassName="editorToolbar-hidden"
        editorClassName="editor-class"
        toolbar={{
          options: ['inline', 'list', 'textAlign', 'link'],
        }}
        localization={{
          locale: 'ko',
        }}
        onEditorStateChange={onEditorStateChange}
      />
      {!readOnly && <Button onClick={onSave}>Save</Button>}
    </Wrapper>
  )
}

const Wrapper = styled.div<{ readOnly: boolean; noPadding: boolean }>`
  ${(props) => (props.noPadding ? '' : 'padding: 16px;')}
  ${(props) =>
    props.readOnly ? '' : 'border: 1px solid black; border-radius: 8px;'}
`
