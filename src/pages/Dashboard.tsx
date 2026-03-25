import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Calendar,
    Clock,
    Shield,
    TrendingUp,
    Zap,
    ArrowUpRight,
    Activity,
    CheckCircle2,
    Clock3
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/ui/Navbar';
import GlassCard from '../components/ui/GlassCard';
import GlowButton from '../components/ui/GlowButton';
import AnimatedBackground from '../components/ui/AnimatedBackground';
import { useAnimateCounter } from '../hooks/useAnimateCounter';
import { cn } from '../utils/cn';

import { db } from '../lib/firebase';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const { user, credits, loading: authLoading } = useAuth();
    const animatedCredits = useAnimateCounter(credits);
    const animatedSessions = useAnimateCounter(24);

    const [sessions, setSessions] = useState<any[]>([]);
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (authLoading || !user) {
            if (!authLoading && !user) setLoading(false);
            return;
        }

        // Fetch all sessions (marketplace)
        const sessionsQuery = query(collection(db, 'sessions'), where('isActive', '==', true));
        const unsubscribeSessions = onSnapshot(sessionsQuery, (snapshot) => {
            const sessionsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            console.log("Dashboard - Fetched sessions:", sessionsData);
            setSessions(sessionsData);
            if (bookings.length > 0 || !loading) setLoading(false);
        });

        // Fetch user's bookings
        const bookingsQuery = query(collection(db, 'bookings'), where('userId', '==', user.uid));
        const unsubscribeBookings = onSnapshot(bookingsQuery, (snapshot) => {
            const bookingsData = snapshot.docs.map(doc => doc.data().sessionId);
            setBookings(bookingsData);
            setLoading(false);
        });

        return () => {
            unsubscribeSessions();
            unsubscribeBookings();
        };
    }, []);

    const handleJoinSession = (link: string | null) => {
        if (link) {
            window.open(link, '_blank');
        }
    };

    return (
        <div className="relative min-h-screen">
            <AnimatedBackground />
            <Navbar />

            <main className="pt-28 pb-12 px-6 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <h1 className="text-4xl font-display font-bold mb-2">Welcome Back, <span className="text-indigo-500">{user?.displayName || user?.email?.split('@')[0] || 'Peer'}</span></h1>
                        <p className="text-zinc-400 font-medium max-w-lg">
                            Your concept synchronization is optimal today. 
                            <span className="block text-zinc-500 italic text-sm mt-1">"Clarity over complexity." — Professional Sync Protocol active.</span>
                        </p>
                    </motion.div>

                    <div className="flex gap-3">
                        <Link to="/teach">
                            <GlowButton variant="glass" size="sm" className="gap-2 bg-indigo-500/5 border-indigo-500/20 text-indigo-400">
                                <Zap size={16} /> Become a Guide
                            </GlowButton>
                        </Link>
                        <Link to="/explore">
                            <GlowButton variant="purple" size="sm" className="gap-2">
                                <Activity size={16} /> New Sync
                            </GlowButton>
                        </Link>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                    {[
                        { label: 'Available Credits', value: animatedCredits, icon: Zap, color: 'text-indigo-500' },
                        { label: 'Concepts Mastered', value: animatedSessions, icon: CheckCircle2, color: 'text-zinc-200' },
                        { label: 'Community Rank', value: 'Top 5%', icon: Shield, color: 'text-indigo-400' },
                        { label: 'Sync Success Rate', value: '98.4%', icon: TrendingUp, color: 'text-zinc-400' }
                    ].map((stat, i) => (
                        <GlassCard key={i} delay={i * 0.05} className="p-5 bg-zinc-900/50 border-zinc-800">
                            <div className="flex items-center justify-between mb-4">
                                <div className={cn("p-2 rounded-lg bg-zinc-800", stat.color)}>
                                    <stat.icon size={18} />
                                </div>
                                <ArrowUpRight size={14} className="text-zinc-600" />
                            </div>
                            <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1">{stat.label}</div>
                            <div className="text-2xl font-display font-bold text-white">
                                {typeof stat.value === 'object' ? <motion.span>{stat.value}</motion.span> : stat.value}
                            </div>
                        </GlassCard>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Upcoming Sessions */}
                    <div className="lg:col-span-2 space-y-6">
                        <h3 className="text-lg font-display font-bold flex items-center gap-2 text-zinc-200">
                            <Clock3 className="text-indigo-500" size={18} /> Upcoming Sync Protocols
                        </h3>
                        <div className="space-y-3">
                            {loading ? (
                                <div className="text-zinc-500 italic p-6">Authenticating secure protocols...</div>
                            ) : sessions.length === 0 ? (
                                <div className="text-zinc-600 text-[10px] uppercase font-bold text-center py-12 border border-dashed border-zinc-800 rounded-none italic tracking-widest">
                                    No active protocols found in the ledger
                                </div>
                            ) : sessions.map((session, i) => {
                                const isBooked = bookings.includes(session.id);
                                const isCreator = session.creatorId === user?.uid;
                                
                                return (
                                    <GlassCard key={session.id} delay={0.2 + i * 0.05} className={cn("p-5 group transition-all", (!isBooked && !isCreator) ? "bg-zinc-900/30 opacity-70" : "bg-zinc-900 border-indigo-500/20 shadow-sm")}>
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                            <div className="flex items-center gap-5">
                                                <div className={cn("w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center border border-zinc-700", (!isBooked && !isCreator) ? "text-zinc-600" : "text-indigo-400")}>
                                                    <Calendar size={20} />
                                                </div>
                                                <div>
                                                    <div className="text-[10px] text-indigo-500 font-bold uppercase tracking-widest mb-0.5">
                                                        {isCreator ? '💎 Your Protocol' : isBooked ? '🔗 Unlocked' : '🔒 Private'}
                                                    </div>
                                                    <h4 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{session.title}</h4>
                                                    <div className="text-xs text-zinc-500 flex items-center gap-2 mt-1 font-medium">
                                                        <Clock size={12} /> Guide: {session.creatorName}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-6">
                                                <div className="text-right hidden md:block">
                                                    <div className="text-[10px] text-zinc-600 uppercase font-bold mb-0.5">Transmission</div>
                                                    <div className={cn("text-xs font-bold font-mono", (!isBooked && !isCreator) ? "text-zinc-700" : "text-indigo-500")}>
                                                        {(!isBooked && !isCreator) ? 'STALE' : 'OPTIMAL'}
                                                    </div>
                                                </div>
                                                <GlowButton 
                                                    onClick={() => (isBooked || isCreator) ? handleJoinSession(session.meetLink) : window.location.href = `/session/${session.id}`}
                                                    variant={(isBooked || isCreator) ? "purple" : "glass"} 
                                                    size="sm"
                                                    className={cn(!isBooked && !isCreator && "opacity-80")}
                                                >
                                                    {(isBooked || isCreator) ? 'Join Sync' : 'Initialize'}
                                                </GlowButton>
                                            </div>
                                        </div>
                                        {(!isBooked && !isCreator) && (
                                            <div className="mt-4 pt-4 border-t border-zinc-800 text-[9px] text-zinc-600 uppercase tracking-[0.3em] font-bold">
                                                Purchase access to synchronize following secure protocol
                                            </div>
                                        )}
                                    </GlassCard>
                                );
                            })}
                        </div>
                    </div>

                    {/* Activity Timeline */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-display font-bold flex items-center gap-2 text-zinc-200">
                            <Activity className="text-indigo-500" size={18} /> Protocol History
                        </h3>
                        <GlassCard className="p-6 bg-zinc-900" hover={false}>
                            <div className="space-y-6">
                                {[
                                    { title: 'Session Booked', time: '2h ago', desc: 'Framer Motion Magic', icon: CheckCircle2, color: 'text-indigo-500' },
                                    { title: 'Credits Received', time: '5h ago', desc: '+150 Credits', icon: Zap, color: 'text-zinc-400' },
                                    { title: 'New Achievement', time: '1d ago', desc: 'Master Protocol Badge', icon: Shield, color: 'text-indigo-600' }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4 relative">
                                        {i !== 2 && <div className="absolute left-[11px] top-6 bottom-[-24px] w-[1px] bg-zinc-800" />}
                                        <div className={cn("w-6 h-6 rounded-md bg-zinc-800 flex items-center justify-center relative z-10", item.color)}>
                                            <item.icon size={10} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <span className="text-sm font-bold text-zinc-200">{item.title}</span>
                                                <span className="text-[10px] text-zinc-600 font-bold">{item.time}</span>
                                            </div>
                                            <p className="text-xs text-zinc-500 font-medium">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </GlassCard>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
