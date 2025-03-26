import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import ReactPlayer from 'react-player'
import { Button } from './ui/button'  // Adjusted path
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'  // Adjusted path
import { RadioGroup, RadioGroupItem } from './ui/radio-group'  // Adjusted path
import { Label } from './ui/label'  // Adjusted path

const CourseDetail = () => {
  const { id } = useParams()
  const [course, setCourse] = useState(null)
  const [progress, setProgress] = useState(null)
  const [quizAnswers, setQuizAnswers] = useState({})
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const courseRes = await axios.get(`http://localhost:8080/api/courses/${id}`)
        setCourse(courseRes.data)
        const progressRes = await axios.get(`http://localhost:8080/api/progress/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setProgress(progressRes.data)
      } catch (error) {
        console.error(error)
        if (error.response?.status === 401) navigate('/login')
      }
    }
    if (token) fetchData()
    else navigate('/login')
  }, [id, token, navigate])

  const handleLessonComplete = async (lessonIndex) => {
    try {
      const updatedLessons = progress?.lessonsCompleted?.includes(lessonIndex)
        ? progress.lessonsCompleted
        : [...(progress?.lessonsCompleted || []), lessonIndex]
      const res = await axios.post(
        'http://localhost:8080/api/progress',
        { courseId: id, lessonsCompleted: updatedLessons },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setProgress(res.data)
    } catch (error) {
      console.error(error)
    }
  }

  const handleQuizSubmit = async () => {
    try {
      const quizScores = course.quizzes.map((quiz, index) => ({
        questionIndex: index,
        score: quizAnswers[index] === quiz.correctAnswer ? 1 : 0,
      }))
      const res = await axios.post(
        'http://localhost:8080/api/progress',
        { courseId: id, quizScores, lessonsCompleted: progress?.lessonsCompleted || [] },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setProgress(res.data)
      alert('Quiz submitted!')
    } catch (error) {
      console.error(error)
    }
  }

  if (!course) return <div className="text-center p-4">Loading...</div>

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">{course.title}</h1>
      <p className="text-gray-600 mb-4">{course.description}</p>
      <p className="mb-4">Progress: {progress?.completionPercentage || 0}%</p>

      <h2 className="text-2xl font-semibold mb-4">Lessons</h2>
      <div className="space-y-4">
        {course.lessons.map((lesson, index) => (
          <Card key={lesson._id}>
            <CardHeader>
              <CardTitle>{lesson.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <ReactPlayer
                url={lesson.videoURL}
                controls
                width="100%"
                height="auto"
                onEnded={() => handleLessonComplete(index)}
              />
            </CardContent>
          </Card>
        ))}
      </div>

      <h2 className="text-2xl font-semibold mt-6 mb-4">Quizzes</h2>
      <div className="space-y-4">
        {course.quizzes.map((quiz, index) => (
          <Card key={quiz._id}>
            <CardHeader>
              <CardTitle>{quiz.question}</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                onValueChange={(value) => setQuizAnswers({ ...quizAnswers, [index]: value })}
                value={quizAnswers[index] || ''}
              >
                {quiz.options.map((option, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={`${index}-${i}`} />
                    <Label htmlFor={`${index}-${i}`}>{option}</Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>
        ))}
        <Button className="mt-4" onClick={handleQuizSubmit}>Submit Quiz</Button>
      </div>
    </div>
  )
}

export default CourseDetail