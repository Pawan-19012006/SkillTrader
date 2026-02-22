import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Github, Chrome, ArrowRight, Sparkles } from 'lucide-react';
import Navbar from '../components/ui/Navbar';
import GlassCard from '../components/ui/GlassCard';
import GlowButton from '../components/ui/GlowButton';
import AnimatedBackground from '../components/ui/AnimatedBackground';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div className="relative min-h-screen flex items-center justify-center p-6">
            <AnimatedBackground />
            <Navbar />

            <div className="w-full max-w-md mt-20">
                <GlassCard className="p-8 md:p-12 relative overflow-hidden" hover={false}>
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary-purple/20 blur-[80px]" />
                    <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-primary-blue/20 blur-[80px]" />

                    <div className="text-center mb-10">
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="inline-flex p-3 rounded-2xl bg-white/5 border border-white/10 mb-4"
                        >
                            <Sparkles className="text-primary-teal" size={32} />
                        </motion.div>
                        <h2 className="text-3xl font-display font-bold mb-2">
                            {isLogin ? 'Welcome Back' : 'Join the Protocol'}
                        </h2>
                        <p className="text-white/40 text-sm">
                            {isLogin ? 'Enter your credentials to access your terminal.' : 'Create an account to start swapping skills today.'}
                        </p>
                    </div>

                    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                        <AnimatePresence mode="wait">
                            {!isLogin && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="space-y-2"
                                >
                                    <label className="text-xs font-bold uppercase tracking-widest text-white/30 ml-1">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                                        <input
                                            type="text"
                                            placeholder="Alex Rivera"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-white/10 focus:outline-none focus:border-primary-purple focus:bg-white/[0.08] transition-all"
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-white/30 ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                                <input
                                    type="email"
                                    placeholder="name@protocol.io"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-white/10 focus:outline-none focus:border-primary-purple focus:bg-white/[0.08] transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-xs font-bold uppercase tracking-widest text-white/30">Password</label>
                                {isLogin && <button className="text-[10px] text-primary-blue hover:underline uppercase font-bold tracking-wider">Forgot?</button>}
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-white/10 focus:outline-none focus:border-primary-purple focus:bg-white/[0.08] transition-all"
                                />
                            </div>
                        </div>

                        <GlowButton variant="purple" fullWidth className="py-4 shadow-glow-purple group">
                            {isLogin ? 'Initialize Session' : 'Create Protocol ID'} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </GlowButton>
                    </form>

                    <div className="mt-10">
                        <div className="relative mb-8 text-center">
                            <hr className="border-white/5" />
                            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-4 text-[10px] uppercase tracking-widest text-white/20 font-bold">Or continue with</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <GlowButton variant="glass" size="sm">
                                <Github size={18} /> GitHub
                            </GlowButton>
                            <GlowButton variant="glass" size="sm">
                                <Chrome size={18} /> Google
                            </GlowButton>
                        </div>
                    </div>

                    <div className="mt-10 text-center text-sm text-white/40">
                        {isLogin ? "Don't have an account?" : "Already have an account?"} {' '}
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-primary-teal font-bold hover:underline"
                        >
                            {isLogin ? 'Sign up' : 'Log in'}
                        </button>
                    </div>
                </GlassCard>
            </div>
        </div>
    );
};

export default Auth;
