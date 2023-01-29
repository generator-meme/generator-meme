import React, { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header/Header'
import Main from './components/Main/Main'
import EditorMeme from './components/EditorMeme/EditorMeme'
import Footer from './components/Footer/Footer'
import MainLayout from './components/MainLayout/MainLayout'
import Canvas from './components/Canvas/Canvas'
import api from './utils/api'
import './App.css'

const App = () => {
  const [memes, setMemes] = useState([]);

  useEffect(() => {
    api
    .getTemplates()
    .then((res) => {
      setMemes(res);
    })
    .catch((err) => {  
    });
  }, [])

  return (
    <div className="page">
      <Header />
      <Routes>
        <Route path="/generator-meme" element={<MainLayout />}>
          <Route index element={<Main memes={memes} />} />
          <Route path="edit" element={<EditorMeme />} />
          <Route path="canvas" element={<Canvas />} />
        </Route>
      </Routes>
      <Footer />
    </div>
  )
}

export default App
