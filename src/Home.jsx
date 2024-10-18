import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import NavBar from './NavBar';
import './styles/Home.css';



function Home() {


  return (
    <NavBar />
  );
}

export default Home;