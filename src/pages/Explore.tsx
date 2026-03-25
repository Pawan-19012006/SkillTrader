import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Star, Zap, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/ui/Navbar';
import GlassCard from '../components/ui/GlassCard';
import GlowButton from '../components/ui/GlowButton';
import AnimatedBackground from '../components/ui/AnimatedBackground';
import { cn } from '../utils/cn';

const concepts = [
    { id: 1, title: 'Recursion Explained Simply', teacher: 'Sarah Chen', rating: 4.9, reviews: 128, cost: 50, category: 'Dev', image: '📦', gradient: 'from-primary-purple/40 to-primary-blue/30', duration: '30 min', level: 'Beginner', tag: 'Exam Prep' },
    { id: 2, title: 'Quantum Superposition', teacher: 'David K.', rating: 4.8, reviews: 85, cost: 75, category: 'Physics', image: '⚛️', gradient: 'from-primary-blue/40 to-primary-teal/30', duration: '45 min', level: 'Advanced', tag: 'Quick Concept' },
    { id: 3, title: 'Integration Basics', teacher: 'Elena R.', rating: 5.0, reviews: 42, cost: 60, category: 'Math', image: '📐', gradient: 'from-primary-purple/30 to-primary-teal/20', duration: '40 min', level: 'Intermediate', tag: 'Exam Focused' },
    { id: 4, title: 'Guitar Chord Transitions', teacher: 'Julian M.', rating: 4.7, reviews: 156, cost: 30, category: 'Music', image: '🎸', gradient: 'from-primary-teal/40 to-primary-blue/30', duration: '20 min', level: 'Beginner', tag: 'Quick Concept' },
    { id: 5, title: 'React State Synchronization', teacher: 'Marcus V.', rating: 4.9, reviews: 210, cost: 80, category: 'Dev', image: '⚡', gradient: 'from-primary-blue/30 to-primary-purple/40', duration: '30 min', level: 'Intermediate', tag: 'High Demand' },
    { id: 6, title: 'Public Speaking Tips', teacher: 'Lisa T.', rating: 4.6, reviews: 73, cost: 45, category: 'Business', image: '🎙️', gradient: 'from-primary-purple/20 to-primary-teal/40', duration: '15 min', level: 'Beginner', tag: 'Quick Concept' },
];

const Explore = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const categories = ['All', 'Dev', 'Design', 'Business', 'Creative', 'Music'];

    const filteredConcepts = concepts.filter(concept =>
        (selectedCategory === 'All' || concept.category === selectedCategory) &&
        concept.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="relative min-h-screen pb-20">
            <AnimatedBackground />
            <Navbar />

            <main className="pt-28 px-6 max-w-7xl mx-auto">
                <header className="mb-12">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500 border border-indigo-500/20 shadow-sm">
                            <Zap size={20} />
                        </div>
                        <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight"
                        >
                            Sync Marketplace
                        </motion.h1>
                    </div>
                    <p className="text-zinc-500 mb-10 max-w-2xl text-lg font-medium">
                        Secure end-to-end concept synchronization. Connect with authorized guides for deep technical mastery.
                    </p>

                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-grow">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
                            <input
                                type="text"
                                placeholder="Search sync protocols (e.g. 'Recursion', 'Solidity')..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-4 pl-14 pr-4 text-white placeholder:text-zinc-700 focus:outline-none focus:border-indigo-500/50 focus:bg-zinc-800/50 transition-all text-base font-bold shadow-sm"
                            />
                        </div>
                        <GlowButton variant="glass" className="md:w-32">
                            <Filter size={16} /> Filters
                        </GlowButton>
                    </div>
                </header>

                {/* Categories Scroller */}
                <div className="flex gap-3 mb-12 overflow-x-auto pb-6 scrollbar-hide">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={cn(
                                "px-6 py-2 rounded-lg border text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap",
                                selectedCategory === cat
                                    ? "bg-indigo-600 border-indigo-500 text-white shadow-sm"
                                    : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-white"
                            )}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Skills Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence mode="popLayout">
                        {filteredConcepts.map((concept, idx) => (
                            <motion.div
                                key={concept.id}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                transition={{ duration: 0.3, delay: idx * 0.05 }}
                            >
                                <Link to={`/session/${concept.id}`}>
                                    <GlassCard className="h-full flex flex-col p-0 overflow-hidden group bg-zinc-900 border-zinc-800 hover:border-indigo-500/50 shadow-sm" hover={true}>
                                        <div className="h-48 bg-zinc-950 flex items-center justify-center text-6xl relative overflow-hidden border-b border-zinc-800">
                                            <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                            {/* Tag */}
                                            <div className="absolute top-4 left-4 z-20">
                                                <div className="bg-zinc-900/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-zinc-800 text-[9px] font-bold text-indigo-400 uppercase tracking-widest">
                                                    {concept.tag}
                                                </div>
                                            </div>

                                            <motion.span
                                                whileHover={{ y: -5 }}
                                                className="z-10 relative"
                                            >
                                                {concept.image}
                                            </motion.span>

                                            <div className="absolute top-4 right-4 z-20">
                                                <div className="bg-zinc-900/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-zinc-800 flex items-center gap-1.5">
                                                    <Star size={10} className="text-indigo-500" fill="currentColor" />
                                                    <span className="text-[10px] font-bold text-zinc-300">{concept.rating}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-6 flex flex-col flex-grow relative">
                                            <div className="flex justify-between items-center mb-4">
                                                <div className="flex gap-2">
                                                    <span className="px-1.5 py-0.5 rounded-sm bg-indigo-500/10 text-[9px] uppercase font-bold text-indigo-400 border border-indigo-500/20 tracking-widest">
                                                        {concept.category}
                                                    </span>
                                                    <span className="px-1.5 py-0.5 rounded-sm bg-zinc-800 text-[9px] uppercase font-bold text-zinc-500 border border-zinc-700 tracking-widest">
                                                        {concept.level}
                                                    </span>
                                                </div>
                                                <div className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">{concept.duration}</div>
                                            </div>

                                            <h3 className="text-lg font-display font-bold mb-3 text-white group-hover:text-indigo-400 transition-colors uppercase tracking-tight">
                                                {concept.title}
                                            </h3>

                                            <div className="flex items-center gap-2.5 text-zinc-500 text-xs mb-6 font-bold uppercase tracking-widest">
                                                <div className="w-5 h-5 rounded-md bg-zinc-800 border border-zinc-700 overflow-hidden shadow-inner">
                                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${concept.teacher}`} alt={concept.teacher} />
                                                </div>
                                                Guide: <span className="text-zinc-400">{concept.teacher}</span>
                                            </div>

                                            <div className="mt-auto pt-6 border-t border-zinc-800 flex items-center justify-between">
                                                <div className="flex flex-col">
                                                    <span className="text-[9px] uppercase text-zinc-600 font-bold tracking-widest mb-1">Exchange Value</span>
                                                    <div className="flex items-center gap-1.5 text-xl font-bold font-display text-white">
                                                        {concept.cost} <span className="text-[10px] text-indigo-500 uppercase tracking-widest font-bold">CR</span>
                                                    </div>
                                                </div>
                                                <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-500 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-500 transition-all">
                                                    <ArrowUpRight size={16} />
                                                </div>
                                            </div>
                                        </div>
                                    </GlassCard>
                                </Link>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {filteredConcepts.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-24 border border-zinc-800 rounded-3xl mt-12 bg-zinc-900/50"
                    >
                        <div className="text-5xl mb-6 opacity-20">📡</div>
                        <h3 className="text-2xl font-display font-bold mb-2 text-white">No Protocol Detected</h3>
                        <p className="text-zinc-500 max-w-sm mx-auto leading-relaxed font-medium">
                            We couldn't synchronize with any concepts matching your current filter set.
                        </p>
                        <GlowButton onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }} variant="glass" className="mt-10" size="sm">
                            Reset Filters
                        </GlowButton>
                    </motion.div>
                )}
            </main>
        </div>
    );
};

export default Explore;
