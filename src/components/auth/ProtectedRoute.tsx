import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-6">
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 border-4 border-indigo-500/10 rounded-full" />
                    <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                </div>
                <div className="flex flex-col items-center gap-2">
                    <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-[0.4em] animate-pulse">
                        Authenticating Protocol
                    </p>
                    <p className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest">
                        Verifying Synchronization Identity...
                    </p>
                </div>
            </div>
        );
    }

    if (!user) {
        // Redirect to /auth but save the attempted location for potential post-login redirection
        return <Navigate to="/auth" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
