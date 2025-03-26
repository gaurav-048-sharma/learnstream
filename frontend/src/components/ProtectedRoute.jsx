import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children, requireInstructor = false }) => {
  const token = localStorage.getItem('token')
  if (!token) {
    return <Navigate to="/login" replace />
  }

  const getUserRoleFromToken = () => {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    }).join(''))
    return JSON.parse(jsonPayload).role
  }

  if (requireInstructor && getUserRoleFromToken() !== 'instructor') {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute