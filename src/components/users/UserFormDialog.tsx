import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { FormProvider, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from '@mui/material'
import { LoadingButton } from '@mui/lab'
import toast from 'react-hot-toast'

import CommonTextField from '@/components/common/CommonTextField'
import { useResponsive } from '@/hooks/useResponsive'
import {
  useCreateUserMutation,
  useUpdateUserMutation,
} from '@/services/users/queries'

const schema = z.object({
  email: z
    .string()
    .min(1, { message: '이메일을 입력해주세요.' })
    .email({ message: '이메일 형식이 올바르지 않습니다.' }),
})

type FormValues = z.infer<typeof schema>

interface UserFormDialogProps {
  open: boolean
  onClose: () => void
  initialFormValues?: FormValues
}

export default function UserFormDialog({
  open,
  onClose,
  initialFormValues,
}: UserFormDialogProps) {
  const { id = '' } = useParams()
  const methods = useForm({
    defaultValues: {
      email: '',
    },
    resolver: zodResolver(schema),
  })
  const { isDesktop } = useResponsive()
  const isCreate = !id

  const { mutate: createMutate, isPending: isCreatePending } =
    useCreateUserMutation({
      onSuccess: () => {
        toast.success('회원가 등록되었습니다.')
        onClose()
      },
    })

  const { mutate: updateMutate, isPending: isUpdatePending } =
    useUpdateUserMutation(id, {
      onSuccess: () => {
        toast.success('회원가 수정되었습니다.')
        onClose()
      },
    })

  const onSubmit = (data: FormValues) => {
    isCreate ? createMutate(data) : updateMutate(data)
  }

  useEffect(() => {
    if (isCreate) return

    methods.reset({
      email: initialFormValues?.email || '',
    })
  }, [isCreate, initialFormValues, methods])

  const isPending = isCreatePending || isUpdatePending

  return (
    <FormProvider {...methods}>
      <Dialog
        disableRestoreFocus
        fullScreen={!isDesktop}
        fullWidth
        maxWidth="sm"
        open={open}
        onClose={onClose}
        PaperProps={{
          component: 'form',
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault()
            methods.handleSubmit(onSubmit)()
          },
        }}
      >
        <DialogTitle>회원 {isCreate ? '등록' : '수정'}</DialogTitle>

        <DialogContent>
          <Stack spacing={2} mt={0.5}>
            <CommonTextField name="email" label="이메일" required />
          </Stack>
        </DialogContent>

        <DialogActions>
          <LoadingButton type="submit" variant="contained" loading={isPending}>
            {isCreate ? '등록' : '수정'}
          </LoadingButton>
          <LoadingButton
            variant="outlined"
            onClick={onClose}
            loading={isPending}
          >
            취소
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </FormProvider>
  )
}
