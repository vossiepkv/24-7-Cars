import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css'
import Signin from './Signin'
import Signup from './Signup'
import { BrowserRouter, Routes, Route} from 'react-router-dom'



function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/Signin' element={<Signin />}></Route>
        <Route path='/Signup' element={<Signup />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
