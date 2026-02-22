import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage.tsx';
import Dashboard from './pages/Dashboard.tsx';
import Explore from './pages/Explore.tsx';
import Scheduler from './pages/Scheduler.tsx';
import SessionDetails from './pages/SessionDetails.tsx';
import Profile from './pages/Profile.tsx';
import Wallet from './pages/Wallet.tsx';
import Auth from './pages/Auth.tsx';

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
                <Route path="/wallet" element={<Wallet />} />
                <Route path="/auth" element={<Auth />} />
            </Routes>
        </div>
    );
}

export default App;
