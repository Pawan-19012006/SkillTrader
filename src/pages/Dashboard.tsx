import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Calendar,
    Clock,
    Shield,
    TrendingUp,
    Zap,
    ArrowUpRight,
    Activity,
    CheckCircle2,
    Clock3
} from 'lucide-react';
import Navbar from '../components/ui/Navbar';
import GlassCard from '../components/ui/GlassCard';
import GlowButton from '../components/ui/GlowButton';
import AnimatedBackground from '../components/ui/AnimatedBackground';
import { useAnimateCounter } from '../hooks/useAnimateCounter';
import { cn } from '../utils/cn';

const Dashboard = () => {
    const animatedCredits = useAnimateCounter(1250);
    const animatedSessions = useAnimateCounter(24);

    const [sessions, setSessions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                // Hardcoded user_123 for demo purposes
                const response = await fetch('http://localhost:5001/sessions?userId=user_123');
                const data = await response.json();
                setSessions(data);
            } catch (error) {
                console.error('Failed to fetch sessions:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSessions();
    }, []);

    const handleJoinSession = (link: string | null) => {
        if (link) {
            window.open(link, '_blank');
        }
    };

    return (
        <div className="relative min-h-screen">
            <AnimatedBackground />
            <Navbar />

            <main className="pt-28 pb-12 px-6 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <h1 className="text-4xl font-display font-bold mb-2">Welcome Back, <span className="text-indigo-500">Alex</span></h1>
                        <p className="text-zinc-400 font-medium max-w-lg">
                            Your concept synchronization is optimal today. 
                            <span className="block text-zinc-500 italic text-sm mt-1">"Clarity over complexity." — Professional Sync Protocol active.</span>
                        </p>
                    </motion.div>

                    <div className="flex gap-3">
                        <GlowButton variant="glass" size="sm" className="gap-2">
                            <Activity size={16} /> Analytics
                        </GlowButton>
                        <GlowButton variant="purple" size="sm" className="gap-2">
                            <Zap size={16} /> New Sync
                        </GlowButton>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                    {[
                        { label: 'Available Credits', value: animatedCredits, icon: Zap, color: 'text-indigo-500' },
                        { label: 'Concepts Mastered', value: animatedSessions, icon: CheckCircle2, color: 'text-zinc-200' },
                        { label: 'Community Rank', value: 'Top 5%', icon: Shield, color: 'text-indigo-400' },
                        { label: 'Sync Success Rate', value: '98.4%', icon: TrendingUp, color: 'text-zinc-400' }
                    ].map((stat, i) => (
                        <GlassCard key={i} delay={i * 0.05} className="p-5 bg-zinc-900/50 border-zinc-800">
                            <div className="flex items-center justify-between mb-4">
                                <div className={cn("p-2 rounded-lg bg-zinc-800", stat.color)}>
                                    <stat.icon size={18} />
                                </div>
                                <ArrowUpRight size={14} className="text-zinc-600" />
                            </div>
                            <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1">{stat.label}</div>
                            <div className="text-2xl font-display font-bold text-white">
                                {typeof stat.value === 'object' ? <motion.span>{stat.value}</motion.span> : stat.value}
                            </div>
                        </GlassCard>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Upcoming Sessions */}
                    <div className="lg:col-span-2 space-y-6">
                        <h3 className="text-lg font-display font-bold flex items-center gap-2 text-zinc-200">
                            <Clock3 className="text-indigo-500" size={18} /> Upcoming Sync Protocols
                        </h3>
                        <div className="space-y-3">
                            {loading ? (
                                <div className="text-zinc-500 italic p-6">Authenticating secure protocols...</div>
                            ) : sessions.map((session, i) => (
                                <GlassCard key={session.id} delay={0.2 + i * 0.05} className={cn("p-5 group transition-all", session.isLocked ? "bg-zinc-900/30 opacity-70" : "bg-zinc-900 border-indigo-500/20 shadow-sm")}>
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        <div className="flex items-center gap-5">
                                            <div className={cn("w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center border border-zinc-700", session.isLocked ? "text-zinc-600" : "text-indigo-400")}>
                                                <Calendar size={20} />
                                            </div>
                                            <div>
                                                <div className="text-[10px] text-indigo-500 font-bold uppercase tracking-widest mb-0.5">
                                                    {session.isLocked ? '🔒 Private' : '🔗 Unlocked'}
                                                </div>
                                                <h4 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{session.title}</h4>
                                                <div className="text-xs text-zinc-500 flex items-center gap-2 mt-1 font-medium">
                                                    <Clock size={12} /> Sync Guide: {session.guide}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div className="text-right hidden md:block">
                                                <div className="text-[10px] text-zinc-600 uppercase font-bold mb-0.5">Reference State</div>
                                                <div className={cn("text-xs font-bold font-mono", session.isLocked ? "text-zinc-700" : "text-indigo-500")}>
                                                    {session.isLocked ? 'STALE' : 'OPTIMAL'}
                                                </div>
                                            </div>
                                            <GlowButton 
                                                onClick={() => !session.isLocked && handleJoinSession(session.meetLink)}
                                                variant={session.isLocked ? "glass" : "purple"} 
                                                size="sm"
                                                className={cn(session.isLocked && "opacity-50 grayscale cursor-not-allowed")}
                                            >
                                                {session.isLocked ? 'Locked' : 'Join Sync Now'}
                                            </GlowButton>
                                        </div>
                                    </div>
                                    {session.isLocked && (
                                        <div className="mt-4 pt-4 border-t border-zinc-800 text-[9px] text-zinc-600 uppercase tracking-[0.3em] font-bold">
                                            Initialize booking to synchronize secure meeting protocols
                                        </div>
                                    )}
                                </GlassCard>
                            ))}
                        </div>
                    </div>

                    {/* Activity Timeline */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-display font-bold flex items-center gap-2 text-zinc-200">
                            <Activity className="text-indigo-500" size={18} /> Protocol History
                        </h3>
                        <GlassCard className="p-6 bg-zinc-900" hover={false}>
                            <div className="space-y-6">
                                {[
                                    { title: 'Session Booked', time: '2h ago', desc: 'Framer Motion Magic', icon: CheckCircle2, color: 'text-indigo-500' },
                                    { title: 'Credits Received', time: '5h ago', desc: '+150 Credits', icon: Zap, color: 'text-zinc-400' },
                                    { title: 'New Achievement', time: '1d ago', desc: 'Master Protocol Badge', icon: Shield, color: 'text-indigo-600' }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4 relative">
                                        {i !== 2 && <div className="absolute left-[11px] top-6 bottom-[-24px] w-[1px] bg-zinc-800" />}
                                        <div className={cn("w-6 h-6 rounded-md bg-zinc-800 flex items-center justify-center relative z-10", item.color)}>
                                            <item.icon size={10} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <span className="text-sm font-bold text-zinc-200">{item.title}</span>
                                                <span className="text-[10px] text-zinc-600 font-bold">{item.time}</span>
                                            </div>
                                            <p className="text-xs text-zinc-500 font-medium">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </GlassCard>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
