import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Users, Zap, Shield, Sparkles } from 'lucide-react';
import Navbar from '../components/ui/Navbar';
import GlowButton from '../components/ui/GlowButton';
import AnimatedBackground from '../components/ui/AnimatedBackground';

const LandingPage = () => {
    const stats = [
        { label: 'Students', value: '12K+', icon: <Users className="text-indigo-500" /> },
        { label: 'Skills Learned', value: '45K+', icon: <Zap className="text-zinc-600" /> },
        { label: 'Success Rate', value: '99.9%', icon: <Star className="text-indigo-500" /> },
    ];

    const features = [
        {
            title: 'Quick Lessons',
            desc: 'Learn new things in short, 15-minute sessions.',
            icon: <Zap className="w-8 h-8 text-indigo-500" />
        },
        {
            title: 'Easy Wallet',
            desc: 'Earn and spend credits fairly with other students.',
            icon: <Shield className="w-8 h-8 text-zinc-600" />
        },
        {
            title: 'Level Up',
            desc: 'Grow your profile and become a verified teacher.',
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
                        <h1 className="text-6xl md:text-8xl font-display font-bold tracking-tighter mb-10 text-white leading-[0.9]">
                            Share Skills. <br />
                            <span className="text-indigo-600">Learn Fast.</span>
                        </h1>
                        <p className="text-xl text-zinc-500 max-w-2xl mx-auto mb-16 leading-relaxed font-medium">
                            The best place to learn and teach skills with other students. <span className="text-white">Simple, fast, and fun.</span>
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link to="/auth">
                                <GlowButton size="lg" variant="purple" className="min-w-[220px] rounded-full px-10 text-[10px] font-bold uppercase tracking-widest">
                                    Get Started <ArrowRight size={16} />
                                </GlowButton>
                            </Link>
                            <Link to="/explore">
                                <GlowButton size="lg" variant="glass" className="min-w-[220px] rounded-full px-10 text-[10px] font-bold uppercase tracking-widest bg-zinc-950 border-zinc-800">
                                    Browse Skills
                                </GlowButton>
                            </Link>
                        </div>
                    </motion.div>

                    {/* Floating Skill Cards */}
                    <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-6">
                        {features.map((feature, i) => (
                            <div key={i} className="bg-zinc-900 border border-zinc-800 p-10 text-left rounded-none border-l-4 border-l-indigo-600 shadow-2xl transition-all hover:-translate-y-1">
                                <div className="mb-8 inline-flex p-4 rounded-lg bg-zinc-950 border border-zinc-800 shadow-inner">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-display font-bold mb-4 text-white uppercase tracking-tight">{feature.title}</h3>
                                <p className="text-zinc-500 leading-relaxed text-sm font-medium">
                                    {feature.desc}
                                </p>
                            </div>
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
                <div className="max-w-5xl mx-auto overflow-hidden bg-zinc-900 border border-zinc-800 rounded-none border-r-4 border-r-indigo-600 shadow-2xl">
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12 p-12 md:p-20 text-center md:text-left">
                        <div className="flex-grow">
                            <h2 className="text-4xl md:text-5xl font-display font-bold mb-8 text-white uppercase tracking-tighter">Learn Faster <span className="text-indigo-500">Together.</span></h2>
                            <p className="text-lg text-zinc-500 font-medium uppercase tracking-tight">
                                Thousands of students are ready to help you master any skill. Join the community today.
                            </p>
                        </div>
                        <Link to="/auth">
                            <GlowButton variant="purple" size="lg" className="whitespace-nowrap px-12 py-6 rounded-none text-[10px] font-bold uppercase tracking-[0.2em]">
                                Get Started
                            </GlowButton>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-16 px-6 text-center text-zinc-600 text-[9px] font-bold uppercase tracking-[0.3em] border-t border-zinc-900 bg-zinc-950/20">
                <p>&copy; 2026 SkillTrader // Privacy Policy // Terms of Service</p>
            </footer>
        </div>
    );
};

export default LandingPage;
