import { useState } from 'react'

export function useDialog(initialOpen = false) {
  const [isOpen, setIsOpen] = useState(initialOpen)

  const handleOpen = () => {
    setIsOpen(true)
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  return {
    isOpen,
    handleOpen,
    handleClose,
  }
}
