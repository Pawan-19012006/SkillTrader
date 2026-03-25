import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Search, 
    Plus, 
    MessageSquare, 
    Clock, 
    ArrowRight,
    User,
    Tag
} from 'lucide-react';
import { collection, query, onSnapshot, orderBy, updateDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/ui/Navbar';
import GlassCard from '../components/ui/GlassCard';
import GlowButton from '../components/ui/GlowButton';
import AnimatedBackground from '../components/ui/AnimatedBackground';
import { cn } from '../utils/cn';
import PostRequestModal from '../components/requests/PostRequestModal';

const Requests = () => {
    const { user } = useAuth();
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);

    useEffect(() => {
        const q = query(
            collection(db, 'requests'),
            orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setRequests(data);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleAcceptRequest = async (requestId: string) => {
        if (!user) return;
        try {
            await updateDoc(doc(db, 'requests', requestId), {
                status: 'accepted',
                acceptedBy: user.uid,
                acceptedByName: user.displayName || user.email?.split('@')[0]
            });
        } catch (error) {
            console.error('Error accepting request:', error);
        }
    };

    const tags = Array.from(new Set(requests.flatMap(r => r.tags || []))).slice(0, 8);

    const filteredRequests = requests.filter(request => {
        const matchesSearch = request.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             request.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTag = !selectedTag || (request.tags && request.tags.includes(selectedTag));
        const isOpen = request.status === 'open';
        return matchesSearch && matchesTag && isOpen;
    });

    const formatTime = (timestamp: any) => {
        if (!timestamp) return 'Just now';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
        if (seconds < 60) return `${seconds}s ago`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="relative min-h-screen pb-20">
            <AnimatedBackground />
            <Navbar />

            <main className="pt-28 px-6 max-w-5xl mx-auto">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3 text-indigo-500 font-bold uppercase tracking-[0.3em] text-[10px]">
                            <MessageSquare size={14} />
                            <span>Knowledge Marketplace</span>
                        </div>
                        <h1 className="text-5xl font-display font-bold text-white tracking-tighter uppercase">Requests Feed</h1>
                        <p className="text-zinc-500 font-medium italic text-sm">Synchronize with peers seeking immediate concept validation.</p>
                    </div>

                    <GlowButton 
                        onClick={() => setIsPostModalOpen(true)}
                        variant="purple" 
                        size="md" 
                        className="gap-2 px-8 py-4 text-xs font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(79,70,229,0.3)]"
                    >
                        <Plus size={16} /> Post Request
                    </GlowButton>
                </header>

                {/* Filters */}
                <div className="flex flex-col md:flex-row items-center gap-6 mb-12">
                    <div className="relative flex-grow w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
                        <input 
                            type="text" 
                            placeholder="SEARCH REQUESTS..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-4 pl-12 pr-6 text-xs font-bold uppercase tracking-widest text-white placeholder:text-zinc-700 focus:outline-none focus:border-indigo-500/50 transition-all"
                        />
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center">
                        <button 
                            onClick={() => setSelectedTag(null)}
                            className={cn(
                                "px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all",
                                !selectedTag ? "bg-indigo-500 text-white shadow-[0_0_15px_rgba(79,70,229,0.2)]" : "bg-zinc-900 text-zinc-500 border border-zinc-800 hover:border-zinc-700"
                            )}
                        >
                            All
                        </button>
                        {tags.map(tag => (
                            <button 
                                key={tag}
                                onClick={() => setSelectedTag(tag)}
                                className={cn(
                                    "px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all",
                                    selectedTag === tag ? "bg-indigo-500 text-white shadow-[0_0_15px_rgba(79,70,229,0.2)]" : "bg-zinc-900 text-zinc-500 border border-zinc-800 hover:border-zinc-700"
                                )}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Feed */}
                <div className="space-y-6">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                        </div>
                    ) : filteredRequests.length === 0 ? (
                        <div className="py-24 text-center bg-zinc-900/30 border border-dashed border-zinc-800 rounded-2xl">
                            <MessageSquare className="mx-auto text-zinc-800 mb-6" size={48} />
                            <h3 className="text-2xl font-display font-bold text-white uppercase italic">Be the first to ask something 🚀</h3>
                            <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest mt-3 px-12 leading-relaxed max-w-md mx-auto">
                                The marketplace is currently idle. Post a synchronization request to initialize the peer-to-peer network.
                            </p>
                        </div>
                    ) : (
                        <AnimatePresence mode="popLayout">
                            {filteredRequests.map((request) => (
                                <motion.div
                                    key={request.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    layout
                                >
                                    <GlassCard className="p-8 bg-zinc-900/40 border-zinc-800 hover:border-indigo-500/30 transition-all group overflow-hidden relative">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl -mr-16 -mt-16 group-hover:bg-indigo-500/10 transition-colors" />
                                        
                                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 relative z-10">
                                            <div className="flex-grow space-y-4">
                                                <div className="flex items-center gap-4">
                                                    {new Date().getTime() - (request.createdAt?.toDate?.() || new Date()).getTime() < 600000 && (
                                                        <div className="flex items-center gap-2 px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-[9px] font-black text-indigo-400 uppercase tracking-widest">
                                                            NEW
                                                        </div>
                                                    )}
                                                    <div className="flex items-center gap-2 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-black text-emerald-500 uppercase tracking-widest">
                                                        <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                                                        OPEN
                                                    </div>
                                                    <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest flex items-center gap-1.5">
                                                        <Clock size={12} /> {formatTime(request.createdAt)}
                                                    </span>
                                                </div>

                                                <div>
                                                    <h3 className="text-xl font-bold text-white uppercase tracking-tight mb-2 group-hover:text-indigo-400 transition-colors">
                                                        {request.title}
                                                    </h3>
                                                    <p className="text-zinc-500 text-sm leading-relaxed max-w-2xl">
                                                        {request.description}
                                                    </p>
                                                </div>

                                                <div className="flex flex-wrap gap-2">
                                                    {request.tags?.map((tag: string) => (
                                                        <span key={tag} className="flex items-center gap-1.5 px-3 py-1 bg-zinc-950 border border-zinc-800 rounded text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
                                                            <Tag size={10} className="text-zinc-600" /> {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-6 pt-6 md:pt-0 border-t md:border-t-0 border-zinc-800/50">
                                                <div className="text-right">
                                                    <div className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.2em] mb-1">Budget Allocation</div>
                                                    <div className="text-3xl font-display font-black text-white flex items-center justify-end gap-2 tracking-tighter">
                                                        {request.budget} <span className="text-indigo-500 text-sm">CR</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <div className="text-right hidden sm:block">
                                                        <div className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">Post Operator</div>
                                                        <div className="text-[11px] text-white font-bold uppercase tracking-tight">{request.creatorName}</div>
                                                    </div>
                                                    <div className="w-10 h-10 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center p-0.5">
                                                        <img 
                                                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${request.createdBy}`} 
                                                            alt="Avatar" 
                                                            className="w-full h-full object-cover rounded opacity-80" 
                                                        />
                                                    </div>
                                                </div>

                                                {request.createdBy !== user?.uid ? (
                                                    <GlowButton 
                                                        onClick={() => {
                                                            if (window.confirm('Accept this synchronization challenge? You will be designated as the Lead Architect for this protocol.')) {
                                                                handleAcceptRequest(request.id);
                                                            }
                                                        }}
                                                        variant="purple" 
                                                        size="sm" 
                                                        className="w-full md:w-auto gap-2 group/btn shadow-lg"
                                                    >
                                                        Accept & Teach <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                                    </GlowButton>
                                                ) : (
                                                    <div className="flex flex-col items-end gap-2">
                                                        <div className="px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                                                            <User size={12} /> Your Request
                                                        </div>
                                                        <div className="text-[8px] text-zinc-600 font-bold uppercase tracking-[0.2em]">Status: Scanning Marketplace</div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </GlassCard>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}
                </div>
            </main>

            <PostRequestModal 
                isOpen={isPostModalOpen} 
                onClose={() => setIsPostModalOpen(false)} 
            />
        </div>
    );
};

export default Requests;
