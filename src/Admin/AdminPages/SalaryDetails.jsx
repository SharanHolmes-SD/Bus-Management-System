import { useState, useEffect } from 'react';
import axios from 'axios';
import { TrashIcon, TruckIcon } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SalaryManagement() {
  const staffNames = [
    { id: 1, name: 'Ravi', role: 'Driver' },
    { id: 2, name: 'robert', role: 'Conductor' },
    { id: 3, name: 'john', role: 'Conductor' },
    { id: 4, name: 'harry', role: 'Driver' }
  ];

  const [staffList, setStaffList] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    role: 'driver',
    salary: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState(null);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const { data } = await axios.get(import.meta.env.VITE_BACKEND_URL + "/api/staff");
        setStaffList(data);
      } catch (error) {
        console.error('Error fetching staff:', error);
      }
    };
    fetchStaff();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.salary) return;

    try {
      const { data } = await axios.post(import.meta.env.VITE_BACKEND_URL + "/api/staff", formData);
      setStaffList([...staffList, data]);
      setFormData({ name: '', role: 'driver', salary: '' });
    } catch (error) {
      console.error('Error adding staff:', error);
    }
  };

  const handleDelete = (staff) => {
    setStaffToDelete(staff._id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/staff/${staffToDelete}`);
      setStaffList(staffList.filter(staff => staff._id !== staffToDelete));
      toast.success('Staff member deleted successfully');
    } catch (error) {
      console.error('Error deleting staff:', error);
      toast.error('Failed to delete staff member');
    } finally {
      setShowDeleteConfirm(false);
      setStaffToDelete(null);
    }
  };

  const handlePrint = () => {
    const printContent = document.getElementById('printable-area').innerHTML;
    const originalContent = document.body.innerHTML;
    
    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  };

  const filteredStaffList = staffList.filter(staff =>
    staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8 no-print">
          <h1 className="text-3xl font-bold text-gray-800">Staff Salary Management</h1>
          <button
            onClick={handlePrint}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Print Report
          </button>
        </div>
        
        <div className="no-print mb-6">
          <input
            type="text"
            placeholder="Search by name or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        {/* Add Staff Form */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8 no-print">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Add New Staff Member</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Staff Name</label>
                <select
                  value={formData.name}
                  onChange={(e) => {
                    const selectedStaff = staffNames.find(staff => staff.name === e.target.value);
                    setFormData({
                      ...formData,
                      name: e.target.value,
                      role: selectedStaff ? selectedStaff.role.toLowerCase() : 'driver'
                    });
                  }}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Staff Member</option>
                  {staffNames.map((staff) => (
                    <option key={staff.id} value={staff.name}>
                      {staff.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled
                >
                  <option value="driver">Driver</option>
                  <option value="conductor">Conductor</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Salary (Rs.)</label>
                <input
                  type="number"
                  value={formData.salary}
                  onChange={(e) => setFormData({...formData, salary: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="25000"
                  required
                />
              </div>
            </div>
            
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              Add Staff Member
            </button>
          </form>
        </div>

        {/* Printable Area */}
        <div id="printable-area">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Role</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Salary</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Date Added</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredStaffList.map((staff) => (
                  <tr key={staff._id}>
                    <td className="px-6 py-4 text-gray-800">{staff.name}</td>
                    <td className="px-6 py-4 capitalize">{staff.role}</td>
                    <td className="px-6 py-4 text-gray-800">Rs.{staff.salary}</td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(staff.dateAdded).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total Salary Summary */}
          <div className="mt-6 text-right">
            <div className="inline-block px-6 py-3">
              <span className="font-medium">Total Monthly Salary: </span>
              <span className="font-semibold">
                Rs.{filteredStaffList.reduce((sum, staff) => sum + Number(staff.salary), 0)}
              </span>
            </div>
          </div>
        </div>

        {/* Original Table with Delete Buttons (non-printable) */}
        <div className="no-print">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mt-8">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Role</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Salary</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Date Added</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredStaffList.map((staff) => (
                  <tr key={staff._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-gray-800">{staff.name}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {staff.role === 'driver' ? (
                          <TruckIcon className="w-5 h-5 text-blue-600 mr-2" />
                        ) : (
                          <TruckIcon className="w-5 h-5 text-green-600 mr-2" />
                        )}
                        <span className="capitalize">{staff.role}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-800">Rs.{staff.salary}</td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(staff.dateAdded).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDelete(staff)}
                        className="text-red-600 hover:text-red-800 flex items-center"
                      >
                        <TrashIcon className="w-5 h-5 mr-1" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Confirm Deletion</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this staff member? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setStaffToDelete(null);
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
    </div>
  );
}