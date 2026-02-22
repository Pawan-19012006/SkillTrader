import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import Navbar from '../components/ui/Navbar';
import GlassCard from '../components/ui/GlassCard';
import GlowButton from '../components/ui/GlowButton';
import AnimatedBackground from '../components/ui/AnimatedBackground';
import { cn } from '../utils/cn';

const Scheduler = () => {
    const [selectedDate, setSelectedDate] = useState(1);
    const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const days = Array.from({ length: 30 }, (_, i) => i + 1);
    const slots = [
        "09:00 AM", "10:30 AM", "01:00 PM", "02:30 PM", "04:00 PM", "05:30 PM"
    ];

    const handleBook = () => {
        if (selectedSlot !== null) {
            setIsSuccess(true);
            setTimeout(() => setIsSuccess(false), 3000);
        }
    };

    return (
        <div className="relative min-h-screen">
            <AnimatedBackground />
            <Navbar />

            <main className="pt-28 pb-12 px-6 max-w-7xl mx-auto">
                <header className="mb-12">
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-4xl font-display font-bold"
                    >
                        Schedule a Session
                    </motion.h1>
                    <p className="text-white/50 mt-1">Book a micro-learning session with a master.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Calendar View */}
                    <GlassCard className="lg:col-span-2 p-8" hover={false}>
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-display font-bold flex items-center gap-2">
                                <CalendarIcon size={20} className="text-primary-purple" /> February 2026
                            </h3>
                            <div className="flex gap-2">
                                <button className="p-2 hover:bg-white/5 rounded-lg transition-colors"><ChevronLeft size={20} /></button>
                                <button className="p-2 hover:bg-white/5 rounded-lg transition-colors"><ChevronRight size={20} /></button>
                            </div>
                        </div>

                        <div className="grid grid-cols-7 gap-2">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                <div key={day} className="text-center text-[10px] uppercase tracking-widest text-white/30 font-bold p-2">
                                    {day}
                                </div>
                            ))}
                            {/* Padding for month start */}
                            {[...Array(6)].map((_, i) => <div key={`pad-${i}`} />)}
                            {days.map(day => (
                                <motion.button
                                    key={day}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => setSelectedDate(day)}
                                    className={cn(
                                        "h-12 flex items-center justify-center rounded-xl text-sm font-medium transition-all group relative overflow-hidden",
                                        selectedDate === day
                                            ? "bg-primary-purple text-white shadow-glow-purple"
                                            : "bg-white/5 border border-white/5 text-white/60 hover:border-white/20"
                                    )}
                                >
                                    {day}
                                    {day % 5 === 0 && selectedDate !== day && (
                                        <div className="absolute bottom-1 w-1 h-1 bg-primary-teal rounded-full" />
                                    )}
                                </motion.button>
                            ))}
                        </div>
                    </GlassCard>

                    {/* Slots & Selection */}
                    <div className="flex flex-col gap-6">
                        <GlassCard className="p-8">
                            <h3 className="text-xl font-display font-bold mb-6 flex items-center gap-2">
                                <Clock size={20} className="text-primary-blue" /> Available Slots
                            </h3>
                            <div className="grid grid-cols-1 gap-3">
                                {slots.map((slot, i) => (
                                    <motion.button
                                        key={i}
                                        whileHover={{ x: 5 }}
                                        onClick={() => setSelectedSlot(i)}
                                        className={cn(
                                            "p-4 rounded-xl text-left border transition-all flex items-center justify-between",
                                            selectedSlot === i
                                                ? "bg-primary-blue/10 border-primary-blue text-primary-blue"
                                                : "bg-white/5 border-white/5 text-white/60 hover:border-white/20"
                                        )}
                                    >
                                        {slot}
                                        {selectedSlot === i && <motion.div layoutId="check"><CheckCircle2 size={18} /></motion.div>}
                                    </motion.button>
                                ))}
                            </div>

                            <div className="mt-8 pt-8 border-t border-white/5">
                                <div className="flex justify-between items-center mb-6">
                                    <div className="text-white/40">Total Cost</div>
                                    <div className="text-2xl font-display font-bold">50 Credits</div>
                                </div>
                                <GlowButton
                                    variant="purple"
                                    fullWidth
                                    disabled={selectedSlot === null}
                                    onClick={handleBook}
                                >
                                    Confirm Booking
                                </GlowButton>
                            </div>
                        </GlassCard>

                        <AnimatePresence>
                            {isSuccess && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                >
                                    <GlassCard className="bg-primary-teal/10 border-primary-teal text-primary-teal text-center py-4">
                                        🎉 Session Booked Successfully!
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
