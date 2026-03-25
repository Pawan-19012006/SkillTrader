import { motion } from 'framer-motion';
import { ArrowRight, Star, Users, Zap, Shield, Sparkles } from 'lucide-react';
import Navbar from '../components/ui/Navbar';
import GlassCard from '../components/ui/GlassCard';
import GlowButton from '../components/ui/GlowButton';
import AnimatedBackground from '../components/ui/AnimatedBackground';

const LandingPage = () => {
    const stats = [
        { label: 'Network Participants', value: '12K+', icon: <Users className="text-indigo-500" /> },
        { label: 'Synchronized Concepts', value: '45K+', icon: <Zap className="text-zinc-600" /> },
        { label: 'Transmission Reliability', value: '99.9%', icon: <Star className="text-indigo-500" /> },
    ];

    const features = [
        {
            title: 'Concept Protocols',
            desc: 'Acquire high-fidelity mental models via 15-minute high-frequency syncs.',
            icon: <Zap className="w-8 h-8 text-indigo-500" />
        },
        {
            title: 'Asset Exchange',
            desc: 'Secure peer-to-peer ledger for fair and transparent knowledge auditing.',
            icon: <Shield className="w-8 h-8 text-zinc-600" />
        },
        {
            title: 'Rank Evolution',
            desc: 'Scale your instructional authority and unlock elite synchronization tiers.',
            icon: <Sparkles className="w-8 h-8 text-indigo-500" />
        }
    ];

    return (
        <div className="relative min-h-screen">
            <AnimatedBackground />
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <span className="inline-block px-4 py-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-[10px] font-bold mb-8 text-indigo-400 uppercase tracking-[0.2em] shadow-sm">
                            Protocol Version 2.4.0 <span className="text-zinc-700 ml-2">Live</span>
                        </span>
                        <h1 className="text-6xl md:text-8xl font-display font-bold tracking-tighter mb-10 text-white uppercase italic leading-[0.9]">
                            Explain. Learn. <br />
                            <span className="text-indigo-600">Sync Reality.</span>
                        </h1>
                        <p className="text-xl text-zinc-500 max-w-2xl mx-auto mb-16 leading-relaxed font-medium uppercase tracking-tight">
                            The high-frequency marketplace for <span className="text-white italic">Peer-to-Peer</span> knowledge synchronization. Acquire models, not just data.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <GlowButton size="lg" variant="purple" className="min-w-[220px] rounded-none px-10 text-[10px] font-bold uppercase tracking-widest">
                                Initialize Sync <ArrowRight size={16} />
                            </GlowButton>
                            <GlowButton size="lg" variant="glass" className="min-w-[220px] rounded-none px-10 text-[10px] font-bold uppercase tracking-widest bg-zinc-950 border-zinc-800">
                                Browse Protocols
                            </GlowButton>
                        </div>
                    </motion.div>

                    {/* Floating Skill Cards */}
                    <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-6">
                        {features.map((feature, i) => (
                            <GlassCard key={i} delay={0.2 + i * 0.1} className="bg-zinc-900 border-zinc-800 p-10 text-left rounded-none border-l-4 border-l-indigo-600">
                                <div className="mb-8 inline-flex p-4 rounded-lg bg-zinc-950 border border-zinc-800 shadow-inner">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-display font-bold mb-4 text-white uppercase tracking-tight">{feature.title}</h3>
                                <p className="text-zinc-500 leading-relaxed text-sm font-medium">
                                    {feature.desc}
                                </p>
                            </GlassCard>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-24 px-6 border-y border-zinc-900 bg-zinc-950/50">
                <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-16 text-center">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="flex flex-col items-center"
                        >
                            <div className="mb-6 text-zinc-700">{stat.icon}</div>
                            <div className="text-6xl font-display font-bold mb-4 text-white tracking-tighter">{stat.value}</div>
                            <div className="text-zinc-600 uppercase tracking-[0.3em] text-[10px] font-bold">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>
            </section>

            <section className="py-32 px-6">
                <GlassCard className="max-w-5xl mx-auto overflow-hidden bg-zinc-900 border-zinc-800 rounded-none border-r-4 border-r-indigo-600" hover={false}>
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12 p-12 md:p-20 text-center md:text-left">
                        <div className="flex-grow">
                            <h2 className="text-4xl md:text-5xl font-display font-bold mb-8 text-white uppercase italic tracking-tighter">Achieve Instant <span className="text-indigo-500">Synchronization.</span></h2>
                            <p className="text-lg text-zinc-500 font-medium uppercase tracking-tight">
                                Thousands of peers are ready to deconstruct complex protocols for you. Join the ledger today.
                            </p>
                        </div>
                        <GlowButton variant="purple" size="lg" className="whitespace-nowrap px-12 py-6 rounded-none text-[10px] font-bold uppercase tracking-[0.2em]">
                            Authorize Access
                        </GlowButton>
                    </div>
                </GlassCard>
            </section>

            {/* Footer */}
            <footer className="py-16 px-6 text-center text-zinc-600 text-[9px] font-bold uppercase tracking-[0.3em] border-t border-zinc-900 bg-zinc-950/20">
                <p>&copy; 2026 SkillTrader Protocol // Terminology of Sync // Privacy Ledger</p>
            </footer>
        </div>
    );
};

export default LandingPage;
