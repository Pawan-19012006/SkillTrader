import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Clock,
    User,
    Wallet,
    CheckCircle2,
    Download,
    Video,
    X,
    Sparkles
} from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import GlowButton from '../ui/GlowButton';
import { useAnimateCounter } from '../../hooks/useAnimateCounter';
import { fireConfetti } from '../ui/Confetti';

interface BookingConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    bookingDetails: {
        date: Date;
        slot: string;
        instructor: string;
        cost: number;
    } | null;
}

const BookingConfirmModal = ({ isOpen, onClose, bookingDetails }: BookingConfirmModalProps) => {
    const [step, setStep] = useState<'confirm' | 'deducting' | 'success'>('confirm');
    const [currentBalance, setCurrentBalance] = useState(1250);
    const animatedBalance = useAnimateCounter(currentBalance);

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const handleConfirm = () => {
        setStep('deducting');

        // Simulate deduction animation
        setTimeout(() => {
            setCurrentBalance(prev => prev - (bookingDetails?.cost || 0));
            setTimeout(() => {
                setStep('success');
                fireConfetti();
            }, 1000);
        }, 500);
    };

    if (!bookingDetails) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex justify-end">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: "spring", damping: 30, stiffness: 200 }}
                        className="relative w-full max-w-xl h-full bg-background border-l border-white/10 p-8 md:p-12 overflow-y-auto"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-8 right-8 p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors"
                        >
                            <X size={20} />
                        </button>

                        {step === 'confirm' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-12"
                            >
                                <div>
                                    <h2 className="text-3xl font-display font-bold mb-2">Confirm Booking</h2>
                                    <p className="text-white/40">Please review your session details before initializing the protocol.</p>
                                </div>

                                <div className="space-y-6">
                                    <GlassCard className="p-6 bg-white/[0.02]" hover={false}>
                                        <div className="flex items-center gap-6">
                                            <div className="w-16 h-16 bg-white/5 rounded-2xl flex flex-col items-center justify-center border border-white/10">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-white/30">{months[bookingDetails.date.getMonth()]}</span>
                                                <span className="text-2xl font-display font-bold">{bookingDetails.date.getDate()}</span>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-lg">Advanced Framer Motion</h4>
                                                <div className="flex items-center gap-2 text-white/40 text-sm mt-1">
                                                    <User size={14} /> {bookingDetails.instructor}
                                                </div>
                                            </div>
                                        </div>
                                    </GlassCard>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                            <div className="text-[10px] text-white/30 uppercase font-black tracking-widest mb-1 flex items-center gap-2">
                                                <Clock size={12} /> Time Slot
                                            </div>
                                            <div className="font-bold">{bookingDetails.slot}</div>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                            <div className="text-[10px] text-white/30 uppercase font-black tracking-widest mb-1 flex items-center gap-2">
                                                <Wallet size={12} /> Cost
                                            </div>
                                            <div className="font-bold text-primary-blue">{bookingDetails.cost} Credits</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6 pt-12 border-t border-white/5">
                                    <div className="flex justify-between items-center px-2">
                                        <span className="text-sm font-medium text-white/40">Current Balance</span>
                                        <span className="font-display font-bold">{currentBalance}</span>
                                    </div>
                                    <div className="flex justify-between items-center px-2">
                                        <span className="text-sm font-medium text-white/40">After Booking</span>
                                        <span className="font-display font-bold text-primary-teal">{currentBalance - bookingDetails.cost}</span>
                                    </div>
                                    <GlowButton onClick={handleConfirm} variant="purple" fullWidth size="lg" className="py-5 shadow-glow-purple group">
                                        Initialze Booking <Sparkles size={18} className="ml-2 group-hover:rotate-12 transition-transform" />
                                    </GlowButton>
                                </div>
                            </motion.div>
                        )}

                        {(step === 'deducting' || step === 'success') && (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-12">
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="relative"
                                >
                                    <AnimatePresence mode="wait">
                                        {step === 'deducting' ? (
                                            <motion.div
                                                key="loading"
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                                className="w-32 h-32 rounded-full border-2 border-dashed border-primary-purple/40"
                                            />
                                        ) : (
                                            <motion.div
                                                key="success"
                                                initial={{ scale: 0, rotate: -45 }}
                                                animate={{ scale: 1, rotate: 0 }}
                                                transition={{ type: "spring", bounce: 0.5 }}
                                                className="w-32 h-32 rounded-full bg-primary-teal flex items-center justify-center text-background shadow-glow-blue"
                                            >
                                                <CheckCircle2 size={64} />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {step === 'deducting' && (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <motion.span className="text-2xl font-display font-bold">
                                                {animatedBalance}
                                            </motion.span>
                                        </div>
                                    )}
                                </motion.div>

                                <div className="space-y-4 max-w-sm">
                                    <h2 className="text-4xl font-display font-bold">
                                        {step === 'deducting' ? 'Processing...' : 'Protocol Sync Complete'}
                                    </h2>
                                    <p className="text-white/40 leading-relaxed">
                                        {step === 'deducting'
                                            ? 'Authenticating transaction and generating meeting protocols. Please stand by.'
                                            : 'Your session has been securely booked. The meeting link is now active in your dashboard.'}
                                    </p>
                                </div>

                                {step === 'success' && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 }}
                                        className="w-full space-y-4 pt-12"
                                    >
                                        <GlassCard className="p-6 text-left border-primary-teal/20" hover={false}>
                                            <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-primary-teal mb-4">
                                                <Video size={14} /> Secret Meeting Link
                                            </div>
                                            <code className="block bg-black/40 p-3 rounded-xl text-primary-blue text-sm font-mono break-all">
                                                https://meet.skillswap.protocol/arc-742-nmx
                                            </code>
                                        </GlassCard>

                                        <div className="flex gap-4">
                                            <GlowButton variant="glass" fullWidth className="gap-2">
                                                <Download size={18} /> Add to Calendar
                                            </GlowButton>
                                            <GlowButton onClick={onClose} variant="purple" fullWidth>
                                                Go to Dashboard
                                            </GlowButton>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default BookingConfirmModal;
