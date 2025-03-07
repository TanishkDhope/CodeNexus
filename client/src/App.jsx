import { useState } from 'react'
import {Route, Routes} from 'react-router-dom'
import './App.css'
import HomePage from './pages/HomePage'
import Login from './pages/Login'
import Excercises from './pages/Excercises'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Routes>
      <Route path="/home" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/exercises" element={<Excercises />} />
    </Routes>
  )
}

export default App
