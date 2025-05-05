import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  Car,
  MapPin,
  Clock,
  MapIcon,
  Gauge,
  CreditCard,
  Calendar,
  Wallet,
  Plus,
  Check,
  CreditCard as CardIcon,
  X,
} from "lucide-react";

export default function UserDashboard() {
  const email = localStorage.getItem("email");
  const vehicle_number = localStorage.getItem("vehicle_number");

  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({});
  const [travelData, setTravelData] = useState([]);

  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [amount, setAmount] = useState("");
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const predefinedAmounts = [100, 200, 500, 1000];

  const getData = async () => {
    try {
      // First request - user info
      const userParams = new URLSearchParams({
        email,
        vehicleNumber: vehicle_number,
      });
      const userUrl = `http://localhost:8080/user/info?${userParams}`;

      const userResponse = await fetch(userUrl);

      // Check if response is OK before parsing
      if (!userResponse.ok) {
        throw new Error(`User request failed: ${userResponse.status}`);
      }

      const userData = await userResponse.json();
      setUserData(userData);
      console.log(userData);

      // Second request - vehicle history
      const vehicleUrl = `http://localhost:8080/vehicle/${vehicle_number}/history`;
      const vehicleResponse = await fetch(vehicleUrl);

      if (!vehicleResponse.ok) {
        throw new Error(`Vehicle request failed: ${vehicleResponse.status}`);
      }

      const vehicleData = await vehicleResponse.json();
      setTravelData(vehicleData.data);
      console.log(vehicleData.data);
    } catch (error) {
      console.error("Error in getData:", error);

      // Check what the server actually returned
      if (error.response) {
        const errorText = await error.response.text();
        console.error("Server response:", errorText);
      }
    }
  };

  useEffect(() => {
    if (email && vehicle_number) {
      setLoading(true);
      getData();
      setLoading(false);
    }
  }, [email, vehicle_number, amount]);

  // Format date for readability
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatDateTime = (date, time) => {
    // Split the date into parts
    const [day, month, year] = date.split("-").map(Number);

    // Create a properly formatted date string (YYYY-MM-DD)
    const isoDate = `${year}-${month.toString().padStart(2, "0")}-${day
      .toString()
      .padStart(2, "0")}`;

    // Combine with time and create Date object
    const dateObj = new Date(`${isoDate}T${time}`);

    // Format the date
    return dateObj.toLocaleString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Format coordinates to be more readable
  const formatCoordinate = (coord) => {
    return coord.toFixed(4);
  };

  const handleTopUp = async (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return;

    setProcessing(true);

    try {
      const response = await fetch("http://localhost:8080/user/add-funds", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          amount: amount,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add funds");
      }

      const result = await response.json();

      // Update wallet balance with response from server
      setUserData({
        ...userData,
        wallet_balance: result.newBalance, // assuming server returns { newBalance: x.xx }
      });

      setSuccess(true);

      // Reset form after showing success
      setTimeout(() => {
        setAmount("");
        setSuccess(false);
        setShowTopUpModal(false);
      }, 2000);
    } catch (error) {
      console.error("Top-up error:", error);
      alert("Failed to add funds. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div>
      {loading ? (
        <button
          type="button"
          className="flex items-center px-4 py-2 bg-indigo-500 text-white text-sm font-medium rounded-md hover:bg-indigo-600 focus:outline-none"
          disabled
        >
          <svg
            className="mr-3 h-5 w-5 animate-spin text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
          Loading…
        </button>
      ) : (
        <div className="min-h-screen bg-gray-100 p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                User Dashboard
              </h1>
              <p className="text-gray-600">
                Welcome back, {userData.first_name}!
              </p>
            </div>

            {/* Financial Summary Card */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <Wallet className="mr-2 h-5 w-5 text-blue-600" />
                Financial Summary
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-500">
                    Account Balance
                  </p>
                  <p className="text-2xl font-bold text-gray-800">
                    {formatCurrency(parseFloat(userData.wallet_balance))}
                  </p>
                </div>

                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-500">
                    Due Amount
                  </p>
                  <p className="text-2xl font-bold text-gray-800">
                    {formatCurrency(parseFloat(userData.due_amount))}
                  </p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg flex items-center">
                  <button
                    onClick={() => setShowTopUpModal(true)}
                    className="ml-4 flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Money
                  </button>
                </div>
              </div>
            </div>

            {/* User Info Card */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <User className="mr-2 h-5 w-5 text-blue-600" />
                Personal Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {/* Name */}
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Full Name
                    </p>
                    <p className="text-gray-800">
                      {userData.first_name} {userData.last_name}
                    </p>
                  </div>

                  {/* Email */}
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Email Address
                      </p>
                      <p className="text-gray-800">{userData.email}</p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Phone Number
                      </p>
                      <p className="text-gray-800">{userData.phone_number}</p>
                    </div>
                  </div>

                  {/* Vehicle */}
                  <div className="flex items-start">
                    <Car className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Vehicle Number
                      </p>
                      <p className="text-gray-800">{userData.vehicle_number}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Address */}
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Address
                      </p>
                      <p className="text-gray-800">{userData.address_line1}</p>
                      <p className="text-gray-800">
                        {userData.city}, {userData.state}, {userData.pin}
                      </p>
                      <p className="text-gray-800">{userData.country}</p>
                    </div>
                  </div>

                  {/* Account Created */}
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Account Created
                      </p>
                      <p className="text-gray-800">
                        {formatDate(userData.created_at)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Travel Data Table */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <Car className="mr-2 h-5 w-5 text-blue-600" />
                Travel & Toll Data
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-800">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                    <tr>
                      <th scope="col" className="px-4 py-3 rounded-tl-lg">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          Time
                        </div>
                      </th>
                      <th scope="col" className="px-4 py-3">
                        <div className="flex items-center">
                          <MapIcon className="h-4 w-4 mr-1" />
                          Latitude
                        </div>
                      </th>
                      <th scope="col" className="px-4 py-3">
                        <div className="flex items-center">
                          <MapIcon className="h-4 w-4 mr-1" />
                          Longitude
                        </div>
                      </th>
                      <th scope="col" className="px-4 py-3">
                        <div className="flex items-center">
                          <Gauge className="h-4 w-4 mr-1" />
                          Speed (km/h)
                        </div>
                      </th>
                      <th scope="col" className="px-4 py-3 rounded-tr-lg">
                        <div className="flex items-center">
                          <CreditCard className="h-4 w-4 mr-1" />
                          Toll Charges
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {travelData.map((data) => (
                      <tr key={data.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">
                          {formatDateTime(data.date, data.time)}
                        </td>
                        <td className="px-4 py-3">{data.latitude}° N</td>
                        <td className="px-4 py-3">{data.longitude}° E</td>
                        <td className="px-4 py-3">
                          <div
                            className={`flex items-center ${
                              data.speed >= 100
                                ? "text-red-600"
                                : data.speed > 80
                                ? "text-yellow-600"
                                : "text-green-600"
                            }`}
                          >
                            {data.speed}
                            {/* {data.speed > 70 && (
                              <span className="ml-1 text-xs">(over limit)</span>
                            )} */}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {formatCurrency(data.charges_applied)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-50">
                      <td
                        colSpan="4"
                        className="px-4 py-3 font-medium text-right"
                      >
                        Total Toll Charges:
                      </td>
                      <td className="px-4 py-3 font-bold">
                        {formatCurrency(
                          travelData.reduce(
                            (sum, entry) => sum + Number(entry.charges_applied),
                            0
                          )
                        )}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
          {/* Add Money Modal */}
          {showTopUpModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">
                    Add Money to Account
                  </h3>
                  <button
                    onClick={() => setShowTopUpModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {success ? (
                  <div className="py-8 text-center">
                    <div className="flex justify-center mb-4">
                      <div className="rounded-full bg-green-100 p-3">
                        <Check className="h-8 w-8 text-green-600" />
                      </div>
                    </div>
                    <h4 className="text-lg font-medium text-gray-800 mb-2">
                      Payment Successful!
                    </h4>
                    <p className="text-gray-600">
                      {formatCurrency(parseFloat(amount))} has been added to
                      your Account.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleTopUp}>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Amount
                      </label>
                      <div className="grid grid-cols-4 gap-2 mb-3">
                        {predefinedAmounts.map((preAmount) => (
                          <button
                            key={preAmount}
                            type="button"
                            className={`py-2 px-4 rounded-md border ${
                              amount === preAmount.toString()
                                ? "border-blue-600 bg-blue-50 text-blue-700"
                                : "border-gray-300 hover:bg-gray-50"
                            }`}
                            onClick={() => setAmount(preAmount.toString())}
                          >
                            ₹{preAmount}
                          </button>
                        ))}
                      </div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500">₹</span>
                        </div>
                        <input
                          type="number"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          placeholder="Enter amount"
                          className="pl-8 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border py-2 px-3"
                          min="1"
                          step="1"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end mt-6">
                      <button
                        type="button"
                        onClick={() => setShowTopUpModal(false)}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 mr-2 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={!amount || processing}
                        className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                          !amount || processing
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        {processing ? (
                          <span className="flex items-center">
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Processing...
                          </span>
                        ) : (
                          "Add Money"
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
