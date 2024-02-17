import { Box, Card, CardContent, Grid, Stack, Typography } from '@mui/material'
import {
  Image as ImageIcon,
  Palette as PaletteIcon,
  Person as PersonIcon,
} from '@mui/icons-material'

import { useFetchPostListQuery } from '@/services/posts/queries'
import { useFetchUserListQuery } from '@/services/users/queries'
import { useFetchAritstListQuery } from '@/services/artists/queries'

export default function Statistics() {
  const pagination = {
    page: 0,
    rowsPerPage: 10,
  }

  const { data: { totalElements: postTotalElements = 0 } = {} } =
    useFetchPostListQuery({
      page: pagination.page,
      rowsPerPage: pagination.rowsPerPage,
    })
  const { data: { totalElements: userTotalElements = 0 } = {} } =
    useFetchUserListQuery({
      page: pagination.page,
      rowsPerPage: pagination.rowsPerPage,
    })
  const { data: { totalElements: artistTotalElements = 0 } = {} } =
    useFetchAritstListQuery({
      page: pagination.page,
      rowsPerPage: pagination.rowsPerPage,
    })

  return (
    <>
      <Typography variant="h5" component="h1" gutterBottom>
        통계현황
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={3}>
                <ImageIcon color="primary" fontSize="large" />

                <Box>
                  <Typography
                    variant="body1"
                    component="p"
                    color="text.secondary"
                  >
                    작품
                  </Typography>
                  <Typography variant="h5" component="div">
                    {postTotalElements}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={3}>
                <PersonIcon color="primary" fontSize="large" />

                <Box>
                  <Typography
                    variant="body1"
                    component="p"
                    color="text.secondary"
                  >
                    회원
                  </Typography>
                  <Typography variant="h5" component="div">
                    {userTotalElements}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={3}>
                <PaletteIcon color="primary" fontSize="large" />

                <Box>
                  <Typography
                    variant="body1"
                    component="p"
                    color="text.secondary"
                  >
                    작가
                  </Typography>
                  <Typography variant="h5" component="div">
                    {artistTotalElements}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  )
}
