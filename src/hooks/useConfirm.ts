import { useState } from 'react'

export function useConfirm() {
  const [isOpen, setIsOpen] = useState(false)
  const [promise, setPromise] = useState<{
    resolve: (value: boolean) => void
  } | null>(null)

  const confirm = () => {
    setIsOpen(true)
    return new Promise<boolean>((resolve) => {
      setPromise({ resolve })
    })
  }

  const handleConfirm = () => {
    setIsOpen(false)
    promise?.resolve(true)
  }

  const handleCancel = () => {
    setIsOpen(false)
    promise?.resolve(false)
  }

  return {
    isOpen,
    confirm,
    handleConfirm,
    handleCancel,
  }
}
