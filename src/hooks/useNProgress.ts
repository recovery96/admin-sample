import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import nProgress from 'nprogress'

export function useNProgress() {
  const location = useLocation()

  useEffect(() => {
    nProgress.done()

    return () => {
      nProgress.start()
    }
  }, [location.pathname])
}
