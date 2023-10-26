import React, { useContext, useState } from 'react'
import loginpic from '../images/login.jpeg'
import { NavLink, useNavigate } from 'react-router-dom'
import LockOpenIcon from '@mui/icons-material/LockOpen';
import EmailIcon from '@mui/icons-material/Email';
import { UserContext } from '../App';

const Login = () => {

  const {state,dispatch}=useContext(UserContext)

  const navigate=useNavigate()
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')

  const loginUser=async(e)=>{
    e.preventDefault()
    const res=await fetch('/signin',{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({email,password})
    })
    const data=res.json()

    console.log(data)
    console.log(res.status)
    if(res.status===400 || !data){
      window.alert("Invalid Credential")
    }else{
      dispatch({type:"USER",payload:true})
      window.alert("Login Successfull")
      navigate('/')
    }
  }
  return (
    <>
      <section className='sign-in'>
            <div className="container mt-5">
                <div className="signin-content">
                    <div className="signin-image align-self-center">
                      <figure>
                        <img src={loginpic} alt="" />
                      </figure>
                      <NavLink to='/signup' className='signup-image-link'>Create an account</NavLink>
                    </div>
                    <div className="signin-form">
                        <h2 className="form-titile">Sign In</h2>
                        <form method='POST' id='register-form' className="register-form">
                            <div className="form-group">
                                <label htmlFor="email"><EmailIcon/></label>
                                <input type="email" name="email" id="email" autoComplete="off" value={email} onChange={(e)=>{setEmail(e.target.value)}} placeholder='Your email'/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="password"><LockOpenIcon/></label>
                                <input type="password" name="password" id="password" autoComplete="off" value={password} onChange={(e)=>{setPassword(e.target.value)}} placeholder='Your password'/>
                            </div>
                            <div className="form-group form-button">
                                <input type="submit" name="signin" id="signin" className="form-submit" value="Log In" onClick={loginUser}/>
                            </div>
                        </form>
                        
                    </div>
                </div>
            </div>

        </section>
    </>
  )
}

export default Login
