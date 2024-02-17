import { type AxiosResponse } from 'axios'
import {
  UseMutationOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

import { userAPI } from '@/services/users'
import type { UserFilter, UserData, User } from '@/models/user.model'

const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: UserFilter) => [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
}

export const useFetchUserListQuery = (filters: UserFilter) => {
  return useQuery({
    queryKey: userKeys.list(filters),
    queryFn: () => userAPI.fetchUserList(filters),
    select: (data) => data.data,
  })
}

export const useFetchUserQuery = (id: string) => {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => userAPI.fetchUser(id),
    select: (data) => data.data,
    enabled: !!id,
  })
}

export const useCreateUserMutation = ({
  onSuccess,
  ...options
}: UseMutationOptions<AxiosResponse<User>, Error, UserData> = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: userAPI.createUser,
    onSuccess: (data, values, context) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
      onSuccess && onSuccess(data, values, context)
    },
    ...options,
  })
}

export const useUpdateUserMutation = (
  id: string,
  {
    onSuccess,
    ...options
  }: UseMutationOptions<AxiosResponse<User>, Error, UserData> = {},
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UserData) => userAPI.updateUser(id, data),
    onSuccess: (data, values, context) => {
      queryClient.invalidateQueries({ queryKey: userKeys.details() })
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
      onSuccess && onSuccess(data, values, context)
    },
    ...options,
  })
}

export const useDeleteUserMutation = (
  id: string,
  {
    onSuccess,
    ...options
  }: UseMutationOptions<AxiosResponse, Error, void> = {},
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => userAPI.deleteUser(id),
    onSuccess: (data, values, context) => {
      queryClient.removeQueries({ queryKey: userKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
      onSuccess && onSuccess(data, values, context)
    },
    ...options,
  })
}

export const useDeleteUserBulkMutation = ({
  onSuccess,
  ...options
}: UseMutationOptions<AxiosResponse, Error, string[]> = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (ids: string[]) => userAPI.deleteUserBulk(ids),
    onSuccess: (data, values, context) => {
      values.forEach((id) => {
        queryClient.removeQueries({ queryKey: userKeys.detail(id) })
      })
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
      onSuccess && onSuccess(data, values, context)
    },
    ...options,
  })
}
