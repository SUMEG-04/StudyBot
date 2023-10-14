import React, { useState,useEffect } from 'react'

const Contact = () => {
  const [userData,setUserData]=useState({name:"",email:"",phone:"",message:""})
  const userContact=async()=>{
    try{
      const res=await fetch('/getdata',{
        method:"GET",
        headers:{
          "Content-Type":"application/json"
        }
      })

      const data=await res.json()
      setUserData({...userData,name:data.name,email:data.email,phone:data.phone})

      if(!res.status===200){
        const error=new Error(res.error)
        throw error
      }
      
    }catch(err){
      console.log(err)
    }
  }
  useEffect(()=>{
    userContact();
  },[])

  const handleInputs=(e)=>{
    const name=e.target.name
    const value=e.target.value
    setUserData({...userData,[name]:value})
  }

  const contactForm=async(e)=>{
    e.preventDefault()

    const {name,email,phone,message}=userData
    const res=await fetch('/contact',{
        method:'POST',
        headers:{
            "Content-Type":"application/json",
        },
        body:JSON.stringify({
            name,email,phone,message
        })
    })

    const data=await res.json()

    if(!data){
        console.log("message not send")
    }else{
        alert("message sent!")
        setUserData({...userData,message:""})
    }
  }
  return (
    <>
        <div className="contact_info">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-lg-10 offset-lg-1 d-flex justify-content-between">
                        <div className="contact_info_item d-flex justify-content-start align-items-center">
                            <img src="" alt="" />
                            <div className="contact_info_content">
                                <div className="contact_info_title">
                                    Phone
                                </div>
                                <div className="contact_info_text">
                                    +91 0895 623 1470
                                </div>
                            </div>
                        </div>
                        <div className="contact_info_item d-flex justify-content-start align-items-center">
                            <img src="" alt="" />
                            <div className="contact_info_content">
                                <div className="contact_info_title">
                                    Email
                                </div>
                                <div className="contact_info_text">
                                    sumeg04112001@gmail.com
                                </div>
                            </div>
                        </div>
                        <div className="contact_info_item d-flex justify-content-start align-items-center">
                            <img src="" alt="" />
                            <div className="contact_info_content">
                                <div className="contact_info_title">
                                    Address
                                </div>
                                <div className="contact_info_text">
                                    Gamma 2 
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="contact_from">
                <div className="container">
                    <div className="row"><div className="col-lg-10 offset-lg-1">
                        <div className="contact_form_container py-3">
                        <div className="contact_from_title">
                            Get in touch
                        </div>
                        <form method='POST' id="contact_form">
                            <div className="contact_form_name d-flex justify-content-between">
                                <input type="text" id="contact_form_name" placeholder='Your name' autoComplete='Off' required onChange={handleInputs} name='name' value={userData.name} className="contact_form_name input_field" />
                                <input type="email" id="contact_form_email" placeholder='Your email' autoComplete='Off' required onChange={handleInputs} name='email' value={userData.email} className="contact_form_email input_field" />
                                <input type="number" id="contact_form_number" placeholder='Your number' autoComplete='Off' required onChange={handleInputs} name='phone' value={userData.phone} className="contact_form_number input_field" />
                            </div>
                            <div className="contact_form_text mt-5">
                                <textarea name="message" id="" cols="30" rows="10" className="text_field contact_form_message" onChange={handleInputs} value={userData.message} placeholder='Message'></textarea>
                            </div>
                            <div className="contact_form_button">
                                <button type='submit' className='button contact_submit_button' onClick={contactForm}>send message</button>
                            </div>
                        </form>
                        </div>
                    </div></div>
                </div>
            </div>
        </div>
    </>
  )
}

export default Contact
