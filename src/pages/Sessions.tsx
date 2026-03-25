import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    Video, 
    Clock,
    User,
    ChevronRight,
    Calendar as CalendarIcon
} from 'lucide-react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/ui/Navbar';
import GlassCard from '../components/ui/GlassCard';
import GlowButton from '../components/ui/GlowButton';
import AnimatedBackground from '../components/ui/AnimatedBackground';
import { cn } from '../utils/cn';
import { useNavigate } from 'react-router-dom';

const Sessions = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'learning' | 'teaching'>('learning');
    const [learnings, setLearnings] = useState<any[]>([]);
    const [teachings, setTeachings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        // Fetch Learnings (Bookings where user is buyer)
        const bookingsQuery = query(
            collection(db, 'bookings'),
            where('buyerId', '==', user.uid)
        );

        const unsubscribeLearnings = onSnapshot(bookingsQuery, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            // Sort by date manually
            data.sort((a: any, b: any) => {
                const dateA = a.selectedDate ? new Date(a.selectedDate).getTime() : 0;
                const dateB = b.selectedDate ? new Date(b.selectedDate).getTime() : 0;
                return dateB - dateA;
            });
            setLearnings(data);
        });

        // Fetch Teachings (Bookings where user is creator)
        const teachingsQuery = query(
            collection(db, 'bookings'),
            where('creatorId', '==', user.uid)
        );

        const unsubscribeTeachings = onSnapshot(teachingsQuery, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            data.sort((a: any, b: any) => {
                const dateA = a.selectedDate ? new Date(a.selectedDate).getTime() : 0;
                const dateB = b.selectedDate ? new Date(b.selectedDate).getTime() : 0;
                return dateB - dateA;
            });
            setTeachings(data);
            setLoading(false);
        });

        return () => {
            unsubscribeLearnings();
            unsubscribeTeachings();
        };
    }, [user]);

    const groupSessionsByDate = (sessions: any[]) => {
        const groups: { [key: string]: any[] } = {};
        
        sessions.forEach(session => {
            const date = session.selectedDate || 'Pending Date';
            if (!groups[date]) groups[date] = [];
            groups[date].push(session);
        });

        // Sort dates descending
        return Object.keys(groups).sort((a, b) => new Date(b).getTime() - new Date(a).getTime()).reduce((obj: any, key) => {
            obj[key] = groups[key];
            return obj;
        }, {});
    };

    const renderSessionCard = (session: any, type: 'learning' | 'teaching') => (
        <motion.div
            key={session.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative"
        >
            <GlassCard 
                className="p-6 bg-zinc-900/60 border-zinc-800 hover:border-indigo-500/30 transition-all rounded-none"
                hover={true}
            >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="flex items-start gap-6">
                        <div className="w-14 h-14 bg-zinc-950 border border-zinc-800 flex flex-col items-center justify-center rounded-none group-hover:border-indigo-500/30 transition-colors">
                            <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest leading-none mb-1">
                                {new Date(session.selectedDate).toLocaleDateString('en-US', { month: 'short' })}
                            </span>
                            <span className="text-xl font-display font-bold text-white leading-none">
                                {new Date(session.selectedDate).getDate()}
                            </span>
                        </div>
                        
                        <div className="space-y-1">
                            <div className="flex items-center gap-3">
                                <span className={cn(
                                    "text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 border",
                                    type === 'learning' ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                )}>
                                    {type === 'learning' ? 'Acquisition' : 'Transmission'}
                                </span>
                                <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest flex items-center gap-1.5">
                                    <Clock size={10} className="text-indigo-500" /> {session.selectedSlot}
                                </span>
                            </div>
                            <h3 className="text-lg font-bold text-white uppercase tracking-tight group-hover:text-indigo-400 transition-colors">
                                {session.sessionTitle}
                            </h3>
                            <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                                <User size={10} className="text-zinc-700" /> {type === 'learning' ? `Source: ${session.guideName}` : `Recipient: ${session.buyerEmail?.split('@')[0]}`}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {session.meetLink && (
                            <GlowButton 
                                onClick={() => window.open(session.meetLink, '_blank')}
                                variant="purple" 
                                size="sm"
                                className="px-6 rounded-none text-[9px] font-bold uppercase tracking-widest"
                            >
                                <Video size={14} className="mr-2" /> Join Protocol
                            </GlowButton>
                        )}
                        <button 
                            onClick={() => navigate(`/session/${session.sessionId}`)}
                            className="p-3 bg-zinc-950 border border-zinc-900 text-zinc-600 hover:text-white hover:border-zinc-700 transition-all"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </GlassCard>
        </motion.div>
    );

    const activeData = activeTab === 'learning' ? learnings : teachings;
    const groupedData = activeTab === 'teaching' ? groupSessionsByDate(teachings) : { 'All Activities': learnings };

    return (
        <div className="relative min-h-screen pt-32 pb-20 px-6">
            <AnimatedBackground />
            <Navbar />

            <div className="max-w-5xl mx-auto">
                <div className="mb-12">
                    <span className="text-indigo-500 font-bold uppercase tracking-[0.3em] text-[10px] mb-4 block">Centralized Activity Ledger</span>
                    <h1 className="text-5xl md:text-6xl font-display font-bold text-white uppercase italic tracking-tighter leading-none mb-6">
                        Sync <span className="text-indigo-600">Sessions</span>
                    </h1>
                </div>

                {/* Tab Navigation */}
                <div className="flex items-center gap-8 mb-12 border-b border-zinc-900">
                    <button
                        onClick={() => setActiveTab('learning')}
                        className={cn(
                            "pb-4 text-[11px] font-bold uppercase tracking-[0.2em] transition-all relative",
                            activeTab === 'learning' ? "text-indigo-500" : "text-zinc-600 hover:text-zinc-400"
                        )}
                    >
                        Learning Nodes
                        {activeTab === 'learning' && (
                            <motion.div layoutId="tab-active" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 shadow-[0_0_10px_rgba(79,70,229,0.5)]" />
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('teaching')}
                        className={cn(
                            "pb-4 text-[11px] font-bold uppercase tracking-[0.2em] transition-all relative",
                            activeTab === 'teaching' ? "text-indigo-500" : "text-zinc-600 hover:text-zinc-400"
                        )}
                    >
                        Teaching Channels
                        {activeTab === 'teaching' && (
                            <motion.div layoutId="tab-active" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 shadow-[0_0_10px_rgba(79,70,229,0.5)]" />
                        )}
                    </button>
                </div>

                {loading ? (
                    <div className="py-32 flex justify-center">
                        <div className="w-10 h-10 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                    </div>
                ) : activeData.length === 0 ? (
                    <div className="py-32 text-center border border-dashed border-zinc-900">
                        <div className="text-4xl mb-6 opacity-20">📡</div>
                        <h3 className="text-white font-display font-bold uppercase italic text-xl mb-4">No Active Protocols</h3>
                        <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest max-w-xs mx-auto leading-relaxed">
                            {activeTab === 'learning' 
                                ? "You haven't acquired any mental models yet. Explore the marketplace to initialize synchronization."
                                : "No transmission channels established. Switch to Teach Mode to share your concepts."}
                        </p>
                        <GlowButton 
                            onClick={() => navigate(activeTab === 'learning' ? '/explore' : '/teach')}
                            variant="purple" 
                            size="lg" 
                            className="mt-10 px-10 rounded-none text-[9px] font-bold uppercase tracking-widest"
                        >
                            {activeTab === 'learning' ? 'Browse Marketplace' : 'Start Teaching'}
                        </GlowButton>
                    </div>
                ) : (
                    <div className="space-y-16">
                        {Object.entries(groupedData).map(([date, sessions]: [string, any]) => (
                            <div key={date} className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-none border border-zinc-800 flex items-center justify-center text-zinc-600">
                                        <CalendarIcon size={14} />
                                    </div>
                                    <h3 className="text-[10px] font-bold text-indigo-500/60 uppercase tracking-[0.3em]">
                                        {date === 'All Activities' ? 'Activity Log' : new Date(date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                                    </h3>
                                    <div className="flex-grow h-[1px] bg-zinc-900" />
                                </div>
                                <div className="space-y-4">
                                    {sessions.map((session: any) => renderSessionCard(session, activeTab))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Sessions;
