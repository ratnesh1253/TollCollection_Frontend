import React from "react";
import FooterLink from "../../components/FooterLink";

export default function Footer() {
  return (
    <div>
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-semibold mb-2">
                Automated Infrastructure-less Toll Collection System using
                Geofencing.
              </h3>
              <p className="text-gray-400 text-sm">
                Real-time Toll monitoring solution.
              </p>
            </div>

            <div className="flex space-x-6">
              <FooterLink text="About" />
              <FooterLink text="Contact" />
              <FooterLink text="Support" />
            </div>
          </div>

          <div className="border-t border-gray-700 mt-6 pt-6 text-center text-gray-400 text-sm">
            © {new Date().getFullYear()} Automated Infrastructure-less Toll
            Collection System using Geofencing. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
