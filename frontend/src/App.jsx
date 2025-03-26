import { Route, Routes } from 'react-router-dom'
import Login from './components/Auth/Login'
import Signup from './components/Auth/Signup'
// import CourseList from './components/CourseList'
// import CourseDetail from './components/CourseDetail'
import './index.css'

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Routes>
        {/* <Route path="/" element={<CourseList />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* <Route path="/courses/:id" element={<CourseDetail />} /> */}
      </Routes>
    </div>
  )
}

export default App