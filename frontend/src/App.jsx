import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar' 
import Login from './components/Auth/Login'
import Signup from './components/Auth/Signup'
import CourseList from './components/Course/CourseList'
import InstructorDashboard from './components/Dashboard/InstructorDashboard'  // Add this
import CourseDetail from './components/Course/CourseDetail'
import ProtectedRoute from './components/ProtectedRoute'  // Add this
import PublicRoute from './components/PublicRoute'
import './index.css'

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <CourseList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses/:id"
            element={
              <ProtectedRoute>
                <CourseDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/instructor"
            element={
              <ProtectedRoute requireInstructor={true}>
                <InstructorDashboard />
              </ProtectedRoute>
            }
          />
          {/* Public Routes */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            }
          />
        </Routes>
      </main>
    </div>
  )
}

export default App
