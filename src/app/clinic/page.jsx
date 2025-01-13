import Clinic1 from "./clinic1/page";
import Clinic2 from "./clinic2/page";

export default function Clinic() {
  return (
    <div
      id="clinic"
      className="w-full min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 relative overflow-hidden"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10 bg-grid-slate-200/[0.2] bg-[size:20px_20px]" />

      {/* Main content */}
      <div className="relative max-w-5xl mx-auto px-4 py-8 sm:py-12 mt-24 sm:mt-28">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Clinic1 />
          <Clinic2 />
        </div>
      </div>

      {/* Decorative circles - reduced size and simplified */}
      <div className="absolute top-1/4 left-0 w-48 h-48 bg-purple-300 rounded-full mix-blend-multiply blur-xl opacity-20 animate-blob" />
      <div className="absolute top-1/3 right-0 w-52 h-52 bg-yellow-300 rounded-full mix-blend-multiply blur-xl opacity-20 animate-blob animation-delay-2000" />
      <div className="absolute bottom-1/4 left-1/4 w-56 h-56 bg-pink-300 rounded-full mix-blend-multiply blur-xl opacity-20 animate-blob animation-delay-4000" />
    </div>
  );
}
