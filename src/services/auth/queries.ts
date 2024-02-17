import { UseMutationOptions, useMutation } from '@tanstack/react-query'

import { useAuth } from '@/hooks/useAuth'
import { authAPI } from '@/services/auth'
import type { SigninData, SigninResponse } from '@/models/auth.model'
import { AxiosResponse } from 'axios'

export const useSigninMutation = ({
  onSuccess,
  ...options
}: UseMutationOptions<
  AxiosResponse<SigninResponse>,
  Error,
  SigninData
> = {}) => {
  const { signin } = useAuth()

  return useMutation({
    mutationFn: (data: SigninData) => authAPI.signin(data),
    onSuccess: (data, values, context) => {
      const { token, email } = data.data
      signin(token, email)
      onSuccess && onSuccess(data, values, context)
    },
    ...options,
  })
}
