import React from "react";

function StatsCard({ title, value, icon }) {
  return (
    <div className="p-6 bg-white border rounded-lg shadow hover:shadow-lg transition flex items-center justify-between">
      <div>
        <h4 className="text-gray-500">{title}</h4>
        <p className="text-2xl font-bold">{value}</p>
      </div>
      <div className="text-3xl">{icon}</div>
    </div>
  );
}

export default StatsCard;
