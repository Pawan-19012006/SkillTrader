import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { cn } from '../../utils/cn';

interface InteractiveCalendarProps {
    onSelectSlot: (date: Date, slot: string) => void;
}

const InteractiveCalendar = ({ onSelectSlot }: InteractiveCalendarProps) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<number | null>(null);
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const daysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
    const startDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay();

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
        setSelectedDate(null);
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
        setSelectedDate(null);
    };

    const timeSlots = ["09:00 AM", "11:30 AM", "02:00 PM", "04:30 PM", "07:00 PM"];

    return (
        <div className="w-full space-y-8">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-display font-bold">
                    {months[currentDate.getMonth()]} <span className="text-white/20">{currentDate.getFullYear()}</span>
                </h3>
                <div className="flex gap-2">
                    <button onClick={handlePrevMonth} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                        <ChevronLeft size={20} />
                    </button>
                    <button onClick={handleNextMonth} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Calendar Grid */}
                <div className="space-y-4">
                    <div className="grid grid-cols-7 gap-2">
                        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(day => (
                            <div key={day} className="text-[10px] uppercase font-black text-white/20 text-center py-2">
                                {day}
                            </div>
                        ))}
                        {Array.from({ length: startDayOfMonth(currentDate.getMonth(), currentDate.getFullYear()) }).map((_, i) => (
                            <div key={`empty-${i}`} />
                        ))}
                        {Array.from({ length: daysInMonth(currentDate.getMonth(), currentDate.getFullYear()) }).map((_, i) => {
                            const day = i + 1;
                            const isSelected = selectedDate === day;
                            const isToday = new Date().getDate() === day && new Date().getMonth() === currentDate.getMonth();
                            const isAvailable = day % 3 !== 0; // Mock availability logic

                            return (
                                <motion.button
                                    key={day}
                                    whileHover={isAvailable ? { scale: 1.1 } : {}}
                                    whileTap={isAvailable ? { scale: 0.95 } : {}}
                                    onClick={() => isAvailable && setSelectedDate(day)}
                                    disabled={!isAvailable}
                                    className={cn(
                                        "aspect-square rounded-xl flex items-center justify-center text-sm font-bold transition-all relative group",
                                        isSelected ? "bg-primary-purple text-white shadow-glow-purple" : "bg-white/5 hover:bg-white/10",
                                        isToday && !isSelected && "border border-primary-teal text-primary-teal",
                                        !isAvailable && "opacity-10 cursor-not-allowed grayscale"
                                    )}
                                >
                                    {day}
                                    {isAvailable && !isSelected && (
                                        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary-teal opacity-40 group-hover:opacity-100 transition-opacity" />
                                    )}
                                </motion.button>
                            );
                        })}
                    </div>
                </div>

                {/* Time Slots */}
                <AnimatePresence mode="wait">
                    {selectedDate ? (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <h4 className="text-sm font-black uppercase tracking-widest text-white/30 flex items-center gap-2">
                                <Clock size={14} /> Available Times
                            </h4>
                            <div className="grid grid-cols-1 gap-3">
                                {timeSlots.map(slot => (
                                    <motion.button
                                        key={slot}
                                        whileHover={{ x: 10 }}
                                        onClick={() => {
                                            setSelectedSlot(slot);
                                            onSelectSlot(new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDate), slot);
                                        }}
                                        className={cn(
                                            "w-full p-4 rounded-2xl border transition-all text-left flex items-center justify-between group",
                                            selectedSlot === slot
                                                ? "bg-primary-blue/20 border-primary-blue text-white shadow-[0_0_20px_rgba(0,212,255,0.2)]"
                                                : "bg-white/5 border-white/5 text-white/60 hover:border-white/20"
                                        )}
                                    >
                                        <span className="font-bold">{slot}</span>
                                        <ChevronRight size={18} className={cn(
                                            "transition-all",
                                            selectedSlot === slot ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                                        )} />
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        <div className="flex items-center justify-center h-full border border-dashed border-white/5 rounded-3xl p-8 text-center bg-white/[0.01]">
                            <p className="text-white/20 text-sm font-medium italic">
                                Select a date from the calendar <br /> to view available time slots.
                            </p>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default InteractiveCalendar;
