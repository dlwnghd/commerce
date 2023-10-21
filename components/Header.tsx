/**
 * FILENAME   : Header.tsx
 * PURPOSE    : 헤더 컴포넌트
 * AUTHOR     : Lee Juhong
 * CREATEDATE : 2023-10-13
 * UPDATEDATE : 2023-10-16 / 찜목록 url경로 수정 / Lee Juhong
 * UPDATEDATE : 2023-10-21 / 로그아웃 Icon 추가 / Lee Juhong
 */

import {
  IconHeart,
  IconHome,
  IconLogout,
  IconShoppingCart,
  IconUser,
} from '@tabler/icons-react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { signOut, useSession } from 'next-auth/react'

export default function Header() {
  const { data: session } = useSession()
  const router = useRouter()

  return (
    <div className="mt-12 mb-12">
      <div className="w-full flex h-50 items-center">
        <IconHome onClick={() => router.push('/')} />
        <span className="m-auto" />
        <IconHeart
          className="mr-4"
          onClick={() =>
            session ? router.push('/wishlist') : router.push('/auth/login')
          }
        />
        <IconShoppingCart
          className="mr-4"
          onClick={() => router.push('/cart')}
        />
        {session ? (
          <div className="flex gap-3 items-center">
            <Image
              alt="profile"
              // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
              src={session.user?.image!}
              width={30}
              height={30}
              style={{ borderRadius: '50%' }}
              onClick={() => router.push('/my')}
            />
            <IconLogout onClick={() => signOut()} />
          </div>
        ) : (
          <IconUser onClick={() => router.push('/auth/login')} />
        )}
      </div>
    </div>
  )
}
