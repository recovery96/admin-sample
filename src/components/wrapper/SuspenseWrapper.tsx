import { Suspense, type PropsWithChildren, useEffect } from 'react'
import nProgress from 'nprogress'

export default function SuspenseWrapper({ children }: PropsWithChildren) {
  return <Suspense fallback={<LoadingIndicator />}>{children}</Suspense>
}

const LoadingIndicator = () => {
  useEffect(() => {
    nProgress.start()

    return () => {
      nProgress.done()
    }
  })

  return null
}
