import StudentIdCard from "./components/StudentIdCard";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <main>
        <StudentIdCard />
      </main>
    </div>
  );
}
