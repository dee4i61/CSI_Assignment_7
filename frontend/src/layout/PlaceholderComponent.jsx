import React from "react";

const PlaceholderComponent = ({ title, description }) => (
  <div className="p-6 text-center">
    <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
    <p className="text-gray-600 mb-6">{description}</p>
    <div className="bg-gray-100 rounded-lg p-12">
      <p className="text-gray-500">This component is under development</p>
    </div>
  </div>
);
export default PlaceholderComponent;
