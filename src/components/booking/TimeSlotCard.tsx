import { motion } from 'framer-motion';
import { Clock, CheckCircle2 } from 'lucide-react';
import { cn } from '../../utils/cn';

interface TimeSlotCardProps {
    time: string;
    duration: string;
    isAvailable: boolean;
    isSelected: boolean;
    onClick: () => void;
}

const TimeSlotCard = ({ time, duration, isAvailable, isSelected, onClick }: TimeSlotCardProps) => {
    return (
        <motion.button
            whileHover={isAvailable ? { scale: 1.02, y: -2 } : {}}
            whileTap={isAvailable ? { scale: 0.98 } : {}}
            onClick={() => isAvailable && onClick()}
            disabled={!isAvailable}
            className={cn(
                "relative w-full p-4 rounded-2xl border transition-all duration-300 text-left group overflow-hidden",
                "bg-white/[0.03] backdrop-blur-md border-white/10",
                isAvailable ? "cursor-pointer hover:border-primary-blue/50 hover:bg-white/[0.05]" : "opacity-40 cursor-not-allowed",
                isSelected && "border-primary-blue bg-primary-blue/10 shadow-[0_0_20px_rgba(0,212,255,0.2)]"
            )}
        >
            {/* Background Glow */}
            <AnimatePresence>
                {isSelected && (
                    <motion.div
                        layoutId="slotGlow"
                        className="absolute inset-0 bg-primary-blue/5 pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />
                )}
            </AnimatePresence>

            <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-4">
                    <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                        isSelected ? "bg-primary-blue text-white" : "bg-white/5 text-white/40 group-hover:text-primary-blue"
                    )}>
                        <Clock size={20} />
                    </div>
                    <div>
                        <div className="text-lg font-bold tracking-tight">{time}</div>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] uppercase font-black tracking-widest text-white/20">Sync Time</span>
                            <span className="px-1.5 py-0.5 rounded-md bg-white/5 text-[10px] font-bold text-white/40">{duration}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {isAvailable && (
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-primary-teal/10 border border-primary-teal/20">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary-teal animate-pulse" />
                            <span className="text-[10px] font-black text-primary-teal uppercase">Active</span>
                        </div>
                    )}

                    <AnimatePresence mode="wait">
                        {isSelected ? (
                            <motion.div
                                initial={{ scale: 0, rotate: -45 }}
                                animate={{ scale: 1, rotate: 0 }}
                                exit={{ scale: 0, rotate: 45 }}
                                className="text-primary-blue"
                            >
                                <CheckCircle2 size={24} fill="currentColor" fillOpacity={0.1} />
                            </motion.div>
                        ) : (
                            <div className="w-6 h-6 rounded-full border border-white/10 group-hover:border-primary-blue/30 transition-colors" />
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Selected Pulse Effect */}
            {isSelected && (
                <motion.div
                    animate={{
                        boxShadow: [
                            "inset 0 0 0px rgba(0,212,255,0)",
                            "inset 0 0 15px rgba(0,212,255,0.2)",
                            "inset 0 0 0px rgba(0,212,255,0)"
                        ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 rounded-2xl pointer-events-none"
                />
            )}
        </motion.button>
    );
};

// Internal Import for AnimatePresence to avoid missing component
import { AnimatePresence } from 'framer-motion';

export default TimeSlotCard;
