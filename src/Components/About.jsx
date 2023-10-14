import React, { useEffect, useState } from 'react'
import pic from '../images/logodiscord.jpeg'
import { useNavigate } from 'react-router-dom'

const About = () => {
  const [userData,setUserData]=useState({})
  const navigate=useNavigate()
  const callAboutPage=async()=>{
    try{
      const res=await fetch('/about',{
        method:"GET",
        headers:{
          Accept:"application/json",
          "Content-Type":"application/json"
        },
        credentials:"include"
      })

      const data=await res.json()
      console.log(data)
      setUserData(data)

      if(!res.status===200){
        const error=new Error(res.error)
        throw error
      }
      
    }catch(err){
      console.log(err)
      navigate('/login')
    }
  }
  useEffect(()=>{
    callAboutPage();
  },[])
  return (
    <>
      <div className="container emp-profile">
        <form method="GET">
          <div className="row">
            <div className="col-md-4">
              <div className="profile-img"><img src={pic} alt="" /></div>
            </div>
            <div className="col-md-6">
              <div className="profile-head">
                <h5>Sumeg</h5>
                <h6>web developer</h6>
                <p className="profile-rating mt-3 mb-5">
                  Ranking: <span>1/10</span>
                </p>

                <ul className="nav nav-tabs" role='tablist'>
                  <li className="nav-item">
                  <a className="nav-link active" id='home-tab' data-toggle='tab' role='tab' href="#home">About</a>
                  </li>
                  <li className="nav-item">
                  <a className="nav-link" id='profile-tab' data-toggle='tab' role='tab' href="#profile">Timeline</a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="col-md-2">
              <input type="text" className="profile-edit-btn" name='btnAddMore' value='Edit Profile' />
            </div>
          </div>

          <div className="row">
            <div className="col-md-4">
              <div className="profile-work">
                <p>WORk LINK</p>
                <a href="https://" target='_sumeg'>Youtube</a><br />
                <a href="https://" target='_sumeg'>Instagram</a><br />
                <a href="https://" target='_sumeg'>Figma</a><br />
                <a href="https://" target='_sumeg'>Linkdin</a><br />
                <a href="https://" target='_sumeg'>Github</a><br />
              </div>
            </div>

            <div className="col-md-8 pl-5 about-info">
              <div className="tab-content profile-tab" id="myTabContent">
                <div className="tab-pane fade show active" id="home" role='tabpanel' aria-labelledby='home-tab'>
                  <div className="row">
                    <div className="col-md-6">
                      <label>User ID</label>
                    </div>
                    <div className="col-md-6">
                      <p>{userData._id}</p>
                    </div>
                  </div>

                  <div className="row mt-3">
                    <div className="col-md-6">
                      <label>Name</label>
                    </div>
                    <div className="col-md-6">
                      <p>{userData.name}</p>
                    </div>
                  </div>

                  <div className="row mt-3">
                    <div className="col-md-6">
                      <label>Email</label>
                    </div>
                    <div className="col-md-6">
                      <p>{userData.email}</p>
                    </div>
                  </div>

                  <div className="row mt-3">
                    <div className="col-md-6">
                      <label>Phone</label>
                    </div>
                    <div className="col-md-6">
                      <p>{userData.phone}</p>
                    </div>
                  </div>

                  <div className="row mt-3">
                    <div className="col-md-6">
                      <label>Class</label>
                    </div>
                    <div className="col-md-6">
                      <p>{userData.clas}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  )
}

export default About
