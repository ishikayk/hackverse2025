import { useNavigate } from "react-router-dom";
import { IconSchool } from "@tabler/icons-react";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/start');
  };

  return (
    <div
      className="w-screen h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{
        backgroundImage: "url(src/assets/hero-img.jpg)",
      }}
    >

      <div
        className="absolute inset-0 bg-gradient-to-b from-slate-900/90 to-indigo-900/80"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="text-center text-white relative z-10 max-w-7xl px-4">
        <h1 className="text-7xl font-bold mb-10">
          Welcome to <span className="bg-gradient-to-br from-rose-500 to-pink-400 text-gradient">CertiFi</span>
        </h1>
        <p className="text-xl mb-8 ">
         Learn your way, Earn your way. Turn your goals into Achievements with your very own custom learning plan. Then, turn your achievements into earnings by validating your knowledge. Powered by EDU Chain
        </p>
        <button
          onClick={handleStart}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:bg-gradient-to-r hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-4 rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto"
        >
          <IconSchool size={24} />
          Start New Course
        </button>
      </div>
    </div>
  );
};

export default HomePage;