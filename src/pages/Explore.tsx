import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Star, Zap, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/ui/Navbar';
import GlassCard from '../components/ui/GlassCard';
import GlowButton from '../components/ui/GlowButton';
import AnimatedBackground from '../components/ui/AnimatedBackground';
import { cn } from '../utils/cn';

const skills = [
    { id: 1, title: 'Mastering Framer Motion', teacher: 'Sarah Chen', rating: 4.9, reviews: 128, cost: 50, category: 'Design', image: '🎨', gradient: 'from-primary-purple/40 to-primary-blue/30' },
    { id: 2, title: 'Intro to Smart Contracts', teacher: 'David K.', rating: 4.8, reviews: 85, cost: 75, category: 'Dev', image: '🔗', gradient: 'from-primary-blue/40 to-primary-teal/30' },
    { id: 3, title: 'Strategic Product Growth', teacher: 'Elena R.', rating: 5.0, reviews: 42, cost: 60, category: 'Business', image: '🚀', gradient: 'from-primary-purple/30 to-primary-teal/20' },
    { id: 4, title: 'Creative Writing Workshop', teacher: 'Julian M.', rating: 4.7, reviews: 156, cost: 30, category: 'Creative', image: '✍️', gradient: 'from-primary-teal/40 to-primary-blue/30' },
    { id: 5, title: 'Fullstack Next.js 14', teacher: 'Marcus V.', rating: 4.9, reviews: 210, cost: 80, category: 'Dev', image: '⚡', gradient: 'from-primary-blue/30 to-primary-purple/40' },
    { id: 6, title: 'Advanced Typography', teacher: 'Lisa T.', rating: 4.6, reviews: 73, cost: 45, category: 'Design', image: '🖋️', gradient: 'from-primary-purple/20 to-primary-teal/40' },
];

const Explore = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const categories = ['All', 'Dev', 'Design', 'Business', 'Creative', 'Music'];

    const filteredSkills = skills.filter(skill =>
        (selectedCategory === 'All' || skill.category === selectedCategory) &&
        skill.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="relative min-h-screen pb-20">
            <AnimatedBackground />
            <Navbar />

            <main className="pt-28 px-6 max-w-7xl mx-auto">
                <header className="mb-12">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary-purple/20 flex items-center justify-center text-primary-purple border border-primary-purple/30">
                            <Zap size={24} />
                        </div>
                        <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-4xl md:text-5xl font-display font-bold"
                        >
                            Skill Marketplace
                        </motion.h1>
                    </div>
                    <p className="text-white/40 mb-10 max-w-2xl text-lg">
                        Synchronize with expert instructors worldwide. Exchange knowledge, earn credits, and evolve your protocol.
                    </p>

                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-grow">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20" size={20} />
                            <input
                                type="text"
                                placeholder="Search the protocol (e.g. 'Framer Motion', 'Solidity')..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-5 pl-14 pr-4 text-white placeholder:text-white/10 focus:outline-none focus:border-primary-purple/50 focus:bg-white/[0.05] transition-all text-lg font-light"
                            />
                        </div>
                        <GlowButton variant="glass" className="md:w-40 py-5">
                            <Filter size={18} /> Filters
                        </GlowButton>
                    </div>
                </header>

                {/* Categories Scroller */}
                <div className="flex gap-4 mb-12 overflow-x-auto pb-6 scrollbar-hide">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={cn(
                                "px-8 py-3 rounded-2xl border transition-all whitespace-nowrap font-bold text-sm tracking-tight",
                                selectedCategory === cat
                                    ? "bg-primary-purple/20 border-primary-purple/40 text-white shadow-[0_0_20px_rgba(157,0,255,0.2)]"
                                    : "bg-white/[0.02] border-white/5 text-white/40 hover:border-white/20 hover:text-white"
                            )}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Skills Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence mode="popLayout">
                        {filteredSkills.map((skill, idx) => (
                            <motion.div
                                key={skill.id}
                                layout
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                            >
                                <Link to={`/session/${skill.id}`}>
                                    <GlassCard className="h-full flex flex-col p-0 overflow-hidden group border-white/5 hover:border-primary-blue/30" hover={true}>
                                        <div className={cn("h-56 bg-gradient-to-br flex items-center justify-center text-7xl relative overflow-hidden", skill.gradient)}>
                                            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
                                            <motion.span
                                                whileHover={{ scale: 1.2, rotate: 5 }}
                                                transition={{ type: "spring", stiffness: 300 }}
                                                className="z-10 relative drop-shadow-2xl"
                                            >
                                                {skill.image}
                                            </motion.span>

                                            <div className="absolute top-4 right-4 z-20">
                                                <div className="bg-background/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-1.5 shadow-xl">
                                                    <Star size={12} className="text-primary-teal" fill="currentColor" />
                                                    <span className="text-xs font-bold text-white">{skill.rating}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-8 flex flex-col flex-grow relative bg-white/[0.01]">
                                            <div className="flex justify-between items-center mb-5">
                                                <span className="text-[10px] uppercase tracking-[0.2em] font-black text-primary-blue">
                                                    {skill.category}
                                                </span>
                                                <div className="text-[10px] text-white/20 font-bold uppercase tracking-widest">{skill.reviews} Reviews</div>
                                            </div>

                                            <h3 className="text-2xl font-display font-bold mb-3 group-hover:text-primary-blue transition-colors leading-snug">
                                                {skill.title}
                                            </h3>

                                            <div className="flex items-center gap-3 text-white/40 text-sm mb-8 font-medium">
                                                <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 overflow-hidden">
                                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${skill.teacher}`} alt={skill.teacher} />
                                                </div>
                                                {skill.teacher}
                                            </div>

                                            <div className="mt-auto pt-8 border-t border-white/5 flex items-center justify-between">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] uppercase text-white/20 font-black tracking-[0.15em] mb-1">Exchange Protocol</span>
                                                    <div className="flex items-center gap-2 text-2xl font-bold font-display text-white">
                                                        {skill.cost} <span className="text-xs text-primary-blue uppercase tracking-widest font-black">Credits</span>
                                                    </div>
                                                </div>
                                                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/20 group-hover:bg-primary-purple group-hover:text-white group-hover:shadow-glow-purple transition-all transform group-hover:rotate-12">
                                                    <ArrowUpRight size={20} />
                                                </div>
                                            </div>
                                        </div>
                                    </GlassCard>
                                </Link>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {filteredSkills.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-32 border border-dashed border-white/10 rounded-[3rem] mt-12 bg-white/[0.01]"
                    >
                        <div className="text-7xl mb-6 opacity-20">📡</div>
                        <h3 className="text-3xl font-display font-bold mb-3">No Signal Detected</h3>
                        <p className="text-white/30 max-w-sm mx-auto leading-relaxed">
                            We couldn't synchronize with any skills matching your current search parameters.
                        </p>
                        <GlowButton onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }} variant="glass" className="mt-10" size="sm">
                            Reset All Protocols
                        </GlowButton>
                    </motion.div>
                )}
            </main>
        </div>
    );
};

export default Explore;
