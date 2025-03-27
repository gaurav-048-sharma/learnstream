import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'

const InstructorDashboard = () => {
  const [courses, setCourses] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [videoFiles, setVideoFiles] = useState([])
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/courses`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        // Filter courses by instructor (assuming backend populates instructor field)
        const instructorCourses = res.data.filter(course => course.instructor._id === getUserIdFromToken())
        setCourses(instructorCourses)
      } catch (error) {
        console.error(error)
      }
    }
    fetchCourses()
  }, [token])

  const getUserIdFromToken = () => {
    const token = localStorage.getItem('token')
    if (token) {
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      }).join(''))
      return JSON.parse(jsonPayload).id
    }
    return null
  }

  const handleFileChange = (e) => {
    setVideoFiles(e.target.files)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('title', title)
    formData.append('description', description)
    for (let i = 0; i < videoFiles.length; i++) {
      formData.append('videos', videoFiles[i])
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/courses`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })
      setTitle('')
      setDescription('')
      setVideoFiles([])
      // Refresh course list
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/courses`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const instructorCourses = res.data.filter(course => course.instructor._id === getUserIdFromToken())
      setCourses(instructorCourses)
    } catch (error) {
      console.error(error)
      alert('Failed to create course')
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Instructor Dashboard</h1>

      {/* Course Creation Form */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Create a New Course</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              placeholder="Course Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Input
              type="file"
              multiple
              accept="video/*"
              onChange={handleFileChange}
            />
            <Button type="submit">Create Course</Button>
          </form>
        </CardContent>
      </Card>

      {/* Course List */}
      <h2 className="text-2xl font-semibold mb-4">Your Courses</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {courses.map((course) => (
          <Card key={course._id}>
            <CardHeader>
              <CardTitle>{course.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{course.description}</p>
              <Button
                className="mt-4"
                onClick={() => navigate(`/courses/${course._id}`)}
              >
                View Course
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default InstructorDashboard