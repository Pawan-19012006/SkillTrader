import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Zap, Info, Tag } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import GlowButton from '../ui/GlowButton';

interface PostRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const PostRequestModal = ({ isOpen, onClose }: PostRequestModalProps) => {
    const { user } = useAuth();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState('');
    const [budget, setBudget] = useState(30);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || isSubmitting) return;

        setIsSubmitting(true);
        try {
            const tagsArray = tags.split(',').map(tag => tag.trim().toUpperCase()).filter(tag => tag !== '');
            
            await addDoc(collection(db, 'requests'), {
                title,
                description,
                tags: tagsArray,
                budget: Number(budget),
                createdBy: user.uid,
                creatorName: user.displayName || user.email?.split('@')[0],
                status: 'open',
                acceptedBy: null,
                createdAt: serverTimestamp()
            });

            onClose();
            setTitle('');
            setDescription('');
            setTags('');
            setBudget(30);
        } catch (error) {
            console.error('Error posting request:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="w-full max-w-xl"
                    >
                        <div className="p-1 w-full bg-zinc-950 border border-zinc-800 rounded-none shadow-2xl">
                            <form onSubmit={handleSubmit} className="p-8 space-y-8">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-indigo-600/20 border border-indigo-500/30 rounded-lg flex items-center justify-center text-indigo-500">
                                            <Send size={20} />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-display font-bold text-white uppercase tracking-tight">Post Request</h2>
                                            <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Ask for help from the community</p>
                                        </div>
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={onClose}
                                        className="p-2 text-zinc-600 hover:text-white transition-colors"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                            Request Title
                                        </label>
                                        <input 
                                            required
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            placeholder="EX: EXPLAIN RECURSION SIMPLY"
                                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-sm font-bold text-white placeholder:text-zinc-800 focus:outline-none focus:border-indigo-500/50 transition-all uppercase tracking-tight"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Detailed Description</label>
                                        <textarea 
                                            required
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            placeholder="DESCRIBE YOUR DOUBT OR THE CONCEPT YOU WISH TO MASTER..."
                                            rows={4}
                                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-sm font-medium text-white placeholder:text-zinc-800 focus:outline-none focus:border-indigo-500/50 transition-all resize-none leading-relaxed"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                                <Tag size={12} /> Tags (Comma Separated)
                                            </label>
                                            <input 
                                                required
                                                value={tags}
                                                onChange={(e) => setTags(e.target.value)}
                                                placeholder="EX: DSA, PYTHON, WEB"
                                                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-sm font-bold text-white placeholder:text-zinc-800 focus:outline-none focus:border-indigo-500/50 transition-all uppercase tracking-tight"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                                    <Zap size={12} /> Budget (Credits)
                                                </label>
                                                <span className="text-[10px] font-black text-indigo-500">{budget} Credits</span>
                                            </div>
                                            <input 
                                                type="range"
                                                min="10"
                                                max="100"
                                                step="5"
                                                value={budget}
                                                onChange={(e) => setBudget(Number(e.target.value))}
                                                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                            />
                                            <div className="flex justify-between text-[8px] text-zinc-700 font-bold uppercase tracking-widest">
                                                <span>10 Credits</span>
                                                <span>100 Credits</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-none flex gap-4 items-start">
                                    <Info className="text-indigo-500 shrink-0" size={18} />
                                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest leading-relaxed">
                                        Posting a request will hold the credits. They will be paid to the teacher once the lesson is complete.
                                    </p>
                                </div>

                                <div className="flex gap-4">
                                    <GlowButton 
                                        type="button"
                                        onClick={onClose}
                                        variant="glass" 
                                        className="flex-grow uppercase text-[10px] font-bold"
                                    >
                                        Cancel
                                    </GlowButton>
                                    <GlowButton 
                                        type="submit"
                                        variant="purple" 
                                        className="flex-grow gap-2 h-12 uppercase text-[10px] font-bold"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>Post Request <Send size={14} /></>
                                        )}
                                    </GlowButton>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default PostRequestModal;
