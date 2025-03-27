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
  const [editMode, setEditMode] = useState(false)
  const [editCourseId, setEditCourseId] = useState(null)
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const API_URL = import.meta.env.VITE_API_URL 

  useEffect(() => {
    fetchCourses()
  }, [token])

  const fetchCourses = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/courses`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const instructorCourses = res.data.filter(course => course.instructor._id === getUserIdFromToken())
      setCourses(instructorCourses)
    } catch (error) {
      console.error(error)
    }
  }

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
      if (editMode) {
        await axios.put(`${API_URL}/api/courses/${editCourseId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        })
      } else {
        await axios.post(`${API_URL}/api/courses`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        })
      }
      resetForm()
      fetchCourses()
    } catch (error) {
      console.error(error)
      alert(`Failed to ${editMode ? 'update' : 'create'} course`)
    }
  }

  const handleEdit = (course) => {
    setEditMode(true)
    setEditCourseId(course._id)
    setTitle(course.title)
    setDescription(course.description)
    setVideoFiles([]) // Reset files, as we’re appending new ones
  }

  const resetForm = () => {
    setEditMode(false)
    setEditCourseId(null)
    setTitle('')
    setDescription('')
    setVideoFiles([])
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Instructor Dashboard</h1>

      {/* Course Creation/Edit Form */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{editMode ? 'Edit Course' : 'Create a New Course'}</CardTitle>
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
            <div className="flex space-x-2">
              <Button type="submit">{editMode ? 'Update Course' : 'Create Course'}</Button>
              {editMode && (
                <Button variant="outline" onClick={resetForm}>Cancel</Button>
              )}
            </div>
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
              <div className="mt-4 flex space-x-2">
                <Button onClick={() => navigate(`/courses/${course._id}`)}>
                  View
                </Button>
                <Button variant="outline" onClick={() => handleEdit(course)}>
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default InstructorDashboard