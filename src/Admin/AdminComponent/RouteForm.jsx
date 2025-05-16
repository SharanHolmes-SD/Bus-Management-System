import React, { useState } from 'react';
import { X, Plus, Trash2, MapPin, Clock, Ruler, Bus, DollarSign } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function RouteForm({ onSubmit, onClose }) {
  const [routeNo, setRouteNo] = useState("");
  const [startLocation, setStartLocation] = useState("");
  const [endLocation, setEndLocation] = useState("");
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [acPrice, setAcPrice] = useState("");
  const [nonAcPrice, setNonAcPrice] = useState("");
  const [stops, setStops] = useState([""]);
  const [status, setStatus] = useState("active");
  const navigate = useNavigate();

  const handleStopChange = (index, value) => {
    const newStops = [...stops];
    newStops[index] = value;
    setStops(newStops);
  };



  const addStop = () => setStops([...stops, '']);
  

  const removeStop = (index) => setStops(stops.filter((_, i) => i !== index));

  async function handleSubmit() {
 
    const route = {
      routeNo,
      startLocation,
      endLocation,
      distance,
      duration,
      acPrice,
      nonAcPrice,
      stops,
      status
    };

    const token = localStorage.getItem('token');

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/route/`, 
        route, 
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      navigate('/admin');
      toast.success('Route added successfully!');
    } catch (error) {
      toast.error('Failed to add route!');
    }
  }

  return (
    <div className="fixed inset-0 bg-white overflow-y-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Add New Route</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="space-y-8">
          {/* Basic Route Information */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Route Number</label>
                <input
                  type="text"
                  name="routeNumber"
                  value={routeNo}
                  onChange={(e)=> setRouteNo(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter route number (e.g., R001)"
                />
              </div>
              <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                name="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
            </div>
          </div>

          {/* Route Details */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Route Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">From Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="fromLocation"
                    value={startLocation}
                    onChange={(e)=> setStartLocation(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter starting location"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">To Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="toLocation"
                    value={endLocation}
                    onChange={(e)=> setEndLocation(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter destination"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Distance</label>
                <div className="relative">
                  <Ruler className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="distance"
                    value={distance}
                    onChange={(e)=> setDistance(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter distance (e.g., 350 km)"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="duration"
                    value={duration}
                    onChange={(e)=> setDuration(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter duration (e.g., 6 hours)"
                  />
                </div>
              </div>
              <div className="bg-white shadow rounded-lg p-6">
  <h3 className="text-lg font-medium text-gray-900 mb-4">Pricing</h3>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        AC Price
      </label>
      <div className="relative">
        <input
          type="number"
          value={acPrice}
          onChange={(e) => setAcPrice(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter AC price"
        />
        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">LKR</span>
      </div>
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Non-AC Price
      </label>
      <div className="relative">
        <input
          type="number"
          value={nonAcPrice}
          onChange={(e) => setNonAcPrice(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter Non-AC price"
        />
        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">LKR</span>
      </div>
    </div>
  </div>
</div>
            </div>
          </div>

          {/* Stops */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Stops</h3>
              <button
                type="button"
                onClick={addStop}
                className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Stop
              </button>
            </div>
            <div className="space-y-4">
              {stops.map((stop, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        value={stop}
                        onChange={(e) => handleStopChange(index ,e.target.value)}
                        required
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={`Stop ${index + 1}`}
                      />
                    </div>
                  </div>
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removeStop(index)}
                      className="p-2 text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              onClick={handleSubmit}
            >
              Save Route
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RouteForm;