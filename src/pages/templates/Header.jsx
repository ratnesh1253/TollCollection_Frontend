import React from "react";
import { Earth } from "lucide-react";

export default function Header() {
  return (
    <div>
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <div className="flex items-center">
            <div className="bg-blue-600 text-white p-2 rounded-md mr-3">
              <Earth size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                Automated Infrastructure-less Toll Collection System using
                Geofencing
              </h1>
              <p className=" text-sm text-gray-600 hidden md:block">
                Manage geofences, track tolls and monitor vehicle data
                seamlessly.
              </p>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
