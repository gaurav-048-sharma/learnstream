import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Button } from '../ui/button'  // Adjusted path
import { Input } from '../ui/input'    // Adjusted path

const Signup = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  // const handleSubmit = async (e) => {
  //   e.preventDefault()
  //   try {
  //     await axios.post('http://localhost:8080/api/users', { name, email, password, role: 'student' })
  //     navigate('/login')
  //   } catch (error) {
  //     console.error(error.response.data)
  //     alert('Signup failed')
  //   }
  // }
  // src/components/Auth/Signup.jsx
const handleSubmit = async (e) => {
  e.preventDefault()
  try {
    await axios.post('http://localhost:8080/api/users', { 
      name, 
      email, 
      password, 
      role: 'instructor'  // Change this from 'student' to 'instructor'
    })
    navigate('/login')
  } catch (error) {
    console.error(error.response.data)
    alert('Signup failed')
  }
}
  

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-bold text-center">Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" className="w-full">Sign Up</Button>
        </form>
        <p className="text-center">
          Already have an account?{' '}
          <span className="text-blue-600 cursor-pointer" onClick={() => navigate('/login')}>
            Login
          </span>
        </p>
      </div>
    </div>
  )
}

export default Signup