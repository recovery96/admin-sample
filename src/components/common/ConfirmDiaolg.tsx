import { Button, Dialog, DialogActions, DialogContent } from '@mui/material'

interface ConfirmDialogProps {
  open: boolean
  message: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDialog({
  open,
  message,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Dialog fullWidth maxWidth="xs" open={open}>
      <DialogContent>{message}</DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onCancel}>
          취소
        </Button>
        <Button variant="contained" onClick={onConfirm}>
          확인
        </Button>
      </DialogActions>
    </Dialog>
  )
}
