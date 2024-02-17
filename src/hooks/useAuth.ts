import { paths } from '@/constants'
import { useNavigate } from 'react-router-dom'

export function useAuth() {
  const navigate = useNavigate()

  const token = localStorage.getItem('token') || ''
  const email = localStorage.getItem('email') || ''

  const signin = (token: string, email: string) => {
    localStorage.setItem('token', token)
    localStorage.setItem('email', email)

    navigate(paths.private)
  }

  const signout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('email')

    navigate(paths.public)
  }

  return {
    token,
    email,
    signin,
    signout,
  }
}
