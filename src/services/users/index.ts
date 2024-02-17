import { type AxiosResponse } from 'axios'

import { instance } from '@/services'
import type { User, UserList, UserFilter, UserData } from '@/models/user.model'

export const userAPI = {
  fetchUserList: (filter: UserFilter): Promise<AxiosResponse<UserList>> =>
    instance.get('/users', { params: filter }),

  fetchUser: (id: string): Promise<AxiosResponse<User>> =>
    instance.get(`/users/${id}`),

  createUser: (data: UserData): Promise<AxiosResponse<User>> =>
    instance.post('/users', data),

  updateUser: (id: string, data: UserData): Promise<AxiosResponse<User>> =>
    instance.put(`/users/${id}`, data),

  deleteUser: (id: string): Promise<AxiosResponse> =>
    instance.delete(`/users/${id}`),

  deleteUserBulk: (ids: string[]): Promise<AxiosResponse> =>
    instance.post(`/users/bulk-delete`, { ids }),
}
