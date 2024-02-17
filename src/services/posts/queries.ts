import { type AxiosResponse } from 'axios'
import {
  UseMutationOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

import { postAPI } from '@/services/posts'
import type { PostFilter, PostData, Post } from '@/models/post.model'

const postKeys = {
  all: ['posts'] as const,
  lists: () => [...postKeys.all, 'list'] as const,
  list: (filters: PostFilter) => [...postKeys.lists(), filters] as const,
  details: () => [...postKeys.all, 'detail'] as const,
  detail: (id: string) => [...postKeys.details(), id] as const,
}

export const useFetchPostListQuery = (filters: PostFilter) => {
  return useQuery({
    queryKey: postKeys.list(filters),
    queryFn: () => postAPI.fetchPostList(filters),
    select: (data) => data.data,
  })
}

export const useFetchPostQuery = (id: string) => {
  return useQuery({
    queryKey: postKeys.detail(id),
    queryFn: () => postAPI.fetchPost(id),
    select: (data) => data.data,
    enabled: !!id,
  })
}

export const useCreatePostMutation = ({
  onSuccess,
  ...options
}: UseMutationOptions<AxiosResponse<Post>, Error, PostData> = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: postAPI.createPost,
    onSuccess: (data, values, context) => {
      queryClient.invalidateQueries({ queryKey: postKeys.lists() })
      onSuccess && onSuccess(data, values, context)
    },
    ...options,
  })
}

export const useUpdatePostMutation = (
  id: string,
  {
    onSuccess,
    ...options
  }: UseMutationOptions<AxiosResponse<Post>, Error, PostData> = {},
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: PostData) => postAPI.updatePost(id, data),
    onSuccess: (data, values, context) => {
      queryClient.invalidateQueries({ queryKey: postKeys.details() })
      queryClient.invalidateQueries({ queryKey: postKeys.lists() })
      onSuccess && onSuccess(data, values, context)
    },
    ...options,
  })
}

export const useDeletePostMutation = (
  id: string,
  {
    onSuccess,
    ...options
  }: UseMutationOptions<AxiosResponse, Error, void> = {},
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => postAPI.deletePost(id),
    onSuccess: (data, values, context) => {
      queryClient.removeQueries({ queryKey: postKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: postKeys.lists() })
      onSuccess && onSuccess(data, values, context)
    },
    ...options,
  })
}

export const useDeletePostBulkMutation = ({
  onSuccess,
  ...options
}: UseMutationOptions<AxiosResponse, Error, string[]> = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (ids: string[]) => postAPI.deletePostBulk(ids),
    onSuccess: (data, values, context) => {
      values.forEach((id) => {
        queryClient.removeQueries({ queryKey: postKeys.detail(id) })
      })
      queryClient.invalidateQueries({ queryKey: postKeys.lists() })
      onSuccess && onSuccess(data, values, context)
    },
    ...options,
  })
}
