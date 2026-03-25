import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import {
    Clock,
    MessageSquare,
    ArrowLeft,
    ShieldCheck,
    Star,
    BookOpen,
    Target,
    Zap,
} from 'lucide-react';
import Navbar from '../components/ui/Navbar';
import GlassCard from '../components/ui/GlassCard';
import GlowButton from '../components/ui/GlowButton';
import AnimatedBackground from '../components/ui/AnimatedBackground';
import InteractiveCalendar from '../components/booking/InteractiveCalendar';
import BookingConfirmModal from '../components/booking/BookingConfirmModal';

const SessionDetails = () => {
    const { id } = useParams();
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [bookingDetails, setBookingDetails] = useState<{
        date: Date;
        slot: string;
        guide: string;
        cost: number;
        title: string;
    } | null>(null);

    const handleSelectSlot = (date: Date, slot: string) => {
        setBookingDetails({
            date,
            slot,
            guide: "Sarah Chen",
            cost: 50,
            title: "Recursion Explained Simply"
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
                                <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-bold uppercase tracking-[0.2em]">
                                    Protocol Sync {id && <span className="text-zinc-600 ml-1">#{id}</span>}
                                </span>
                                <div className="flex items-center gap-1.5 text-zinc-400 text-xs font-bold uppercase tracking-widest">
                                    <Star size={12} fill="currentColor" className="text-indigo-500" /> 4.9 <span className="text-zinc-600">Secure Rating</span>
                                </div>
                            </motion.div>

                            <h1 className="text-5xl md:text-7xl font-display font-bold mb-8 leading-[1.1] tracking-tight text-white">
                                Recursion <br />
                                <span className="text-indigo-500">
                                    Explained Simply
                                </span>
                            </h1>

                            <p className="text-xl text-zinc-500 leading-relaxed max-w-2xl font-medium">
                                Technical mental models for recursive logic. Peer-to-peer synchronization focused on deep comprehension and protocol mastery.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-8 py-8 border-y border-zinc-800">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-center text-indigo-500 shadow-sm">
                                    <Clock size={20} />
                                </div>
                                <div>
                                    <div className="text-[10px] text-zinc-600 uppercase font-bold tracking-widest mb-0.5">Time Frame</div>
                                    <div className="font-bold text-white uppercase text-sm">30 Minutes</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-center text-white shadow-sm">
                                    <Zap size={20} />
                                </div>
                                <div>
                                    <div className="text-[10px] text-zinc-600 uppercase font-bold tracking-widest mb-0.5">Protocol Cost</div>
                                    <div className="font-bold text-white uppercase text-sm">75 Credits</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-center text-indigo-400 shadow-sm">
                                    <ShieldCheck size={20} />
                                </div>
                                <div>
                                    <div className="text-[10px] text-zinc-600 uppercase font-bold tracking-widest mb-0.5">Available</div>
                                    <div className="font-bold text-indigo-500 uppercase text-sm">Next 24h</div>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <GlowButton onClick={() => setIsBookingOpen(true)} variant="purple" size="lg" className="px-10">
                                Initialize Sync
                            </GlowButton>
                            <GlowButton variant="glass" size="lg" className="px-8 flex items-center gap-2">
                                <MessageSquare size={18} /> Contact Guide
                            </GlowButton>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-4"
                    >
                        <GlassCard className="p-8 sticky top-32 bg-zinc-900 border-zinc-800" hover={false}>
                            <div className="text-center mb-8">
                                <div className="w-24 h-24 mx-auto rounded-xl p-0.5 mb-6 ring-1 ring-zinc-800 bg-zinc-800/50">
                                    <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center overflow-hidden">
                                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" alt="Sarah Chen" className="w-full h-full object-cover" />
                                    </div>
                                </div>
                                <h3 className="text-2xl font-display font-bold text-white tracking-tight">Sarah Chen</h3>
                                <p className="text-indigo-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">Authenticated Concept Guide</p>
                            </div>

                            <div className="space-y-6 text-sm">
                                <p className="text-zinc-500 leading-relaxed text-center font-medium">
                                    "Specializing in visual mental models for complex CS logic. Protocol focus: deep understanding over rote syntax."
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

                                <GlowButton variant="glass" fullWidth size="sm" className="mt-4">
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
                            <h2 className="text-2xl font-display font-bold flex items-center gap-4 text-white">
                                <Target className="text-indigo-500" size={24} /> Learning Objectives
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { title: "The Call Stack", desc: "Visualize how the computer tracks nested function calls." },
                                    { title: "Base Case Logic", desc: "Designing stop conditions to prevent infinite loops." },
                                    { title: "Recursive Thinking", desc: "Breaking problems into smaller, identical sub-problems." },
                                    { title: "Visual Tracing", desc: "Learn to trace recursive flows without getting lost." }
                                ].map((item, i) => (
                                    <GlassCard key={i} className="p-6 bg-zinc-900 border-zinc-800" hover={true}>
                                        <h4 className="font-bold text-white mb-2 uppercase text-xs tracking-widest">{item.title}</h4>
                                        <p className="text-sm text-zinc-500 font-medium leading-relaxed">{item.desc}</p>
                                    </GlassCard>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-8">
                            <h2 className="text-2xl font-display font-bold flex items-center gap-4 text-white">
                                <BookOpen className="text-indigo-400" size={24} /> Protocol Requirements
                            </h2>
                            <GlassCard className="p-8 bg-zinc-900 border-zinc-800" hover={false}>
                                <ul className="space-y-4">
                                    {[
                                        "Basic understanding of functions and variables",
                                        "Familiarity with any programming language (JS, Python, etc.)",
                                        "A desire for mental clarity over rote memorization"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-start gap-4 text-zinc-400 font-medium">
                                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shadow-[0_0_8px_rgba(99,102,241,0.3)]" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </GlassCard>
                        </div>
                    </div>
                </section>
            </main>

            {/* Booking Side Panel / Modal */}
            <AnimatePresence>
                {isBookingOpen && (
                    <div className="fixed inset-0 z-50 flex justify-end">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsBookingOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: "spring", damping: 30, stiffness: 200 }}
                            className="relative w-full max-w-2xl h-full bg-background border-l border-white/10 p-8 md:p-12 overflow-y-auto"
                        >
                            <div className="mb-12">
                                <h2 className="text-4xl font-display font-bold mb-2">Select Sync Slot</h2>
                                <p className="text-white/40">Synchronize your timeline with Sarah Chen's clarity.</p>
                            </div>

                            <InteractiveCalendar onSelectSlot={handleSelectSlot} />

                            {/* Confirm Selection Area */}
                            <AnimatePresence>
                                {bookingDetails && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 30 }}
                                        className="mt-12 pt-8 border-t border-white/5"
                                    >
                                        <BookingConfirmModal
                                            isOpen={isBookingOpen}
                                            onClose={() => setIsBookingOpen(false)}
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
