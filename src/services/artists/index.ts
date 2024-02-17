import { type AxiosResponse } from 'axios'

import { instance } from '@/services'
import type {
  Artist,
  ArtistList,
  ArtistFilter,
  ArtistData,
} from '@/models/artist.model'

export const artistAPI = {
  fetchArtistList: (filter: ArtistFilter): Promise<AxiosResponse<ArtistList>> =>
    instance.get('/artists', { params: filter }),

  fetchArtist: (id: string): Promise<AxiosResponse<Artist>> =>
    instance.get(`/artists/${id}`),

  createArtist: (data: ArtistData): Promise<AxiosResponse<Artist>> =>
    instance.post('/artists', data),

  updateArtist: (
    id: string,
    data: ArtistData,
  ): Promise<AxiosResponse<Artist>> => instance.put(`/artists/${id}`, data),

  deleteArtist: (id: string): Promise<AxiosResponse> =>
    instance.delete(`/artists/${id}`),

  deleteArtistBulk: (ids: string[]): Promise<AxiosResponse> =>
    instance.post(`/artists/bulk-delete`, { ids }),
}
