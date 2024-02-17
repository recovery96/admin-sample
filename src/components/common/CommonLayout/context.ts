import { createContext } from 'react'
import { SNBItemMap } from './models'

interface LayoutContextInterface {
  isDesktop?: boolean
  isSNBOpen: boolean
  isSNBItemOpenMap: SNBItemMap
  toggleSNB: () => void
  toggleSNBItemMap: (key: string) => void
}

const defaultLayoutContext: LayoutContextInterface = {
  isDesktop: true,
  isSNBOpen: false,
  isSNBItemOpenMap: {},
  toggleSNB: () => {},
  toggleSNBItemMap: () => {},
}

export const LayoutContext =
  createContext<LayoutContextInterface>(defaultLayoutContext)
