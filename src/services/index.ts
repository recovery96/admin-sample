import axios from 'axios'
import toast from 'react-hot-toast'

const BASE_URL = import.meta.env.VITE_SERVER_URL

const createInstance = () => {
  const instance = axios.create({
    baseURL: BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 10000,
  })

  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token')
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`
      }
      return config
    },
    (error) => {
      return Promise.reject(error)
    },
  )

  instance.interceptors.response.use(
    (response) => {
      return response
    },
    (error) => {
      if (!error.response) {
        toast.error('네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.')
        return
      }

      switch (error.response?.status) {
        case 401:
          toast.error('로그인이 필요합니다.')
          break
        case 403:
          toast.error('접근 권한이 없습니다.')
          break
        case 404:
          toast.error('페이지를 찾을 수 없습니다.')
          break
        case 500:
          toast.error('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.')
          break
        default:
          toast.error(
            error.response.data.message || '알 수 없는 오류가 발생했습니다.',
          )
      }

      return Promise.reject(error)
    },
  )

  return instance
}

const instance = createInstance()

export { instance }
