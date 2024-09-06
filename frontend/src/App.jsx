import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Admin from './pages/Admin'
import Home from './pages/Home'
import Navbar from './components/Navbar'


function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Admin" element={<Admin/>} />
      </Routes>
    </Router>
  )
}

export default App
