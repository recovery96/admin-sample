import { useNavigate, useParams } from 'react-router-dom'
import {
  Button,
  Card,
  CardContent,
  Grid,
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

import UserFormDialog from '@/components/users/UserFormDialog'
import ConfirmDialog from '@/components/common/ConfirmDiaolg'
import { useDialog } from '@/hooks/useDialog'
import { useConfirm } from '@/hooks/useConfirm'
import {
  useDeleteUserMutation,
  useFetchUserQuery,
} from '@/services/users/queries'

export default function User() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const { isOpen, handleOpen, handleClose } = useDialog()
  const {
    isOpen: isConfirmDialogOpen,
    confirm,
    handleConfirm,
    handleCancel,
  } = useConfirm()

  const { data: { email, createdAt, updatedAt } = {}, isFetching } =
    useFetchUserQuery(id)

  const { mutate } = useDeleteUserMutation(id, {
    onSuccess: () => {
      toast.success('유저가 삭제되었습니다.')
      navigate('/users')
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
        유저상세정보
      </Typography>

      <Stack direction="row" justifyContent="end" spacing={1} sx={{ mb: 2 }}>
        <Button
          variant="contained"
          color="success"
          startIcon={<EditIcon />}
          onClick={handleOpen}
        >
          유저수정
        </Button>

        <Button
          variant="contained"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={handleDeleteBtnClick}
        >
          유저삭제
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
              <Typography variant="subtitle1">이메일</Typography>
            </Grid>
            <Grid item xs={8} sm={10}>
              <Typography variant="body1">{email || '-'}</Typography>
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
          </Grid>
        </CardContent>
      </Card>

      {isOpen && (
        <UserFormDialog
          open={isOpen}
          onClose={handleClose}
          initialFormValues={{
            email: email || '',
          }}
        />
      )}
      {isConfirmDialogOpen && (
        <ConfirmDialog
          open={isConfirmDialogOpen}
          message="회원을 삭제하시겠습니까?"
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </>
  )
}
