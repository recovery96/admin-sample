import { useNavigate, useParams } from 'react-router-dom'
import {
  Button,
  Card,
  CardContent,
  Grid,
  Link,
  Stack,
  Typography,
} from '@mui/material'
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  List as ListIcon,
} from '@mui/icons-material'
import dayjs from 'dayjs'
import toast from 'react-hot-toast'

import ArtistFormDialog from '@/components/artists/ArtistFormDialog'
import ConfirmDialog from '@/components/common/ConfirmDiaolg'
import { useDialog } from '@/hooks/useDialog'
import { useConfirm } from '@/hooks/useConfirm'
import {
  useDeleteAritstMutation,
  useFetchAritstQuery,
} from '@/services/artists/queries'

export default function Artist() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const { isOpen, handleOpen, handleClose } = useDialog()
  const {
    isOpen: isConfirmDialogOpen,
    confirm,
    handleConfirm,
    handleCancel,
  } = useConfirm()

  const {
    data: { name, createdAt, updatedAt, twitter, pixiv } = {},
    isFetching,
  } = useFetchAritstQuery(id)

  const { mutate } = useDeleteAritstMutation(id, {
    onSuccess: () => {
      toast.success('작가가 삭제되었습니다.')
      navigate('/artists')
    },
  })

  if (isFetching) return <div>loading...</div>

  const handleBackBtnClick = () => {
    navigate(-1)
  }

  const handleDeleteBtnClick = async () => {
    if (!(await confirm())) return

    mutate()
  }

  return (
    <>
      <Typography variant="h5" component="h1" gutterBottom>
        작가상세정보
      </Typography>

      <Stack direction="row" justifyContent="end" spacing={1} sx={{ mb: 2 }}>
        <Button
          variant="contained"
          color="success"
          startIcon={<EditIcon />}
          onClick={handleOpen}
        >
          작가수정
        </Button>

        <Button
          variant="contained"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={handleDeleteBtnClick}
        >
          작가삭제
        </Button>

        <Button
          variant="contained"
          color="primary"
          startIcon={<ListIcon />}
          onClick={handleBackBtnClick}
        >
          돌아가기
        </Button>
      </Stack>

      <Stack spacing={2}>
        <Card>
          <CardContent>
            <Typography gutterBottom variant="h6" component="div">
              기본정보
            </Typography>

            <Grid container spacing={2} mt={1}>
              <Grid item xs={4} sm={2}>
                <Typography variant="subtitle1">이름</Typography>
              </Grid>
              <Grid item xs={8} sm={10}>
                <Typography variant="body1">{name || '-'}</Typography>
              </Grid>

              <Grid item xs={4} sm={2}>
                <Typography variant="subtitle1">등록일</Typography>
              </Grid>
              <Grid item xs={8} sm={4}>
                <Typography variant="body1">
                  {createdAt
                    ? dayjs(createdAt).format('YYYY-MM-DD HH:mm:ss')
                    : '-'}
                </Typography>
              </Grid>

              <Grid item xs={4} sm={2}>
                <Typography variant="subtitle1">수정일</Typography>
              </Grid>
              <Grid item xs={8} sm={4}>
                <Typography variant="body1" component="a">
                  {updatedAt
                    ? dayjs(updatedAt).format('YYYY-MM-DD HH:mm:ss')
                    : '-'}
                </Typography>
              </Grid>

              <Grid item xs={4} sm={2}>
                <Typography variant="subtitle1">트위터 (X)</Typography>
              </Grid>
              <Grid item xs={8} sm={4}>
                {twitter ? (
                  <Link href={`https://twitter.com/${twitter}`} target="_blank">
                    {twitter}
                  </Link>
                ) : (
                  <Typography variant="body1">-</Typography>
                )}
              </Grid>

              <Grid item xs={4} sm={2}>
                <Typography variant="subtitle1">픽시브</Typography>
              </Grid>
              <Grid item xs={8} sm={4}>
                {pixiv ? (
                  <Link
                    href={`https://pixiv.net/users/${pixiv}`}
                    target="_blank"
                  >
                    {pixiv}
                  </Link>
                ) : (
                  <Typography variant="body1">-</Typography>
                )}
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Stack>

      {isOpen && (
        <ArtistFormDialog
          open={isOpen}
          onClose={handleClose}
          initialFormValues={{
            name: name || '',
            twitter: twitter || '',
            pixiv: pixiv || '',
          }}
        />
      )}
      {isConfirmDialogOpen && (
        <ConfirmDialog
          open={isConfirmDialogOpen}
          message="작가를 삭제하시겠습니까?"
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </>
  )
}
