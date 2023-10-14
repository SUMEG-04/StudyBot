import React, { useEffect, useState } from 'react'

const Home = () => {
  const [userName,setUserName]=useState("")
  const [show,setShow]=useState(false)

  const callData=async()=>{
    try{
      const res=await fetch('/getdata',{
        method:"GET",
        headers:{
          "Content-Type":"application/json"
        }
      })

      const data=await res.json()
      setUserName(data.name)
      setShow(true)

      if(!res.status===200){
        const error=new Error(res.error)
        throw error
      }
      
    }catch(err){
      console.log(err)
    }
  }
  useEffect(()=>{
    callData();
  },[])
  return (
    <>
      <div className="home-page">
        <div className="home-div">
          <p className="pt-5">WELCOME</p>
          <h1>{userName}</h1>
          <h3>{show ?"Happy to see you back!" :"Grow your Knowledge everyday."}</h3>
        </div>
      </div>
    </>
  )
}

export default Home
