import { type PropsWithChildren } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { useAuth } from '@/hooks/useAuth'
import { paths } from '@/constants'

const publicPaths = ['/login']

export default function ProtectedRouteWrapper({ children }: PropsWithChildren) {
  const location = useLocation()
  const { token } = useAuth()

  const isAuthenticated = !!token

  const pathname = location.pathname
  const isPublicPath = publicPaths.includes(pathname)

  // 루트 경로('/')에 대한 처리
  if (pathname === '/') {
    // 인증된 사용자는 통계 페이지로, 그렇지 않은 경우 로그인 페이지로 리다이렉트
    return <Navigate to={isAuthenticated ? paths.private : paths.public} />
  }

  // 인증되지 않은 사용자가 비공개 경로에 접근 시 로그인 페이지로 리다이렉트
  if (!isAuthenticated && !isPublicPath) {
    return <Navigate to={paths.public} />
  }

  // 인증된 사용자가 공개 경로에 접근 시 통계 페이지로 리다이렉트
  if (isAuthenticated && isPublicPath) {
    return <Navigate to={paths.private} />
  }

  // 위 조건에 해당하지 않는 경우, 자식 컴포넌트 렌더링
  return children
}
