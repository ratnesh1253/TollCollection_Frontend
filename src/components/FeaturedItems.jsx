import React from "react";

export default function FeaturedItems({ icon, title, description }) {
  return (
    <div>
      {" "}
      <div className="flex items-start">
        <div className="bg-blue-100 p-2 rounded-full text-blue-600 mr-4">
          {icon}
        </div>
        <div>
          <h4 className="font-medium text-gray-800">{title}</h4>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  );
}
