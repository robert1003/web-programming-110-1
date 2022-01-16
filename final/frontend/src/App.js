import { useState } from 'react';
// react router
import { Routes, Route, Link as reactLink, Navigate } from "react-router-dom";
// component
import Home from './container/Home.js';
import Post from './container/Post.js';
import Header from './container/Header.js';
import NewPost from './container/NewPost.js';
import Search from './container/Search.js';
import Signin from './container/Signin.js';
import Signup from './container/Signup.js';
import { useLogin } from './hooks/useLogin.js';

function App() {
  const [board, setBoard] = useState();

  return (
    <Routes>
      <Route path="/" element={<Home board={board} />} />
      <Route path="/newpost" element={<NewPost />} />
      <Route path="/search" element={<Search />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/post/:postId" element={<Post />} />
    </Routes>
  )
}

export default App;
