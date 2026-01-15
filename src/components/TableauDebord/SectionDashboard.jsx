import React from "react";
import { useNavigate } from "react-router-dom";

function SectionDashboard({ icon, title, description, link, badge = 0 }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => link && navigate(link)}
      className="relative p-6 border border-gray-300 rounded-lg cursor-pointer hover:shadow-lg transition bg-transparent"
    >
      {badge > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}

      <h3 className="text-xl font-semibold flex items-center gap-2">
        {icon} {title}
      </h3>

      <p className="mt-2 text-gray-600">{description}</p>
    </div>
  );
}

export default SectionDashboard;
