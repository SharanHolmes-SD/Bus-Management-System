import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

function Inventory() {
  const [inventories, setInventories] = useState([]);
  const [formData, setFormData] = useState({
    vehicleNumber: '',
    vehicleModel: '',
    yearOfManufacture: '',
    issueDescription: '',
    priorityLevel: 'Low',
    sparePartName: '',
    quantityAvailable: '',
    status: 'Active'
  });
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [inventoryToDelete, setInventoryToDelete] = useState(null);

  useEffect(() => {
    fetchInventories();
  }, []);

  const fetchInventories = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/inventory`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInventories(response.data);
    } catch (error) {
      console.error('Error fetching inventories:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let year;
    if (formData.yearOfManufacture) {
      year = parseInt(formData.yearOfManufacture, 10);
      if (isNaN(year)) {
        alert('Please enter a valid number for Year of Manufacture');
        return;
      }
    } else {
      year = undefined;
    }

    let quantity;
    if (formData.quantityAvailable) {
      quantity = parseInt(formData.quantityAvailable, 10);
      if (isNaN(quantity)) {
        alert('Please enter a valid number for Quantity Available');
        return;
      }
    } else {
      quantity = undefined;
    }

    const cleanedData = {
      ...formData,
      yearOfManufacture: year,
      quantityAvailable: quantity
    };

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in as an admin to perform this action.');
        return;
      }

      if (editingId) {
        await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/api/inventory/${editingId}`,
          cleanedData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/inventory`,
          cleanedData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      setFormData({
        vehicleNumber: '',
        vehicleModel: '',
        yearOfManufacture: '',
        issueDescription: '',
        priorityLevel: 'Low',
        sparePartName: '',
        quantityAvailable: '',
        status: 'Active'
      });
      setEditingId(null);
      fetchInventories();
    } catch (error) {
      console.error('Error saving inventory:', error);
      alert(
        error.response?.data?.message ||
        'Failed to save inventory. Please ensure you are logged in as an admin.'
      );
    }
  };

  const handleEdit = (inventory) => {
    setFormData({
      ...inventory,
      yearOfManufacture: inventory.yearOfManufacture ? inventory.yearOfManufacture.toString() : '',
      quantityAvailable: inventory.quantityAvailable ? inventory.quantityAvailable.toString() : ''
    });
    setEditingId(inventory._id);
  };

  const handleDelete = (inventory) => {
    setInventoryToDelete(inventory._id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in as an admin to perform this action.');
        return;
      }
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/inventory/${inventoryToDelete}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchInventories();
      toast.success('Inventory item deleted successfully');
    } catch (error) {
      console.error('Error deleting inventory:', error);
      toast.error('Failed to delete inventory item');
    } finally {
      setShowDeleteConfirm(false);
      setInventoryToDelete(null);
    }
  };

  const filteredInventories = inventories.filter((inventory) =>
    inventory.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inventory.vehicleModel.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePrint = () => {
    const printContent = document.getElementById('printable-area').innerHTML;
    const originalContent = document.body.innerHTML;
    
    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  };

  return (
    <div className="p-6 ml-64 font-poppins">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Inventory Management</h1>
        <button
          onClick={handlePrint}
          className="no-print bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          Print to PDF
        </button>
      </div>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by Vehicle Number or Model"
        className="no-print mb-4 p-2 border rounded w-full"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Inventory Form */}
      <form onSubmit={handleSubmit} className="no-print bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Vehicle Number</label>
            <input
              type="text"
              required
              className="mt-1 p-2 border rounded w-full"
              value={formData.vehicleNumber}
              onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Vehicle Model</label>
            <input
              type="text"
              className="mt-1 p-2 border rounded w-full"
              value={formData.vehicleModel}
              onChange={(e) => setFormData({ ...formData, vehicleModel: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Year of Manufacture</label>
            <input
              type="number"
              className="mt-1 p-2 border rounded w-full"
              value={formData.yearOfManufacture}
              onChange={(e) => setFormData({ ...formData, yearOfManufacture: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Priority Level</label>
            <select
              className="mt-1 p-2 border rounded w-full"
              value={formData.priorityLevel}
              onChange={(e) => setFormData({ ...formData, priorityLevel: e.target.value })}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Issue Description</label>
            <textarea
              required
              className="mt-1 p-2 border rounded w-full"
              value={formData.issueDescription}
              onChange={(e) => setFormData({ ...formData, issueDescription: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Spare Part Name</label>
            <input
              type="text"
              className="mt-1 p-2 border rounded w-full"
              value={formData.sparePartName}
              onChange={(e) => setFormData({ ...formData, sparePartName: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Quantity Available</label>
            <input
              type="number"
              className="mt-1 p-2 border rounded w-full"
              value={formData.quantityAvailable}
              onChange={(e) => setFormData({ ...formData, quantityAvailable: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              className="mt-1 p-2 border rounded w-full"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="Active">Active</option>
              <option value="Under Maintenance">Under Maintenance</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {editingId ? 'Update Inventory' : 'Add Inventory'}
        </button>
      </form>

      {/* Printable Area */}
      <div id="printable-area" className="bg-white rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-bold text-gray-800 p-6">Inventory Report</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle Number</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Spare Part</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredInventories.map((inventory) => (
              <tr key={inventory._id}>
                <td className="px-6 py-4 whitespace-nowrap text-gray-800">{inventory.vehicleNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-800">{inventory.vehicleModel}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-800">{inventory.yearOfManufacture}</td>
                <td className="px-6 py-4 text-gray-800">{inventory.issueDescription}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`${
                    inventory.priorityLevel === 'High'
                      ? 'text-red-600'
                      : inventory.priorityLevel === 'Medium'
                      ? 'text-orange-600'
                      : 'text-green-600'
                  }`}>
                    {inventory.priorityLevel}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-800">{inventory.sparePartName || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-800">{inventory.quantityAvailable || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    inventory.status === 'Active'
                      ? 'bg-green-100 text-green-800'
                      : inventory.status === 'Under Maintenance'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {inventory.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Inventory List */}
      <div className="no-print grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredInventories.map((inventory) => (
          <div key={inventory._id} className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-semibold text-gray-800">{inventory.vehicleNumber}</h3>
              <span
                className={`px-2 py-1 rounded text-sm ${
                  inventory.status === 'Active'
                    ? 'bg-green-100 text-green-800'
                    : inventory.status === 'Under Maintenance'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                {inventory.status}
              </span>
            </div>
            <p className="text-gray-600 mb-2">{inventory.vehicleModel}</p>
            <p className="text-sm text-gray-500">Year: {inventory.yearOfManufacture}</p>
            <p className="text-sm text-gray-500">
              Priority:
              <span
                className={`ml-1 ${
                  inventory.priorityLevel === 'High'
                    ? 'text-red-600'
                    : inventory.priorityLevel === 'Medium'
                    ? 'text-orange-600'
                    : 'text-green-600'
                }`}
              >
                {inventory.priorityLevel}
              </span>
            </p>
            <p className="text-sm text-gray-500 mt-2">{inventory.issueDescription}</p>

            {inventory.sparePartName && (
              <div className="mt-2 border-t pt-2">
                <p className="text-sm text-gray-500">
                  Spare Part: {inventory.sparePartName} (Qty: {inventory.quantityAvailable})
                </p>
              </div>
            )}

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => handleEdit(inventory)}
                className="text-sm bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(inventory)}
                className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this inventory item? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setInventoryToDelete(null);
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

export default Inventory;