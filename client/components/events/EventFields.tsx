import React from "react";

export default function EventFields() {
  return (
    <div className="grid grid-cols-2 gap-4 mb-8">
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-300">
          Leader Email
        </label>
        <input
          type="email"
          required
          placeholder="leader@university.edu.pk"
          className="w-full px-3 py-2 bg-[#1b1b1b] rounded-md border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[#34A853]"
        />
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium text-gray-300">
          Roll Number
        </label>
        <input
          type="text"
          placeholder="bscs23043"
          required
          className="w-full px-3 py-2 bg-[#1b1b1b] rounded-md border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[#34A853]"
        />
      </div>
    </div>
  );
}
