import { useState } from 'react'
import './App.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './pages/Home.jsx'
import PostList from './pages/PostList.jsx'
import PostDetails from './pages/PostDetails.jsx'

function App() {
  return (
      <BrowserRouter>
      <div>Navigation bar is here</div>
        <Routes>
          <Route path='/' element={<Home/>}></Route>
          <Route path='/posts' element={<PostList/>}></Route>
          <Route path='/posts/:postId' element={<PostDetails/>}></Route>
        </Routes>
      </BrowserRouter>
  )
}

export default App