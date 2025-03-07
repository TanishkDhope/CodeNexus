import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import './App.css'
import HomePage from './pages/HomePage'
import Leaderboard from './pages/Leaderboard/Leaderboard'
import UserProfile from './pages/UserProfile/UserProfile'
import RoadmapHome from './pages/Roadmap/RoadmapHome'
import RoadmapsDetail from './pages/Roadmap/RoadmapsDetails' // Import the RoadmapsDetail component

function App() {
  const [count, setCount] = useState(0)

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/Leaderboard" element={<Leaderboard />} />
      <Route path="/UserProfile" element={<UserProfile />} />
      <Route path="/Roadmaps" element={<RoadmapHome />} />
      
      {/* Added dynamic route for RoadmapsDetail */}
      <Route path="/Roadmaps/:id" element={<RoadmapsDetail />} />
    </Routes>
  )
}

export default App
