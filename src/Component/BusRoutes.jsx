import { ArrowRightLeft, Clock } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import busImage from '../assets/Images/busimage.png'

function BusRoutes() {
  const location = useLocation();
  const navigate = useNavigate();
  const { buses } = location.state || {};
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [])

  const handleViewSeats = (bus, schedule, time) => {
    navigate('/seating', { 
      state: { 
        bus,
        selectedDate: schedule.date,
        selectedTime: time.startTime,
        endTime: time.endTime
      } 
    });
  };

  const handleViewPolicy = () => {
    setShowPolicyModal(true);
  };

  if (!buses) {
    return (
      <div className='flex flex-col gap-5 items-center w-full min-h-screen bg-whitegray mt-20'>
        <div className='w-[70rem] h-[12rem] bg-white shadow-lg rounded-lg flex items-center justify-center'>
          <h1 className='text-gray-500 font-poppins text-xl'>
            Please search for buses first
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-5 items-center w-full min-h-screen bg-whitegray mt-20'>
      {/* Route Bar */}
      {buses.length > 0 && (
        <div className='flex w-full h-16 bg-yellow-200 justify-center items-center'>
          <div className='flex flex-row items-center gap-10 text-yellow-800 font-poppins text-xl'>
            <h1>{buses[0].startLocation}</h1>
            <ArrowRightLeft />
            <h1>{buses[0].endLocation}</h1>
          </div>
        </div>
      )}

      {/* Bus Cards */}
      {buses.length > 0 ? (
        buses.map((bus) => {
          // Get the first schedule (assuming each bus has at least one schedule)
          const schedule = bus.schedule?.[0] || {};
          // Get the first time slot (assuming each schedule has at least one time)
          const firstTime = schedule.times?.[0] || {};

          return (
            <div key={bus._id} className='w-[70rem] bg-white shadow-lg rounded-lg'>
              <div className='flex flex-row p-5 gap-5'>
                {/* Bus Image */}
                <div className='w-48 h-32 rounded-lg overflow-hidden'>
                  <img 
                    src={busImage} 
                    alt={`${bus.busName} bus`}
                    className='w-full h-full object-cover'
                  />
                </div>

                {/* Bus Details */}
                <div className='flex flex-col w-full gap-2'>
                  {/* Bus Name & Type */}
                  <div className='flex flex-row justify-between'>
                    <h1 className='font-poppins text-xl font-semibold'>{bus.busName}</h1>
                    <h1 className='font-poppins text-sm text-gray-500'>{bus.busType}</h1>
                  </div>

                  {/* Route Details */}
                  <div className='flex flex-row gap-5'>
                    <div className='flex flex-col'>
                      <h1 className='font-poppins text-sm text-gray-500'>Departure</h1>
                      <h1 className='font-poppins text-sm'>{firstTime.startTime}</h1>
                    </div>
                    <div className='flex flex-col'>
                      <h1 className='font-poppins text-sm text-gray-500'>Arrival</h1>
                      <h1 className='font-poppins text-sm'>{firstTime.endTime}</h1>
                    </div>
                  </div>

                  {/* Cancellation Policy */}
                  <div 
                    className='text-sm text-blue-600 font-medium cursor-pointer hover:text-blue-800'
                    onClick={handleViewPolicy}
                  >
                    <h1>View cancellation policy</h1>
                  </div>

                  {/* Price & Action */}
                  <div className='flex flex-col items-end gap-1'>
                    <h1 className='font-poppins text-2xl'>LKR {bus.price}.00</h1>
                    <h1 className='font-poppins text-xs text-gray-500'>
                      Available Seats: {bus.noOfSeats}
                    </h1>
                    <h1 className='font-poppins text-xs text-gray-500'>
                      Closing Date: <span>{schedule.closingDate || 'N/A'}</span>
                    </h1>
                    <div className="flex flex-col gap-2 mt-2">
                      <button 
                        className='bg-green-500 px-4 py-2 text-white rounded-lg hover:bg-green-600 transition'
                        onClick={() => handleViewSeats(bus, schedule, firstTime)}
                      >
                        View Seats
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className='w-[70rem] h-[12rem] bg-white shadow-lg rounded-lg flex items-center justify-center'>
          <h1 className='text-gray-500 font-poppins text-xl'>No buses available for the selected route and date</h1>
        </div>
      )}

      {/* Cancellation Policy Modal */}
      {showPolicyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Cancellation Policy</h2>
            <div className="space-y-4 text-gray-700">
              <p><strong>1. Cancellation Time Frame:</strong></p>
              <ul className="list-disc pl-6 space-y-2">
                <li>More than 3 hours before departure: Full refund</li>
                <li>Between 1-3 hours before departure: 50% refund</li>
                <li>Less than 1 hour before departure: No refund</li>
              </ul>
              
              <p><strong>2. Refund Process:</strong></p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Refunds will be processed within 5-7 business days</li>
                <li>Refunds will be credited to the original payment method</li>
              </ul>

              <p><strong>3. Special Cases:</strong></p>
              <ul className="list-disc pl-6 space-y-2">
                <li>In case of bus cancellation by the company: Full refund</li>
                <li>In case of natural disasters or emergencies: Special consideration</li>
              </ul>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowPolicyModal(false)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BusRoutes