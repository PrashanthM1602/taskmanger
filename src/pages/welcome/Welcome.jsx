import React from 'react'
import propic from './propic.jpg'
import { Link } from 'react-router-dom'
import './Welcome.scss'

const Welcome = () => {
  return (
    <div className="welcome">
      
      <div className="right">
        <img 
          src={propic} 
          alt="Welcome to productivity app" 
        />
      </div>

      <div className="left">
        <div className="wrapper">
          
          <h1>Productivity Mind</h1>

          <p className="body">
            Organize your tasks, manage your time,
            and boost your productivity
          </p>

          {/* ✅ FIXED BUTTON */}
          <Link to="/register" style={{ textDecoration: 'none' }}>
            <button className="btn">
              Get Started
            </button>
          </Link>

          <p>
            Already have an account?
            <span
              style={{
                color: '#007bff',
                cursor: 'pointer',
              }}
            >
              <Link to="/login" style={{ textDecoration: 'none' }}>
                Login
              </Link>
            </span>
          </p>

        </div>
      </div>

    </div>
  )
}

export default Welcome