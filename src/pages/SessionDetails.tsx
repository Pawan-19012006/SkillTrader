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

            <main className="pt-28 pb-20 px-6 max-w-7xl mx-auto">
                <Link to="/explore" className="inline-flex items-center gap-2 text-white/40 hover:text-white mb-12 transition-colors group">
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back to Concept Marketplace
                </Link>

                {/* Hero Section */}
                <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-8 space-y-8"
                    >
                        <div>
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="flex items-center gap-3 mb-6"
                            >
                                <span className="px-3 py-1 rounded-full bg-primary-purple/20 text-primary-purple border border-primary-purple/30 text-[10px] font-bold uppercase tracking-[0.2em]">
                                    Quick Concept Sync {id && <span className="text-white/20 ml-1">#{id}</span>}
                                </span>
                                <div className="flex items-center gap-1 text-primary-teal text-sm font-bold">
                                    <Star size={14} fill="currentColor" /> 4.9 (128 Reviews)
                                </div>
                            </motion.div>

                            <h1 className="text-5xl md:text-7xl font-display font-bold mb-8 leading-tight">
                                Recursion <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-blue to-primary-teal">
                                    Explained Simply
                                </span>
                            </h1>

                            <p className="text-xl text-white/60 leading-relaxed max-w-2xl font-light">
                                Understand how functions call themselves through elegant, mental-model driven explanations. Like a friend helping you before an exam.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-8 py-8 border-y border-white/5">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-primary-purple">
                                    <Clock size={24} />
                                </div>
                                <div>
                                    <div className="text-[10px] text-white/30 uppercase font-black tracking-widest">Duration</div>
                                    <div className="font-bold">30 Minutes</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-primary-blue">
                                    <Zap size={24} />
                                </div>
                                <div>
                                    <div className="text-[10px] text-white/30 uppercase font-black tracking-widest">Cost</div>
                                    <div className="font-bold">75 Credits</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-primary-teal">
                                    <ShieldCheck size={24} />
                                </div>
                                <div>
                                    <div className="text-[10px] text-white/30 uppercase font-black tracking-widest">Available</div>
                                    <div className="font-bold underline decoration-primary-teal/30">Next: Tomorrow</div>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <GlowButton onClick={() => setIsBookingOpen(true)} variant="purple" size="lg" className="px-12 py-5 text-lg shadow-glow-purple">
                                Book Concept Sync
                            </GlowButton>
                            <GlowButton variant="glass" size="lg" className="px-8 flex items-center gap-2">
                                <MessageSquare size={18} /> Chat with Concept Guide
                            </GlowButton>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-4"
                    >
                        <GlassCard className="p-8 sticky top-32" hover={false}>
                            <div className="text-center mb-8">
                                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary-purple to-primary-blue rounded-3xl p-0.5 mb-6 rotate-3">
                                    <div className="w-full h-full bg-background rounded-[22px] flex items-center justify-center overflow-hidden">
                                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" alt="Sarah Chen" className="w-full h-full object-cover" />
                                    </div>
                                </div>
                                <h3 className="text-2xl font-display font-bold">Sarah Chen</h3>
                                <p className="text-primary-teal text-sm font-bold uppercase tracking-widest mt-1">Master Concept Guide</p>
                            </div>

                            <div className="space-y-6 text-sm">
                                <p className="text-white/50 leading-relaxed text-center italic">
                                    "I specialize in breaking down complex CS concepts into simple, visual mental models. I help you understand the 'why' before the 'how'."
                                </p>

                                <div className="pt-6 border-t border-white/5 space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-white/30 uppercase text-[10px] font-bold">Sessions</span>
                                        <span className="font-bold">1,240+</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-white/30 uppercase text-[10px] font-bold">Students</span>
                                        <span className="font-bold">500+</span>
                                    </div>
                                </div>

                                <GlowButton variant="glass" fullWidth size="sm" className="mt-4">
                                    View Full Profile
                                </GlowButton>
                            </div>
                        </GlassCard>
                    </motion.div>
                </section>

                {/* Content Tabs / Info */}
                <section className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-8 space-y-16">
                        <div className="space-y-8">
                            <h2 className="text-3xl font-display font-bold flex items-center gap-4">
                                <Target className="text-primary-purple" /> What You Will Understand
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { title: "The Call Stack", desc: "Visualize how the computer tracks nested function calls." },
                                    { title: "Base Case Logic", desc: "Designing stop conditions to prevent infinite loops." },
                                    { title: "Recursive Thinking", desc: "Breaking problems into smaller, identical sub-problems." },
                                    { title: "Visual Tracing", desc: "Learn to trace recursive flows without getting lost." }
                                ].map((item, i) => (
                                    <GlassCard key={i} className="p-6 bg-white/[0.02]" hover={true}>
                                        <h4 className="font-bold text-primary-teal mb-2">{item.title}</h4>
                                        <p className="text-sm text-white/50 leading-relaxed">{item.desc}</p>
                                    </GlassCard>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-8">
                            <h2 className="text-3xl font-display font-bold flex items-center gap-4">
                                <BookOpen className="text-primary-blue" /> Prerequisites
                            </h2>
                            <GlassCard className="p-8" hover={false}>
                                <ul className="space-y-4">
                                    {[
                                        "Basic understanding of functions and variables",
                                        "Familiarity with any programming language (JS, Python, etc.)",
                                        "A desire for mental clarity over rote memorization"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-start gap-4 text-white/60">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary-blue mt-2 shadow-[0_0_8px_rgba(0,212,255,1)]" />
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
