import React from 'react'
import photo1 from '../assets/Images/BusPartners/photo1.png'
import photo2 from '../assets/Images/BusPartners/photo2.png'
import photo3 from '../assets/Images/BusPartners/photo3.png'
import photo4 from '../assets/Images/BusPartners/photo4.png'
import photo5 from '../assets/Images/BusPartners/photo5.png'
import photo6 from '../assets/Images/BusPartners/photo6.png'
import photo7 from '../assets/Images/BusPartners/photo7.png'
import photo8 from '../assets/Images/BusPartners/photo8.png'
import photo9 from '../assets/Images/BusPartners/photo9.png'
import photo10 from '../assets/Images/BusPartners/photo10.png'
import photo12 from '../assets/Images/BusPartners/photo12.png'
import photo13 from '../assets/Images/BusPartners/photo13.png'

function Partners() {
  return (
    <div className='w-full h-auto py-10 bg-linear-to-t from-black from-1% to-yellow-900'>
      <div className='text-5xl text-center text-white font-poppinsSemiBold mb-10 p-10'>
        <h1>Partnered Bus Service Providers</h1>
      </div>

      <div className='flex flex-col items-center gap-8'>
        <div className='flex flex-wrap justify-center gap-10 items-center'>
          <img src={photo1} alt="partner 1" className='w-32 h-[80px]' />
          <img src={photo2} alt="partner 2" className='w-32 h-[80px]' />
          <img src={photo3} alt="partner 3" className='w-32 h-[80px]' />
          <img src={photo4} alt="partner 4" className='w-32 h-[80px]' />
          <img src={photo5} alt="partner 5" className='w-32 h-[80px]' />
          <img src={photo6} alt="partner 6" className='w-32 h-[80px]' />
        </div>

        <div className='flex flex-wrap justify-center gap-10'>
          <img src={photo7} alt="partner 7" className='w-32 h-[80px]' />
          <img src={photo8} alt="partner 8" className='w-32 h-[80px]' />
          <img src={photo9} alt="partner 9" className='w-32 h-[80px]' />
          <img src={photo10} alt="partner 10" className='w-32 h-[80px]' />
          <img src={photo12} alt="partner 12" className='w-32 h-[80px]' />
          <img src={photo13} alt="partner 13" className='w-32 h-[80px]' />
        </div>
      </div>
    </div>
  )
}

export default Partners;
