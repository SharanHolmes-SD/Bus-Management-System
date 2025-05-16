import React, { useEffect, useState } from 'react';
import { Building, Bus, Clock, DollarSign, MapPin, User, X } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

function BusForm({ onClose }) {
  const [status, setStatus] = useState('loading');
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [selectedRouteNumber, setSelectedRouteNumber] = useState('');
  const [timeSlots, setTimeSlots] = useState([{ date: '', departure: '', arrival: '' }]);
  const [busName, setBusName] = useState("");
  const [noOfSeats, SetNoOfSeats] = useState("");
  const [busOwnerName, setBusOwnerName] = useState("");
  const [busNo, setBusNo] = useState("");
  const [busType, setBusType] = useState("");
  const [driverName, setDriverName] = useState("");

  useEffect(() => {
    if (status === 'loading') {
      axios
        .get(import.meta.env.VITE_BACKEND_URL + '/api/route/')
        .then((res) => {
          setRoutes(res.data);
          setStatus('loaded');
        })
        .catch((error) => {
          console.error('Error fetching routes:', error);
          setStatus('error');
        });
    }
  }, [status]);

  const handleRouteChange = (e) => {
    const routeNumber = e.target.value;
    setSelectedRouteNumber(routeNumber);
    const route = routes.find((r) => r.routeNo === routeNumber);
    setSelectedRoute(route || null);
  };

  const addTimeSlot = () => {
    setTimeSlots([...timeSlots, { date: '', departure: '', arrival: '' }]);
  };

  const removeTimeSlot = (index) => {
    if (timeSlots.length === 1) return;
    const updatedSlots = timeSlots.filter((_, i) => i !== index);
    setTimeSlots(updatedSlots);
  };

  const handleTimeSlotChange = (index, field, value) => {
    const updatedSlots = timeSlots.map((slot, i) => 
      i === index ? { ...slot, [field]: value } : slot
    );
    setTimeSlots(updatedSlots);
  };

  async function addBus() {
    if (!selectedRoute) {
      toast.error('Please select a route first');
      return;
    }

    // Process time slots into the required schedule format
    const scheduleMap = {};
    timeSlots.forEach(slot => {
      if (!scheduleMap[slot.date]) {
        scheduleMap[slot.date] = [];
      }
      scheduleMap[slot.date].push({
        startTime: slot.departure,
        endTime: slot.arrival
      });
    });

    // Convert to array format
    const schedule = Object.entries(scheduleMap).map(([date, times]) => ({
      date,
      times
    }));

    // Prepare the complete bus data
    const busData = {
      busName,
      noOfSeats,
      busOwnerName,
      busNo,
      busType,
      driverName,
      routeNo: selectedRoute.routeNo,
      startLocation: selectedRoute.startLocation,
      endLocation: selectedRoute.endLocation,
      price: busType === "AC" ? selectedRoute.acPrice : selectedRoute.nonAcPrice,
      schedule
    };

    const token = localStorage.getItem('token');

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/buses`, 
        busData,
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );
      
      if (response.status === 201) {
        toast.success('Bus added successfully!');
        onClose();
        // Refresh the bus list by triggering a page reload or state update
        window.location.reload();
      } else {
        toast.error('Failed to add bus!');
      }
    } catch (error) {
      console.error('Error adding bus:', error);
      toast.error(error.response?.data?.message || 'Failed to add bus!');
    }
  }

  return (
    <div className="space-y-8">
      <div className="fixed inset-0 bg-white overflow-y-auto">
        <div className="min-h-screen p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8 border-b pb-4">
            <h2 className="text-3xl font-bold text-gray-800 flex items-center">
              <Bus className="w-8 h-8 mr-3 text-blue-600" />
              Add New Bus
            </h2>
            <button
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              onClick={onClose}
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Basic Bus Information */}
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  <Bus className="w-6 h-6 mr-2 text-blue-600" />
                  Basic Bus Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bus Number</label>
                    <input
                      type="text"
                      name="busNumber"
                      value={busNo}
                      onChange={(e) => setBusNo(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bus Name</label>
                    <input
                      type="text"
                      name="busName"
                      value={busName}
                      onChange={(e) => setBusName(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bus Type</label>
                    <select
                      name="busType"
                      value={busType}
                      onChange={(e) => setBusType(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Bus Type</option>
                      <option value="Non-AC">Non-AC</option>
                      <option value="AC">AC</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Seats</label>
                    <input
                      type="number"
                      name="totalSeats"
                      value={noOfSeats}
                      onChange={(e) => SetNoOfSeats(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Driver Information */}
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  <User className="w-6 h-6 mr-2 text-blue-600" />
                  Driver Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Driver Name</label>
                    <input
                      type="text"
                      name="driverName"
                      value={driverName}
                      onChange={(e) => setDriverName(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Owner Name</label>
                    <input
                      type="text"
                      name="ownerName"
                      value={busOwnerName}
                      onChange={(e) => setBusOwnerName(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Route Information */}
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  <MapPin className="w-6 h-6 mr-2 text-blue-600" />
                  Bus Route
                </h3>
                <div>
                  <select
                    name="routeNumber"
                    value={selectedRouteNumber}
                    onChange={handleRouteChange}
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="" className="text-black">
                      Select Route Number
                    </option>
                    {routes.map((route) => (
                      <option key={route.routeNo} value={route.routeNo}>
                        {route.routeNo}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    From Location
                  </label>
                  <input
                    type="text"
                    name="fromLocation"
                    value={selectedRoute?.startLocation || ''}
                    readOnly
                    className="w-full border border-gray-300 rounded-md px-4 py-2 bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    To Location
                  </label>
                  <input
                    type="text"
                    name="toLocation"
                    value={selectedRoute?.endLocation || ''}
                    readOnly
                    className="w-full border border-gray-300 rounded-md px-4 py-2 bg-gray-100"
                  />
                </div>

                {/* Stops Info */}
                {selectedRoute?.stops?.length > 0 && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bus Stops
                    </label>
                    <div className="bg-white p-3 rounded-md border border-gray-200 max-h-40 overflow-y-auto">
                      <ul className="divide-y divide-gray-200">
                        {selectedRoute.stops.map((stop, index) => (
                          <li key={index} className="py-2 flex items-center">
                            <Building className="w-4 h-4 mr-2 text-gray-500" />
                            <span>{stop}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Price Info */}
                <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                    <DollarSign className="w-6 h-6 mr-2 text-blue-600" />
                    Price Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {busType ? `${busType} Price` : "Price"}
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={
                            selectedRoute
                              ? busType === "AC"
                                ? selectedRoute.acPrice
                                : selectedRoute.nonAcPrice
                              : ""
                          }
                          readOnly
                          className="w-full border border-gray-300 rounded-md px-4 py-2 bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                          LKR
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Time Slots */}
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm lg:col-span-2">
                <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  <Clock className="w-6 h-6 mr-2 text-blue-600" />
                  Time Slots
                </h3>
                <div className="space-y-4">
                  {timeSlots.map((slot, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-white rounded-lg">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                        <input
                          type="date"
                          value={slot.date}
                          onChange={(e) => handleTimeSlotChange(index, 'date', e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Departure Time</label>
                        <input
                          type="time"
                          value={slot.departure}
                          onChange={(e) => handleTimeSlotChange(index, 'departure', e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Arrival Time</label>
                        <input
                          type="time"
                          value={slot.arrival}
                          onChange={(e) => handleTimeSlotChange(index, 'arrival', e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      <div className="flex items-end">
                        {index === 0 ? (
                          <button
                            type="button"
                            onClick={addTimeSlot}
                            className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                          >
                            Add Time Slot
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => removeTimeSlot(index)}
                            className="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end mt-8 border-t pt-6">
              <button
                type="button"
                onClick={addBus}
                className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-lg font-medium"
              >
                Add Bus
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BusForm;