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
        className="absolute inset-0 bg-gradient-to-l from-sky-400/70 to-indigo-500/60"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="text-center text-white relative z-10 max-w-7xl px-4">
        <h1 className="text-7xl font-bold mb-10">
          Welcome to Our Project
        </h1>
        <p className="text-xl mb-8">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos culpa, commodi optio voluptas veritatis dolor velit neque doloremque repudiandae, laudantium aliquid. Laborum fuga cum autem beatae eum modi sed similique?
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