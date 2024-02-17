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
import CommonSelectField from '@/components/common/CommonSelectField'
import { useResponsive } from '@/hooks/useResponsive'
import {
  useCreatePostMutation,
  useUpdatePostMutation,
} from '@/services/posts/queries'
import { postTypeOptions } from '@/utils/filter'
import { useFetchAritstListQuery } from '@/services/artists/queries'
import CommonAutocompleteField from '../common/CommonAutocompleteField'

const schema = z.object({
  title: z.string().min(1, { message: '제목을 입력해주세요.' }),
  type: z.enum(['illust', 'manga', 'novel'], {
    errorMap: () => ({ message: '종류를 선택해주세요.' }),
  }),
  artist: z
    .object({
      label: z.string(),
      value: z.string(),
    })
    .refine((value) => value.value, {
      message: '작가를 선택해주세요.',
    }),
})

type FormValues = z.infer<typeof schema>

interface PostFormDialogProps {
  open: boolean
  onClose: () => void
  initialFormValues?: FormValues
}

export default function PostFormDialog({
  open,
  onClose,
  initialFormValues,
}: PostFormDialogProps) {
  const { id = '' } = useParams()
  const methods = useForm<FormValues>({
    defaultValues: {
      title: '',
      type: 'illust',
      artist: {
        label: '',
        value: '',
      },
    },
    resolver: zodResolver(schema),
  })
  const { isDesktop } = useResponsive()
  const isCreate = !id

  const { data: { content = [] } = {} } = useFetchAritstListQuery({
    page: 0,
    // FIXME: 임시적으로 10000개로 설정
    rowsPerPage: 10000,
  })

  const { mutate: createMutate, isPending: isCreatePending } =
    useCreatePostMutation({
      onSuccess: () => {
        toast.success('작가가 등록되었습니다.')
        onClose()
      },
    })

  const { mutate: updateMutate, isPending: isUpdatePending } =
    useUpdatePostMutation(id, {
      onSuccess: () => {
        toast.success('작가가 수정되었습니다.')
        onClose()
      },
    })

  const onSubmit = (data: FormValues) => {
    isCreate
      ? createMutate({ ...data, artistId: data.artist.value })
      : updateMutate({ ...data, artistId: data.artist.value })
  }

  useEffect(() => {
    if (isCreate) return

    methods.reset({
      title: initialFormValues?.title || '',
      type: initialFormValues?.type || 'illust',
      artist: {
        label: initialFormValues?.artist.label || '',
        value: initialFormValues?.artist.value || '',
      },
    })
  }, [isCreate, initialFormValues, methods])

  const artistOptions = content.map((item) => ({
    label: item.name,
    value: item.id,
  }))
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
        <DialogTitle>작품 {isCreate ? '등록' : '수정'}</DialogTitle>

        <DialogContent>
          <Stack spacing={2} mt={0.5}>
            <CommonTextField name="title" label="제목" required />
            <CommonSelectField
              name="type"
              label="종류"
              options={postTypeOptions}
              required
            />
            <CommonAutocompleteField
              name="artist"
              label="작가"
              options={artistOptions}
              required
            />
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
