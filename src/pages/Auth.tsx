import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Github, Chrome, ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/ui/Navbar';
import GlowButton from '../components/ui/GlowButton';
import AnimatedBackground from '../components/ui/AnimatedBackground';
import { useAuth } from '../context/AuthContext';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [isAuthenticating, setIsAuthenticating] = useState(false);
    const { loginWithGoogle } = useAuth();
    const navigate = useNavigate();

    const handleGoogleLogin = async () => {
        setIsAuthenticating(true);
        try {
            await loginWithGoogle();
            navigate('/explore');
        } catch (error) {
            console.error("Login Error:", error);
            alert("Login failed. Please check your credentials.");
        } finally {
            setIsAuthenticating(false);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center p-6">
            <AnimatedBackground />
            <Navbar />

            <div className="w-full max-w-md mt-20">
                <div className="p-8 md:p-12 bg-zinc-900 border border-zinc-800 shadow-2xl">
                    <div className="text-center mb-10">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="inline-flex p-3 rounded-xl bg-zinc-950 border border-zinc-800 mb-6 shadow-inner"
                        >
                            <Sparkles className="text-indigo-500" size={28} />
                        </motion.div>
                        <h2 className="text-3xl font-display font-bold mb-3 text-white tracking-tight uppercase">
                            {isLogin ? 'Login' : 'Sign Up'}
                        </h2>
                        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
                            {isLogin ? 'Login to your account to continue learning.' : 'Create an account to start your learning journey.'}
                        </p>
                    </div>

                    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                        <AnimatePresence mode="wait">
                            {!isLogin && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-2"
                                >
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 ml-1">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
                                        <input
                                            type="text"
                                            placeholder="Sarah Chen"
                                            className="w-full bg-zinc-950 border border-zinc-800 rounded-none py-3.5 pl-12 pr-4 text-white placeholder:text-zinc-800 focus:outline-none focus:border-indigo-500/50 focus:bg-zinc-950/80 transition-all text-sm font-medium"
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
                                <input
                                    type="email"
                                    placeholder="name@email.com"
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-none py-3.5 pl-12 pr-4 text-white placeholder:text-zinc-800 focus:outline-none focus:border-indigo-500/50 focus:bg-zinc-950/80 transition-all text-sm font-medium"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">Password</label>
                                {isLogin && <button className="text-[9px] text-indigo-500 hover:text-indigo-400 uppercase font-bold tracking-widest transition-colors">Recover</button>}
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-none py-3.5 pl-12 pr-4 text-white placeholder:text-zinc-800 focus:outline-none focus:border-indigo-500/50 focus:bg-zinc-950/80 transition-all text-sm font-medium"
                                />
                            </div>
                        </div>

                        <GlowButton variant="purple" fullWidth className="py-4 group text-[10px] font-bold uppercase tracking-widest overflow-hidden relative">
                             <span className="relative z-10 flex items-center justify-center gap-2">
                                 {isLogin ? 'Login' : 'Sign Up'} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                             </span>
                        </GlowButton>
                    </form>

                    <div className="mt-10">
                        <div className="relative mb-8 text-center">
                            <hr className="border-zinc-800" />
                             <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-zinc-900 px-4 text-[9px] uppercase tracking-widest text-zinc-600 font-bold">Or continue with</span>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <GlowButton variant="glass" size="sm" className="font-bold text-[9px] uppercase tracking-widest border-zinc-800 bg-zinc-950">
                                <Github size={16} /> GitHub
                            </GlowButton>
                            <GlowButton
                                onClick={handleGoogleLogin}
                                disabled={isAuthenticating}
                                variant="glass"
                                size="sm"
                                className="font-bold text-[9px] uppercase tracking-widest border-zinc-800 bg-zinc-950"
                            >
                                 <Chrome size={16} /> {isAuthenticating ? 'Loading...' : 'Google'}
                            </GlowButton>
                        </div>
                    </div>

                     <div className="mt-10 text-center text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                        {isLogin ? "New here?" : "Already have an account?"} {' '}
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-indigo-500 hover:text-indigo-400 transition-colors ml-1"
                        >
                            {isLogin ? 'Sign Up' : 'Login'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;
