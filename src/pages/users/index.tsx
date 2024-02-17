import { useNavigate, useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Button, IconButton, Stack, Typography } from '@mui/material'
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Search as SearchIcon,
} from '@mui/icons-material'
import dayjs from 'dayjs'
import toast from 'react-hot-toast'

import CommonTable from '@/components/common/CommonTable'
import UserFormDialog from '@/components/users/UserFormDialog'
import ConfirmDialog from '@/components/common/ConfirmDiaolg'
import { useDialog } from '@/hooks/useDialog'
import { useConfirm } from '@/hooks/useConfirm'
import {
  useDeleteUserBulkMutation,
  useFetchUserListQuery,
} from '@/services/users/queries'
import type { Column, Row, Sort } from '@/components/common/CommonTable/models'

export default function Users() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [selection, setSelection] = useState<string[]>([])
  const [pagination, setPagination] = useState({
    page: Number(searchParams.get('page') || 0),
    count: 0,
    rowsPerPage: Number(searchParams.get('rowsPerPage') || 10),
    rowsPerPageOptions: [10, 20, 30],
  })
  const [sort, setSort] = useState<Sort>({
    orderBy: (function () {
      const orderBy = searchParams.get('sort')?.split(',')[0]
      return orderBy && ['email', 'createdAt', 'updatedAt'].includes(orderBy)
        ? orderBy
        : 'createdAt'
    })(),
    order: (function () {
      const order = searchParams.get('sort')?.split(',')[1]
      return order === 'asc' || order === 'desc' ? order : 'desc'
    })(),
  })
  const { isOpen, handleOpen, handleClose } = useDialog()
  const {
    isOpen: isConfirmDialogOpen,
    confirm,
    handleConfirm,
    handleCancel,
  } = useConfirm()

  const { data: { content = [], totalElements = 0 } = {}, isFetching } =
    useFetchUserListQuery({
      page: pagination.page,
      rowsPerPage: pagination.rowsPerPage,
      sort: `${sort.orderBy},${sort.order}`,
    })

  const { mutate } = useDeleteUserBulkMutation({
    onSuccess: () => {
      setSelection([])
      toast.success('유저가 삭제되었습니다.')
    },
  })

  useEffect(() => {
    if (isFetching) return
    setPagination((prev) => ({ ...prev, count: totalElements }))
  }, [isFetching, totalElements])

  useEffect(() => {
    setSearchParams({
      page: pagination.page.toString(),
      rowsPerPage: pagination.rowsPerPage.toString(),
      sort: `${sort.orderBy},${sort.order}`,
    })
  }, [pagination.page, pagination.rowsPerPage, sort, setSearchParams])

  const rows: Row[] = content.map((user, i) => ({
    id: user.id || '-',
    no: pagination.page * pagination.rowsPerPage + i + 1,
    email: user.email || '-',
    createdAt: user.createdAt
      ? dayjs(user.createdAt).format('YYYY-MM-DD HH:mm:ss')
      : '',
    updatedAt: user.updatedAt
      ? dayjs(user.updatedAt).format('YYYY-MM-DD HH:mm:ss')
      : '',
    detail: user.id ? (
      <IconButton sx={{ my: -1 }} onClick={() => navigate(`/users/${user.id}`)}>
        <SearchIcon />
      </IconButton>
    ) : null,
  }))

  const columns: Column[] = [
    { id: 'no', label: 'NO', align: 'center' },
    { id: 'email', label: '이메일', sortable: true },
    { id: 'createdAt', label: '등록일', sortable: true },
    { id: 'updatedAt', label: '수정일', sortable: true },
    { id: 'detail', label: '상세정보' },
  ]

  if (isFetching) return <div>loading...</div>

  const handleDeleteBtnClick = async () => {
    if (selection.length === 0) {
      toast.error('삭제할 작가를 선택해주세요.')
      return
    }

    if (!(await confirm())) return

    mutate(selection)
  }

  return (
    <>
      <Typography variant="h5" component="h1" gutterBottom>
        회원목록
      </Typography>

      <Stack direction="row" justifyContent="end" spacing={1} sx={{ mb: 2 }}>
        <Button
          variant="contained"
          color="success"
          startIcon={<AddIcon />}
          onClick={handleOpen}
        >
          회원추가
        </Button>

        <Button
          variant="contained"
          color="error"
          startIcon={<RemoveIcon />}
          onClick={handleDeleteBtnClick}
        >
          회원삭제
        </Button>
      </Stack>

      <CommonTable
        rows={rows}
        columns={columns}
        pagination={pagination}
        sort={sort}
        selection={selection}
        onPaginationChange={setPagination}
        onSortChange={setSort}
        onSelectionChange={setSelection}
      >
        <CommonTable.Head />
        <CommonTable.Body />
      </CommonTable>

      {isOpen && <UserFormDialog open={isOpen} onClose={handleClose} />}
      {isConfirmDialogOpen && (
        <ConfirmDialog
          open={isConfirmDialogOpen}
          message="선택한 회원을 삭제하시겠습니까?"
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </>
  )
}
