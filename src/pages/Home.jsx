import React, { useState } from "react";
import {
  Satellite,
  MapPinned,
  Wallet,
  User,
  Users,
  Leaf,
  Radio,
} from "lucide-react";
import FeatureItem from "../components/FeaturedItems";
import AdminLoginForm from "../components/AdminLoginForm";
import UserLoginForm from "../components/UserLoginForm";

export default function Home() {
  const [activeTab, setActiveTab] = useState("user");
  return (
    <>
      {/* Hero Section */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          {/* Left Side - Introduction */}
          <div className="w-full md:w-1/2 pr-0 md:pr-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-gray-700">
                Key Features
              </h3>

              <div className="space-y-4">
                <FeatureItem
                  icon={<Satellite size={20} />}
                  title="Smart Real-Time Tracking"
                  description="Live Vehicle location, speed and time tracking using GPS."
                />

                <FeatureItem
                  icon={<MapPinned size={20} />}
                  title="Vertual Toll Collection"
                  description="Automatically applies toll charges when vehicles enters geofenced area."
                />

                <FeatureItem
                  icon={<Radio size={20} />}
                  title="Geofence-Based Billing"
                  description="Admin-defined geofences trigger automated billing without physical toll booths."
                />

                <FeatureItem
                  icon={<Wallet size={20} />}
                  title="Intelligent Wallet System"
                  description="Deducts charges in real-time; logs dues if the balance is insufficient for toll payment."
                />

                <FeatureItem
                  icon={<Leaf size={20} />}
                  title="Privacy & Eco-Friendly"
                  description="Collects only checkpoint data to protect privacy and reduce fuel use and emissions."
                />
              </div>
            </div>
          </div>

          {/* Right Side - Login Section */}
          <div className="w-full md:w-1/2 mt-8 md:mt-0">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto">
              <div className="flex mb-6">
                <button
                  className={`flex-1 py-2 text-center font-medium ${
                    activeTab === "user"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("user")}
                >
                  <div className="flex justify-center items-center">
                    <User size={18} className="mr-2" />
                    User Login
                  </div>
                </button>
                <button
                  className={`flex-1 py-2 text-center font-medium ${
                    activeTab === "admin"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("admin")}
                >
                  <div className="flex justify-center items-center">
                    <Users size={18} className="mr-2" />
                    Admin Login
                  </div>
                </button>
              </div>

              {activeTab === "user" ? <UserLoginForm /> : <AdminLoginForm />}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
