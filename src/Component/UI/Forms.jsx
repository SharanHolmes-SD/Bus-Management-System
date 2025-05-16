import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

function Forms() {
  const navigate = useNavigate();
  const [routes, setRoutes] = useState([]);
  const [pageStatus, setPageStatus] = useState("loading");
  const [startLocation, setStartLocation] = useState("");
  const [endLocation, setEndLocation] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    if (pageStatus === "loading") {
      axios.get(import.meta.env.VITE_BACKEND_URL + "/api/route/")
        .then((res) => {
          setRoutes(res.data);
          setPageStatus("loaded");
          
          // Set default values if routes exist
          if (res.data.length > 0) {
            setStartLocation(res.data[0].startLocation);
            setEndLocation(res.data[0].endLocation);
            setDate(new Date().toISOString().split('T')[0]);
          }
        })
        .catch(error => {
          console.error("Error fetching routes:", error);
          setPageStatus("error");
        });
    }
  }, [pageStatus]);

  const handleSearch = async () => {
    // Basic validation
    if (!startLocation || !endLocation || !date) {
      toast.error("Please fill in all fields");
      return;
    }

    // Date validation
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to compare only dates

    if (selectedDate < today) {
      toast.error("Please select a future date");
      return;
    }

    try {
      const response = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/buses/selectedbus",
        { startLocation, endLocation, date }
      );
      
      // Navigate to results page with the fetched buses data
      navigate('/routes', { state: { buses: response.data.buses } });
    } catch (error) {
      navigate('/routes', { state: { buses: [] } });
    }
  };

  // Get unique locations from routes
  const startLocations = [...new Set(routes.map(route => route.startLocation))];
  const endLocations = [...new Set(routes.map(route => route.endLocation))];

  return (
    <div className="flex flex-row items-center justify-center w-full min-h-[5rem] rounded-lg bg-gray-50">
      <div className="w-full max-w-6xl">
        <div className="w-full bg-white rounded-lg shadow-md p-4 transition-all duration-300 hover:shadow-lg">
          <div className="flex flex-row items-center gap-4">
            {/* From City */}
            <div className="flex-1">
              <div className="relative">
                <select 
                  value={startLocation}
                  onChange={(e) => setStartLocation(e.target.value)}
                  className="w-full h-12 pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 appearance-none text-gray-800"
                >
                  {startLocations.map((location, index) => (
                    <option key={`from-${index}`} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
                {/* ... SVG icon ... */}
              </div>
            </div>
            
            {/* To City */}
            <div className="flex-1">
              <div className="relative">
                <select 
                  value={endLocation}
                  onChange={(e) => setEndLocation(e.target.value)}
                  className="w-full h-12 pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 appearance-none text-gray-800"
                >
                  {endLocations.map((location, index) => (
                    <option key={`to-${index}`} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
                {/* ... SVG icon ... */}
              </div>
            </div>
            
            {/* Date Selection */}
            <div className="flex-1">
              <div className="relative">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full h-12 pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-800"
                  required
                />
                {/* ... SVG icon ... */}
              </div>
            </div>
            
            {/* Search Button */}
            <div className="flex-none">
              <button 
                onClick={handleSearch}
                className="h-12 px-6 bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 text-white font-medium rounded-lg text-center transition-colors duration-300 flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Find Routes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Forms;