import { type AxiosResponse } from 'axios'

import { instance } from '@/services'
import type { Post, PostList, PostFilter, PostData } from '@/models/post.model'

export const postAPI = {
  fetchPostList: (filter: PostFilter): Promise<AxiosResponse<PostList>> =>
    instance.get('/posts', { params: filter }),

  fetchPost: (id: string): Promise<AxiosResponse<Post>> =>
    instance.get(`/posts/${id}`),

  createPost: (data: PostData): Promise<AxiosResponse<Post>> =>
    instance.post('/posts', data),

  updatePost: (id: string, data: PostData): Promise<AxiosResponse<Post>> =>
    instance.put(`/posts/${id}`, data),

  deletePost: (id: string): Promise<AxiosResponse> =>
    instance.delete(`/posts/${id}`),

  deletePostBulk: (ids: string[]): Promise<AxiosResponse> =>
    instance.post(`/posts/bulk-delete`, { ids }),
}
