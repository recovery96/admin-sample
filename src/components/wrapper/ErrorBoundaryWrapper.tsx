import { type PropsWithChildren } from 'react'
import { Link } from 'react-router-dom'
import { ErrorBoundary } from 'react-error-boundary'
import { Box, Button, Container, Typography } from '@mui/material'

export default function ErrorBoundaryWrapper({ children }: PropsWithChildren) {
  return <ErrorBoundary FallbackComponent={Fallback}>{children}</ErrorBoundary>
}

const Fallback = () => {
  return (
    <Box
      component="main"
      sx={{ display: 'flex', alignItems: 'center', width: 1, height: '100vh' }}
    >
      <Container maxWidth="sm">
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          알 수 없는 오류가 발생했습니다.
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary">
          지속적으로 발생할 경우 관리자에게 문의해주세요.
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
