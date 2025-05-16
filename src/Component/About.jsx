import React, { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import BusPhoto from '../assets/Images/bus.webp'
import { 
  Sofa,
  ShieldCheck,
  Headphones,
  Clock,
  Bus,
  CalendarCheck,
  MapPin,
  Users
} from 'lucide-react'

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger)

function About() {
  const containerRef = useRef(null)
  const textRef = useRef(null)
  const imageRef = useRef(null)
  const featuresRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hide elements initially
      gsap.set([textRef.current, imageRef.current, featuresRef.current], {
        opacity: 0,
        y: 50
      })

      // Text animation
      gsap.to(textRef.current, {
        scrollTrigger: {
          trigger: textRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse'
        },
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out'
      })

      // Image animation
      gsap.to(imageRef.current, {
        scrollTrigger: {
          trigger: imageRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse'
        },
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
        ease: 'power3.out',
        delay: 0.3
      })

      // Features animation
      gsap.to(featuresRef.current, {
        scrollTrigger: {
          trigger: featuresRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse'
        },
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        delay: 0.5
      })

      // Title animation
      gsap.from('.about-title', {
        scrollTrigger: {
          trigger: '.about-title',
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse'
        },
        x: -50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
      })

      // Paragraph animations
      gsap.from('.about-paragraph', {
        scrollTrigger: {
          trigger: '.about-paragraph',
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse'
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
        delay: 0.5
      })

      // Feature item animations
      gsap.from('.feature-item', {
        scrollTrigger: {
          trigger: '.feature-item',
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse'
        },
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power3.out',
        delay: 0.7
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="about" className='w-full py-12 md:py-24 bg-linear-to-t from-black from-1% to-yellow-900'>
      <div className='container mx-auto px-6 md:px-12 lg:px-16 xl:px-32'>
        <div className='flex flex-col lg:flex-row gap-10 lg:gap-12 justify-between items-center'>
          {/* About us */}
          <div ref={textRef} className='flex flex-col gap-3 md:gap-6'>
            <div className='text-xl md:text-2xl text-blue-400 font-poppinsSemiBold about-title'>
              <h1>YOUR JOURNEY, OUR COMMITMENT</h1>
            </div>
            <div className='flex flex-col gap-5 md:gap-7 max-w-full lg:max-w-xl xl:w-[32rem] text-gray-100 font-poppins'>
              <h1 className='text-3xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent about-paragraph'>
                Redefining Travel Excellence
              </h1>   
              <p className='leading-6 md:leading-7 text-sm md:text-base about-paragraph'>
                At BusSeat.lk, we're revolutionizing Sri Lanka's transportation landscape. With over 15 years of experience serving thousands of satisfied passengers, we've mastered the art of comfortable, reliable travel. Our modern fleet of luxury coaches features plush reclining seats, individual charging ports, and climate control to ensure your journey is as pleasant as your destination.
              </p>
              <p className='leading-6 md:leading-7 text-sm md:text-base about-paragraph'>
                What truly sets us apart is our people. From our professionally trained drivers with impeccable safety records to our courteous onboard staff, every team member is dedicated to making your trip exceptional. We operate on major routes across the island with punctuality rates exceeding 98%, because we know your time is valuable.
              </p>
            </div>

            {/* Features Grid */}
            <div ref={featuresRef} className='grid grid-cols-2 gap-4 mt-4'>
              <div className='feature-item bg-gray-800 p-4 rounded-lg border-l-4 border-blue-500 hover:bg-gray-700 transition-colors duration-300'>
                <div className='flex items-center gap-3'>
                  <Sofa className='w-8 h-8 text-blue-400' />
                  <h3 className='font-semibold text-blue-400'>Premium Comfort</h3>
                </div>
                <p className='text-xs mt-2 text-gray-300'>Ergonomic seats with extra legroom and adjustable headrests</p>
              </div>
              
              <div className='feature-item bg-gray-800 p-4 rounded-lg border-l-4 border-blue-500 hover:bg-gray-700 transition-colors duration-300'>
                <div className='flex items-center gap-3'>
                  <ShieldCheck className='w-8 h-8 text-blue-400' />
                  <h3 className='font-semibold text-blue-400'>Safety First</h3>
                </div>
                <p className='text-xs mt-2 text-gray-300'>GPS tracked vehicles with 24/7 monitoring</p>
              </div>
              
              <div className='feature-item bg-gray-800 p-4 rounded-lg border-l-4 border-blue-500 hover:bg-gray-700 transition-colors duration-300'>
                <div className='flex items-center gap-3'>
                  <Headphones className='w-8 h-8 text-blue-400' />
                  <h3 className='font-semibold text-blue-400'>Onboard Service</h3>
                </div>
                <p className='text-xs mt-2 text-gray-300'>Complimentary snacks & beverages on select routes</p>
              </div>
              
              <div className='feature-item bg-gray-800 p-4 rounded-lg border-l-4 border-blue-500 hover:bg-gray-700 transition-colors duration-300'>
                <div className='flex items-center gap-3'>
                  <Clock className='w-8 h-8 text-blue-400' />
                  <h3 className='font-semibold text-blue-400'>Punctuality</h3>
                </div>
                <p className='text-xs mt-2 text-gray-300'>98% on-time departure record nationwide</p>
              </div>
            </div>
          </div>

          {/* Image with decorative elements */}
          <div ref={imageRef} className='relative mt-6 lg:mt-0 group'>
            <img 
              src='https://images.unsplash.com/photo-1570125909517-53cb21c89ff2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YnVzfGVufDB8fDB8fHww' 
              alt="Luxury Coach" 
              className='w-full max-w-xs md:max-w-md lg:w-[28rem] xl:w-[32rem] mx-auto rounded-lg shadow-2xl transform transition-transform duration-500 group-hover:scale-105' 
            />
            <div className='absolute -inset-4 border-2 border-blue-400/30 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>
            <div className='absolute -bottom-6 -right-6 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg font-medium flex items-center gap-2'>
              <CalendarCheck className='w-4 h-4' />
              <span className='text-sm'>Since 2008</span>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className='px-6 md:px-12 lg:px-0 mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 text-center'>
          <div className='feature-item p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors duration-300'>
            <Bus className='w-10 h-10 mx-auto text-blue-400' />
            <h3 className='text-3xl md:text-5xl font-bold text-blue-400 mt-2'>15+</h3>
            <p className='text-gray-300 text-sm mt-2'>Years Experience</p>
          </div>
          <div className='feature-item p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors duration-300'>
            <MapPin className='w-10 h-10 mx-auto text-blue-400' />
            <h3 className='text-3xl md:text-5xl font-bold text-blue-400 mt-2'>50+</h3>
            <p className='text-gray-300 text-sm mt-2'>Modern Vehicles</p>
          </div>
          <div className='feature-item p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors duration-300'>
            <Clock className='w-10 h-10 mx-auto text-blue-400' />
            <h3 className='text-3xl md:text-5xl font-bold text-blue-400 mt-2'>98%</h3>
            <p className='text-gray-300 text-sm mt-2'>On-Time Rate</p>
          </div>
          <div className='feature-item p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors duration-300'>
            <Users className='w-10 h-10 mx-auto text-blue-400' />
            <h3 className='text-3xl md:text-5xl font-bold text-blue-400 mt-2'>24/7</h3>
            <p className='text-gray-300 text-sm mt-2'>Customer Support</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About