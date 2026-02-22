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

const CountdownTimer = ({ targetDate }: { targetDate: Date }) => {
    const [timeLeft, setTimeLeft] = useState(targetDate.getTime() - Date.now());

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(targetDate.getTime() - Date.now());
        }, 1000);
        return () => clearInterval(interval);
    }, [targetDate]);

    const h = Math.floor(Math.max(0, timeLeft) / (1000 * 60 * 60));
    const m = Math.floor((Math.max(0, timeLeft) / (1000 * 60)) % 60);
    const s = Math.floor((Math.max(0, timeLeft) / 1000) % 60);

    return (
        <div className="flex gap-2 font-mono text-primary-teal font-bold">
            <span>{h.toString().padStart(2, '0')}</span>:
            <span>{m.toString().padStart(2, '0')}</span>:
            <span>{s.toString().padStart(2, '0')}</span>
        </div>
    );
};

const Dashboard = () => {
    const animatedCredits = useAnimateCounter(1250);
    const animatedSessions = useAnimateCounter(24);

    const upcomingSessions = [
        {
            id: 1,
            title: 'Advanced Framer Motion',
            instructor: 'Sarah Chen',
            time: 'In 15 Minutes',
            date: new Date(Date.now() + 15 * 60 * 1000),
            type: 'Live Workshop'
        },
        {
            id: 2,
            title: 'Solidity Architecture',
            instructor: 'Alex Rivera',
            time: 'Tomorrow, 10:00 AM',
            date: new Date(Date.now() + 24 * 60 * 60 * 1000),
            type: '1-on-1'
        }
    ];

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
                        <h1 className="text-4xl font-display font-bold mb-2">Welcome Back, <span className="text-primary-purple">Protocol_User</span></h1>
                        <p className="text-white/40">Your skill exchange synchronization is optimal today.</p>
                    </motion.div>

                    <div className="flex gap-4">
                        <GlowButton variant="glass" size="sm" className="gap-2">
                            <Activity size={16} /> Analytics
                        </GlowButton>
                        <GlowButton variant="purple" size="sm" className="gap-2">
                            <Zap size={16} /> New Session
                        </GlowButton>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {[
                        { label: 'Available Credits', value: animatedCredits, icon: Zap, color: 'text-primary-blue' },
                        { label: 'Sessions Completed', value: animatedSessions, icon: CheckCircle2, color: 'text-primary-teal' },
                        { label: 'Community Rank', value: 'Top 5%', icon: Shield, color: 'text-primary-purple' },
                        { label: 'Success Rate', value: '98.4%', icon: TrendingUp, color: 'text-primary-blue' }
                    ].map((stat, i) => (
                        <GlassCard key={i} delay={i * 0.1} className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className={cn("p-2 rounded-lg bg-white/5", stat.color)}>
                                    <stat.icon size={20} />
                                </div>
                                <ArrowUpRight size={16} className="text-white/20" />
                            </div>
                            <div className="text-[10px] text-white/30 uppercase font-black tracking-widest mb-1">{stat.label}</div>
                            <div className="text-2xl font-display font-bold">
                                {typeof stat.value === 'object' ? <motion.span>{stat.value}</motion.span> : stat.value}
                            </div>
                        </GlassCard>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Upcoming Sessions */}
                    <div className="lg:col-span-2 space-y-6">
                        <h3 className="text-xl font-display font-bold flex items-center gap-2">
                            <Clock3 className="text-primary-purple" size={20} /> Upcoming Syncs
                        </h3>
                        <div className="space-y-4">
                            {upcomingSessions.map((session, i) => (
                                <GlassCard key={session.id} delay={0.4 + i * 0.1} className="p-6 hover:border-primary-purple/30 group">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        <div className="flex items-center gap-6">
                                            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5 text-primary-blue">
                                                <Calendar size={24} />
                                            </div>
                                            <div>
                                                <div className="text-[10px] text-primary-teal font-black uppercase tracking-widest mb-1">{session.type}</div>
                                                <h4 className="text-lg font-bold group-hover:text-primary-purple transition-colors">{session.title}</h4>
                                                <div className="text-sm text-white/40 flex items-center gap-2 mt-1">
                                                    <Clock size={14} /> {session.instructor}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div className="text-right hidden md:block">
                                                <div className="text-[10px] text-white/30 uppercase font-bold mb-1">Time Remaining</div>
                                                <CountdownTimer targetDate={session.date} />
                                            </div>
                                            <GlowButton variant="glass" size="sm">
                                                Details
                                            </GlowButton>
                                        </div>
                                    </div>
                                </GlassCard>
                            ))}
                        </div>
                    </div>

                    {/* Activity Timeline */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-display font-bold flex items-center gap-2">
                            <Activity className="text-primary-blue" size={20} /> Activity Timeline
                        </h3>
                        <GlassCard className="p-8" hover={false}>
                            <div className="space-y-8">
                                {[
                                    { title: 'Session Booked', time: '2h ago', desc: 'Framer Motion Layout Magic', icon: CheckCircle2, color: 'text-primary-teal' },
                                    { title: 'Credits Received', time: '5h ago', desc: '+150 Credits from Teaching', icon: Zap, color: 'text-primary-blue' },
                                    { title: 'New Achievement', time: '1d ago', desc: '"Master Protocol" Badge Earned', icon: Shield, color: 'text-primary-purple' }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4 relative">
                                        {i !== 2 && <div className="absolute left-[11px] top-6 bottom-[-24px] w-[1px] bg-white/5" />}
                                        <div className={cn("w-6 h-6 rounded-full bg-white/5 flex items-center justify-center relative z-10", item.color)}>
                                            <item.icon size={12} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-sm font-bold">{item.title}</span>
                                                <span className="text-[10px] text-white/20 font-medium">{item.time}</span>
                                            </div>
                                            <p className="text-xs text-white/40 leading-relaxed font-light">{item.desc}</p>
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
