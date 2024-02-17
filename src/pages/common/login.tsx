import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Box,
  FormHelperText,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { LoadingButton } from '@mui/lab'

import { useSigninMutation } from '@/services/auth/queries'
import { subtitle, title } from '@/constants'
import type { SigninFormValues } from '@/models/auth.model'

const schema = z.object({
  email: z
    .string()
    .min(1, { message: '이메일을 입력해주세요.' })
    .email({ message: '이메일 형식이 올바르지 않습니다.' }),
  password: z.string().min(1, { message: '비밀번호를 입력해주세요.' }),
})

export default function Login() {
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: 'tester@gmail.com',
      password: 'tester123!',
      submit: null,
    },
    resolver: zodResolver(schema),
  })

  const { mutate, isPending } = useSigninMutation({
    onError: () => {
      setError('submit', {
        message: '이메일 또는 비밀번호가 올바르지 않습니다.',
      })
    },
  })

  const onSubmit = (data: SigninFormValues) => {
    mutate(data)
  }

  const handleInputChange = () => {
    clearErrors('submit')
  }

  return (
    <Grid container>
      <Grid
        item
        xs={0}
        md={8}
        sx={{
          background:
            'radial-gradient(50% 50% at 50% 50%, #122647 0%, #090E23 100%)',
          minHeight: '100vh',
        }}
      ></Grid>

      <Grid
        item
        xs={12}
        md={4}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            width: '100%',
            backgroundColor: 'background.paper',
            p: 4,
          }}
        >
          <Stack spacing={1} sx={{ mb: 3 }}>
            <Typography variant="h4">{title} 로그인</Typography>
            <Typography color="text.secondary" variant="body2">
              {title} {subtitle}에 오신 것을 환영합니다.
            </Typography>
          </Stack>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
              <TextField
                {...register('email', { onChange: handleInputChange })}
                label="Email"
                InputLabelProps={{ shrink: true }}
                autoComplete="email"
                error={!!errors.email}
                helperText={errors.email?.message}
              />
              <TextField
                type="password"
                {...register('password', { onChange: handleInputChange })}
                label="Password"
                InputLabelProps={{ shrink: true }}
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            </Stack>

            {errors.submit && (
              <FormHelperText sx={{ mt: 1, ml: 1 }} error>
                {errors.submit?.message}
              </FormHelperText>
            )}

            <LoadingButton
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3 }}
              loading={isPending}
              disabled={isPending}
              size="large"
            >
              로그인
            </LoadingButton>
          </form>
        </Box>
      </Grid>
    </Grid>
  )
}
