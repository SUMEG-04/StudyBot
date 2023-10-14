import React, { createContext, useReducer } from 'react'
import 'bootstrap/dist/css/bootstrap.css'
import Navbar from './Components/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './Components/Home'
import About from './Components/About'
import Contact from './Components/Contact'
import Login from './Components/Login'
import Signup from './Components/Signup'
import './App.css'
import Errorpage from './Components/Errorpage'
import Logout from './Components/Logout'
import { initilState,reducer } from './Reducer/UseReducer'
import Chat from './Components/Chat'

export const UserContext=createContext()

const App = () => {
  const [state,dispatch]=useReducer(reducer,initilState)

  return (
    <>
      <UserContext.Provider value={{state,dispatch}}>
      <Navbar/>
      <Routes>
        <Route exact path='/' element={<Home/>}/>
        <Route path='/home' element={<Home/>}/>
        <Route path='/about' element={<About/>}/>
        <Route path='/contact' element={<Contact/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/logout' element={<Logout/>}/>
        <Route path='/chat' element={<Chat/>}/>
        <Route path='/*' element={<Errorpage/>}></Route>
      </Routes>
      </UserContext.Provider>
    </>
  )
}

export default App
