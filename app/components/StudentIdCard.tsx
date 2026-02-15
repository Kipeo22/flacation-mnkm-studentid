import Image from "next/image";
import React from "react";
import { Student } from "../utils/csv";

interface StudentIdCardProps {
  student: Student;
}

const StudentIdCard = ({ student }: StudentIdCardProps) => {
  // Construct image path. CSV has filename, we need /member/filename
  // Handle "kuro,jpg" case if it comes through strangely, but parser should handle it.
  // The user said "imageURL is public/member/filename".
  // Clean up potentially weird characters if needed, but assuming simple concatenation.
  // Note: CSV has "kuro,jpg" (comma in filename due to typo in CSV or intended?). 
  // User said "imageURL points to files in public/member". 
  // If the file on disk is actually named "kuro,jpg", then we use it. 
  // If it's a typo for "kuro.jpg", we might need to fix it, but instructions say "imageURL refers to filenames".
  // I will assume the filename in CSV is correct for the file on disk.
  
  const imagePath = `/member/${student.image}`;

  return (
    <div className="relative w-[600px] h-[350px] bg-white text-black shadow-xl overflow-hidden font-serif">
        {/* Watermark/Background */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
            {/* Character - Right side, large */}
            <div className="absolute top-20 right-25 w-[210px] h-[210px]">
                <Image src="/flashami_logo_character.png" alt="Flashami Character" fill className="object-contain opacity-80" />
            </div>
            {/* Title - Bottom Right */}
            <div className="absolute bottom-2 right-30 w-48 h-12">
                 <Image src="/flashami_logo_title.png" alt="Flashami Title" fill className="object-contain" />
            </div>
        </div>

      {/* Header */}
      <div className="bg-[#EBC700] h-16 flex items-center justify-between px-8 z-10 relative">
        <h1 className="text-white text-3xl font-bold tracking-wider drop-shadow-sm">Flashami学園</h1>
        <h2 className="text-white text-2xl font-bold tracking-widest drop-shadow-sm">学生証</h2>
      </div>

      {/* Body */}
      <div className="flex p-8 gap-8 z-10 relative h-[calc(100%-4rem)] items-center">
        {/* Photo Section */}
        <div className="shrink-0 w-44 h-44 relative">
          <div className="w-full h-full relative overflow-hidden shadow-md bg-gray-200">
            <Image
              src={imagePath}
              alt={`${student.name} Photo`}
              fill
              className="object-cover object-top"
            />
          </div>
        </div>

        {/* Info Section */}
        <div className="grow flex flex-col justify-center space-y-2 pl-2">
            <div className="grid grid-cols-[110px_1fr] items-baseline gap-2">
                <span className="font-bold text-lg text-gray-800 whitespace-nowrap">ニックネーム</span>
                <span className="text-2xl font-bold tracking-wide -mt-2 block">{student.name}</span>
            </div>
            
            <div className="grid grid-cols-[110px_1fr] items-center gap-2">
                <span className="font-bold text-gray-800 whitespace-nowrap">leaders期</span>
                <span className="text-base font-bold">{student.generation}</span>
            </div>

            <div className="grid grid-cols-[110px_1fr] items-center gap-2">
                <span className="font-bold text-gray-800 whitespace-nowrap">地域</span>
                <span className="text-base font-bold">{student.region}</span>
            </div>

            <div className="grid grid-cols-[110px_1fr] items-center gap-2">
                <span className="font-bold text-gray-800 whitespace-nowrap">発行日</span>
                <span className="text-base font-bold">2026 年 02 月 16 日</span>
            </div>

            <div className="grid grid-cols-[110px_1fr] items-start gap-2">
                <span className="font-bold text-gray-800 whitespace-nowrap pt-1">特殊能力</span>
                <div className="text-sl font-bold leading-tight min-h-14 flex items-center">
                  <span>{student.ability}</span>
                </div>
            </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-2 right-8 text-right z-10 pointer-events-none">
        <p className="text-[0.6rem] text-gray-500 tracking-tighter">
            上記のものは、本学の学生であることを証明する
        </p>
        <div className="flex items-center justify-end gap-1">
            <p className="font-bold text-lg text-gray-800">Flashami学園 &nbsp; 校長</p>
        </div>
      </div>
    </div>
  );
};

export default StudentIdCard;
