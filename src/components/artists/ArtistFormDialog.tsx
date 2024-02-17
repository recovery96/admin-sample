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
  useCreateAritstMutation,
  useUpdateAritstMutation,
} from '@/services/artists/queries'

const schema = z.object({
  name: z.string().min(1, { message: '이름을 입력해주세요.' }),
  twitter: z.string().optional(),
  pixiv: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

interface ArtistFormDialogProps {
  open: boolean
  onClose: () => void
  initialFormValues?: FormValues
}

export default function ArtistFormDialog({
  open,
  onClose,
  initialFormValues,
}: ArtistFormDialogProps) {
  const { id = '' } = useParams()
  const methods = useForm({
    defaultValues: {
      name: '',
      twitter: '',
      pixiv: '',
    },
    resolver: zodResolver(schema),
  })
  const { isDesktop } = useResponsive()
  const isCreate = !id

  const { mutate: createMutate, isPending: isCreatePending } =
    useCreateAritstMutation({
      onSuccess: () => {
        toast.success('작가가 등록되었습니다.')
        onClose()
      },
    })

  const { mutate: updateMutate, isPending: isUpdatePending } =
    useUpdateAritstMutation(id, {
      onSuccess: () => {
        toast.success('작가가 수정되었습니다.')
        onClose()
      },
    })

  const onSubmit = (data: FormValues) => {
    isCreate ? createMutate(data) : updateMutate(data)
  }

  useEffect(() => {
    if (isCreate) return

    methods.reset({
      name: initialFormValues?.name || '',
      twitter: initialFormValues?.twitter || '',
      pixiv: initialFormValues?.pixiv || '',
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
        <DialogTitle>작가 {isCreate ? '등록' : '수정'}</DialogTitle>

        <DialogContent>
          <Stack spacing={2} mt={0.5}>
            <CommonTextField name="name" label="이름" required />
            <CommonTextField name="twitter" label="트위터" />
            <CommonTextField name="pixiv" label="픽시브" />
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
