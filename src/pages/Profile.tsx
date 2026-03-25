import { motion } from 'framer-motion';
import { Star, Award, Shield, BookOpen, MessageCircle, TrendingUp, Settings, MapPin, Search } from 'lucide-react';
import Navbar from '../components/ui/Navbar';
import GlassCard from '../components/ui/GlassCard';
import GlowButton from '../components/ui/GlowButton';
import AnimatedBackground from '../components/ui/AnimatedBackground';
import { cn } from '../utils/cn';

const Profile = () => {
    const conceptsOffered = ['React Architecture', 'Framer Motion', 'UI Design Systems', 'Web3 Protocols'];
    const conceptsWanted = ['Advanced Rust', 'Zero Knowledge Proofs', 'Creative Writing'];
    const reviews = [
        { name: 'Marcus V.', rating: 5, comment: 'Incredible Concept Guide! Sarah explained complex animations simply.', date: '2 days ago' },
        { name: 'Elena R.', rating: 5, comment: 'One of the best concept syncs I have had. Instant clarity.', date: '1 week ago' },
    ];

    return (
        <div className="relative min-h-screen">
            <AnimatedBackground />
            <Navbar />

            <main className="pt-28 pb-12 px-6 max-w-7xl mx-auto">
                {/* Profile Header */}
                <section className="mb-12">
                    <GlassCard className="p-8 md:p-12 bg-zinc-900 border-zinc-800" hover={false}>
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
                            <div className="relative">
                                <div className="w-32 h-32 rounded-2xl bg-zinc-950 border-2 border-zinc-800 p-1 shadow-inner">
                                    <div className="w-full h-full bg-zinc-900 rounded-xl flex items-center justify-center overflow-hidden">
                                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="Avatar" className="w-full h-full object-cover grayscale opacity-80" />
                                    </div>
                                </div>
                                <div className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-2 rounded-lg shadow-sm border border-indigo-500">
                                    <Award size={18} />
                                </div>
                            </div>

                            <div className="flex-grow text-center md:text-left">
                                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                                    <h1 className="text-4xl font-display font-bold text-white tracking-tight uppercase">Sarah Chen</h1>
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
                                        <Shield size={12} /> Verified Protocol User
                                    </span>
                                </div>

                                <div className="flex flex-wrap justify-center md:justify-start gap-6 text-zinc-500 mb-8 font-bold uppercase tracking-widest text-[10px]">
                                    <div className="flex items-center gap-2"><MapPin size={14} className="text-zinc-600" /> Neo-Tokyo, District 7</div>
                                    <div className="flex items-center gap-2 border-l border-zinc-800 pl-6"><BookOpen size={14} className="text-zinc-600" /> 124 Syncs</div>
                                    <div className="flex items-center gap-2 border-l border-zinc-800 pl-6 text-indigo-400">
                                        <Star size={14} fill="currentColor" /> 5.0 Rating
                                    </div>
                                </div>

                                <div className="flex justify-center md:justify-start gap-3">
                                    <GlowButton variant="purple" size="sm" className="px-8">Edit Identity</GlowButton>
                                    <GlowButton variant="glass" size="sm" className="w-11 px-0"><Settings size={18} /></GlowButton>
                                </div>
                            </div>

                            <div className="hidden lg:grid grid-cols-2 gap-3">
                                <div className="p-5 bg-zinc-950 border border-zinc-800 rounded-xl text-center shadow-sm">
                                    <div className="text-2xl font-display font-bold text-white">42</div>
                                    <div className="text-[9px] text-zinc-600 uppercase font-bold tracking-widest mt-1">Tier Level</div>
                                </div>
                                <div className="p-5 bg-zinc-950 border border-zinc-800 rounded-xl text-center shadow-sm">
                                    <div className="text-2xl font-display font-bold text-indigo-500">12.4k</div>
                                    <div className="text-[9px] text-zinc-600 uppercase font-bold tracking-widest mt-1">Assets Earned</div>
                                </div>
                            </div>
                        </div>
                    </GlassCard>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Skills Area */}
                    <div className="lg:col-span-2 space-y-8">
                        <GlassCard hover={false} className="bg-zinc-900 border-zinc-800 p-8">
                            <h3 className="text-[10px] font-bold uppercase tracking-widest mb-8 flex items-center gap-3 text-zinc-500">
                                <TrendingUp size={16} className="text-indigo-500" /> Active Sync Protocols
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {conceptsOffered.map((skill, i) => (
                                    <span key={i} className="px-3.5 py-1.5 rounded-md bg-zinc-950 border border-zinc-800 text-zinc-400 text-[10px] font-bold uppercase tracking-widest hover:border-indigo-500/50 hover:text-white transition-all cursor-default shadow-sm">
                                        {skill}
                                    </span>
                                ))}
                            </div>

                            <h3 className="text-[10px] font-bold uppercase tracking-widest mt-12 mb-8 flex items-center gap-3 text-zinc-500">
                                <Search size={16} className="text-zinc-600" /> Learning Objectives
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {conceptsWanted.map((skill, i) => (
                                    <span key={i} className="px-3.5 py-1.5 rounded-md bg-zinc-950 border border-zinc-800 text-zinc-500 text-[10px] font-bold uppercase tracking-widest hover:border-zinc-600 hover:text-white transition-all cursor-default shadow-sm">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </GlassCard>

                        <GlassCard hover={false} className="bg-zinc-900 border-zinc-800 p-8">
                            <div className="flex items-center justify-between mb-10">
                                <h3 className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-3 text-zinc-500">
                                    <MessageCircle size={16} className="text-indigo-500" /> Peer Validation
                                </h3>
                                <button className="text-[9px] uppercase font-bold tracking-widest text-zinc-600 hover:text-white transition-colors">Archive</button>
                            </div>
                            <div className="space-y-6">
                                {reviews.map((review, i) => (
                                    <div key={i} className="pb-8 border-b border-zinc-800 last:border-0 last:pb-0">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="font-bold text-xs text-white uppercase tracking-tight">{review.name}</div>
                                            <div className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">{review.date}</div>
                                        </div>
                                        <div className="flex gap-1 text-indigo-500 mb-4">
                                            {[...Array(review.rating)].map((_, j) => <Star key={j} size={10} fill="currentColor" />)}
                                        </div>
                                        <p className="text-zinc-500 text-sm leading-relaxed font-medium">{review.comment}</p>
                                    </div>
                                ))}
                            </div>
                        </GlassCard>
                    </div>

                    {/* Stats/Badges Sidebar */}
                    <div className="space-y-8">
                        <GlassCard hover={false} className="bg-zinc-900 border-zinc-800 p-8">
                            <h3 className="text-[10px] font-bold uppercase tracking-widest mb-10 text-zinc-500">Service Badges</h3>
                            <div className="grid grid-cols-4 gap-3">
                                {[...Array(8)].map((_, i) => (
                                    <div key={i} className={cn(
                                        "aspect-square rounded-lg flex items-center justify-center border transition-all shadow-sm",
                                        i < 5 ? "bg-indigo-500/10 text-indigo-500 border-indigo-500/20" : "bg-zinc-950 text-zinc-800 border-zinc-900"
                                    )}>
                                        <Shield size={18} />
                                    </div>
                                ))}
                            </div>
                            <p className="mt-8 text-[9px] text-zinc-600 text-center font-bold uppercase tracking-widest leading-relaxed">
                                Complete 5 more validations to unlock <span className="text-zinc-400">The Architect</span>.
                            </p>
                        </GlassCard>

                        <GlassCard className="bg-zinc-900 border-zinc-800 p-8" hover={true}>
                            <h4 className="text-[10px] font-bold uppercase tracking-widest mb-8 text-zinc-500">Protocol Performance</h4>
                            <div className="space-y-6">
                                <div>
                                    <div className="flex justify-between text-[9px] mb-2 font-bold uppercase tracking-widest text-zinc-600">
                                        <span>Trust Vector</span>
                                        <span className="text-indigo-400">98%</span>
                                    </div>
                                    <div className="h-1 bg-zinc-950 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            whileInView={{ width: '98%' }}
                                            className="h-full bg-indigo-600 shadow-[0_0_8px_rgba(79,70,229,0.3)]"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-[9px] mb-2 font-bold uppercase tracking-widest text-zinc-600">
                                        <span>Transmission Accuracy</span>
                                        <span className="text-zinc-400">94%</span>
                                    </div>
                                    <div className="h-1 bg-zinc-950 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            whileInView={{ width: '94%' }}
                                            className="h-full bg-zinc-700"
                                        />
                                    </div>
                                </div>
                            </div>
                        </GlassCard>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Profile;
