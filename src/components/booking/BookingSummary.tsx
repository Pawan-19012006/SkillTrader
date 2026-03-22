import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, ChevronRight, Sparkles } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import GlowButton from '../ui/GlowButton';
import { useAnimateCounter } from '../../hooks/useAnimateCounter';
import { cn } from '../../utils/cn';

interface BookingSummaryProps {
    selectedDate: number | null;
    selectedTime: string | null;
    cost: number;
    guide: {
        name: string;
        avatar: string;
        sessions: number;
    };
    onConfirm: () => void;
    isProcessing?: boolean;
}

const BookingSummary = ({ selectedDate, selectedTime, cost, guide, onConfirm, isProcessing }: BookingSummaryProps) => {
    const animatedCost = useAnimateCounter(cost);

    return (
        <GlassCard className="p-8 sticky top-28 bg-white/[0.02] border-white/5" hover={false}>
            <div className="space-y-8">
                <div>
                    <h3 className="text-xl font-display font-bold mb-2 flex items-center gap-3">
                        <Sparkles className="text-primary-purple" size={20} /> Sync Overview
                    </h3>
                    <p className="text-sm text-white/30 font-medium">Review your concept parameters before initializing.</p>
                </div>

                <div className="space-y-4">
                    {/* Animated Selection Display */}
                    <div className="grid grid-cols-1 gap-4">
                        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 relative overflow-hidden group">
                            <div className="text-[10px] text-white/20 uppercase font-black tracking-widest mb-3 flex items-center gap-2">
                                <Calendar size={12} /> Sync Date
                            </div>
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={selectedDate || 'empty'}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    className="text-lg font-bold"
                                >
                                    {selectedDate ? `February ${selectedDate}, 2026` : 'Select a date'}
                                </motion.div>
                            </AnimatePresence>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Calendar size={40} />
                            </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 relative overflow-hidden group">
                            <div className="text-[10px] text-white/20 uppercase font-black tracking-widest mb-3 flex items-center gap-2">
                                <Clock size={12} /> Sync Time
                            </div>
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={selectedTime || 'empty'}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    className="text-lg font-bold text-primary-blue"
                                >
                                    {selectedTime || 'Pending selection'}
                                </motion.div>
                            </AnimatePresence>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Clock size={40} />
                            </div>
                        </div>
                    </div>

                    {/* Instructor Detail */}
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                        <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 overflow-hidden relative group">
                            <img src={guide.avatar} alt={guide.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div>
                            <div className="text-[10px] text-white/20 uppercase font-black tracking-widest">Concept Guide</div>
                            <div className="font-bold text-sm tracking-tight">{guide.name}</div>
                            <div className="text-[10px] text-primary-teal font-bold">{guide.sessions}+ Concepts Explained</div>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 space-y-6">
                    <div className="flex justify-between items-end">
                        <div>
                            <div className="text-[10px] text-white/20 uppercase font-black tracking-widest mb-1">Knowledge Units</div>
                            <div className="flex items-baseline gap-2">
                                <div className="text-4xl font-display font-bold tracking-tighter text-white">
                                    <motion.span>{animatedCost}</motion.span>
                                </div>
                                <span className="text-sm font-bold text-primary-purple tracking-widest">CR</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-[10px] text-white/20 uppercase font-black tracking-widest mb-1">Duration</div>
                            <div className="font-bold">30m Concept Sync</div>
                        </div>
                    </div>

                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <GlowButton
                            onClick={onConfirm}
                            variant="purple"
                            fullWidth
                            size="lg"
                            disabled={!selectedDate || !selectedTime || isProcessing}
                            className={cn(
                                "py-6 text-base tracking-tighter font-bold shadow-glow-purple group",
                                (!selectedDate || !selectedTime) && "opacity-50 grayscale"
                            )}
                        >
                            <span className="flex items-center gap-2">
                                {isProcessing ? 'Initializing Sync...' : 'Initialize Concept Sync'}
                                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </span>
                        </GlowButton>
                    </motion.div>

                    <div className="text-center">
                        <p className="text-[10px] text-white/20 font-medium">Timezone: UTC +05:30 (India Standard Time)</p>
                    </div>
                </div>
            </div>
        </GlassCard>
    );
};

export default BookingSummary;
