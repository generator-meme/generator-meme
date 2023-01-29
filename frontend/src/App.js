import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header/Header'
import Main from './components/Main/Main'
import Footer from './components/Footer/Footer'
import MainLayout from './components/MainLayout/MainLayout'
import Canvas from './components/Canvas/Canvas'
import './App.css'

const App = () => {
  return (
    <div className="page">
      <Header />
      <Routes>
        <Route path="/generator-meme" element={<MainLayout />}>
          <Route index element={<Main />} />
          <Route path="canvas" element={<Canvas />} />
        </Route>
      </Routes>
      <Footer />
    </div>
  )
}

export default App
