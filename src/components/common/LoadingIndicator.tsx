import { useEffect } from 'react'
import nProgress from 'nprogress'

export default function LoadingIndicator() {
  useEffect(() => {
    nProgress.start()

    return () => {
      nProgress.done()
    }
  })

  return null
}
