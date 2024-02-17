import { type AxiosResponse } from 'axios'
import {
  UseMutationOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

import { artistAPI } from '@/services/artists'
import type { ArtistFilter, ArtistData, Artist } from '@/models/artist.model'

export const artistKeys = {
  all: ['artists'] as const,
  lists: () => [...artistKeys.all, 'list'] as const,
  list: (filters: ArtistFilter) => [...artistKeys.lists(), filters] as const,
  details: () => [...artistKeys.all, 'detail'] as const,
  detail: (id: string) => [...artistKeys.details(), id] as const,
}

export const useFetchAritstListQuery = (filters: ArtistFilter) => {
  return useQuery({
    queryKey: artistKeys.list(filters),
    queryFn: () => artistAPI.fetchArtistList(filters),
    select: (data) => data.data,
  })
}

export const useFetchAritstQuery = (id: string) => {
  return useQuery({
    queryKey: artistKeys.detail(id),
    queryFn: () => artistAPI.fetchArtist(id),
    select: (data) => data.data,
    enabled: !!id,
  })
}

export const useCreateAritstMutation = ({
  onSuccess,
  ...options
}: UseMutationOptions<AxiosResponse<Artist>, Error, ArtistData> = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: artistAPI.createArtist,
    onSuccess: (data, values, context) => {
      queryClient.invalidateQueries({ queryKey: artistKeys.lists() })
      onSuccess && onSuccess(data, values, context)
    },
    ...options,
  })
}

export const useUpdateAritstMutation = (
  id: string,
  {
    onSuccess,
    ...options
  }: UseMutationOptions<AxiosResponse<Artist>, Error, ArtistData> = {},
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ArtistData) => artistAPI.updateArtist(id, data),
    onSuccess: (data, values, context) => {
      queryClient.invalidateQueries({ queryKey: artistKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: artistKeys.lists() })
      onSuccess && onSuccess(data, values, context)
    },
    ...options,
  })
}

export const useDeleteAritstMutation = (
  id: string,
  {
    onSuccess,
    ...options
  }: UseMutationOptions<AxiosResponse, Error, void> = {},
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => artistAPI.deleteArtist(id),
    onSuccess: (data, values, context) => {
      queryClient.removeQueries({ queryKey: artistKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: artistKeys.lists() })
      onSuccess && onSuccess(data, values, context)
    },
    ...options,
  })
}

export const useDeleteAritstBulkMutation = ({
  onSuccess,
  ...options
}: UseMutationOptions<AxiosResponse, Error, string[]> = {}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (ids: string[]) => artistAPI.deleteArtistBulk(ids),
    onSuccess: (data, values, context) => {
      values.forEach((id) => {
        queryClient.removeQueries({ queryKey: artistKeys.detail(id) })
      })
      queryClient.invalidateQueries({ queryKey: artistKeys.lists() })
      onSuccess && onSuccess(data, values, context)
    },
    ...options,
  })
}
