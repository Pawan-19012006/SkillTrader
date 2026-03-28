import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Star, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/ui/Navbar';
import GlowButton from '../components/ui/GlowButton';
import AnimatedBackground from '../components/ui/AnimatedBackground';
import { cn } from '../utils/cn';
import { db } from '../lib/firebase';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

const Explore = () => {
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [sessions, setSessions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    
    const categories = ['All', 'Technical', 'Dev', 'Computer Science', 'Design', 'Business', 'Creative'];

    useEffect(() => {
        const q = query(
            collection(db, 'sessions'),
            where('isActive', '==', true)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const sessionsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            console.log("Fetched sessions:", sessionsData);
            setSessions(sessionsData);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching sessions:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const filteredConcepts = sessions.filter(session =>
        (selectedCategory === 'All' || (session.tags && session.tags.includes(selectedCategory))) &&
        session.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="relative min-h-screen pb-20">
            <AnimatedBackground />
            <Navbar />

            <main className="pt-28 px-6 max-w-7xl mx-auto">
                <header className="mb-12">
                    <div className="flex flex-col gap-2 mb-10">
                        <h1 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight">Find Skills</h1>
                        <p className="text-zinc-500 text-lg font-medium">Discover new skills and sessions to grow your wallet.</p>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-grow">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
                            <input
                                type="text"
                                placeholder="Search sync protocols (e.g. 'Recursion', 'Solidity')..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-4 pl-14 pr-4 text-white placeholder:text-zinc-700 focus:outline-none focus:border-indigo-500/50 focus:bg-zinc-800/50 transition-all text-base font-bold shadow-sm"
                            />
                        </div>
                        <GlowButton variant="glass" className="md:w-32">
                            <Filter size={16} /> Filters
                        </GlowButton>
                    </div>
                </header>

                {/* Categories Scroller */}
                <div className="flex gap-3 mb-12 overflow-x-auto pb-6 scrollbar-hide">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={cn(
                                "px-6 py-2 rounded-lg border text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap",
                                selectedCategory === cat
                                    ? "bg-indigo-600 border-indigo-500 text-white shadow-sm"
                                    : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-white"
                            )}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Skills Grid */}
                {loading ? (
                    <div className="flex items-center justify-center py-24">
                        <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence mode="popLayout">
                            {filteredConcepts.map((session, idx) => (
                                <motion.div
                                    key={session.id}
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                                >
                                    <Link to={`/session/${session.id}`}>
                                        <div className="h-full flex flex-col p-0 overflow-hidden group bg-zinc-900 border border-zinc-800 hover:border-indigo-500/50 shadow-sm transition-all shadow-xl">
                                            <div className="h-40 bg-zinc-950 flex items-center justify-center text-5xl relative overflow-hidden border-b border-zinc-800">
                                                <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                                
                                                <div className="absolute top-4 left-4 z-20">
                                                    <div className="bg-zinc-900/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-zinc-800 text-[9px] font-bold text-indigo-400 uppercase tracking-widest">
                                                        {session.tags?.[0] || 'Protocol'}
                                                    </div>
                                                </div>

                                                <motion.span
                                                    whileHover={{ y: -5 }}
                                                    className="z-10 relative"
                                                >
                                                    {session.image || '📡'}
                                                </motion.span>

                                                <div className="absolute top-4 right-4 z-20">
                                                    <div className="bg-zinc-900/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-zinc-800 flex items-center gap-1.5">
                                                        <Star size={10} className="text-indigo-500" fill="currentColor" />
                                                        <span className="text-[10px] font-bold text-zinc-300">4.9</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-6 flex flex-col flex-grow relative">
                                                <div className="flex justify-between items-center mb-4">
                                                    <div className="flex gap-2">
                                                        <span className="px-1.5 py-0.5 rounded-sm bg-indigo-500/10 text-[9px] uppercase font-bold text-indigo-400 border border-indigo-500/20 tracking-widest">
                                                            {session.tags?.[1] || 'Core'}
                                                        </span>
                                                        <span className="px-1.5 py-0.5 rounded-sm bg-zinc-800 text-[9px] uppercase font-bold text-zinc-500 border border-zinc-700 tracking-widest">
                                                            Level I
                                                        </span>
                                                    </div>
                                                    <div className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">{session.duration}m sync</div>
                                                </div>

                                                <h3 className="text-lg font-display font-bold mb-3 text-white group-hover:text-indigo-400 transition-colors uppercase tracking-tight line-clamp-2">
                                                    {session.title}
                                                </h3>

                                                <div className="flex items-center gap-2.5 text-zinc-500 text-xs mb-6 font-bold uppercase tracking-widest">
                                                    <div className="w-5 h-5 rounded-md bg-zinc-800 border border-zinc-700 overflow-hidden shadow-inner">
                                                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${session.creatorName}`} alt={session.creatorName} />
                                                    </div>
                                                    Guide: <span className="text-zinc-400">{session.creatorName}</span>
                                                </div>

                                                <div className="mt-auto pt-6 border-t border-zinc-800 flex items-center justify-between">
                                                    <div className="flex flex-col">
                                                        <span className="text-[9px] uppercase text-zinc-600 font-bold tracking-widest mb-1">
                                                            {session.creatorId === user?.uid ? 'Ownership Status' : 'Exchange Value'}
                                                        </span>
                                                        <div className="flex items-center gap-1.5 text-xl font-bold font-display text-white">
                                                            {session.creatorId === user?.uid ? (
                                                                <span className="text-zinc-500 italic text-sm tracking-widest uppercase">Your Session</span>
                                                            ) : (
                                                                <>
                                                                    {session.price} <span className="text-[10px] text-indigo-500 uppercase tracking-widest font-bold">CR</span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className={cn(
                                                        "w-10 h-10 rounded-lg flex items-center justify-center transition-all",
                                                        session.creatorId === user?.uid 
                                                            ? "bg-zinc-900 border border-zinc-800 text-zinc-700"
                                                            : "bg-zinc-800 border border-zinc-700 text-zinc-500 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-500"
                                                    )}>
                                                        <ArrowUpRight size={16} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}

                {!loading && filteredConcepts.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-24 border border-zinc-800 rounded-3xl mt-12 bg-zinc-900/50"
                    >
                        <div className="text-5xl mb-6 opacity-20">📡</div>
                        <h3 className="text-2xl font-display font-bold mb-2 text-white">No Protocol Detected</h3>
                        <p className="text-zinc-500 max-w-sm mx-auto leading-relaxed font-medium">
                            We couldn't synchronize with any concepts matching your current filter set.
                        </p>
                        <GlowButton onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }} variant="glass" className="mt-10" size="sm">
                            Reset Filters
                        </GlowButton>
                    </motion.div>
                )}
            </main>
        </div>
    );
};

export default Explore;
