import React from 'react'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EmailIcon from '@mui/icons-material/Email';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import WorkIcon from '@mui/icons-material/Work';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { NavLink,useNavigate } from 'react-router-dom';
import signupimg from '../images/register.jpeg'
import { useState } from 'react';

const Signup = () => {
    let navigate=useNavigate();
    const [user,setUser]=useState({
        name:"",
        email:"",
        phone:"",
        clas:"",
        password:"",
        cpassword:""
    })

    let name,value
    const handleInputs=(e)=>{
        name=e.target.name
        value=e.target.value

        setUser({...user,[name]:value})
    }
    const PostData= async (e)=>{
        e.preventDefault()

        const {name,email,phone,clas,password,cpassword}=user

        const res=await fetch('/register',{
            method:"POST",
            headers:{
                "content-Type":"application/json"
            },
            body:JSON.stringify({name,email,phone,clas,password,cpassword})
        })

        const data=await res.json()
        if(data.status===422 || !data){
            window.alert("Invalid Registration")
            console.log("Invalid Registration")
        }
        else{
            window.alert("Registration successfull")
            console.log("Registration successfull")

            navigate('/login')
        }
    }
  return (
    <>
        <section className='signup'>
            <div className="container mt-5">
                <div className="signup-content">
                    <div className="signup-form d-flex justify-content-evenly">
                        
                        <form meyhod="POST" id='register-form' className="register-form">
                        <h2 className="form-titile">Sign Up</h2>
                            <div className="form-group">
                                <label htmlFor="name"><AccountCircleIcon/></label>
                                <input type="text" name="name" id="name" autoComplete="off" value={user.name} onChange={handleInputs} placeholder='Your Name'/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="email"><EmailIcon/></label>
                                <input type="email" name="email" id="email" autoComplete="off" value={user.email} onChange={handleInputs} placeholder='Your email'/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="phone"><PhoneInTalkIcon/></label>
                                <input type="number" name="phone" id="phone" autoComplete="off" value={user.phone} onChange={handleInputs} placeholder='Your Number'/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="clas"><WorkIcon/></label>
                                <input type="text" name="clas" id="clas" autoComplete="off" value={user.clas} onChange={handleInputs} placeholder='Your Class'/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="password"><LockOpenIcon/></label>
                                <input type="password" name="password" id="password" autoComplete="off" value={user.password} onChange={handleInputs} placeholder='Your password'/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="cpassword"><LockOpenIcon/></label>
                                <input type="password" name="cpassword" id="cpassword" autoComplete="off" value={user.cpassword} onChange={handleInputs} placeholder='Confirm password'/>
                            </div>
                            <div className="form-group form-button">
                                <input type="submit" name="signup" id="signup" className="form-submit" value="register" onClick={PostData}/>
                            </div>
                        </form>
                        <div className="signup-image align-self-center">
                            <figure>
                                <img src={signupimg} alt="register pic" />
                            </figure>
                            <NavLink to="/login" className="signup-image-link">I am already register</NavLink>
                        </div>
                    </div>
                </div>
            </div>

        </section>
    </>
  )
}

export default Signup
