import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage.tsx';
import Dashboard from './pages/Dashboard.tsx';
import Explore from './pages/Explore.tsx';
import Scheduler from './pages/Scheduler.tsx';
import SessionDetails from './pages/SessionDetails.tsx';
import Profile from './pages/Profile.tsx';
import Auth from './pages/Auth.tsx';
import Teach from './pages/Teach.tsx';

function App() {
    return (
        <div className="min-h-screen">
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/scheduler" element={<Scheduler />} />
                <Route path="/session/:id" element={<SessionDetails />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/teach" element={<Teach />} />
            </Routes>
        </div>
    );
}

export default App;
