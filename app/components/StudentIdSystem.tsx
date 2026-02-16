"use client";

import React, { useState } from "react";
import StudentIdCard from "./StudentIdCard";
import { Student } from "../utils/csv";
import { toPng } from 'html-to-image';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import { useRef } from "react";

interface StudentIdSystemProps {
  initialMembers: Student[];
}

const StudentIdSystem = ({ initialMembers }: StudentIdSystemProps) => {
  // Default to the first member if available
  const [selectedMember, setSelectedMember] = useState<Student | null>(
    initialMembers.length > 0 ? initialMembers[0] : null
  );
  
  const [isGenerating, setIsGenerating] = useState(false);
  const singleCardRef = useRef<HTMLDivElement>(null);
  const hiddenContainerRef = useRef<HTMLDivElement>(null);
  const hiddenSingleRef = useRef<HTMLDivElement>(null);

  const handleSaveSingle = async () => {
    if (!selectedMember || !hiddenSingleRef.current) return;
    
    try {
      setIsGenerating(true);
      // Wait a moment for the hidden render to be ready with the new image
      // Since we use key={selectedMember.name}, it remounts.
      // We also use standard <img> in export mode so it loads eagerly.
      // Add a small delay to ensure painting
      await new Promise(resolve => setTimeout(resolve, 300));

      const dataUrl = await toPng(hiddenSingleRef.current, { cacheBust: true, pixelRatio: 2 });
      saveAs(dataUrl, `student-id-${selectedMember.name}.png`);
    } catch (err) {
      console.error('Failed to save image:', err);
      alert('画像の保存に失敗しました。');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveAll = async () => {
    if (initialMembers.length === 0 || !hiddenContainerRef.current) return;

    try {
      setIsGenerating(true);
      const zip = new JSZip();
      const folder = zip.folder("student-ids");
      
      // Wait for rendering to ensure hidden container is ready (though it's always there in this approach)
      // Actually, we need to ensure the images in the hidden container are loaded if possible.
      // But let's try generating directly.
      
      const cardElements = hiddenContainerRef.current.children;
      
      // We need to process sequentially to avoid memory issues or browser freeze
      for (let i = 0; i < cardElements.length; i++) {
        const card = cardElements[i] as HTMLElement;
        const studentName = initialMembers[i].name;
        
        // Add a small delay to allow UI updates if needed
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const dataUrl = await toPng(card, { cacheBust: true, pixelRatio: 2 });
        // Remove data:image/png;base64, prefix
        const base64Data = dataUrl.split(',')[1];
        folder?.file(`${studentName}.png`, base64Data, { base64: true });
      }

      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "student_ids.zip");
      
    } catch (err) {
      console.error('Failed to save all images:', err);
      alert('一括保存に失敗しました。');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex w-full max-w-6xl mx-auto gap-8 p-8 h-[calc(100vh-2rem)]">
      {/* Left Column: Member List */}
      <div className="w-1/3 bg-white shadow-lg rounded-lg overflow-hidden flex flex-col">
        <div className="bg-[#EBC700] p-4 text-white font-bold text-xl flex justify-between items-center">
          <span>メンバー一覧</span>
          <button 
            onClick={handleSaveAll}
            disabled={isGenerating}
            className="text-xs bg-white text-[#EBC700] px-3 py-1 rounded hover:bg-yellow-50 disabled:opacity-50"
          >
            {isGenerating ? '保存中...' : '全て保存'}
          </button>
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
          <div className="flex flex-col items-center gap-4">
            {/* 
                We keep the visible card using Next/Image for performance and quality in the UI. 
                We DON'T use this for export anymore to avoid state/cache issues. 
            */}
            <div>
              <StudentIdCard key={selectedMember.name} student={selectedMember} />
            </div>
            <button
              onClick={handleSaveSingle}
              disabled={isGenerating}
              className="px-6 py-2 bg-[#EBC700] text-white font-bold rounded-full shadow hover:bg-[#d4b300] transition-colors disabled:opacity-50"
            >
              {isGenerating ? '保存中...' : '画像を保存'}
            </button>
          </div>
        ) : (
          <div className="text-gray-400 text-lg">
            メンバーを選択してください
          </div>
        )}
      </div>

      {/* Hidden container for SINGLE export 
          This ensures we always have a clean, export-friendly (<img/>) version 
          that re-mounts completely (key change) when member changes.
          NOTE: We cannot use visibility:hidden because html-to-image needs the element to be painted.
          We use opacity: 0 and fixed positioning off-screen or behind.
      */}
      <div style={{ position: 'fixed', left: '0', top: '0', opacity: 0, pointerEvents: 'none', zIndex: -1 }}>
        {selectedMember && (
            <div ref={hiddenSingleRef} style={{ width: '600px' }}>
                <StudentIdCard 
                    key={`export-${selectedMember.name}`} 
                    student={selectedMember} 
                    priority={true} 
                    isExport={true} 
                />
            </div>
        )}
      </div>

      {/* Hidden container for BULK export */}
      <div 
        ref={hiddenContainerRef} 
        style={{ 
          position: 'fixed', 
          left: '0', 
          top: '0', 
          opacity: 0,
          pointerEvents: 'none',
          zIndex: -1,
          width: '600px', // Force width to match card width to avoid layout issues
        }}
      >
        {initialMembers.map((member, index) => (
            <div key={`hidden-${index}`} className="mb-4">
                <StudentIdCard student={member} priority={true} isExport={true} />
            </div>
        ))}
      </div>
    </div>
  );
};

export default StudentIdSystem;
