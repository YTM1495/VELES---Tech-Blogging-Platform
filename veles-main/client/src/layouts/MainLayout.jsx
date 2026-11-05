import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#e5f3f1] dark:bg-[#111713] text-gray-800 dark:text-[#E5E9E4] transition-colors duration-200">
      <header className="sticky top-0 z-40 w-full border-b border-[#2f4b3a]/10 bg-[#e5f3f1]/90 shadow-sm backdrop-blur-md dark:border-[#35443A]/60 dark:bg-[#111713]/90">
        <div className="px-3 sm:px-4 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
          <Navbar />
        </div>
      </header>
      <div className="min-w-0 flex-1 px-3 sm:px-4 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
