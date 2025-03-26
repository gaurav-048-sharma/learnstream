import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Button } from './ui/button'  // Adjusted path (relative to CourseList.jsx)
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'  // Adjusted path

const CourseList = () => {
  const [courses, setCourses] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/courses')
        setCourses(res.data)
      } catch (error) {
        console.error(error)
      }
    }
    fetchCourses()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Courses</h1>
        <Button variant="outline" onClick={handleLogout}>Logout</Button>
      </div>
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

export default CourseList