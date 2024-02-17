import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Button, IconButton, Stack, Typography } from '@mui/material'
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Search as SearchIcon,
} from '@mui/icons-material'
import dayjs from 'dayjs'
import toast from 'react-hot-toast'

import CommonTable from '@/components/common/CommonTable'
import ArtistFormDialog from '@/components/artists/ArtistFormDialog'
import ConfirmDialog from '@/components/common/ConfirmDiaolg'
import { useDialog } from '@/hooks/useDialog'
import { useConfirm } from '@/hooks/useConfirm'
import {
  useDeleteAritstBulkMutation,
  useFetchAritstListQuery,
} from '@/services/artists/queries'
import type { Column, Row, Sort } from '@/components/common/CommonTable/models'

export default function Artists() {
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
      return orderBy && ['name', 'createdAt', 'updatedAt'].includes(orderBy)
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
    useFetchAritstListQuery({
      page: pagination.page,
      rowsPerPage: pagination.rowsPerPage,
      sort: `${sort.orderBy},${sort.order}`,
    })

  const { mutate } = useDeleteAritstBulkMutation({
    onSuccess: () => {
      setSelection([])
      toast.success('작가가 삭제되었습니다.')
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

  const rows: Row[] = content.map((artist, i) => ({
    id: artist.id || '-',
    no: pagination.page * pagination.rowsPerPage + i + 1,
    name: artist.name || '-',
    createdAt: artist.createdAt
      ? dayjs(artist.createdAt).format('YYYY-MM-DD HH:mm:ss')
      : '',
    updatedAt: artist.updatedAt
      ? dayjs(artist.updatedAt).format('YYYY-MM-DD HH:mm:ss')
      : '',
    detail: artist.id ? (
      <IconButton
        sx={{ my: -1 }}
        onClick={() => navigate(`/artists/${artist.id}`)}
      >
        <SearchIcon />
      </IconButton>
    ) : null,
  }))

  const columns: Column[] = [
    { id: 'no', label: 'NO', align: 'center' },
    { id: 'name', label: '이름', sortable: true },
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
        작가목록
      </Typography>

      <Stack direction="row" justifyContent="end" spacing={1} sx={{ mb: 2 }}>
        <Button
          variant="contained"
          color="success"
          startIcon={<AddIcon />}
          onClick={handleOpen}
        >
          작가추가
        </Button>

        <Button
          variant="contained"
          color="error"
          startIcon={<RemoveIcon />}
          onClick={handleDeleteBtnClick}
        >
          작가삭제
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

      {isOpen && <ArtistFormDialog open={isOpen} onClose={handleClose} />}
      {isConfirmDialogOpen && (
        <ConfirmDialog
          open={isConfirmDialogOpen}
          message="선택한 작가를 삭제하시겠습니까?"
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </>
  )
}
