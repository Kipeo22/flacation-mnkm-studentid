"use client";

import React, { useState } from "react";
import StudentIdCard from "./StudentIdCard";
import { Student } from "../utils/csv";

interface StudentIdSystemProps {
  initialMembers: Student[];
}

const StudentIdSystem = ({ initialMembers }: StudentIdSystemProps) => {
  // Default to the first member if available
  const [selectedMember, setSelectedMember] = useState<Student | null>(
    initialMembers.length > 0 ? initialMembers[0] : null
  );

  return (
    <div className="flex w-full max-w-6xl mx-auto gap-8 p-8 h-[calc(100vh-2rem)]">
      {/* Left Column: Member List */}
      <div className="w-1/3 bg-white shadow-lg rounded-lg overflow-hidden flex flex-col">
        <div className="bg-[#EBC700] p-4 text-white font-bold text-xl">
          メンバー一覧
        </div>
        <div className="overflow-y-auto flex-1 p-2 space-y-1">
          {initialMembers.map((member, index) => (
            <button
              key={`${member.name}-${index}`}
              onClick={() => setSelectedMember(member)}
              className={`w-full text-left px-4 py-3 rounded-md transition-colors duration-200 border-b border-gray-100 last:border-0
                ${
                  selectedMember?.name === member.name
                    ? "bg-yellow-50 text-yellow-800 font-bold border-l-4 border-l-[#EBC700]"
                    : "hover:bg-gray-50 text-gray-700 hover:text-gray-900"
                }
              `}
            >
              <div className="flex items-center justify-between">
                <span>{member.name}</span>
                <span className="text-xs text-gray-400 font-normal bg-gray-100 px-2 py-0.5 rounded-full">
                  {member.generation}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right Column: ID Card Display */}
      <div className="w-2/3 flex items-center justify-center bg-gray-50 rounded-lg shadow-inner p-8">
        {selectedMember ? (
          <div className="transform transition-all duration-300 hover:scale-105">
            <StudentIdCard student={selectedMember} />
          </div>
        ) : (
          <div className="text-gray-400 text-lg">
            メンバーを選択してください
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentIdSystem;
