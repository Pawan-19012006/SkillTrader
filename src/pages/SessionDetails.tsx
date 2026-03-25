import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    Clock,
    MessageSquare,
    ArrowLeft,
    ShieldCheck,
    Star,
    BookOpen,
    Target,
    Zap,
    AlertCircle
} from 'lucide-react';
import Navbar from '../components/ui/Navbar';
import GlassCard from '../components/ui/GlassCard';
import GlowButton from '../components/ui/GlowButton';
import AnimatedBackground from '../components/ui/AnimatedBackground';
import BookingConfirmModal from '../components/booking/BookingConfirmModal';
import { db } from '../lib/firebase';
import { doc, getDoc, collection, query, where, onSnapshot, getDocs, setDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { cn } from '../utils/cn';

const SessionDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [enrollmentStatus, setEnrollmentStatus] = useState<{[key: string]: boolean}>({});
    const [attendeeCount, setAttendeeCount] = useState(0);
    const [session, setSession] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [selectedSlotIdx, setSelectedSlotIdx] = useState<{dateIdx: number, slotIdx: number} | null>(null);
    const [bookingDetails, setBookingDetails] = useState<{
        date: Date;
        slot: string;
        guide: string;
        cost: number;
        title: string;
        sessionId: string;
        dateString: string;
    } | null>(null);

    const isOwner = session?.creatorId === user?.uid;

    const navigate = useNavigate();

    const handleMessage = async () => {
        if (!user || !session?.creatorId) return;
        
        // Search for existing chat
        const chatsQuery = query(
            collection(db, 'chats'),
            where('participants', 'array-contains', user.uid)
        );
        const querySnapshot = await getDocs(chatsQuery);
        const existingChat = querySnapshot.docs.find(doc => doc.data().participants.includes(session.creatorId));

        if (existingChat) {
            navigate(`/messages?chatId=${existingChat.id}`);
            return;
        }

        // Create new chat
        const chatId = [user.uid, session.creatorId].sort().join('_');
        await setDoc(doc(db, 'chats', chatId), {
            participants: [user.uid, session.creatorId],
            updatedAt: serverTimestamp(),
            lastMessage: `Synchronization initialized regarding: ${session.title}`
        });
        
        navigate(`/messages?chatId=${chatId}`);
    };

    useEffect(() => {
        const fetchSession = async () => {
            if (!id) return;
            try {
                const docRef = doc(db, 'sessions', id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setSession({ id: docSnap.id, ...data });
                }
            } catch (error) {
                console.error("Error fetching session:", error);
            } finally {
                setLoading(false);
            }
        };

        const fetchBookings = async () => {
             if (!id) return;
             // Use onSnapshot for real-time count
             const q = query(collection(db, 'bookings'), where('sessionId', '==', id));
             return onSnapshot(q, (snapshot) => {
                 setAttendeeCount(snapshot.size);
                 
                 if (user) {
                     const status: {[key: string]: boolean} = {};
                     snapshot.docs.forEach(doc => {
                         const d = doc.data();
                         if (d.buyerId === user.uid) {
                             // Use date+slot as key for granular check
                             status[`${d.selectedDate}-${d.selectedSlot}`] = true;
                         }
                     });
                     setEnrollmentStatus(status);
                 }
             });
        };

        fetchSession();
        let unsubscribeBookings: any;
        fetchBookings().then(un => unsubscribeBookings = un);

        return () => {
            if (unsubscribeBookings) unsubscribeBookings();
        };
    }, [id, user]);

    const handleConfirmSelection = () => {
        if (!session || !selectedSlotIdx) return;
        
        const dateStr = session.availability[selectedSlotIdx.dateIdx].date;
        const slot = session.availability[selectedSlotIdx.dateIdx].slots[selectedSlotIdx.slotIdx];
        const [year, month, day] = dateStr.split('-').map(Number);
        const bookingDate = new Date(year, month - 1, day);

        setBookingDetails({
            date: bookingDate,
            dateString: dateStr,
            slot: slot,
            guide: session.creatorName,
            cost: session.price,
            title: session.title,
            sessionId: session.id
        });
    };

    return (
        <div className="relative min-h-screen overflow-x-hidden">
            <AnimatedBackground />
            <Navbar />

            <main className="pt-28 pb-20 px-6 max-w-7xl mx-auto text-zinc-100">
                <Link to="/explore" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white mb-12 transition-colors group font-bold text-xs uppercase tracking-widest">
                    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Marketplace
                </Link>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 space-y-6">
                        <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                        <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.3em]">Synchronizing local state with ledger...</p>
                    </div>
                ) : !session ? (
                    <div className="text-center py-32">
                        <h2 className="text-3xl font-display font-bold text-white mb-4 uppercase italic tracking-tighter">Protocol Terminated</h2>
                        <p className="text-zinc-500 font-medium uppercase tracking-tight">The requested synchronization session no longer exists in the ledger.</p>
                        <Link to="/explore">
                            <GlowButton variant="purple" className="mt-10 rounded-none font-bold uppercase tracking-widest text-[10px]">Return to Network</GlowButton>
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Hero Section */}
                        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="lg:col-span-8 space-y-10"
                            >
                                <div>
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 }}
                                        className="flex items-center gap-4 mb-6"
                                    >
                                        <span className="px-3 py-1 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-bold uppercase tracking-[0.2em]">
                                            Protocol Sync <span className="text-zinc-600 ml-1">#{session.id.slice(0, 8)}</span>
                                        </span>
                                        <div className="flex items-center gap-1.5 text-zinc-400 text-xs font-bold uppercase tracking-widest">
                                            <Star size={12} fill="currentColor" className="text-indigo-500" /> 4.9 <span className="text-zinc-600">Secure Rating</span>
                                        </div>
                                    </motion.div>

                                    <h1 className="text-5xl md:text-7xl font-display font-bold mb-8 leading-[0.9] tracking-tighter text-white uppercase italic uppercase">
                                        {session.title.split(' ').map((word: string, i: number) => i === 1 ? <><br /><span key={i} className="text-indigo-500">{word} </span></> : <span key={i}>{word} </span>)}
                                    </h1>

                                    <p className="text-xl text-zinc-500 leading-relaxed max-w-2xl font-medium uppercase tracking-tight">
                                        {session.description}
                                    </p>
                                </div>

                                    <div className="flex flex-wrap gap-8 py-8 border-y border-zinc-800">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-none flex items-center justify-center text-indigo-500 shadow-sm">
                                                <Clock size={20} />
                                            </div>
                                            <div>
                                                <div className="text-[10px] text-zinc-600 uppercase font-bold tracking-widest mb-0.5">Time Frame</div>
                                                <div className="font-bold text-white uppercase text-sm">{session.duration} Minutes</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-none flex items-center justify-center text-white shadow-sm">
                                                <Zap size={20} />
                                            </div>
                                            <div>
                                                <div className="text-[10px] text-zinc-600 uppercase font-bold tracking-widest mb-0.5">Learners Enrolled</div>
                                                <div className="font-bold text-indigo-500 uppercase text-sm">{attendeeCount} Synthesizing</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-none flex items-center justify-center text-indigo-400 shadow-sm">
                                                <ShieldCheck size={20} />
                                            </div>
                                            <div>
                                                <div className="text-[10px] text-zinc-600 uppercase font-bold tracking-widest mb-0.5">Cost</div>
                                                <div className="font-bold text-white uppercase text-sm">{session.price} CR</div>
                                            </div>
                                        </div>
                                    </div>

                                <div className="space-y-6">
                                    {isOwner && (
                                        <div className="flex items-center gap-3 p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-none">
                                            <AlertCircle className="text-indigo-500" size={18} />
                                            <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">
                                                Ownership Protocol Detected: You cannot synchronize with your own broadcast.
                                            </p>
                                        </div>
                                    )}
                                    <div className="flex gap-4 pt-4">
                                        <GlowButton 
                                            onClick={() => setIsBookingOpen(true)} 
                                            variant="purple" 
                                            size="lg" 
                                            className="px-10 rounded-none font-bold uppercase tracking-[0.2em] text-[10px]"
                                            disabled={isOwner}
                                        >
                                            {isOwner ? 'Locked: Your Session' : 'Access Sync Ledger'}
                                        </GlowButton>
                                        <GlowButton 
                                            onClick={handleMessage}
                                            variant="glass" 
                                            size="lg" 
                                            className="px-8 flex items-center gap-2 rounded-none font-bold uppercase tracking-[0.2em] text-[10px]"
                                            disabled={isOwner}
                                        >
                                            <MessageSquare size={18} /> Contact Guide
                                        </GlowButton>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="lg:col-span-4"
                            >
                                <GlassCard className="p-8 sticky top-32 bg-zinc-900 border-zinc-800 rounded-none border-l-4 border-l-indigo-600" hover={false}>
                                    <div className="text-center mb-8">
                                        <div className="w-24 h-24 mx-auto mb-6 bg-zinc-950 border border-zinc-800 p-1">
                                            <div className="w-full h-full bg-zinc-900 flex items-center justify-center overflow-hidden">
                                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${session.creatorName}`} alt={session.creatorName} className="w-full h-full object-cover" />
                                            </div>
                                        </div>
                                        <h3 className="text-2xl font-display font-bold text-white tracking-tight uppercase italic">{session.creatorName}</h3>
                                        <p className="text-indigo-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">Authenticated Concept Guide</p>
                                    </div>

                                    <div className="space-y-6 text-sm">
                                        <p className="text-zinc-500 leading-relaxed text-center font-medium uppercase tracking-tight">
                                            Authorized instructor for the {session.tags?.[0] || 'Technical'} Synchronization Protocol.
                                        </p>

                                        <div className="pt-6 border-t border-zinc-800 space-y-4">
                                            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                                                <span className="text-zinc-600">Total Syncs</span>
                                                <span className="text-zinc-300">1,240</span>
                                            </div>
                                            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                                                <span className="text-zinc-600">Mastery Rating</span>
                                                <span className="text-indigo-500">99.2%</span>
                                            </div>
                                        </div>

                                        <GlowButton variant="glass" fullWidth size="sm" className="mt-4 rounded-none text-[9px] font-bold uppercase tracking-widest">
                                            Profile Analytics
                                        </GlowButton>
                                    </div>
                                </GlassCard>
                            </motion.div>
                        </section>

                        {/* Content Tabs / Info */}
                        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                            <div className="lg:col-span-8 space-y-16">
                                <div className="space-y-8">
                                    <h2 className="text-2xl font-display font-bold flex items-center gap-4 text-white uppercase italic tracking-tighter">
                                        <Target className="text-indigo-500" size={24} /> Learning Objectives
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {(session.objectives || []).map((obj: string, i: number) => (
                                            <GlassCard key={i} className="p-6 bg-zinc-900 border-zinc-800 rounded-none border-t border-t-indigo-500/20" hover={true}>
                                                <h4 className="font-bold text-white mb-2 uppercase text-[10px] tracking-widest">Target Objective {i + 1}</h4>
                                                <p className="text-sm text-zinc-500 font-medium leading-relaxed uppercase tracking-tight">{obj}</p>
                                            </GlassCard>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <h2 className="text-2xl font-display font-bold flex items-center gap-4 text-white uppercase italic tracking-tighter">
                                        <BookOpen className="text-indigo-400" size={24} /> Protocol Requirements
                                    </h2>
                                    <GlassCard className="p-8 bg-zinc-900 border-zinc-800 rounded-none border-b border-b-indigo-500/20" hover={false}>
                                        <ul className="space-y-4">
                                            {[
                                                "Basic understanding of core concepts",
                                                "Active communication hardware ready",
                                                "Commitment to the 15-minute high-frequency sync"
                                            ].map((item, i) => (
                                                <li key={i} className="flex items-start gap-4 text-zinc-400 font-medium uppercase text-[10px] tracking-widest font-bold">
                                                    <div className="w-1.5 h-1.5 rounded-none bg-indigo-500 mt-2 shadow-[0_0_8px_rgba(99,102,241,0.3)]" />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </GlassCard>
                                </div>
                            </div>
                        </section>
                    </>
                )}
            </main>

            {/* Booking Side Panel / Modal */}
            <AnimatePresence>
                {isBookingOpen && (
                    <div className="fixed inset-0 z-50 flex justify-end">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => {
                                setIsBookingOpen(false);
                                setBookingDetails(null);
                                setSelectedSlotIdx(null);
                            }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                            <motion.div
                                initial={{ x: '100%', opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: '100%', opacity: 0 }}
                                transition={{ type: "spring", damping: 30, stiffness: 200 }}
                                className="relative w-full max-w-2xl h-full bg-zinc-950 border-l border-zinc-900 p-8 md:p-12 overflow-y-auto"
                            >
                                <div className="mb-12">
                                    <motion.h2 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="text-4xl font-display font-bold mb-2 uppercase italic tracking-tighter text-white"
                                    >
                                        Initialize Sync
                                    </motion.h2>
                                    <motion.p 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className="text-zinc-500 font-medium uppercase tracking-tight text-sm"
                                    >
                                        Reviewing protocol parameters for {session?.creatorName}'s clarity session.
                                    </motion.p>
                                </div>

                            <AnimatePresence mode="wait">
                                {!bookingDetails ? (
                                    <motion.div 
                                        key="selection-list"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="space-y-8"
                                    >
                                        <div className="space-y-1 mb-8">
                                            <h4 className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                                                Select Available Time
                                            </h4>
                                        </div>

                                        <div className="space-y-8 max-h-[60vh] overflow-y-auto pr-4 scrollbar-none">
                                            {session?.availability && session.availability.length > 0 ? (
                                                session.availability.map((dateItem: any, dIdx: number) => (
                                                    <div key={dIdx} className="space-y-4">
                                                        <h3 className="text-sm font-bold text-white uppercase tracking-widest border-l-2 border-indigo-500 pl-3 py-1 bg-white/5">
                                                            {new Date(dateItem.date).toLocaleDateString(undefined, { 
                                                                weekday: 'long', 
                                                                month: 'long', 
                                                                day: 'numeric' 
                                                            })}
                                                        </h3>
                                                        
                                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                                            {dateItem.slots.map((slot: string, sIdx: number) => (
                                                                <motion.button
                                                                    key={`${dIdx}-${sIdx}`}
                                                                    whileHover={{ y: -2 }}
                                                                    whileTap={{ scale: 0.98 }}
                                                                    onClick={() => setSelectedSlotIdx({ dateIdx: dIdx, slotIdx: sIdx })}
                                                                    className={cn(
                                                                        "p-4 border text-[10px] font-bold uppercase tracking-widest transition-all",
                                                                        selectedSlotIdx?.dateIdx === dIdx && selectedSlotIdx?.slotIdx === sIdx
                                                                            ? "bg-white text-black border-white shadow-[0_10px_30px_rgba(255,255,255,0.1)]"
                                                                            : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300"
                                                                    )}
                                                                >
                                                                    {slot}
                                                                </motion.button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="py-24 text-center border border-dashed border-zinc-900 bg-zinc-900/10">
                                                    <div className="text-4xl mb-6 opacity-30">📅</div>
                                                    <h4 className="text-zinc-600 text-[10px] font-bold uppercase tracking-[0.3em] px-12 leading-loose">
                                                        No slots available
                                                    </h4>
                                                </div>
                                            )}
                                        </div>

                                        <div className="pt-10 mt-auto border-t border-zinc-900">
                                            {selectedSlotIdx && enrollmentStatus[`${session.availability[selectedSlotIdx.dateIdx].date}-${session.availability[selectedSlotIdx.dateIdx].slots[selectedSlotIdx.slotIdx]}`] ? (
                                                <GlowButton 
                                                    disabled={true}
                                                    variant="glass" 
                                                    fullWidth 
                                                    size="lg" 
                                                    className="py-6 rounded-none font-bold uppercase tracking-[0.25em] text-[10px] border-emerald-500/50 text-emerald-500"
                                                >
                                                    Already Enrolled
                                                </GlowButton>
                                            ) : (
                                                <GlowButton 
                                                    onClick={handleConfirmSelection}
                                                    disabled={!selectedSlotIdx}
                                                    variant="purple" 
                                                    fullWidth 
                                                    size="lg" 
                                                    className="py-6 rounded-none font-bold uppercase tracking-[0.25em] text-[10px]"
                                                >
                                                    Initialize Enrollment
                                                </GlowButton>
                                            )}
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="confirm-modal"
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.98 }}
                                        className="h-full"
                                    >
                                        <BookingConfirmModal
                                            isOpen={isBookingOpen}
                                            onClose={() => {
                                                setIsBookingOpen(false);
                                                setBookingDetails(null);
                                                setSelectedSlotIdx(null);
                                            }}
                                            bookingDetails={bookingDetails}
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SessionDetails;
