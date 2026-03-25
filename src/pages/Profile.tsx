import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    Shield, 
    Video, 
    Zap, 
    BookOpen, 
    Award,
    Search
} from 'lucide-react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/ui/Navbar';
import GlassCard from '../components/ui/GlassCard';
import GlowButton from '../components/ui/GlowButton';
import AnimatedBackground from '../components/ui/AnimatedBackground';
import { cn } from '../utils/cn';

const Profile = () => {
    const { user, credits } = useAuth();
    const [activeTab, setActiveTab] = useState<'learnings' | 'teachings'>('learnings');
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
            // Sort by date manually since composite index might be missing
            data.sort((a: any, b: any) => new Date(a.selectedTime).getTime() - new Date(b.selectedTime).getTime());
            setLearnings(data);
        });

        // Fetch Teachings (Sessions created by user)
        const sessionsQuery = query(
            collection(db, 'sessions'),
            where('creatorId', '==', user.uid)
        );

        const unsubscribeTeachings = onSnapshot(sessionsQuery, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setTeachings(data);
            setLoading(false);
        });

        return () => {
            unsubscribeLearnings();
            unsubscribeTeachings();
        };
    }, [user]);

    const groupSessionsByDate = (sessions: any[]) => {
        const now = new Date();
        const todayStr = now.toDateString();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toDateString();

        const groups: { [key: string]: any[] } = {
            'Today': [],
            'Tomorrow': [],
            'Upcoming': []
        };

        sessions.forEach(session => {
            // Handle both Firestore Timestamps and ISO strings
            const date = session.selectedTime ? new Date(session.selectedTime) : (session.createdAt?.toDate ? session.createdAt.toDate() : new Date());
            const dateStr = date.toDateString();

            if (dateStr === todayStr) {
                groups['Today'].push(session);
            } else if (dateStr === tomorrowStr) {
                groups['Tomorrow'].push(session);
            } else if (date > now) {
                groups['Upcoming'].push(session);
            }
        });

        return groups;
    };

    const learningGroups = groupSessionsByDate(learnings);
    const teachingGroups = groupSessionsByDate(teachings);

    const renderSessionCard = (session: any, type: 'learning' | 'teaching') => (
        <GlassCard key={session.id} className="p-5 bg-zinc-900/50 border-zinc-800 hover:border-indigo-500/30 transition-all group">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-zinc-800 rounded-lg flex flex-col items-center justify-center border border-zinc-700">
                        <span className="text-[8px] font-bold uppercase text-zinc-500">
                            {new Date(session.selectedTime || session.createdAt?.toDate?.() || Date.now()).toLocaleDateString('en-US', { month: 'short' })}
                        </span>
                        <span className="text-xl font-display font-bold text-white leading-none">
                            {new Date(session.selectedTime || session.createdAt?.toDate?.() || Date.now()).getDate()}
                        </span>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className={cn(
                                "text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border",
                                type === 'learning' ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            )}>
                                {type === 'learning' ? 'Learning' : 'Teaching'}
                            </span>
                            <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
                                {session.selectedSlot || 'Fixed Schedule'}
                            </span>
                        </div>
                        <h4 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{session.sessionTitle || session.title}</h4>
                        <div className="text-xs text-zinc-500 flex items-center gap-2 mt-1 font-medium italic">
                            {type === 'learning' ? `Guide: ${session.guideName}` : `${session.duration}m Protocol Sync`}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {session.meetLink && (
                        <GlowButton 
                            onClick={() => window.open(session.meetLink, '_blank')}
                            variant="purple" 
                            size="sm"
                            className="gap-2"
                        >
                            <Video size={14} /> Join Now
                        </GlowButton>
                    )}
                    <GlowButton 
                        onClick={() => window.location.href = `/session/${session.sessionId || session.id}`}
                        variant="glass" 
                        size="sm"
                    >
                        Details
                    </GlowButton>
                </div>
            </div>
        </GlassCard>
    );

    const activeGroups = activeTab === 'learnings' ? learningGroups : teachingGroups;
    const hasData = Object.values(activeGroups).some(group => group.length > 0);

    return (
        <div className="relative min-h-screen">
            <AnimatedBackground />
            <Navbar />

            <main className="pt-28 pb-12 px-6 max-w-7xl mx-auto">
                <header className="mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col md:flex-row items-center md:items-start gap-10"
                    >
                        <div className="relative">
                            <div className="w-32 h-32 rounded-2xl bg-zinc-950 border-2 border-zinc-800 p-1 shadow-inner">
                                <div className="w-full h-full bg-zinc-900 rounded-xl flex items-center justify-center overflow-hidden">
                                    <img 
                                        src={user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.uid}`} 
                                        alt="Avatar" 
                                        className="w-full h-full object-cover grayscale opacity-80" 
                                    />
                                </div>
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-2 rounded-lg shadow-sm border border-indigo-500">
                                <Award size={18} />
                            </div>
                        </div>

                        <div className="flex-grow text-center md:text-left">
                            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                                <h1 className="text-4xl font-display font-bold text-white tracking-tight uppercase">
                                    {user?.displayName || user?.email?.split('@')[0]}
                                </h1>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
                                    <Shield size={12} /> Verified Sync Agent
                                </span>
                            </div>

                            <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-8">
                                <div className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center gap-3">
                                    <div className="p-1.5 rounded bg-indigo-500/10 text-indigo-500">
                                        <Zap size={14} />
                                    </div>
                                    <div>
                                        <div className="text-[8px] text-zinc-600 uppercase font-bold tracking-widest">Available Credits</div>
                                        <div className="text-lg font-display font-bold text-white leading-none">{credits} CR</div>
                                    </div>
                                </div>
                                <div className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center gap-3">
                                    <div className="p-1.5 rounded bg-zinc-800 text-zinc-400">
                                        <BookOpen size={14} />
                                    </div>
                                    <div>
                                        <div className="text-[8px] text-zinc-600 uppercase font-bold tracking-widest">Total Syncs</div>
                                        <div className="text-lg font-display font-bold text-white leading-none">{learnings.length + teachings.length}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </header>

                {/* Tabs */}
                <div className="flex gap-4 mb-10 border-b border-zinc-800">
                    <button 
                        onClick={() => setActiveTab('learnings')}
                        className={cn(
                            "pb-4 px-2 text-xs font-bold uppercase tracking-widest transition-all relative",
                            activeTab === 'learnings' ? "text-indigo-500" : "text-zinc-600 hover:text-zinc-400"
                        )}
                    >
                        Learnings
                        {activeTab === 'learnings' && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />}
                    </button>
                    <button 
                        onClick={() => setActiveTab('teachings')}
                        className={cn(
                            "pb-4 px-2 text-xs font-bold uppercase tracking-widest transition-all relative",
                            activeTab === 'teachings' ? "text-indigo-500" : "text-zinc-600 hover:text-zinc-400"
                        )}
                    >
                        Teachings
                        {activeTab === 'teachings' && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />}
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-12">
                        {loading ? (
                            <div className="flex items-center justify-center py-24">
                                <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                            </div>
                        ) : !hasData ? (
                            <div className="py-24 text-center border border-dashed border-zinc-800">
                                <Search className="mx-auto text-zinc-800 mb-4" size={48} />
                                <h3 className="text-xl font-display font-bold text-white uppercase italic">No Protocol Detected</h3>
                                <p className="text-zinc-600 text-xs font-bold uppercase tracking-widest mt-2 px-12 leading-relaxed">
                                    {activeTab === 'learnings' 
                                        ? "Your synchronization ledger is currently empty. Explore the marketplace to initialize your first protocol."
                                        : "You haven't published any knowledge assets yet. Switch to Teach Mode to share your concepts."}
                                </p>
                                <GlowButton 
                                    onClick={() => window.location.href = activeTab === 'learnings' ? '/explore' : '/teach'}
                                    variant="purple" 
                                    size="sm" 
                                    className="mt-8 px-8"
                                >
                                    {activeTab === 'learnings' ? 'Explore Protocols' : 'Start Teaching'}
                                </GlowButton>
                            </div>
                        ) : (
                            <div className="space-y-12">
                                {['Today', 'Tomorrow', 'Upcoming'].map(group => (
                                    activeGroups[group].length > 0 && (
                                        <div key={group} className="space-y-4">
                                            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-indigo-500/60 flex items-center gap-4">
                                                <span>{group}</span>
                                                <div className="h-[1px] flex-grow bg-zinc-800" />
                                            </h3>
                                            <div className="space-y-4">
                                                {activeGroups[group].map(session => renderSessionCard(session, activeTab === 'learnings' ? 'learning' : 'teaching'))}
                                            </div>
                                        </div>
                                    )
                                ))}
                            </div>
                        )}
                    </div>

                    <aside className="space-y-8">
                        <GlassCard className="p-8 bg-zinc-900 border-zinc-800" hover={false}>
                            <h4 className="text-[10px] font-bold uppercase tracking-widest mb-8 text-zinc-500">Service Badges</h4>
                            <div className="grid grid-cols-4 gap-3">
                                {[...Array(8)].map((_, i) => (
                                    <div key={i} className={cn(
                                        "aspect-square rounded-lg flex items-center justify-center border transition-all shadow-sm",
                                        i < 3 ? "bg-indigo-500/10 text-indigo-500 border-indigo-500/20 shadow-[0_0_10px_rgba(79,70,229,0.1)]" : "bg-zinc-950 text-zinc-800 border-zinc-900"
                                    )}>
                                        <Award size={18} />
                                    </div>
                                ))}
                            </div>
                            <p className="mt-8 text-[9px] text-zinc-600 text-center font-bold uppercase tracking-widest leading-relaxed">
                                Complete {5 - learnings.length > 0 ? 5 - learnings.length : 1} more validations to unlock <span className="text-zinc-400">The Architect</span>.
                            </p>
                        </GlassCard>

                        <GlassCard className="bg-zinc-900 border-zinc-800 p-8" hover={true}>
                            <h4 className="text-[10px] font-bold uppercase tracking-widest mb-8 text-zinc-500">Protocol Performance</h4>
                            <div className="space-y-6">
                                <div>
                                    <div className="flex justify-between text-[9px] mb-2 font-bold uppercase tracking-widest text-zinc-600">
                                        <span>Trust Vector</span>
                                        <span className="text-indigo-400">92%</span>
                                    </div>
                                    <div className="h-1 bg-zinc-950 rounded-full overflow-hidden">
                                        <div className="h-full bg-indigo-600 shadow-[0_0_8px_rgba(79,70,229,0.3)] w-[92%]" />
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-zinc-800/50">
                                    <div className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest">Mastery Level</div>
                                    <div className="text-lg font-display font-bold text-white mt-1 italic uppercase tracking-tighter">Level {Math.floor((learnings.length + teachings.length) / 5) + 1}</div>
                                </div>
                            </div>
                        </GlassCard>
                    </aside>
                </div>
            </main>
        </div>
    );
};

export default Profile;
