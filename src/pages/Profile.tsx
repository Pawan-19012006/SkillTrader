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
                    <GlassCard className="p-8 md:p-12 relative overflow-hidden" hover={false}>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-purple/10 blur-[100px] -z-10" />

                        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                            <div className="relative">
                                <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-primary-purple to-primary-blue p-1">
                                    <div className="w-full h-full bg-background rounded-[22px] flex items-center justify-center overflow-hidden">
                                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="Avatar" className="w-full h-full object-cover" />
                                    </div>
                                </div>
                                <div className="absolute -bottom-2 -right-2 bg-primary-teal text-[#0a0a0c] p-2 rounded-xl shadow-glow-blue">
                                    <Award size={20} />
                                </div>
                            </div>

                            <div className="flex-grow text-center md:text-left">
                                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                                    <h1 className="text-4xl font-display font-bold">Sarah Chen</h1>
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-primary-blue uppercase tracking-widest">
                                        <Shield size={12} /> Verified Protocol User
                                    </span>
                                </div>

                                <div className="flex flex-wrap justify-center md:justify-start gap-6 text-white/50 mb-8">
                                    <div className="flex items-center gap-2"><MapPin size={16} /> Neo-Tokyo, District 7</div>
                                    <div className="flex items-center gap-2"><BookOpen size={16} /> 124 Concepts Explained</div>
                                    <div className="flex items-center gap-2 text-primary-teal font-bold">
                                        <Star size={16} fill="currentColor" /> 5.0 (214 Reviews)
                                    </div>
                                </div>

                                <div className="flex justify-center md:justify-start gap-4">
                                    <GlowButton variant="purple" size="sm">Edit Profile</GlowButton>
                                    <GlowButton variant="glass" size="sm"><Settings size={18} /></GlowButton>
                                </div>
                            </div>

                            <div className="hidden lg:grid grid-cols-2 gap-4">
                                <div className="p-4 bg-white/5 rounded-2xl text-center">
                                    <div className="text-2xl font-display font-bold text-primary-purple">Level 42</div>
                                    <div className="text-[10px] text-white/30 uppercase font-bold">Protocol Rank</div>
                                </div>
                                <div className="p-4 bg-white/5 rounded-2xl text-center">
                                    <div className="text-2xl font-display font-bold text-primary-teal">12.4k</div>
                                    <div className="text-[10px] text-white/30 uppercase font-bold">Total Earned</div>
                                </div>
                            </div>
                        </div>
                    </GlassCard>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Skills Area */}
                    <div className="lg:col-span-2 space-y-8">
                        <GlassCard hover={false}>
                            <h3 className="text-xl font-display font-bold mb-6 flex items-center gap-2">
                                <TrendingUp size={20} className="text-primary-blue" /> Concepts Explained
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {conceptsOffered.map((skill, i) => (
                                    <span key={i} className="px-4 py-2 rounded-xl bg-primary-blue/5 border border-primary-blue/10 text-primary-blue text-sm font-medium hover:bg-primary-blue/10 transition-colors cursor-default">
                                        {skill}
                                    </span>
                                ))}
                            </div>

                            <h3 className="text-xl font-display font-bold mt-10 mb-6 flex items-center gap-2">
                                <Search size={20} className="text-primary-purple" /> Currently Learning
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {conceptsWanted.map((skill, i) => (
                                    <span key={i} className="px-4 py-2 rounded-xl bg-primary-purple/5 border border-primary-purple/10 text-primary-purple text-sm font-medium hover:bg-primary-purple/10 transition-colors cursor-default">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </GlassCard>

                        <GlassCard hover={false}>
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-display font-bold flex items-center gap-2">
                                    <MessageCircle size={20} className="text-primary-teal" /> Peer Reviews
                                </h3>
                                <button className="text-sm text-white/40 hover:text-white transition-colors">View All</button>
                            </div>
                            <div className="space-y-6">
                                {reviews.map((review, i) => (
                                    <div key={i} className="pb-6 border-b border-white/5 last:border-0 last:pb-0">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="font-bold">{review.name}</div>
                                            <div className="text-[10px] text-white/30 uppercase">{review.date}</div>
                                        </div>
                                        <div className="flex gap-1 text-primary-teal mb-3">
                                            {[...Array(review.rating)].map((_, j) => <Star key={j} size={12} fill="currentColor" />)}
                                        </div>
                                        <p className="text-white/60 text-sm leading-relaxed">{review.comment}</p>
                                    </div>
                                ))}
                            </div>
                        </GlassCard>
                    </div>

                    {/* Stats/Badges Sidebar */}
                    <div className="space-y-8">
                        <GlassCard hover={false}>
                            <h3 className="text-lg font-display font-bold mb-6">Achievements</h3>
                            <div className="grid grid-cols-4 gap-4">
                                {[...Array(8)].map((_, i) => (
                                    <div key={i} className={cn(
                                        "aspect-square rounded-xl flex items-center justify-center p-2",
                                        i < 5 ? "bg-primary-purple/10 text-primary-purple border border-primary-purple/20" : "bg-white/5 text-white/10 border border-white/5"
                                    )}>
                                        <Shield size={20} />
                                    </div>
                                ))}
                            </div>
                            <p className="mt-6 text-xs text-white/30 text-center">Earn 5 more reviews to unlock "The Catalyst" badge.</p>
                        </GlassCard>

                        <GlassCard className="bg-gradient-to-br from-primary-purple/10 to-transparent" hover={true}>
                            <h4 className="font-bold mb-2">Protocol Stats</h4>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-xs mb-1.5 font-bold uppercase tracking-widest text-white/40">
                                        <span>Community Trust</span>
                                        <span>98%</span>
                                    </div>
                                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            whileInView={{ width: '98%' }}
                                            className="h-full bg-primary-teal shadow-[0_0_10px_rgba(0,255,163,0.5)]"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs mb-1.5 font-bold uppercase tracking-widest text-white/40">
                                        <span>Teaching Accuracy</span>
                                        <span>94%</span>
                                    </div>
                                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            whileInView={{ width: '94%' }}
                                            className="h-full bg-primary-blue shadow-[0_0_10px_rgba(0,212,255,0.5)]"
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
