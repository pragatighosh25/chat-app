import React, { useContext, useState } from 'react'
import assets from '../assets/assets'
import { AuthContext } from '../../context/AuthContext'

const Login = () => {
  const [currentState, setCurrentState] = useState('Sign Up')
  const [fullname, setFullname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [bio, setBio] = useState('')
  const [isDataSubmitted, setIsDataSubmitted] = useState(false)

  const {login} = useContext(AuthContext);

  const onSubmitHandler = (e) => {
    e.preventDefault()
    if (currentState === 'Sign Up' && !isDataSubmitted) {
      setIsDataSubmitted(true)
      return;
    } 

    login(currentState === 'Sign Up' ? 'signup' : 'login', {fullname, email, password, bio})
  }

  return (
    <div className='min-h-screen bg-cover flex items-center gap-8 justify-center sm:justify-evenly max-sm:flex-col backdrop-blur-2xl'>

      {/* -------- left side -------- */}
      <img src={assets.logo_big} alt="logo" className='w-[min(30vw,250px)]' />

      {/* -------- right side -------- */}
      <form onSubmit={onSubmitHandler} className='border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg'>
        <h2 className='font-medium text-2xl flex justify-between items-center'>{currentState}
          {isDataSubmitted && <img onClick={()=> setIsDataSubmitted(false)} src={assets.arrow_icon} alt="" className='w-5 cursor-pointer' />}
        </h2>
        {currentState === 'Sign Up' && !isDataSubmitted && (
          <input onChange={(e) => setFullname(e.target.value)} value={fullname}
          type="text" className='p-2 border border-gray-500 rounded-md focus:outline-none' placeholder='Full Name' required />
        )}
        {!isDataSubmitted && (
          <>
            <input onChange={(e) => setEmail(e.target.value)} value={email}
             type="email" className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' placeholder='Email Address' required />

            <input onChange={(e) => setPassword(e.target.value)} value={password}
             type="password" className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' placeholder='Password' required />
             </> 
        )}
        {currentState === 'Sign Up' && isDataSubmitted && (
          <textarea onChange={(e) => setBio(e.target.value)} value={bio} rows={4}
             className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' placeholder='Provide a short bio...' required />
        )}

        <button type="submit" className='py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer'>
          {currentState === 'Sign Up' ? 'Create Account' : 'Login Now'}
        </button>

        <div className='flex items-center gap-2 text-sm text-gray-500'>
          <input type="checkbox" />
          <p>Agree to the terms of use & privacy policy</p>
        </div>

        <div className=''>
          {currentState === 'Sign Up' ? (
            <p className='text-sm text-gray-600'>Already have an account? <span className='text-violet-500 cursor-pointer font-medium' onClick={() => { setCurrentState('Login'); setIsDataSubmitted(false); }}>Login</span></p>
          ) : (
            <p className='text-sm text-gray-600'>Don't have an account? <span className='text-violet-500 cursor-pointer font-medium' onClick={() => { setCurrentState('Sign Up'); setIsDataSubmitted(false); }}>Sign Up</span></p>
          )}
        </div>
      </form>
    </div>
  )
}

export default Login
