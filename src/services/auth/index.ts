import { type AxiosResponse } from 'axios'

import { instance } from '@/services'
import type { SigninData, SigninResponse } from '@/models/auth.model'

export const authAPI = {
  signin: (data: SigninData): Promise<AxiosResponse<SigninResponse>> =>
    instance.post('/auth/signin', data),
}
