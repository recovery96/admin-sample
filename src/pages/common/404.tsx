import { Link } from 'react-router-dom'
import { Box, Button, Container, Typography } from '@mui/material'

export default function NotFound() {
  return (
    <Box
      component="main"
      sx={{ display: 'flex', alignItems: 'center', width: 1, height: '100vh' }}
    >
      <Container maxWidth="sm">
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          페이지를 찾을 수 없습니다.
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button component={Link} to="/">
            홈으로 돌아가기
          </Button>
        </Box>
      </Container>
    </Box>
  )
}
