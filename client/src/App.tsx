import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Start from './pages/StartNew';
import Roadmap from './pages/RoadmapPage';
import ProfilePage from './pages/ProfilePage';
import HomePage from './pages/HomePage';
import Quiz from './pages/QuizPage';
import Chat from './pages/ChatPage';
//import Progress from './components/Progress';
//import Resources from './components/Resources';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-zinc-100"  >
        <div>
          <Navigation />
          
          <div className="flex justify-center">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/start" element={<Start />} />
              <Route path="/roadmap" element={<Roadmap />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/chat" element={<Chat />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;