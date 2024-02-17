import { PropsWithChildren, useState } from 'react'

import GNB from './components//GNB'
import SNB from './components//SNB'
import Dashboard from './components/Dashboard'
import { LayoutContext } from './context'
import { SNBItemMap } from './models'

interface LayoutProps {
  isDesktop?: boolean
}

const Layout = ({ isDesktop, children }: PropsWithChildren<LayoutProps>) => {
  const [isSNBOpen, setIsSNBOpen] = useState(true)
  const [isSNBItemOpenMap, setIsSNBItemOpenMap] = useState<SNBItemMap>({})

  const toggleSNB = () => {
    setIsSNBOpen((prev) => !prev)
  }

  const toggleSNBItemMap = (key: string) => {
    setIsSNBItemOpenMap((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  return (
    <LayoutContext.Provider
      value={{
        isDesktop,
        isSNBOpen,
        isSNBItemOpenMap,
        toggleSNB,
        toggleSNBItemMap,
      }}
    >
      {children}
    </LayoutContext.Provider>
  )
}

Layout.GNB = GNB
Layout.SNB = SNB
Layout.Dashboard = Dashboard

export default Layout
