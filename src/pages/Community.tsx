import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Search, 
    Plus, 
    MessageSquare,
    Clock, 
    ArrowRight,
    Users,
    Sparkles
} from 'lucide-react';
import { collection, query, onSnapshot, orderBy, updateDoc, doc, addDoc, serverTimestamp, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/ui/Navbar';
import GlassCard from '../components/ui/GlassCard';
import GlowButton from '../components/ui/GlowButton';
import AnimatedBackground from '../components/ui/AnimatedBackground';
import { cn } from '../utils/cn';
import PostRequestModal from '../components/requests/PostRequestModal';
import FollowButton from '../components/social/FollowButton';

const Community = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'discussions' | 'requests'>('discussions');
    const [loading, setLoading] = useState(true);
    
    // Discussions State
    const [discussions, setDiscussions] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isPosting, setIsPosting] = useState(false);

    // Requests State
    const [requests, setRequests] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [isPostModalOpen, setIsPostModalOpen] = useState(false);

    useEffect(() => {
        // Discussions Subscription
        const discQ = query(
            collection(db, 'discussions'),
            orderBy('createdAt', 'desc'),
            limit(50)
        );

        const unsubscribeDisc = onSnapshot(discQ, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            // We want chronological for chat, but Firebase gives desc by default for feed feel
            // For a chat feed, usually bottom is newest, but here we can do top newest like social media
            setDiscussions(data);
            if (activeTab === 'discussions') setLoading(false);
        });

        // Requests Subscription
        const reqQ = query(
            collection(db, 'requests'),
            orderBy('createdAt', 'desc')
        );

        const unsubscribeReq = onSnapshot(reqQ, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setRequests(data);
            if (activeTab === 'requests') setLoading(false);
        });

        return () => {
            unsubscribeDisc();
            unsubscribeReq();
        };
    }, [activeTab]);

    const handlePostDiscussion = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !newMessage.trim() || isPosting) return;

        setIsPosting(true);
        try {
            await addDoc(collection(db, 'discussions'), {
                message: newMessage.trim(),
                createdBy: user.uid,
                creatorName: user.displayName || user.email?.split('@')[0],
                creatorAvatar: user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`,
                createdAt: serverTimestamp()
            });
            setNewMessage('');
        } catch (error) {
            console.error('Error posting discussion:', error);
        } finally {
            setIsPosting(false);
        }
    };

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
                <header className="mb-12">
                    <div className="flex items-center gap-3 text-indigo-500 font-bold uppercase tracking-[0.3em] text-[10px] mb-4">
                        <Users size={14} />
                        <span>Social Hub</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-display font-bold text-white tracking-tighter uppercase italic leading-none mb-8">
                        Community <span className="text-indigo-600">Hub</span>
                    </h1>

                    {/* Tab Switcher */}
                    <div className="flex items-center gap-8 border-b border-zinc-900">
                        <button
                            onClick={() => setActiveTab('discussions')}
                            className={cn(
                                "pb-4 text-[11px] font-bold uppercase tracking-[0.2em] transition-all relative",
                                activeTab === 'discussions' ? "text-indigo-500" : "text-zinc-600 hover:text-zinc-400"
                            )}
                        >
                            Discussions & Intel
                            {activeTab === 'discussions' && (
                                <motion.div layoutId="community-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 shadow-[0_0_10px_rgba(79,70,229,0.5)]" />
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('requests')}
                            className={cn(
                                "pb-4 text-[11px] font-bold uppercase tracking-[0.2em] transition-all relative",
                                activeTab === 'requests' ? "text-indigo-500" : "text-zinc-600 hover:text-zinc-400"
                            )}
                        >
                            Learning Requests
                            {activeTab === 'requests' && (
                                <motion.div layoutId="community-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 shadow-[0_0_10px_rgba(79,70,229,0.5)]" />
                            )}
                        </button>
                    </div>
                </header>

                <div className="mt-8">
                    {activeTab === 'discussions' ? (
                        <div className="space-y-12">
                            {/* Discussion Input */}
                            <GlassCard className="p-4 bg-zinc-950 border-zinc-900 rounded-none border-l-2 border-indigo-600" hover={false}>
                                <form onSubmit={handlePostDiscussion} className="flex gap-4">
                                    <div className="flex-grow relative">
                                        <input 
                                            type="text"
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            placeholder="Ask or discuss anything with the network..."
                                            className="w-full bg-zinc-900 border border-zinc-800 rounded-none py-4 px-6 text-sm font-medium text-white placeholder:text-zinc-700 focus:outline-none focus:border-indigo-500/50 transition-all"
                                        />
                                    </div>
                                    <GlowButton 
                                        type="submit"
                                        disabled={!newMessage.trim() || isPosting}
                                        variant="purple" 
                                        className="rounded-none px-8 font-bold uppercase tracking-widest text-[10px]"
                                    >
                                        {isPosting ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : 'Broadcast'}
                                    </GlowButton>
                                </form>
                            </GlassCard>

                            {/* Discussions Feed */}
                            <div className="space-y-6">
                                {discussions.length === 0 && !loading ? (
                                    <div className="py-24 text-center border border-dashed border-zinc-900 bg-zinc-900/10">
                                        <Sparkles className="mx-auto text-zinc-800 mb-6" size={48} />
                                        <h3 className="text-zinc-100 font-display font-bold uppercase italic text-xl">Start the conversation 🚀</h3>
                                        <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest mt-3 px-12 leading-relaxed max-w-md mx-auto">
                                            The discussion ledger is currently empty. Initialize the narrative by broadcasting your first thought.
                                        </p>
                                    </div>
                                ) : (
                                    <AnimatePresence mode="popLayout">
                                        {discussions.map((msg) => (
                                            <motion.div
                                                key={msg.id}
                                                initial={{ opacity: 0, scale: 0.98 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                layout
                                            >
                                                <div className="group flex gap-6 p-6 bg-zinc-900/30 border border-zinc-800 hover:border-zinc-700 transition-all rounded-none">
                                                    <div className="w-12 h-12 bg-zinc-950 border border-zinc-800 p-0.5 shrink-0">
                                                        <img src={msg.creatorAvatar} alt={msg.creatorName} className="w-full h-full object-cover rounded opacity-80" />
                                                    </div>
                                                    <div className="flex-grow space-y-2">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-[11px] font-bold text-white uppercase tracking-tight italic">{msg.creatorName}</span>
                                                                <FollowButton targetUserId={msg.createdBy} size="sm" className="h-6 px-2 text-[8px]" />
                                                                <span className="w-1 h-1 rounded-full bg-zinc-800" />
                                                                <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">{formatTime(msg.createdAt)}</span>
                                                            </div>
                                                        </div>
                                                        <p className="text-sm text-zinc-400 leading-relaxed font-medium">{msg.message}</p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-4">
                                <div className="space-y-1">
                                    <h3 className="text-xl font-display font-bold text-white tracking-tight uppercase italic">Active Requests</h3>
                                    <p className="text-zinc-600 font-bold uppercase tracking-widest text-[9px]">Synchronize with peers seeking immediate concept validation.</p>
                                </div>
                                <GlowButton 
                                    onClick={() => setIsPostModalOpen(true)}
                                    variant="purple" 
                                    size="sm" 
                                    className="gap-2 px-8 py-4 text-xs font-bold uppercase tracking-widest"
                                >
                                    <Plus size={16} /> Post Request
                                </GlowButton>
                            </header>

                            {/* Filters */}
                            <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
                                <div className="relative flex-grow w-full">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700" size={16} />
                                    <input 
                                        type="text" 
                                        placeholder="SEARCH REQUESTS..." 
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full bg-zinc-950 border border-zinc-900 rounded-none py-3 pl-12 pr-6 text-[10px] font-bold uppercase tracking-widest text-white placeholder:text-zinc-800 focus:outline-none focus:border-indigo-500/50 transition-all font-mono"
                                    />
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <button 
                                        onClick={() => setSelectedTag(null)}
                                        className={cn(
                                            "px-3 py-1.5 border text-[9px] font-bold uppercase tracking-[0.2em] transition-all",
                                            !selectedTag ? "bg-indigo-600 text-white border-indigo-500" : "bg-zinc-950 border-zinc-900 text-zinc-600 hover:border-zinc-800"
                                        )}
                                    >
                                        All
                                    </button>
                                    {tags.map(tag => (
                                        <button 
                                            key={tag}
                                            onClick={() => setSelectedTag(tag)}
                                            className={cn(
                                                "px-3 py-1.5 border text-[9px] font-bold uppercase tracking-[0.2em] transition-all",
                                                selectedTag === tag ? "bg-indigo-600 text-white border-indigo-500" : "bg-zinc-950 border-zinc-900 text-zinc-600 hover:border-zinc-800"
                                            )}
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Requests Feed */}
                            <div className="space-y-4">
                                {loading && requests.length === 0 ? (
                                    <div className="flex items-center justify-center py-20">
                                        <div className="w-10 h-10 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                                    </div>
                                ) : filteredRequests.length === 0 ? (
                                    <div className="py-24 text-center border border-dashed border-zinc-900 bg-zinc-900/10">
                                        <MessageSquare className="mx-auto text-zinc-800 mb-6" size={48} />
                                        <h3 className="text-zinc-100 font-display font-bold uppercase italic text-xl">Ask your first doubt 🔥</h3>
                                        <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest mt-3 px-12 leading-relaxed max-w-md mx-auto">
                                            The requests ledger is currently idle. Post a synchronization request to initialize the peer-to-peer network.
                                        </p>
                                    </div>
                                ) : (
                                    <AnimatePresence mode="popLayout">
                                        {filteredRequests.map((request) => (
                                            <motion.div
                                                key={request.id}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, scale: 0.98 }}
                                                layout
                                            >
                                                <GlassCard className="p-6 bg-zinc-900/40 border-zinc-800 hover:border-indigo-500/20 transition-all rounded-none overflow-hidden relative group">
                                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                                                        <div className="space-y-3 flex-grow">
                                                            <div className="flex items-center gap-3">
                                                                <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                                                                    <Clock size={12} /> {formatTime(request.createdAt)}
                                                                </span>
                                                                <div className="w-1 h-1 rounded-full bg-zinc-800" />
                                                                <span className="text-[9px] text-emerald-500 font-bold uppercase tracking-[0.2em]">Open Sync</span>
                                                            </div>
                                                            <h4 className="text-lg font-bold text-white uppercase tracking-tight group-hover:text-indigo-400 transition-colors uppercase italic">{request.title}</h4>
                                                            <p className="text-xs text-zinc-500 leading-relaxed font-medium uppercase tracking-tight">{request.description}</p>
                                                            <div className="flex flex-wrap gap-2 pt-2">
                                                                {request.tags?.map((tag: string) => (
                                                                    <span key={tag} className="px-2 py-0.5 bg-zinc-950 border border-zinc-900 text-[8px] font-bold text-zinc-600 uppercase tracking-widest rounded-none">
                                                                        {tag}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center justify-between md:flex-col md:items-end gap-6 md:min-w-[140px] border-t md:border-t-0 border-zinc-900 pt-6 md:pt-0">
                                                            <div className="text-right">
                                                                <div className="text-[8px] text-zinc-600 font-bold uppercase tracking-[0.3em] mb-1">Budget</div>
                                                                <div className="text-2xl font-display font-black text-indigo-500 tracking-tighter">{request.budget}<span className="text-[10px] ml-0.5">CR</span></div>
                                                            </div>
                                                            {request.createdBy !== user?.uid ? (
                                                                <GlowButton 
                                                                    onClick={() => {
                                                                        if (window.confirm('Accept this synchronization challenge?')) {
                                                                            handleAcceptRequest(request.id);
                                                                        }
                                                                    }}
                                                                    variant="purple" 
                                                                    size="sm" 
                                                                    className="px-6 rounded-none text-[9px] font-bold uppercase tracking-widest h-10"
                                                                >
                                                                    Accept <ArrowRight size={14} className="ml-2" />
                                                                </GlowButton>
                                                            ) : (
                                                                <div className="px-4 py-2 bg-indigo-500/5 border border-indigo-500/20 text-indigo-500 text-[9px] font-bold uppercase tracking-[0.2em] rounded-none">
                                                                    Your Request
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
                        </div>
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

export default Community;
