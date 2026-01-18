import React from "react";
import { useNavigate } from "react-router-dom";

function SectionDashboard({ icon, title, description, link, badge = 0 }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => link && navigate(link)}
      className="
        relative
        border border-gray-300 rounded-lg cursor-pointer
        hover:shadow-lg transition bg-transparent

        /* MOBILE */
        flex flex-col items-center justify-center
        p-2 min-w-[80px]

        /* DESKTOP (inchangé) */
        sm:p-6 sm:items-start sm:block
      "
    >
      {/* Badge */}
      {badge > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
          {badge}
        </span>
      )}

      {/* Icône */}
      <div className="text-xl sm:text-2xl">
        {icon}
      </div>

      {/* Titre */}
      <h3 className="text-[10px] text-center mt-1 sm:text-xl sm:mt-0 sm:text-left font-semibold">
        {title}
      </h3>

      {/* Description visible UNIQUEMENT sur ordi */}
      <p className="hidden sm:block mt-2 text-gray-600">
        {description}
      </p>
    </div>
  );
}

export default SectionDashboard;
