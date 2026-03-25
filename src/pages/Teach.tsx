import { useState } from 'react';
import { Clock, DollarSign, Check, AlertCircle, Plus, Trash2, Calendar } from 'lucide-react';
import Navbar from '../components/ui/Navbar';
import GlassCard from '../components/ui/GlassCard';
import GlowButton from '../components/ui/GlowButton';
import AnimatedBackground from '../components/ui/AnimatedBackground';
import { cn } from '../utils/cn';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

const Teach = () => {
    const { user } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        objectives: '',
        duration: '30',
        price: '50',
        meetLink: '',
        tags: '',
        availability: [
            { date: '', slots: [''] }
        ]
    });

    const addDate = () => {
        setFormData({
            ...formData,
            availability: [...formData.availability, { date: '', slots: [''] }]
        });
    };

    const removeDate = (index: number) => {
        const newAvailability = [...formData.availability];
        newAvailability.splice(index, 1);
        setFormData({ ...formData, availability: newAvailability });
    };

    const addSlot = (dateIndex: number) => {
        const newAvailability = [...formData.availability];
        newAvailability[dateIndex].slots.push('');
        setFormData({ ...formData, availability: newAvailability });
    };

    const removeSlot = (dateIndex: number, slotIndex: number) => {
        const newAvailability = [...formData.availability];
        newAvailability[dateIndex].slots.splice(slotIndex, 1);
        setFormData({ ...formData, availability: newAvailability });
    };

    const updateDate = (index: number, value: string) => {
        const newAvailability = [...formData.availability];
        newAvailability[index].date = value;
        setFormData({ ...formData, availability: newAvailability });
    };

    const updateSlot = (dateIndex: number, slotIndex: number, value: string) => {
        const newAvailability = [...formData.availability];
        newAvailability[dateIndex].slots[slotIndex] = value;
        setFormData({ ...formData, availability: newAvailability });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        // Validation logic
        const priceNum = parseInt(formData.price);
        if (priceNum < 1 || priceNum > 100) {
            alert('Price must be between 1 and 100 credits.');
            setIsSubmitting(false);
            return;
        }

        try {
            if (!user) {
                alert('Authorization required to broadcast protocols.');
                setIsSubmitting(false); // Ensure submitting state is reset
                return;
            }

            await addDoc(collection(db, 'sessions'), {
                ...formData,
                price: priceNum,
                duration: parseInt(formData.duration),
                creatorId: user.uid,
                creatorName: user.displayName || user.email?.split('@')[0] || 'Peer',
                isActive: true,
                createdAt: serverTimestamp(),
                objectives: formData.objectives.split(';').map(o => o.trim()).filter(o => o !== ''),
                tags: formData.tags.split(',').map(t => t.trim()).filter(t => t !== ''),
                availability: formData.availability.filter(a => a.date !== '' && a.slots.some(s => s !== ''))
            });

            setSuccess(true);
            setTimeout(() => {
                window.location.href = '/profile';
            }, 2000);
        } catch (error) {
            console.error('Error creating session:', error);
            alert('Failed to broadcast protocol. Check your connection.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (success) {
        return (
            <div className="relative min-h-screen flex items-center justify-center p-6">
                <AnimatedBackground />
                <Navbar />
                <GlassCard className="max-w-md w-full p-12 text-center bg-zinc-900 border-zinc-800 rounded-none border-t-4 border-t-indigo-600">
                    <div className="w-20 h-20 bg-indigo-600/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-indigo-500/30">
                        <Check className="text-indigo-500" size={40} />
                    </div>
                    <h2 className="text-3xl font-display font-bold mb-4 text-white uppercase italic tracking-tighter">Protocol Published</h2>
                    <p className="text-zinc-500 mb-10 font-medium uppercase tracking-tight">Your synchronization session is now live in the SkillTrader ledger.</p>
                    <GlowButton onClick={() => setSuccess(false)} variant="purple" fullWidth className="rounded-none font-bold uppercase tracking-widest text-[10px] py-4">
                        Initialize New Protocol
                    </GlowButton>
                </GlassCard>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen pt-32 pb-20 px-6">
            <AnimatedBackground />
            <Navbar />

            <div className="max-w-4xl mx-auto">
                <div className="mb-12">
                    <span className="text-indigo-500 font-bold uppercase tracking-[0.3em] text-[10px] mb-4 block">Instructional Interface</span>
                    <h1 className="text-5xl md:text-6xl font-display font-bold text-white uppercase italic tracking-tighter leading-none mb-6">
                        Define Your <span className="text-indigo-600">Sync Protocol</span>
                    </h1>
                    <p className="text-zinc-500 max-w-2xl font-medium uppercase tracking-tight">
                        Broadcast your mental models to the network. Set your parameters, define your value, and catalyze collective clarity.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-8">
                        <GlassCard className="p-8 bg-zinc-900 border-zinc-800 rounded-none" hover={false}>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 ml-1">Protocol Title</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="e.g., Recursion Fundamentals Synchronization"
                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-none py-4 px-4 text-white placeholder:text-zinc-800 focus:outline-none focus:border-indigo-500/50 transition-all font-bold uppercase tracking-tight"
                                        value={formData.title}
                                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 ml-1">Transmission Summary</label>
                                    <textarea
                                        required
                                        rows={4}
                                        placeholder="Briefly describe the mental model you will be transmitting..."
                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-none py-4 px-4 text-white placeholder:text-zinc-800 focus:outline-none focus:border-indigo-500/50 transition-all font-medium uppercase tracking-tight text-sm"
                                        value={formData.description}
                                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 ml-1">Learning Objectives (Semicolon separated)</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="e.g., Trace recursion stacks; Identify base cases"
                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-none py-4 px-4 text-white placeholder:text-zinc-800 focus:outline-none focus:border-indigo-500/50 transition-all font-medium uppercase tracking-tight text-sm"
                                        value={formData.objectives}
                                        onChange={(e) => setFormData({...formData, objectives: e.target.value})}
                                    />
                                </div>
                            </div>
                        </GlassCard>

                        <GlassCard className="p-8 bg-zinc-900 border-zinc-800 rounded-none" hover={false}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 ml-1">Categorization Tags</label>
                                    <input
                                        type="text"
                                        placeholder="e.g., Computer Science, Algorithms"
                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-none py-4 px-4 text-white placeholder:text-zinc-800 focus:outline-none focus:border-indigo-500/50 transition-all font-medium uppercase tracking-tight text-sm"
                                        value={formData.tags}
                                        onChange={(e) => setFormData({...formData, tags: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 ml-1">Secure Meeting Link</label>
                                    <input
                                        required
                                        type="url"
                                        placeholder="e.g., https://meet.google.com/abc-defg-hij"
                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-none py-4 px-4 text-white placeholder:text-zinc-800 focus:outline-none focus:border-indigo-500/50 transition-all font-medium uppercase tracking-tight text-sm"
                                        value={formData.meetLink}
                                        onChange={(e) => setFormData({...formData, meetLink: e.target.value})}
                                    />
                                </div>
                            </div>
                        </GlassCard>

                        {/* Availability Manager */}
                        <GlassCard className="p-8 bg-zinc-900 border-zinc-800 rounded-none relative overflow-hidden" hover={false}>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl -mr-16 -mt-16" />
                            
                            <div className="flex items-center justify-between mb-8 relative z-10">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-indigo-600/10 border border-indigo-500/20 rounded-none flex items-center justify-center text-indigo-500">
                                        <Calendar size={18} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-display font-bold text-white uppercase italic tracking-tighter">Availability Manager</h3>
                                        <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Define Sync Windows</p>
                                    </div>
                                </div>
                                <button 
                                    type="button"
                                    onClick={addDate}
                                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-[10px] font-bold uppercase tracking-widest text-white hover:bg-indigo-500 transition-colors"
                                >
                                    <Plus size={14} /> Add Date
                                </button>
                            </div>

                            <div className="space-y-8 relative z-10">
                                {formData.availability.map((avail, dateIdx) => (
                                    <div key={dateIdx} className="p-6 bg-zinc-950 border border-zinc-800 space-y-6">
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="flex-grow">
                                                <label className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mb-1 block">Protocol Date</label>
                                                <input 
                                                    type="date"
                                                    required
                                                    value={avail.date}
                                                    onChange={(e) => updateDate(dateIdx, e.target.value)}
                                                    className="w-full bg-zinc-900 border border-zinc-800 py-2 px-3 text-white text-xs font-bold focus:outline-none focus:border-indigo-500/50"
                                                />
                                            </div>
                                            <button 
                                                type="button"
                                                onClick={() => removeDate(dateIdx)}
                                                className="mt-5 p-2 text-zinc-700 hover:text-red-500 transition-colors"
                                                disabled={formData.availability.length === 1}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>

                                        <div className="space-y-4">
                                            <label className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest block">Synchronization Slots</label>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                                {avail.slots.map((slot, slotIdx) => (
                                                    <div key={slotIdx} className="flex items-center gap-2">
                                                        <input 
                                                            type="time"
                                                            required
                                                            value={slot}
                                                            onChange={(e) => updateSlot(dateIdx, slotIdx, e.target.value)}
                                                            className="flex-grow bg-zinc-900 border border-zinc-800 py-2 px-3 text-white text-xs font-bold focus:outline-none focus:border-indigo-500/50"
                                                        />
                                                        <button 
                                                            type="button"
                                                            onClick={() => removeSlot(dateIdx, slotIdx)}
                                                            className="p-1.5 text-zinc-800 hover:text-red-500 transition-colors"
                                                            disabled={avail.slots.length === 1}
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                ))}
                                                <button 
                                                    type="button"
                                                    onClick={() => addSlot(dateIdx)}
                                                    className="flex items-center justify-center gap-2 py-2 border border-dashed border-zinc-800 text-zinc-600 hover:border-zinc-600 hover:text-zinc-400 text-[9px] font-bold uppercase tracking-widest transition-all"
                                                >
                                                    <Plus size={12} /> Add Slot
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </GlassCard>
                    </div>

                    <div className="space-y-8">
                        <GlassCard className="p-8 bg-zinc-900 border-zinc-800 rounded-none border-l-4 border-l-indigo-600" hover={false}>
                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 flex items-center gap-2">
                                        <Clock size={14} className="text-indigo-500" /> Duration (Minutes)
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {['15', '30', '45', '60'].map((time) => (
                                            <button
                                                key={time}
                                                type="button"
                                                onClick={() => setFormData({...formData, duration: time})}
                                                className={cn(
                                                    "py-3 font-bold uppercase tracking-widest text-[10px] border transition-all",
                                                    formData.duration === time 
                                                        ? "bg-indigo-600 border-indigo-500 text-white" 
                                                        : "bg-zinc-950 border-zinc-800 text-zinc-600 hover:border-zinc-700"
                                                )}
                                            >
                                                {time}m
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 flex items-center gap-2">
                                        <DollarSign size={14} className="text-indigo-500" /> Protocol Value (1-100)
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            min="1"
                                            max="100"
                                            className="w-full bg-zinc-950 border border-zinc-800 rounded-none py-6 px-4 text-4xl text-white font-display font-bold text-center focus:outline-none focus:border-indigo-500/50 transition-all"
                                            value={formData.price}
                                            onChange={(e) => setFormData({...formData, price: e.target.value})}
                                        />
                                        <span className="absolute right-4 bottom-4 text-[9px] font-bold uppercase tracking-widest text-zinc-600">Credits</span>
                                    </div>
                                    <div className="p-3 bg-zinc-950 border border-zinc-800 flex items-start gap-3">
                                        <AlertCircle className="text-indigo-500 shrink-0" size={14} />
                                        <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest leading-relaxed">
                                            Strict regulation: Sync sessions cannot exceed 100 base units.
                                        </p>
                                    </div>
                                </div>

                                <GlowButton 
                                    type="submit" 
                                    variant="purple" 
                                    fullWidth 
                                    className="rounded-none py-6 font-bold uppercase tracking-[0.2em] text-[11px]"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Enciphering Protocol...' : 'Broadcast to Ledger'}
                                </GlowButton>
                            </div>
                        </GlassCard>

                        <div className="p-6 bg-indigo-600/5 border border-indigo-500/10 text-center">
                            <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest leading-relaxed">
                                By broadcasting, you agree to adhere to the high-frequency synchronization standards of the SkillTrader Protocol.
                            </p>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Teach;
