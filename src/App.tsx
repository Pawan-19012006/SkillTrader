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
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
    return (
        <div className="min-h-screen">
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/auth" element={<Auth />} />
                
                {/* Protected Synchronization Hubs */}
                <Route path="/explore" element={<ProtectedRoute><Explore /></ProtectedRoute>} />
                <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
                <Route path="/session/:id" element={<ProtectedRoute><SessionDetails /></ProtectedRoute>} />
                <Route path="/sessions" element={<ProtectedRoute><Sessions /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profiles /></ProtectedRoute>} />
                <Route path="/profile/:uid" element={<ProtectedRoute><Profiles /></ProtectedRoute>} />
                <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
                <Route path="/teach" element={<ProtectedRoute><Teach /></ProtectedRoute>} />
            </Routes>
        </div>
    );
}

export default App;
