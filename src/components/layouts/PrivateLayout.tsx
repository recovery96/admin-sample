import { Outlet } from 'react-router-dom'

import ErrorBoundaryWrapper from '@/components/wrapper/ErrorBoundaryWrapper'
import SuspenseWrapper from '@/components/wrapper/SuspenseWrapper'
import CommonLayout from '@/components/common/CommonLayout'
import { useResponsive } from '@/hooks/useResponsive'
import { useNProgress } from '@/hooks/useNProgress'
import { useAuth } from '@/hooks/useAuth'
import { privateRoutes as routes } from '@/routes'
import { title, subtitle, version } from '@/constants'

export default function PrivateLayout() {
  const { isDesktop } = useResponsive()
  const { email, signout } = useAuth()
  useNProgress()

  return (
    <ErrorBoundaryWrapper>
      <CommonLayout isDesktop={isDesktop}>
        <CommonLayout.GNB
          username={isDesktop ? email : email.split('@')[0] || '-'}
          onSignout={signout}
        />
        <CommonLayout.SNB
          title={title}
          subtitle={subtitle}
          version={version}
          routes={routes}
        />
        <CommonLayout.Dashboard>
          <SuspenseWrapper>
            <Outlet />
          </SuspenseWrapper>
        </CommonLayout.Dashboard>
      </CommonLayout>
    </ErrorBoundaryWrapper>
  )
}
