// import { useState, useEffect } from 'react'
// import { useNavigate } from 'react-router-dom'
// import axios from 'axios'
// import { Button } from '../ui/button'
// import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

const CourseList = () => {
  const [courses, setCourses] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/courses')
        setCourses(res.data)
      } catch (error) {
        console.error(error)
      }
    }
    fetchCourses()
  }, [])

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Courses</h1>
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