import React from 'react'
import { NavLink } from 'react-router-dom'

const Errorpage = () => {
  return (
    <>
        <div id="not-found">
            <div className="not-found">
                <h1>404</h1>
            </div>
            <h2>We are sorry,page not found</h2>
            <p className="mb-5">
                The page u are looking for might have been removed 
                had its name changed or is temporerily unavailable.
            </p>
            <NavLink to='/home'>Back to Homepage</NavLink>
        </div>
    </>
  )
}

export default Errorpage
