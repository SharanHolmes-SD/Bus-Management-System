import React, { useRef } from 'react'
import Forms from '../Component/UI/Forms'

function BookingLayout() {
  const formRef = useRef(null)
  const headingRef = useRef(null)
  const subheadingRef = useRef(null)

  return (
    <div className='bg-gradient-to-t from-yellow-900 to-black w-full min-h-screen overflow-hidden'>
      {/* Background with gradient overlay */}
    
      {/* Content */}
      <div className='relative'>
        {/* Hero Section */}
        <div className='flex flex-col justify-center items-center p-4 md:p-6 pt-20 md:pt-24'>
          <h1 ref={headingRef} className='text-3xl md:text-5xl lg:text-6xl font-poppinsMedium text-white text-center pb-4 md:pb-7 max-w-4xl'>
            The simplest way to book your bus tickets in Sri Lanka
          </h1>
          <h1 ref={subheadingRef} className='text-white/90 text-center font-poppins text-base md:text-lg lg:text-xl w-full max-w-3xl lg:max-w-4xl leading-relaxed md:leading-loose'>
            Plan your trip with ease select your route, choose your seat, and confirm your ticket in just a few clicks. Fast, simple, and secure bus booking at your fingertips.
          </h1>
        </div>
        {/* Form Section */}
        <div className='flex flex-col items-center mx-4 md:mx-6 lg:mx-10 gap-6 md:gap-8 mt-8 md:mt-12'>
          <div ref={formRef} className='w-full max-w-6xl backdrop-blur-sm bg-white/10 rounded-2xl p-6 md:p-8 shadow-2xl border border-white/20'>
            <Forms/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingLayout