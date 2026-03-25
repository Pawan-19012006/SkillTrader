import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Explore from './pages/Explore';
import Requests from './pages/Requests';
import SessionDetails from './pages/SessionDetails';
import Sessions from './pages/Sessions';
import Profile from './pages/Profile';
import Auth from './pages/Auth';
import Teach from './pages/Teach';

function App() {
    return (
        <div className="min-h-screen">
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/requests" element={<Requests />} />
                <Route path="/session/:id" element={<SessionDetails />} />
                <Route path="/sessions" element={<Sessions />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/teach" element={<Teach />} />
            </Routes>
        </div>
    );
}

export default App;
