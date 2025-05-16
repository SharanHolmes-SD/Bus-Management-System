import React, { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import circleBG from '../assets/Images/circleBG.png'
import busPhoto from '../assets/Images/busimage.png'

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger)

function Hero() {
  const heroRef = useRef(null)
  const textRef = useRef(null)
  const imageRef = useRef(null)
  const buttonRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Text animation
      gsap.from(textRef.current.children, {
        scrollTrigger: {
          trigger: textRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse'
        },
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out'
      })

      // Image animation
      gsap.from(imageRef.current, {
        scrollTrigger: {
          trigger: imageRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse'
        },
        scale: 0.8,
        opacity: 0,
        duration: 1.5,
        ease: 'power3.out'
      })

      // Button animation
      gsap.from(buttonRef.current, {
        scrollTrigger: {
          trigger: buttonRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse'
        },
        y: 30,
        opacity: 0,
        duration: 1,
        delay: 0.5,
        ease: 'power3.out'
      })

      // Background circle animation
      gsap.to(imageRef.current.querySelector('img:first-child'), {
        scrollTrigger: {
          trigger: imageRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          scrub: 1
        },
        rotation: 360,
        duration: 2,
        ease: 'none'
      })
    }, heroRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={heroRef} className='w-full min-h-[80vh] bg-radial from-yellow-900 from-1% to-black mt-20 flex flex-col items-center justify-center'>
      <div className='w-full max-w-6xl px-4'>
        <div className='flex flex-col lg:flex-row items-center justify-between gap-15'>
          
          {/* Text Section */}
          <div ref={textRef} className='flex flex-col gap-5 lg:gap-10 p-3 text-center lg:text-left lg:max-w-xl'>
            <h1 className='font-poppinsMedium text-xl md:text-2xl text-white'>Your Journey Begins Here ,</h1>
            <h1 className='font-poppinsSemiBold text-3xl md:text-4xl lg:text-5xl text-white'>Sri Lanka's Smart Bus Ticketing Platform</h1>
            <p className='font-poppins text-base md:text-xl text-white leading-7 md:leading-10'>
              Your go-to platform for hassle-free bus ticket booking in Sri Lanka. 
              <span className='hidden md:inline'><br /></span> Safe, fast, and convenient travel the smart way.
            </p>
          </div>
          
          {/* Image Section */}
          <div ref={imageRef} className='relative w-full max-w-xs md:max-w-sm lg:w-[30rem] h-[15rem] md:h-[20rem] lg:h-[25rem] mt-8 lg:mt-0'>
            <img 
              src={circleBG} 
              alt="Background Circle" 
              className='w-full h-full object-contain' 
            />
            <img 
              src={busPhoto} 
              alt="Bus" 
              className='absolute top-1/2 left-1/2 w-full md:w-[50rem] lg:w-[70rem] transform -translate-x-1/2 -translate-y-1/2 z-10' 
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero