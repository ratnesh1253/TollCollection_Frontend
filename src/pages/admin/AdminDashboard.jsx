import React, { useEffect, useState } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";

export default function AdminDashboard() {
  const [admin, setAdmin] = useState({});
  const [geofences, setGeofences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingGeofence, setEditingGeofence] = useState(null);

  const email = localStorage.getItem("email");

  const getAdminData = async () => {
    try {
      setLoading(true);

      // Fetch admin data
      const encodedEmail = encodeURIComponent(email);
      const adminResponse = await fetch(
        `http://localhost:8080/admin/${encodedEmail}`
      );

      if (!adminResponse.ok) {
        console.log(`Failed to fetch admin data: ${adminResponse.status}`);
        throw new Error(`Failed to fetch admin data: ${adminResponse.status}`);
      }

      const { admin } = await adminResponse.json();
      setAdmin(admin);

      // Fetch geofences data
      const geofenceResponse = await fetch(
        "http://localhost:8080/geofence/show"
      );

      if (!geofenceResponse.ok) {
        console.log(`Failed to fetch geofences: ${geofenceResponse.status}`);
        throw new Error(
          `Failed to fetch geofences: ${geofenceResponse.status}`
        );
      }

      const geofences = await geofenceResponse.json();
      setGeofences(geofences);
    } catch (error) {
      console.error("Error in getAdminData:", error.message);
      // Consider adding error state handling here, e.g.:
      // setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAdminData();
  }, [email]);

  const initialFormState = {
    name: "",
    lat1: "",
    lon1: "",
    lat2: "",
    lon2: "",
    lat3: "",
    lon3: "",
    lat4: "",
    lon4: "",
    charges: "",
    adminId: "",
  };

  // State for modal
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    lat1: "",
    lon1: "",
    lat2: "",
    lon2: "",
    lat3: "",
    lon3: "",
    lat4: "",
    lon4: "",
    charges: "",
    adminId: "",
  });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const encodedEmail = encodeURIComponent(email);
      const adminResponse = await fetch(
        `http://localhost:8080/admin/${encodedEmail}`
      );

      if (!adminResponse.ok) {
        throw new Error(`Failed to fetch admin data: ${adminResponse.status}`);
      }

      const { admin } = await adminResponse.json();
      const endpoint = editingGeofence
        ? `http://localhost:8080/geofence/update/${editingGeofence.id}`
        : "http://localhost:8080/geofence/add";

      const method = editingGeofence ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, adminId: admin.id }),
      });

      if (!response.ok) {
        console.log("Failed to save geofence");
        throw new Error("Failed to save geofence");
      }

      // Reset and close - THIS IS THE FIXED VERSION
      setFormData(initialFormState);
      setShowModal(false);
      setEditingGeofence(null);
      getAdminData();
    } catch (error) {
      console.error("Error:", error.message);
      // Show error to user
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  const handleEditClick = (geofence) => {
    setEditingGeofence(geofence);
    setFormData({
      name: geofence.name,
      lat1: geofence.lat1,
      lon1: geofence.lon1,
      lat2: geofence.lat2,
      lon2: geofence.lon2,
      lat3: geofence.lat3,
      lon3: geofence.lon3,
      lat4: geofence.lat4,
      lon4: geofence.lon4,
      charges: geofence.charges,
    });
    setShowModal(true);
  };

  const handleDeleteClick = async (geofenceId) => {
    if (!window.confirm("Are you sure you want to delete this geofence?")) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/geofence/delete/${geofenceId}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        console.log(result.message || "Failed to delete geofence");
        throw new Error(result.message || "Failed to delete geofence");
      }

      // Refresh the geofences list
      getAdminData();

      // Optional: Show success message
      alert("Geofence deleted successfully");
    } catch (error) {
      console.error("Error deleting geofence:", error.message);
      alert(error.message);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen mt-5">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Admin Info Card */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Admin Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">First Name</p>
              <p className="font-medium">{admin.first_name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Last Name</p>
              <p className="font-medium">{admin.last_name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{admin.email}</p>
            </div>
          </div>
        </div>

        {/* Geofence Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Geofence Management</h2>
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
            >
              <Plus size={18} className="mr-2" />
              Add Geofence
            </button>
          </div>

          {/* Geofence Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lat1
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lon1
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lat2
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lon2
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lat3
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lon3
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lat4
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lon4
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Charges
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {geofences.map((geofence) => (
                  <tr key={geofence.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {geofence.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {geofence.lat1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {geofence.lon1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {geofence.lat2}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {geofence.lon2}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {geofence.lat3}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {geofence.lon3}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {geofence.lat4}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {geofence.lon4}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ₹{parseFloat(geofence.charges).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {geofence.admin_first_name} {geofence.admin_last_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(geofence.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditClick(geofence)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(geofence.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Add Geofence Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {editingGeofence ? "Edit Geofence" : "Add New Geofence"}
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Latitude 1
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="lat1"
                    value={formData.lat1}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Longitude 1
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="lon1"
                    value={formData.lon1}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Latitude 2
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="lat2"
                    value={formData.lat2}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Longitude 2
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="lon2"
                    value={formData.lon2}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Latitude 3
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="lat3"
                    value={formData.lat3}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Longitude 3
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="lon3"
                    value={formData.lon3}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Latitude 4
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="lat4"
                    value={formData.lat4}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Longitude 4
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="lon4"
                    value={formData.lon4}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Charges ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="charges"
                    value={formData.charges}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingGeofence(null);
                  }}
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 border border-transparent rounded-md shadow-sm py-2 px-4 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {editingGeofence ? "Update Geofence" : "Save Geofence"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
