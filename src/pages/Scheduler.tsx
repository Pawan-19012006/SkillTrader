import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, CheckCircle2, Globe, MapPin } from 'lucide-react';
import Navbar from '../components/ui/Navbar';
import GlassCard from '../components/ui/GlassCard';
import AnimatedBackground from '../components/ui/AnimatedBackground';
import TimeSlotCard from '../components/booking/TimeSlotCard';
import BookingSummary from '../components/booking/BookingSummary';
import { cn } from '../utils/cn';

const Scheduler = () => {
    const [selectedDate, setSelectedDate] = useState<number | null>(1);
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [monthOffset, setMonthOffset] = useState(0);

    const days = Array.from({ length: 28 }, (_, i) => i + 1);
    const slots = [
        { time: "09:00 AM", duration: "45m", available: true },
        { time: "10:30 AM", duration: "45m", available: true },
        { time: "01:00 PM", duration: "45m", available: false },
        { time: "02:30 PM", duration: "45m", available: true },
        { time: "04:00 PM", duration: "45m", available: true },
        { time: "05:30 PM", duration: "45m", available: true }
    ];

    const guide = {
        name: "Sarah Chen",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
        sessions: 156
    };

    const handleBook = () => {
        if (selectedDate && selectedSlot) {
            setIsSuccess(true);
            setTimeout(() => setIsSuccess(false), 5000);
        }
    };

    return (
        <div className="relative min-h-screen bg-background overflow-hidden">
            <AnimatedBackground />

            {/* Grid Overlay for Depth */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03]"
                style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />

            <Navbar />

            <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto relative z-10 text-zinc-100">
                <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
                                Protocol Synchronization
                            </div>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-display font-bold tracking-tight text-white">
                            Sync <span className="text-indigo-500 text-glow">Protocol</span>
                        </h1>
                        <p className="text-zinc-500 mt-4 text-lg max-w-xl font-medium leading-relaxed">
                            Initialize your secure concept synchronization window. All active guides are authenticated in your local protocol.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-6"
                    >
                        <div className="text-right">
                            <div className="text-[10px] text-zinc-600 uppercase font-bold tracking-widest mb-1 flex items-center justify-end gap-2">
                                <Globe size={12} /> Sync Local Time
                            </div>
                            <div className="text-sm font-bold text-zinc-300">11:34 PM (IST)</div>
                        </div>
                        <div className="w-px h-10 bg-zinc-800" />
                        <div className="text-right text-sm text-zinc-500">
                            <div className="flex items-center gap-2 justify-end mb-1 font-bold">
                                <MapPin size={12} /> Bengaluru, IN
                            </div>
                            <div className="font-bold text-zinc-700">UTC +05:30</div>
                        </div>
                    </motion.div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    {/* Left: Selection Column */}
                    <div className="lg:col-span-8 space-y-12">
                        {/* Calendar Section */}
                        <GlassCard className="p-10 bg-zinc-900/50 border-zinc-800 relative overflow-hidden" hover={false}>
                            <div className="flex items-center justify-between mb-10 relative z-10">
                                <div className="space-y-1">
                                    <h3 className="text-2xl font-display font-bold flex items-center gap-3 text-white">
                                        <CalendarIcon size={24} className="text-indigo-500" />
                                        February <span className="text-zinc-700">2026</span>
                                    </h3>
                                    <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest leading-relaxed">Select an authenticated sync window</p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setMonthOffset(prev => prev - 1)}
                                        className="w-10 h-10 flex items-center justify-center rounded-lg bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 transition-all text-zinc-400 hover:text-white shadow-sm"
                                    >
                                        <ChevronLeft size={18} />
                                    </button>
                                    <button
                                        onClick={() => setMonthOffset(prev => prev + 1)}
                                        className="w-10 h-10 flex items-center justify-center rounded-lg bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 transition-all text-zinc-400 hover:text-white shadow-sm"
                                    >
                                        <ChevronRight size={18} />
                                    </button>
                                </div>
                            </div>

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={monthOffset}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="grid grid-cols-7 gap-3 relative z-10"
                                >
                                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                        <div key={day} className="text-center text-[10px] uppercase tracking-[0.3em] text-zinc-600 font-bold p-4">
                                            {day}
                                        </div>
                                    ))}

                                    {/* Padding for month start */}
                                    {[...Array(6)].map((_, i) => <div key={`pad-${i}`} />)}

                                    {days.map(day => {
                                        const isSelected = selectedDate === day;
                                        const hasActiveIndicator = day % 7 === 0 || day % 11 === 0;

                                        return (
                                            <motion.button
                                                key={day}
                                                whileHover={{ y: -2 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => setSelectedDate(day)}
                                                className={cn(
                                                    "h-14 flex flex-col items-center justify-center rounded-lg text-sm font-bold transition-all relative group overflow-hidden border shadow-sm",
                                                    isSelected
                                                        ? "bg-indigo-600/20 border-indigo-500 text-white"
                                                        : "bg-zinc-800/50 border-zinc-700 text-zinc-500 hover:border-zinc-500 hover:text-white"
                                                )}
                                            >
                                                <span className="relative z-10">{day}</span>
                                                {hasActiveIndicator && !isSelected && (
                                                    <div className="absolute bottom-2 w-1 h-1 bg-indigo-500 rounded-full opacity-40 group-hover:opacity-100 transition-opacity" />
                                                )}
                                                {isSelected && (
                                                    <motion.div
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        className="absolute bottom-2 w-1.5 h-1.5 bg-indigo-500 rounded-full z-10 shadow-[0_0_8px_rgba(99,102,241,0.5)]"
                                                    />
                                                )}
                                            </motion.button>
                                        );
                                    })}
                                </motion.div>
                            </AnimatePresence>
                        </GlassCard>

                        {/* Slots Section */}
                        <div className="space-y-8">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <h4 className="text-xl font-display font-bold flex items-center gap-3 text-white">
                                        <Clock size={22} className="text-indigo-500" />
                                        Sync Window Slots
                                    </h4>
                                    <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest leading-relaxed">Available authenticated protocols</p>
                                </div>
                                <div className="flex items-center gap-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-indigo-500" /> Authentic
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {slots.map((slot) => (
                                    <TimeSlotCard
                                        key={slot.time}
                                        time={slot.time}
                                        duration={slot.duration}
                                        isAvailable={slot.available}
                                        isSelected={selectedSlot === slot.time}
                                        onClick={() => setSelectedSlot(slot.time)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Summary Column */}
                    <div className="lg:col-span-4 relative">
                        <BookingSummary
                            selectedDate={selectedDate}
                            selectedTime={selectedSlot}
                            cost={50}
                            guide={guide}
                            onConfirm={handleBook}
                        />

                        {/* Success Notification */}
                        <AnimatePresence>
                            {isSuccess && (
                                <motion.div
                                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                                    className="fixed bottom-10 right-10 z-[100]"
                                >
                                    <GlassCard className="bg-primary-teal/20 border-primary-teal/50 text-white p-6 shadow-glow-teal flex items-center gap-4" hover={false}>
                                        <div className="w-12 h-12 rounded-2xl bg-primary-teal text-white flex items-center justify-center">
                                            <CheckCircle2 size={28} />
                                        </div>
                                        <div>
                                            <div className="font-bold text-lg">Sync Initialized</div>
                                            <div className="text-sm text-white/60">Your concept session has been synchronized.</div>
                                        </div>
                                    </GlassCard>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Scheduler;
