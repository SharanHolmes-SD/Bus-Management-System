import React, { useEffect, useState } from 'react';
import { Plus, Search, Trash2, Download, Edit } from 'lucide-react';
import BusForm from '../AdminComponent/BusForm';
import axios from 'axios';
import toast from 'react-hot-toast';
import BusReport from '../AdminComponent/PDFReports/BusReport';
import PDFGenerator from '../AdminComponent/PDFReports/PDFGenerator';

function BusDetails() {
  const [busData, setBusData] = useState(false);
  const [buses, setBuses] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBus, setSelectedBus] = useState(null);
  const [showReport, setShowReport] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [busToDelete, setBusToDelete] = useState(null);

  useEffect(() => {
    if (!busData) {
      axios.get(import.meta.env.VITE_BACKEND_URL + "/api/buses/getallBus")
        .then((res) => {
          setBuses(res.data);
          setBusData(true);
        }, []).catch((error) => {
          toast.error("Failed to get bus details");
        });
    }
  }, [busData]);

  const handleGenerateReport = (bus) => {
    setSelectedBus(bus);
    setShowReport(true);
  };

  const handleDelete = (bus) => {
    setBusToDelete(bus._id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/buses/${busToDelete}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success('Bus deleted successfully');
      setBusData(false);
    } catch (error) {
      console.error('Error deleting bus:', error);
      toast.error(error.response?.data?.message || 'Failed to delete bus');
    } finally {
      setShowDeleteConfirm(false);
      setBusToDelete(null);
    }
  };

  const filteredBuses = buses.filter(bus =>
    bus.busNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bus.busName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 ml-64 font-poppins">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Bus Details</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Bus
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by bus number or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Bus Table */}
      {busData ? 
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bus Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bus Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBuses.map((bus) => (
                <tr key={bus.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{bus.busNo}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{bus.busName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{bus.busType}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{bus.noOfSeats}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleGenerateReport(bus)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                    <button className="text-yellow-600 hover:text-yellow-900 mr-3">
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(bus)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div> : <div>loading</div>}

      {/* Full Screen Bus Form */}
      {showAddModal && (
        <BusForm 
          onClose={() => setShowAddModal(false)} 
        />
      )}

      {/* PDF Report Generation */}
      {showReport && selectedBus && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Generate Bus Report</h2>
            <div className="flex justify-end space-x-3">
              <PDFGenerator
                document={<BusReport busData={selectedBus} />}
                fileName={`bus_report_${selectedBus.busNo}.pdf`}
                buttonText="Download Report"
              />
              <button
                onClick={() => setShowReport(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this bus? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setBusToDelete(null);
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BusDetails;