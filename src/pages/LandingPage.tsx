import { motion } from 'framer-motion';
import { ArrowRight, Star, Users, Zap, Shield, Sparkles } from 'lucide-react';
import Navbar from '../components/ui/Navbar';
import GlassCard from '../components/ui/GlassCard';
import GlowButton from '../components/ui/GlowButton';
import AnimatedBackground from '../components/ui/AnimatedBackground';

const LandingPage = () => {
    const stats = [
        { label: 'Active Learners', value: '12K+', icon: <Users className="text-primary-blue" /> },
        { label: 'Skills Exchanged', value: '45K+', icon: <Zap className="text-primary-purple" /> },
        { label: 'Trust Rating', value: '4.9/5', icon: <Star className="text-primary-teal" /> },
    ];

    const features = [
        {
            title: 'Micro-Sessions',
            desc: 'Learn high-impact skills in 30-minute intense sessions.',
            icon: <Zap className="w-10 h-10 text-primary-purple" />
        },
        {
            title: 'Credit Protocol',
            desc: 'Transparent peer-to-peer credit system for fair exchange.',
            icon: <Shield className="w-10 h-10 text-primary-blue" />
        },
        {
            title: 'Elite Reputation',
            desc: 'Scale your status and unlock exclusive teaching tiers.',
            icon: <Sparkles className="w-10 h-10 text-primary-teal" />
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
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm font-medium mb-6 text-primary-blue animate-pulse-glow">
                            Introducing SkillSwap v2.0
                        </span>
                        <h1 className="text-6xl md:text-8xl font-display font-bold tracking-tight mb-8">
                            Teach. Learn. <br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-purple via-primary-blue to-primary-teal">
                                Earn Your Status.
                            </span>
                        </h1>
                        <p className="text-xl text-white/60 max-w-3xl mx-auto mb-12 leading-relaxed">
                            The futuristic marketplace for Peer-to-Peer knowledge exchange.
                            Teach your mastery, earn credits, and unlock incredible new skills from global experts.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <GlowButton size="lg" variant="purple" className="min-w-[200px]">
                                Start Learning Now <ArrowRight size={20} />
                            </GlowButton>
                            <GlowButton size="lg" variant="glass" className="min-w-[200px]">
                                Explore Marketplace
                            </GlowButton>
                        </div>
                    </motion.div>

                    {/* Floating Skill Cards */}
                    <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map((feature, i) => (
                            <GlassCard key={i} delay={0.2 + i * 0.1}>
                                <div className="mb-6 inline-flex p-4 rounded-2xl bg-white/5 border border-white/10">
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-display font-bold mb-4">{feature.title}</h3>
                                <p className="text-white/50 leading-relaxed text-lg">
                                    {feature.desc}
                                </p>
                            </GlassCard>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 px-6 border-y border-white/5 bg-white/[0.02]">
                <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-12 text-center">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="flex flex-col items-center"
                        >
                            <div className="mb-4">{stat.icon}</div>
                            <div className="text-5xl font-display font-bold mb-2">{stat.value}</div>
                            <div className="text-white/40 uppercase tracking-widest text-sm font-semibold">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-6">
                <GlassCard className="max-w-5xl mx-auto overflow-hidden relative" hover={false}>
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-primary-purple/10 blur-[100px] pointer-events-none" />
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12 p-8 md:p-12">
                        <div className="text-left max-w-xl">
                            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">Ready to upgrade your skill set?</h2>
                            <p className="text-lg text-white/60">
                                Join thousands of peers swapping knowledge across coding, design, business, and creative arts.
                            </p>
                        </div>
                        <GlowButton variant="teal" size="lg" className="whitespace-nowrap">
                            Join the Network
                        </GlowButton>
                    </div>
                </GlassCard>
            </section>

            {/* Footer */}
            <footer className="py-12 px-6 text-center text-white/30 text-sm border-t border-white/5">
                <p>&copy; 2026 SkillSwap Protocol. Built for the future of education.</p>
            </footer>
        </div>
    );
};

export default LandingPage;
