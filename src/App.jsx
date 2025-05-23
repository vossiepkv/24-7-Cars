import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css'
import Signin from './Signin'
import Signup from './Signup'
import Home from './Home'
import ProfilePage from "./ProfilePage";
import SettingsPage from "./SettingsPage";
import ProtectedRoute from "./ProtectedRoutes";
import UserProfile from "./UserProfile";
import { BrowserRouter, Routes, Route} from 'react-router-dom'
import { Navigate } from 'react-router-dom';




function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Navigate to='/Signin' />}/>
        <Route path='/Signin' element={<Signin />}></Route>
        <Route path='/Signup' element={<Signup />}></Route>
        <Route path='/Home' element={<ProtectedRoute><Home /></ProtectedRoute>}></Route>
        <Route path='/Profile' element={<ProfilePage/>}></Route>
        <Route path='/Settings' element={<SettingsPage />}></Route>
        <Route path="/user/:id" element={<UserProfile />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
