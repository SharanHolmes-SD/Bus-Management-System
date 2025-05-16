// frontend/src/components/Seating.js
import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Calendar, Clock, MapPin, Ticket, Trash2 } from "lucide-react";

const seatStatuses = {
  available: "bg-emerald-400 text-white cursor-pointer",
  booked: "bg-gray-300 text-gray-500 cursor-not-allowed opacity-70",
  notProvided: "bg-amber-50 border border-amber-200 text-amber-700",
};

const config = { reservedFee: 50 };

const Seating = () => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [seatStatusMap, setSeatStatusMap] = useState({});
  const [formData, setFormData] = useState({ name: "", phone: "" });
  const [loadingSeats, setLoadingSeats] = useState(true);
  const containerRef = useRef(null);
  const seatsRef = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { bus, selectedDate, selectedTime, endTime } = location.state || {};
  const [userBookings, setUserBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    if (!bus || !selectedDate || !selectedTime) return;

    const fetchBookedSeats = async () => {
      try {
        const response = await axios.get(import.meta.env.VITE_BACKEND_URL + "/api/bookings", {
          params: {
            busId: bus._id,
            bookingDate: selectedDate,
            time: selectedTime
          }
        });

        const bookedSeats = response.data.bookedSeats;
        const seatLayout = generateSeatLayout().flat();
        
        const bookedSeatNumbers = bookedSeats.map(label => {
          const seat = seatLayout.find(s => s.label === label);
          return seat ? seat.num : null;
        }).filter(Boolean);

        const statusMap = {};
        for (let i = 1; i <= bus.noOfSeats; i++) {
          statusMap[i] = bookedSeatNumbers.includes(i) ? 'booked' : 'available';
        }
        
        setSeatStatusMap(statusMap);
        setLoadingSeats(false);

      } catch (error) {
        console.error('Error fetching seat availability:', error);
        setLoadingSeats(false);
      }
    };

    fetchBookedSeats();
  }, [bus, selectedDate, selectedTime]);

  useEffect(() => {
    const fetchUserBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        if (!token || !userId) {
          setLoadingBookings(false);
          return;
        }

        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/bookings/getbookings`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        setUserBookings(response.data);
      } catch (error) {
        console.error('Error fetching user bookings:', error);
      } finally {
        setLoadingBookings(false);
      }
    };

    fetchUserBookings();
  }, []);

  const generateSeatLayout = () => {
    if (!bus) return [];
    const layout = [];
    let seatNumber = 1;
    let rowNumber = 1;

    while (seatNumber <= bus.noOfSeats) {
      const seatsInRow = Math.min(4, bus.noOfSeats - seatNumber + 1);
      const rowSeats = [];
      
      for (let i = 0; i < seatsInRow; i++) {
        const label = `${rowNumber}${String.fromCharCode(65 + i)}`;
        rowSeats.push({ num: seatNumber, label });
        seatNumber++;
      }
      
      layout.push(rowSeats);
      rowNumber++;
    }

    return layout;
  };

  const handleSeatClick = (seatNum) => {
    if (seatStatusMap[seatNum] === "booked" || loadingSeats) return;

    const seatElement = seatsRef.current[seatNum - 1];
    if (seatElement) {
      gsap.to(seatElement, {
        scale: 1.1,
        duration: 0.2,
        ease: "power2.out",
        yoyo: true,
        repeat: 1
      });
    }

    setSelectedSeats(prev => 
      prev.includes(seatNum) 
        ? prev.filter(s => s !== seatNum) 
        : prev.length < 4 ? [...prev, seatNum] : prev
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Phone number validation
    if (name === 'phone') {
      // Only allow numbers and limit to 10 digits
      const numericValue = value.replace(/[^0-9]/g, '').slice(0, 10);
      setFormData(prev => ({ ...prev, [name]: numericValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleProceedToPayment = () => {
    if (!bus || selectedSeats.length === 0 || !formData.name || !formData.phone) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Phone number length validation - must be exactly 10 digits
    if (formData.phone.length !== 10) {
      toast.error("Phone number must be exactly 10 digits");
      return;
    }

    const seatLabels = selectedSeats.map(seatNum => 
      generateSeatLayout()
        .flat()
        .find(seat => seat.num === seatNum)?.label || seatNum
    );

    navigate("/payment", {
      state: {
        bookingDetails: {
          selectedSeats: seatLabels,
          passengerName: formData.name,
          passengerPhone: formData.phone,
          bookingDate: selectedDate,
          departureTime: selectedTime,
          arrivalTime: endTime,
          routeNumber: bus.routeNo,
          busId: bus._id,
          seatPrice: bus.price,
          totalPrice: selectedSeats.length * bus.price + config.reservedFee * 2,
          busType: bus.busType,
          startLocation: bus.startLocation,
          endLocation: bus.endLocation,
          reservationFee: config.reservedFee * 2
        }
      }
    });
  };

  const handleCancelBooking = async () => {
    if (!bookingToCancel) return;

    setIsCancelling(true);
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      if (!token || !userId) {
        throw new Error('User not authenticated');
      }

      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/bookings/${bookingToCancel._id}`,
        {
          data: { userId },
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      toast.success(response.data.message);
      if (response.data.refundAmount > 0) {
        toast.success(`Refund Amount: LKR ${response.data.refundAmount.toFixed(2)}`);
      }
      // Refresh the bookings list
      const bookingsResponse = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/bookings/getbookings`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      setUserBookings(bookingsResponse.data);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to cancel booking');
    } finally {
      setIsCancelling(false);
      setShowCancelModal(false);
      setBookingToCancel(null);
    }
  };

  const seatLayout = generateSeatLayout();
  const total = selectedSeats.length * (bus?.price || 0) + config.reservedFee * 2;

  if (!bus) return <div className="p-6 text-center">Loading bus details...</div>;

  return (
    <div ref={containerRef} className="bg-gray-100 p-6 min-h-screen font-poppins">
      <div className="mx-auto max-w-5xl grid grid-cols-1 lg:grid-cols-5 gap-6 bg-white p-6 rounded-xl shadow-lg">
        {/* Header Section */}
        <div className="lg:col-span-5 header-content">
          <h1 className="text-xl font-semibold text-black">Express Bus Reservation</h1>
          <div className="flex flex-col gap-3 text-sm text-gray-600 mt-1">
            <span>{bus.startLocation} to {bus.endLocation} • {selectedDate}</span>
            <span>{selectedTime} to {endTime}</span>
          </div>
          <div className="flex gap-3 text-sm text-gray-600 mt-1">
            <span>{bus.routeNo}</span>
            <span>{bus.noOfSeats} Seats</span>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">{bus.busType}</span>
            <span className="hidden">{bus._id}</span>
          </div>
        </div>

        {/* Seat Selection Section */}
        <div className="lg:col-span-3">
          <h2 className="text-md font-semibold text-gray-700 mb-3">Select Your Seats</h2>

          {loadingSeats ? (
            <div className="text-center py-4 text-gray-500">
              <div className="animate-pulse">Loading seat availability...</div>
            </div>
          ) : (
            <>
              <div className="flex gap-4 mb-4 text-xs seat-legend">
                {Object.entries(seatStatuses).map(([status, classes]) => (
                  <div key={status} className="flex items-center">
                    <div className={`w-4 h-4 rounded ${classes.split(" ")[0]}`}></div>
                    <span className="ml-1 capitalize text-gray-600">{status}</span>
                  </div>
                ))}
              </div>

              <div className="relative bg-gray-50 rounded-lg p-6 shadow-sm">
                <div className="text-xs text-center text-gray-500 bg-gray-200 w-24 mx-auto mb-6 py-1 rounded-full">Bus Front</div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-2">
                      <div className="w-20 h-10 bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-600 font-medium">
                        Entrance
                      </div>
                    </div>
                    <div className="w-6 h-8 bg-gray-100 rounded-sm"></div>
                    <div className="flex gap-2">
                      <div className="w-20 h-10 ml-4 bg-gray-300 rounded-md flex items-center justify-center text-xs text-gray-700 font-medium shadow">
                        Driver
                      </div>
                    </div>
                  </div>

                  {seatLayout.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex items-center gap-3">
                      <span className="w-6 text-xs text-gray-500 font-medium text-right">{rowIndex + 1}</span>
                      {rowIndex === seatLayout.length - 1 ? (
                        <div className="flex gap-2">
                          {row.map(seat => (
                            <Seat
                              key={seat.num}
                              ref={el => (seatsRef.current[seat.num - 1] = el)}
                              {...seat}
                              selected={selectedSeats.includes(seat.num)}
                              status={seatStatusMap[seat.num]}
                              onClick={handleSeatClick}
                            />
                          ))}
                        </div>
                      ) : (
                        <>
                          <div className="flex gap-2">
                            {row.slice(0, 2).map(seat => (
                              <Seat
                                key={seat.num}
                                ref={el => (seatsRef.current[seat.num - 1] = el)}
                                {...seat}
                                selected={selectedSeats.includes(seat.num)}
                                status={seatStatusMap[seat.num]}
                                onClick={handleSeatClick}
                              />
                            ))}
                          </div>
                          <div className="w-6 h-8 bg-gray-100 rounded-sm"></div>
                          <div className="flex gap-2">
                            {row.slice(2).map(seat => (
                              <Seat
                                key={seat.num}
                                ref={el => (seatsRef.current[seat.num - 1] = el)}
                                {...seat}
                                selected={selectedSeats.includes(seat.num)}
                                status={seatStatusMap[seat.num]}
                                onClick={handleSeatClick}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Booking Form Section - Fixed visibility */}
        <div className="lg:col-span-2 bg-gray-50 p-4 rounded-lg shadow-sm">
          <h2 className="text-md font-semibold text-gray-700 mb-4">Booking Details</h2>
          <form className="space-y-4 text-sm" onSubmit={e => e.preventDefault()}>
            <div>
              <label className="block text-gray-700 mb-1 text-xs font-medium">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your name"
                className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                required
                disabled={loadingSeats}
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1 text-xs font-medium">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter your number"
                className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                required
                disabled={loadingSeats}
              />
            </div>
            <div className="bg-white p-3 rounded border border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700 text-xs font-medium">Selected Seats</span>
                <span className="text-xs text-gray-500">{selectedSeats.length}/4</span>
              </div>
              <div className="mb-3">
                {selectedSeats.length > 0 ? (
                  <div className="flex gap-2">
                    {selectedSeats.map(seat => (
                      <span
                        key={seat}
                        className="inline-flex items-center justify-center w-8 h-8 rounded bg-blue-100 text-blue-700 text-xs font-medium"
                      >
                        {seatLayout.flat().find(s => s.num === seat).label}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-gray-400 italic">No seats selected</span>
                )}
              </div>
              <div className="pt-2 border-t border-gray-100 text-xs">
                <div className="flex justify-between text-gray-600 mb-1">
                  <span>Tickets ({selectedSeats.length})</span>
                  <span>{bus.price * selectedSeats.length} LKR</span>
                </div>
                <div className="flex justify-between text-gray-600 mb-1">
                  <span>Reservation Fee</span>
                  <span>{config.reservedFee * 2} LKR</span>
                </div>
                <div className="flex justify-between font-semibold text-gray-800">
                  <span>Total</span>
                  <span>{total} LKR</span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleProceedToPayment}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg text-sm transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              disabled={loadingSeats || selectedSeats.length === 0 || !formData.name || !formData.phone}
            >
              {loadingSeats ? (
                <>
                  Loading Seats...
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </>
              ) : (
                <>
                  Proceed to Payment
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* User's Booked Seats Section */}
      <div className="mx-auto max-w-5xl mt-8 bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Your Booked Seats</h2>
        
        {loadingBookings ? (
          <div className="text-center py-4 text-gray-500">
            <div className="animate-pulse">Loading your bookings...</div>
          </div>
        ) : userBookings.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">You haven't made any bookings yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {userBookings.map((booking) => (
              <div key={booking._id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Route Information */}
                  <div className="flex items-start space-x-3">
                    <MapPin className="flex-shrink-0 text-blue-500 mt-1" />
                    <div>
                      <h3 className="font-medium text-gray-800">Route</h3>
                      <p className="text-gray-600">
                        {booking.startLocation} → {booking.endLocation}
                      </p>
                    </div>
                  </div>

                  {/* Date and Time */}
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <Calendar className="text-blue-500 inline mr-2" />
                      <Clock className="text-blue-500 inline" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">Schedule</h3>
                      <p className="text-gray-600">
                        {booking.bookingDate} • {booking.time}
                      </p>
                    </div>
                  </div>

                  {/* Seats */}
                  <div className="flex items-start space-x-3">
                    <Ticket className="flex-shrink-0 text-blue-500 mt-1" />
                    <div>
                      <h3 className="font-medium text-gray-800">Booked Seats</h3>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {booking.seats.map((seat, index) => (
                          <span
                            key={index}
                            className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium"
                          >
                            {seat}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Cancel Button */}
                  <div className="flex items-center justify-end">
                    <button
                      onClick={() => {
                        setBookingToCancel(booking);
                        setShowCancelModal(true);
                      }}
                      className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Cancel Booking
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cancellation Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Cancel Booking</h2>
            <p className="text-gray-600 mb-4">
              Are you sure you want to cancel this booking?
            </p>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    Cancellation Policy:
                    <ul className="list-disc list-inside mt-1">
                      <li>More than 3 hours before departure: Full refund</li>
                      <li>1-3 hours before departure: 50% refund</li>
                      <li>Less than 1 hour before departure: No refund</li>
                    </ul>
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setBookingToCancel(null);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                No, Keep Booking
              </button>
              <button
                onClick={handleCancelBooking}
                disabled={isCancelling}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-red-400 disabled:cursor-not-allowed flex items-center"
              >
                {isCancelling ? (
                  <>
                    Cancelling...
                    <svg className="animate-spin h-4 w-4 ml-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  </>
                ) : (
                  'Yes, Cancel Booking'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Seat = React.forwardRef(({ num, label, selected, status, onClick }, ref) => (
  <div
    ref={ref}
    onClick={() => onClick(num)}
    className={`w-10 h-10 rounded-md flex items-center justify-center text-xs font-medium transition
      ${seatStatuses[status]} ${selected ? "ring-2 ring-blue-500 ring-offset-1" : ""}`}
  >
    {label}
  </div>
));

export default Seating;