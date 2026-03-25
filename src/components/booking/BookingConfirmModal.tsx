import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Clock,
    User,
    Wallet,
    CheckCircle2,
    Shield,
    Video,
    X,
    Sparkles
} from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import GlowButton from '../ui/GlowButton';
import { useAnimateCounter } from '../../hooks/useAnimateCounter';
import { fireConfetti } from '../ui/Confetti';

import { db } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp, getDoc, doc } from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';

interface BookingConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    bookingDetails: {
        date: Date;
        slot: string;
        guide: string;
        cost: number;
        title: string;
        sessionId: string;
    } | null;
}

const BookingConfirmModal = ({ isOpen, onClose, bookingDetails }: BookingConfirmModalProps) => {
    const [step, setStep] = useState<'confirm' | 'deducting' | 'success'>('confirm');
    const [currentBalance, setCurrentBalance] = useState(1250);
    const [meetLink, setMeetLink] = useState<string | null>(null);
    const animatedBalance = useAnimateCounter(currentBalance);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const { user } = useAuth();

    const handleConfirm = async () => {
        if (!bookingDetails || !user) return;
        
        setStep('deducting');

        try {
            // Create the booking record in Firestore
            const bookingData = {
                userId: user.uid,
                userEmail: user.email,
                sessionId: bookingDetails.sessionId,
                sessionTitle: bookingDetails.title,
                guideName: bookingDetails.guide,
                selectedTime: bookingDetails.date.toISOString(),
                selectedSlot: bookingDetails.slot,
                status: 'confirmed',
                creditsSpent: bookingDetails.cost,
                createdAt: serverTimestamp()
            };

            const docRef = await addDoc(collection(db, 'bookings'), bookingData);

            if (docRef.id) {
                // Fetch the meetLink from the session doc
                const sessionRef = doc(db, 'sessions', bookingDetails.sessionId);
                const sessionSnap = await getDoc(sessionRef);
                
                if (sessionSnap.exists()) {
                    setMeetLink(sessionSnap.data().meetLink);
                }
                
                setTimeout(() => {
                    setCurrentBalance(prev => prev - (bookingDetails.cost || 0));
                    setTimeout(() => {
                        setStep('success');
                        fireConfetti();
                    }, 1000);
                }, 500);
            }
        } catch (error) {
            console.error('Booking error:', error);
            alert('Booking protocol failed. Please re-verify connection.');
            setStep('confirm');
        }
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
                            className="absolute top-8 right-8 p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-white transition-all shadow-sm"
                        >
                            <X size={18} />
                        </button>

                        {step === 'confirm' && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-12"
                            >
                                <div>
                                    <h2 className="text-3xl font-display font-bold mb-2 text-white">Initialize Sync</h2>
                                    <p className="text-zinc-500 font-medium tracking-tight">Verify protocol parameters before execution.</p>
                                </div>

                                <div className="space-y-6">
                                    <GlassCard className="p-6 bg-zinc-900 border-zinc-800 rounded-none border-l-2 border-indigo-500" hover={false}>
                                        <div className="flex items-center gap-6">
                                            <div className="w-16 h-16 bg-zinc-950 rounded-none flex flex-col items-center justify-center border border-zinc-800">
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">{months[bookingDetails.date.getMonth()]}</span>
                                                <span className="text-2xl font-display font-bold text-white">{bookingDetails.date.getDate()}</span>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-lg text-white uppercase tracking-tighter italic">{bookingDetails.title}</h4>
                                                <div className="flex items-center gap-2 text-zinc-500 text-xs mt-1 font-bold uppercase tracking-widest">
                                                    <User size={12} className="text-indigo-500" /> {bookingDetails.guide}
                                                </div>
                                            </div>
                                        </div>
                                    </GlassCard>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-5 rounded-none bg-zinc-900 border border-zinc-800 shadow-sm transition-colors hover:border-zinc-700">
                                            <div className="text-[10px] text-zinc-600 uppercase font-bold tracking-widest mb-2 flex items-center gap-2">
                                                <Clock size={12} className="text-indigo-500" /> Time Slot
                                            </div>
                                            <div className="font-bold text-white text-xs uppercase tracking-tight">{bookingDetails.slot}</div>
                                        </div>
                                        <div className="p-5 rounded-none bg-zinc-900 border border-zinc-800 shadow-sm transition-colors hover:border-zinc-700">
                                            <div className="text-[10px] text-zinc-600 uppercase font-bold tracking-widest mb-2 flex items-center gap-2">
                                                <Wallet size={12} className="text-zinc-400" /> Protocol Cost
                                            </div>
                                            <div className="font-bold text-indigo-500 text-xs uppercase tracking-tight">{bookingDetails.cost} CR</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6 pt-12 border-t border-zinc-800">
                                    <div className="flex justify-between items-center px-2">
                                        <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Current Balance</span>
                                        <span className="font-bold text-white">1,250 CR</span>
                                    </div>
                                    <div className="flex justify-between items-center px-2">
                                        <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Execution Result</span>
                                        <span className="font-bold text-indigo-500">{1250 - bookingDetails.cost} CR</span>
                                    </div>
                                    <GlowButton onClick={handleConfirm} variant="purple" fullWidth size="lg" className="py-5 group">
                                        Execute Sync <Sparkles size={18} className="ml-2 group-hover:rotate-12 transition-transform" />
                                    </GlowButton>
                                </div>
                            </motion.div>
                        )}

                        {(step === 'deducting' || step === 'success') && (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-12">
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="relative"
                                >
                                    <AnimatePresence mode="wait">
                                        {step === 'deducting' ? (
                                            <motion.div
                                                key="loading"
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                                className="w-32 h-32 rounded-full border-2 border-dashed border-indigo-500/20"
                                            />
                                        ) : (
                                            <motion.div
                                                key="success"
                                                initial={{ scale: 0, rotate: -45 }}
                                                animate={{ scale: 1, rotate: 0 }}
                                                transition={{ type: "spring", bounce: 0.5 }}
                                                className="w-32 h-32 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-[0_0_40px_rgba(79,70,229,0.3)]"
                                            >
                                                <CheckCircle2 size={64} />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {step === 'deducting' && (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                                            <motion.span className="text-2xl font-display font-bold">
                                                {animatedBalance}
                                            </motion.span>
                                        </div>
                                    )}
                                </motion.div>

                                <div className="space-y-4 max-w-sm">
                                    <h2 className="text-4xl font-display font-bold text-white">
                                        {step === 'deducting' ? 'Synchronizing...' : 'Protocol Active'}
                                    </h2>
                                    <p className="text-zinc-500 font-medium leading-relaxed px-4">
                                        {step === 'deducting'
                                            ? 'Initializing secure peer-to-peer data channels. Please maintain connection.'
                                            : 'Your concept sync has been established. Secure access protocols are now active.'}
                                    </p>
                                </div>

                                {step === 'success' && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 }}
                                        className="w-full space-y-6 pt-12"
                                    >
                                        <div className="p-6 text-left bg-zinc-900 border border-indigo-500/20 rounded-xl relative overflow-hidden">
                                            <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400 mb-4">
                                                <Video size={14} /> Encrypted Meeting Link
                                            </div>
                                            <div className="bg-zinc-950 p-4 rounded-lg text-indigo-300 text-sm font-mono break-all border border-zinc-800 select-all">
                                                {meetLink || 'Processing...'}
                                            </div>
                                            <div className="mt-4 text-[9px] text-zinc-600 uppercase tracking-widest font-bold flex items-center gap-2">
                                                <Shield size={10} /> Secure end-to-end channel
                                            </div>
                                        </div>

                                        <div className="flex gap-4">
                                            <GlowButton variant="glass" fullWidth size="lg">
                                                Sync Details
                                            </GlowButton>
                                            <GlowButton onClick={onClose} variant="purple" fullWidth size="lg">
                                                Dashboard
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
