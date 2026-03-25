import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Explore from './pages/Explore';
import Community from './pages/Community';
import SessionDetails from './pages/SessionDetails';
import Sessions from './pages/Sessions';
import Profiles from './pages/Profile';
import Auth from './pages/Auth';
import Teach from './pages/Teach';
import Messages from './pages/Messages';

function App() {
    return (
        <div className="min-h-screen">
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/community" element={<Community />} />
                <Route path="/session/:id" element={<SessionDetails />} />
                <Route path="/sessions" element={<Sessions />} />
                <Route path="/profile" element={<Profiles />} />
                <Route path="/profile/:uid" element={<Profiles />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/teach" element={<Teach />} />
            </Routes>
        </div>
    );
}

export default App;
