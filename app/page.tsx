import fs from 'fs';
import path from 'path';
import StudentIdSystem from "./components/StudentIdSystem";
import { parseCSV } from "./utils/csv";

export default function Home() {
  const filePath = path.join(process.cwd(), 'Flashami-20260216-0218-Flacation2026-member.csv'); // このファイル名を書き変える
  const csvData = fs.readFileSync(filePath, 'utf8');
  const members = parseCSV(csvData);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <main className="w-full">
        <StudentIdSystem initialMembers={members} />
      </main>
    </div>
  );
}
