import React from 'react'
import Visa from '../assets/Images/PaymentImages/visacard.png'
import Master from '../assets/Images/PaymentImages/mastercard.png'
import Genie from '../assets/Images/PaymentImages/genie.png'
import Amex from '../assets/Images/PaymentImages/amexcard.png'
import MoneyT from '../assets/Images/PaymentImages/moneyt.png'

function HeroSub() {
  return (
    <div className='w-full h-[25rem] bg-linear-to-t from-yellow-900 from-1% to-black '>
      <div className='mt-5'>
        <div className='text-center text-5xl text-whitegray font-poppinsSemiBold p-11'><h1>Multiple Payment Option</h1></div>
        <div className='flex flex-row justify-center items-center space-x-24 p-10'>
            <div className='flex flex-col gap-1 items-center font-poppins text-white text-center p-2'>
                <img src={Visa} alt="visa card" className='w-[5rem]' />
                <h1>Visa Card</h1>
            </div>
            <div className='flex flex-col gap-1 items-center font-poppins text-white text-center p-2'>
                <img src={Amex} alt="american express" className='w-[5rem]' />
                <h1>American Express</h1>
            </div>
            <div className='flex flex-col gap-1 items-center font-poppins text-white text-center p-2'>
                <img src={Master} alt="master card" className='w-[5rem]' />
                <h1>Master Card</h1>
            </div>
            <div className='flex flex-col gap-1 items-center font-poppins text-white text-center p-2'>
                <img src={Genie} alt="genie" className='w-[5rem]' />
                <h1>Genie</h1>
            </div>
            <div className='flex flex-col gap-1 items-center font-poppins text-white text-center p-2'>
                <img src={MoneyT} alt="money transfer" className='w-[5rem]' />
                <h1>Money Transfer</h1>
            </div>
        </div>
      </div>
    </div>
  )
}

export default HeroSub
