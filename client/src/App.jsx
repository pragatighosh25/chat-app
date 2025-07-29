import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Profile from './pages/Profile.jsx'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} /> 
        <Route path='/profile' element={<Profile />} />
      </Routes>
    </div>
  )
}

export default App
