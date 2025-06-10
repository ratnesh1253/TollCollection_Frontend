import { useState } from "react";
import { Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function RegistrationForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    addressLine1: "",
    city: "",
    state: "",
    country: "",
    pin: "",
    email: "",
    password: "",
    phoneNumber: "",
    vehicleNumber: "",
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  // Regular expressions
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\d{10}$/;
  const vehicleRegex = /^[A-Z]{2}\d{2}[A-Z]{2}\d{4}$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const pinRegex = /^\d{6}$/;

  const validateForm = () => {
    const newErrors = {};

    const requiredFields = [
      "firstName",
      "lastName",
      "addressLine1",
      "city",
      "state",
      "country",
      "pin",
      "email",
      "password",
      "phoneNumber",
      "vehicleNumber",
    ];

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = `${field.replace(/([A-Z])/g, " $1")} is required`;
      }
    });

    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (formData.password && !passwordRegex.test(formData.password)) {
      newErrors.password =
        "Password must be at least 8 characters with uppercase, lowercase, number and special character";
    }

    if (formData.phoneNumber && !phoneRegex.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone number must be 10 digits";
    }

    if (formData.vehicleNumber && !vehicleRegex.test(formData.vehicleNumber)) {
      newErrors.vehicleNumber =
        "Vehicle number format should be like MH11CA5305";
    }

    if (formData.pin && !pinRegex.test(formData.pin)) {
      newErrors.pin = "PIN must be 6 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await fetch(
          `https://be-project-pyax.onrender.com/user/register`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              first_name: formData.firstName,
              last_name: formData.lastName,
              email: formData.email,
              password: formData.password,
              phone_number: formData.phoneNumber,
              vehicle_number: formData.vehicleNumber.toUpperCase(),
              address_line1: formData.addressLine1,
              city: formData.city,
              state: formData.state,
              country: formData.country,
              pin: formData.pin,
            }),
          }
        );

        const result = await response.json();
        console.log("response in register: ", response);

        if (response.ok) {
          setSuccess(true);
          setTimeout(() => {
            setSuccess(false);
            setFormData({
              firstName: "",
              lastName: "",
              addressLine1: "",
              city: "",
              state: "",
              country: "",
              pin: "",
              email: "",
              password: "",
              phoneNumber: "",
              vehicleNumber: "",
            });
            localStorage.setItem("email", formData.email);
            localStorage.setItem("vehicle_number", formData.vehicleNumber);
            navigate("/userDashboard");
          }, 1000);
        } else {
          alert(result.message || "Registration failed");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Something went wrong. Please try again.");
      }
    }
  };

  const renderInput = (name, label, type = "text", placeholder = "") => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={formData[name]}
        onChange={handleChange}
        className={`mt-1 block w-full px-3 py-2 border ${
          errors[name] ? "border-red-300" : "border-gray-300"
        } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
        placeholder={placeholder}
      />
      {errors[name] && (
        <p className="mt-1 text-sm text-red-600 flex items-center">
          <XCircle className="h-4 w-4 mr-1" />
          {errors[name]}
        </p>
      )}
    </div>
  );

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 pt-5 pb-5">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
          <p className="mt-2 text-gray-600">Please register to continue</p>
        </div>

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            <span>Registration successful!</span>
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {renderInput("firstName", "First Name", "text", "John")}
          {renderInput("lastName", "Last Name", "text", "Doe")}
          {renderInput(
            "addressLine1",
            "Address Line 1",
            "text",
            "123 Main Street"
          )}
          {renderInput("city", "City", "text", "Pune")}
          {renderInput("state", "State", "text", "Maharashtra")}
          {renderInput("country", "Country", "text", "India")}
          {renderInput("pin", "Pincode", "number", "411057")}
          {renderInput("email", "Email Address", "email", "john@example.com")}

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.password ? "border-red-300" : "border-gray-300"
                } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                placeholder="Enter a strong password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <XCircle className="h-4 w-4 mr-1" />
                {errors.password}
              </p>
            )}
          </div>

          {renderInput("phoneNumber", "Phone Number", "tel", "8975028015")}
          {renderInput("vehicleNumber", "Vehicle Number", "text", "MH11CA5305")}

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
