import React from 'react'
import Home from './pages/home/Home'
import Day from "./pages/day/Day";
import Calendar from './pages/calendar/MyCalendar'
import Sticky from './pages/sticky/Sticky';
import Welcome from './pages/welcome/Welcome'
import Register from './pages/register/Register'
import Login from './pages/login/Login'
import { Routes, Route } from 'react-router-dom';

import {ApolloProvider} from '@apollo/client/react';
import {client} from './graphql/client';
 
const App = () => {
  return (
  <ApolloProvider client={client}>
    <div style={{ backgroundColor: 'white' }}>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/home" element={<Home />} />
        <Route path="/day" element={<Day />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/sticky" element={<Sticky />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  </ApolloProvider>
  )
}
export default App;