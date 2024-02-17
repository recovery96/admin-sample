import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom'
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

import PostFormDialog from '@/components/posts/PostFormDialog'
import ConfirmDialog from '@/components/common/ConfirmDiaolg'
import { useDialog } from '@/hooks/useDialog'
import { useConfirm } from '@/hooks/useConfirm'
import {
  useDeletePostMutation,
  useFetchPostQuery,
} from '@/services/posts/queries'
import { filterOptionsByValue, postTypeOptions } from '@/utils/filter'

export default function Post() {
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
    data: { title, type, artist, createdAt, updatedAt } = {},
    isFetching,
  } = useFetchPostQuery(id)

  const { mutate } = useDeletePostMutation(id, {
    onSuccess: () => {
      toast.success('작품이 삭제되었습니다.')
      navigate('/posts')
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
        작품상세정보
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

      <Card>
        <CardContent>
          <Typography gutterBottom variant="h6" component="div">
            기본정보
          </Typography>

          <Grid container spacing={2} mt={1}>
            <Grid item xs={4} sm={2}>
              <Typography variant="subtitle1">제목</Typography>
            </Grid>
            <Grid item xs={8} sm={4}>
              <Typography variant="body1">{title || '-'}</Typography>
            </Grid>

            <Grid item xs={4} sm={2}>
              <Typography variant="subtitle1">종류</Typography>
            </Grid>
            <Grid item xs={8} sm={4}>
              <Typography variant="body1">
                {type ? filterOptionsByValue(postTypeOptions, type) : '-'}
              </Typography>
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
              <Typography variant="subtitle1">작가</Typography>
            </Grid>
            <Grid item xs={8} sm={4}>
              {artist?.id && artist?.name ? (
                <Link to={`/artists/${artist.id}`} component={RouterLink}>
                  {artist.name || ''}
                </Link>
              ) : null}
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {isOpen && (
        <PostFormDialog
          open={isOpen}
          onClose={handleClose}
          initialFormValues={{
            title: title || '',
            type: type || 'illust',
            artist: {
              label: artist?.name || '',
              value: artist?.id || '',
            },
          }}
        />
      )}
      {isConfirmDialogOpen && (
        <ConfirmDialog
          open={isConfirmDialogOpen}
          message="작품을 삭제하시겠습니까?"
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </>
  )
}
