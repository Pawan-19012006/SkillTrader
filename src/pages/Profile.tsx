import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Shield, 
    Zap, 
    Award,
    Edit3,
    X,
    TrendingUp,
    TrendingDown,
    Clock,
    User as UserIcon,
    Mail,
    Save,
    MessageSquare
} from 'lucide-react';
import { collection, query, where, onSnapshot, doc, updateDoc, orderBy, limit, getDocs, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/ui/Navbar';
import GlowButton from '../components/ui/GlowButton';
import AnimatedBackground from '../components/ui/AnimatedBackground';
import { cn } from '../utils/cn';
import { useParams, useNavigate } from 'react-router-dom';
import FollowButton from '../components/social/FollowButton';

const Profile = () => {
    const { uid: paramUid } = useParams();
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();
    
    const isOwnProfile = !paramUid || paramUid === currentUser?.uid;
    const targetUid = isOwnProfile ? currentUser?.uid : paramUid;

    const [profileUser, setProfileUser] = useState<any>(null);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isLearnedFrom, setIsLearnedFrom] = useState(false);
    
    // Stats
    const [stats, setStats] = useState({
        followers: 0,
        following: 0,
        credits: 0
    });

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editData, setEditData] = useState({
        displayName: '',
        photoURL: ''
    });

    // Connections
    const [activeTab, setActiveTab] = useState<'ledger' | 'followers' | 'following'>('ledger');
    const [followerUsers, setFollowerUsers] = useState<any[]>([]);
    const [followingUsers, setFollowingUsers] = useState<any[]>([]);
    const [loadingConnections, setLoadingConnections] = useState(false);

    useEffect(() => {
        if (!targetUid) return;

        // Fetch User Data
        const userRef = doc(db, 'users', targetUid);
        const unsubUser = onSnapshot(userRef, async (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.data();
                setProfileUser(data);
                setStats({
                    followers: data.followers?.length || 0,
                    following: data.following?.length || 0,
                    credits: data.credits || 0
                });
                if (isOwnProfile) {
                    setEditData({
                        displayName: data.displayName || '',
                        photoURL: data.photoURL || ''
                    });
                }

                // Fetch connection details if tabs are active
                if (activeTab === 'followers' || activeTab === 'following') {
                    setLoadingConnections(true);
                    const connectionIds = activeTab === 'followers' ? (data.followers || []) : (data.following || []);
                    
                    if (connectionIds.length > 0) {
                        try {
                            const fetchedUsers: any[] = [];
                            // Firestore 'in' queries are limited to 10-30 items depending on sdk version, 
                            // but usually it's better to chunk.
                            const chunks = [];
                            for (let i = 0; i < connectionIds.length; i += 10) {
                                chunks.push(connectionIds.slice(i, i + 10));
                            }

                            for (const chunk of chunks) {
                                const q = query(collection(db, 'users'), where('uid', 'in', chunk));
                                const snaps = await getDocs(q);
                                fetchedUsers.push(...snaps.docs.map(d => d.data()));
                            }
                            
                            if (activeTab === 'followers') setFollowerUsers(fetchedUsers);
                            else setFollowingUsers(fetchedUsers);
                        } catch (err) {
                            console.error("Error fetching connection details:", err);
                        }
                    } else {
                        if (activeTab === 'followers') setFollowerUsers([]);
                        else setFollowingUsers([]);
                    }
                    setLoadingConnections(false);
                }
            }
        });

        // Check if shared booking exists (for academic badge & messaging)
        if (!isOwnProfile && currentUser) {
            const checkAcademicLink = async () => {
                const bookingsQuery = query(
                    collection(db, 'bookings'),
                    where('buyerId', 'in', [currentUser.uid, targetUid]),
                    where('creatorId', 'in', [currentUser.uid, targetUid])
                );
                const snaps = await getDocs(bookingsQuery);
                setIsLearnedFrom(snaps.size > 0);
            };
            checkAcademicLink();
        }

        // Fetch Transactions (Only if own profile for privacy)
        let unsubTx: (() => void) | null = null;
        if (isOwnProfile) {
            const fetchTransactions = (useOrderBy = true) => {
                const constraints: any[] = [where('userId', '==', targetUid)];
                if (useOrderBy) constraints.push(orderBy('createdAt', 'desc'));
                constraints.push(limit(20));

                const q = query(collection(db, 'transactions'), ...constraints);
                return onSnapshot(q, (snapshot) => {
                    let data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    if (!useOrderBy) {
                        data.sort((a: any, b: any) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0));
                    }
                    setTransactions(data);
                    setLoading(false);
                }, () => {
                    if (useOrderBy) fetchTransactions(false);
                });
            };
            unsubTx = fetchTransactions(true);
        } else {
            setLoading(false);
        }

        return () => {
            unsubUser();
            if (unsubTx) unsubTx();
        };
    }, [targetUid, currentUser, isOwnProfile, activeTab]);

    const handleUpdateProfile = async () => {
        if (!currentUser) return;
        try {
            const userRef = doc(db, 'users', currentUser.uid);
            await updateDoc(userRef, {
                displayName: editData.displayName,
                photoURL: editData.photoURL
            });
            setIsEditModalOpen(false);
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update identity protocols.");
        }
    };

    const handleMessage = async (specificUid?: string) => {
        const initiator = currentUser;
        const recipientUid = specificUid || targetUid;
        if (!initiator || !recipientUid) return;
        
        // Search for existing chat
        const chatsQuery = query(
            collection(db, 'chats'),
            where('participants', 'array-contains', initiator.uid)
        );
        const querySnapshot = await getDocs(chatsQuery);
        const existingChat = querySnapshot.docs.find(doc => doc.data().participants.includes(recipientUid));

        if (existingChat) {
            navigate(`/messages?chatId=${existingChat.id}`);
            return;
        }

        // Create new chat
        const chatId = [initiator.uid, recipientUid].sort().join('_');
        await setDoc(doc(db, 'chats', chatId), {
            participants: [initiator.uid, recipientUid],
            updatedAt: serverTimestamp(),
            lastMessage: 'Synchronization context established.'
        });
        
        navigate(`/messages?chatId=${chatId}`);
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
        </div>
    );

    if (!profileUser) return null;

    return (
        <div className="relative min-h-screen">
            <AnimatedBackground />
            <Navbar />

            <main className="pt-28 pb-12 px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Profile Information */}
                    <aside className="space-y-8">
                        <div className="p-8 bg-zinc-900 border border-zinc-800 relative overflow-hidden rounded-none">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl -mr-16 -mt-16" />
                            
                            <div className="flex flex-col items-center text-center space-y-6 relative z-10">
                                <div className="relative group">
                                    <div className="w-32 h-32 rounded-full border-4 border-zinc-800 p-1 shadow-xl overflow-hidden">
                                        <img 
                                            src={profileUser?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${targetUid}`} 
                                            alt="Avatar" 
                                            className="w-full h-full object-cover" 
                                        />
                                    </div>
                                    <button 
                                        onClick={() => setIsEditModalOpen(true)}
                                        className="absolute bottom-0 right-0 bg-indigo-600 p-2 text-white hover:bg-indigo-500 rounded-full transition-all border border-indigo-400 shadow-lg"
                                    >
                                        <Edit3 size={14} />
                                    </button>
                                </div>

                                <div className="space-y-2">
                                    <h1 className="text-3xl font-display font-bold text-white tracking-tight">
                                        {profileUser?.displayName || profileUser?.email?.split('@')[0]}
                                    </h1>
                                    <div className="flex flex-col items-center gap-3">
                                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                                            <Shield size={12} className="text-indigo-500" /> Verified Member
                                        </p>
                                        
                                        {isLearnedFrom && (
                                            <div className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 text-[8px] font-black uppercase tracking-widest">
                                                Learned Together
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-8 py-2">
                                    <div className="text-center">
                                        <div className="text-2xl font-display font-bold text-white tracking-tighter">{stats.followers}</div>
                                        <div className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Followers</div>
                                    </div>
                                    <div className="h-8 w-[1px] bg-zinc-800" />
                                    <div className="text-center">
                                        <div className="text-2xl font-display font-bold text-white tracking-tighter">{stats.following}</div>
                                        <div className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Following</div>
                                    </div>
                                </div>

                                {!isOwnProfile && (
                                    <div className="w-full flex gap-3">
                                        <FollowButton targetUserId={targetUid!} className="flex-grow py-4" size="md" />
                                        <GlowButton 
                                            onClick={() => handleMessage()}
                                            disabled={!isLearnedFrom}
                                            variant="glass" 
                                            className="flex-grow py-4 uppercase text-[10px] font-bold tracking-widest gap-2"
                                            title={!isLearnedFrom ? "Establish academic sync first to unlock private messaging." : "Initialize 1:1 synchronization."}
                                        >
                                            <MessageSquare size={14} className={cn(!isLearnedFrom && "opacity-20")} />
                                            <span className={cn(!isLearnedFrom && "opacity-20")}>Message</span>
                                        </GlowButton>
                                    </div>
                                )}

                                <div className="w-full pt-6 border-t border-zinc-800 space-y-4">
                                    <div className="flex items-center gap-4 text-zinc-500">
                                        <Mail size={14} className="text-zinc-700" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">{profileUser?.email}</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-zinc-500">
                                        <Clock size={14} className="text-zinc-700" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Member Level: 1</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Wallet Display */}
                        <div className="p-8 bg-zinc-900 border border-zinc-800 border-l-4 border-l-indigo-600">
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-6 flex items-center gap-2">
                                <Zap size={14} className="text-indigo-500" /> Wallet Balance
                            </h4>
                            <div className="flex items-baseline gap-2">
                                <span className="text-6xl font-display font-bold text-white tracking-tighter">{stats.credits}</span>
                                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Credits</span>
                            </div>
                            {isOwnProfile && (
                                <GlowButton variant="glass" fullWidth size="lg" className="mt-8 rounded-none text-[10px] font-bold uppercase tracking-widest">
                                    View History
                                </GlowButton>
                            )}
                        </div>

                        <div className="p-8 bg-zinc-900 border border-zinc-800 rounded-none">
                            <h4 className="text-[10px] font-bold uppercase tracking-widest mb-8 text-zinc-500">Mastery Badges</h4>
                            <div className="grid grid-cols-4 gap-3">
                                {[...Array(8)].map((_, i) => (
                                    <div key={i} className={cn(
                                        "aspect-square rounded-none flex items-center justify-center border transition-all shadow-sm",
                                        i < 3 ? "bg-indigo-500/10 text-indigo-500 border-indigo-500/20 shadow-[0_0_10px_rgba(79,70,229,0.1)]" : "bg-zinc-950 text-zinc-800 border-zinc-800"
                                    )}>
                                        <Award size={18} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* Interactive Tabbed Content */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div>
                                <h2 className="text-3xl font-display font-bold text-white tracking-tight leading-none mb-2">
                                    Activity
                                </h2>
                                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Your recent lessons and following</p>
                            </div>

                            <div className="flex bg-zinc-900/50 p-1 border border-zinc-900">
                                {[
                                    { id: 'ledger', label: 'History' },
                                    { id: 'followers', label: 'Followers' },
                                    { id: 'following', label: 'Following' }
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id as any)}
                                        className={cn(
                                            "px-4 py-2 text-[8px] font-black uppercase tracking-[0.2em] transition-all",
                                            activeTab === tab.id 
                                                ? "bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.3)]" 
                                                : "text-zinc-600 hover:text-zinc-400"
                                        )}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            {activeTab === 'ledger' && (
                                loading ? (
                                    <div className="py-24 flex justify-center">
                                        <div className="w-8 h-8 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                                    </div>
                                ) : transactions.length === 0 ? (
                                    <div className="py-24 text-center border border-dashed border-zinc-900 bg-zinc-900/10">
                                        <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-[0.3em]">No activity found.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {transactions.map((tx) => (
                                            <div key={tx.id} className="p-5 bg-zinc-900/40 border border-zinc-800 group rounded-none hover:bg-zinc-900/80 transition-all shadow-lg">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-5">
                                                        <div className={cn(
                                                            "w-12 h-12 flex items-center justify-center rounded-none border",
                                                            tx.type === 'credit' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : "bg-red-500/10 border-red-500/20 text-red-500"
                                                        )}>
                                                            {tx.type === 'credit' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                                                        </div>
                                                        <div>
                                                            <h4 className="text-[11px] font-bold text-white uppercase tracking-widest">{tx.title}</h4>
                                                            <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest mt-1">
                                                                {tx.createdAt?.toDate ? tx.createdAt.toDate().toLocaleDateString() : 'Processing...'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className={cn(
                                                        "text-lg font-display font-bold tabular-nums tracking-tighter",
                                                        tx.type === 'credit' ? "text-emerald-500" : "text-red-500"
                                                    )}>
                                                        {tx.type === 'credit' ? '+' : '-'}{tx.amount}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )
                            )}

                            {(activeTab === 'followers' || activeTab === 'following') && (
                                loadingConnections ? (
                                    <div className="py-24 flex justify-center">
                                        <div className="w-8 h-8 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                                    </div>
                                ) : (activeTab === 'followers' ? followerUsers : followingUsers).length === 0 ? (
                                    <div className="py-24 text-center border border-dashed border-zinc-900 bg-zinc-900/10">
                                        <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-[0.3em]">
                                            {activeTab === 'followers' ? 'No followers yet.' : "You're not following anyone yet."}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {(activeTab === 'followers' ? followerUsers : followingUsers).map((u) => (
                                            <div key={u.uid} className="p-4 bg-zinc-900/60 border border-zinc-800 flex items-center justify-between rounded-none hover:bg-zinc-900/90 transition-all shadow-md">
                                                <div className="flex items-center gap-4">
                                                    <div 
                                                        className="w-10 h-10 bg-zinc-950 border border-zinc-800 cursor-pointer overflow-hidden"
                                                        onClick={() => navigate(`/profile/${u.uid}`)}
                                                    >
                                                        <img 
                                                            src={u.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.uid}`} 
                                                            className="w-full h-full object-cover grayscale opacity-80" alt="" 
                                                        />
                                                    </div>
                                                    <div>
                                                        <h4 
                                                            className="text-[10px] font-bold text-white uppercase tracking-widest cursor-pointer hover:text-indigo-400 transition-colors"
                                                            onClick={() => navigate(`/profile/${u.uid}`)}
                                                        >
                                                            {u.displayName || u.name}
                                                        </h4>
                                                        <p className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest mt-0.5 italic truncate max-w-[120px]">
                                                            {u.email}
                                                        </p>
                                                    </div>
                                                </div>
                                                <GlowButton 
                                                    onClick={() => handleMessage(u.uid)}
                                                    variant="glass" 
                                                    className="px-4 py-2 text-[8px] font-black uppercase tracking-widest"
                                                >
                                                    Message
                                                </GlowButton>
                                            </div>
                                        ))}
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* Edit Profile Modal */}
            <AnimatePresence>
                {isEditModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsEditModalOpen(false)}
                            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
                        />
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 p-10 space-y-10 rounded-none shadow-2xl"
                        >
                            <button 
                                onClick={() => setIsEditModalOpen(false)}
                                className="absolute top-6 right-6 text-zinc-600 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>

                            <div>
                                <h3 className="text-2xl font-display font-bold text-white uppercase italic tracking-tighter">Adjust Identity</h3>
                                <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mt-1">Update verified sync credentials.</p>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-600 ml-1">Universal Display Name</label>
                                    <div className="relative">
                                        <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700" size={14} />
                                        <input 
                                            type="text"
                                            value={editData.displayName}
                                            onChange={(e) => setEditData({...editData, displayName: e.target.value})}
                                            className="w-full bg-zinc-900 border border-zinc-800 py-4 pl-12 pr-4 text-xs font-bold text-white focus:outline-none focus:border-indigo-600/50"
                                            placeholder="Identity Label"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[9px] font-bold uppercase tracking-widest text-zinc-600 ml-1">Visual Metadata (Avatar URL)</label>
                                    <div className="relative">
                                        <Edit3 className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700" size={14} />
                                        <input 
                                            type="text"
                                            value={editData.photoURL}
                                            onChange={(e) => setEditData({...editData, photoURL: e.target.value})}
                                            className="w-full bg-zinc-900 border border-zinc-800 py-4 pl-12 pr-4 text-xs font-bold text-white focus:outline-none focus:border-indigo-600/50"
                                            placeholder="https://image-protocol.io/..."
                                        />
                                    </div>
                                </div>
                            </div>

                            <GlowButton 
                                onClick={handleUpdateProfile}
                                variant="purple" 
                                fullWidth 
                                className="py-5 rounded-none font-bold uppercase tracking-[0.2em] text-[10px]"
                            >
                                <Save size={16} className="mr-2" /> Commit Identity Changes
                            </GlowButton>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Profile;
