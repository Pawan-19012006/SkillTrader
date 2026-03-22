import { motion } from 'framer-motion';
import {
    Wallet as WalletIcon,
    ArrowUpRight,
    ArrowDownLeft,
    History,
    BarChart3,
    CreditCard,
    ChevronRight,
    Sparkles,
    Trophy
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
import Navbar from '../components/ui/Navbar';
import GlassCard from '../components/ui/GlassCard';
import GlowButton from '../components/ui/GlowButton';
import AnimatedBackground from '../components/ui/AnimatedBackground';
import { cn } from '../utils/cn';
import { useAnimateCounter } from '../hooks/useAnimateCounter';

const chartData = [
    { name: 'Mon', value: 200, type: 'earned' },
    { name: 'Tue', value: -150, type: 'spent' },
    { name: 'Wed', value: 300, type: 'earned' },
    { name: 'Thu', value: -50, type: 'spent' },
    { name: 'Fri', value: 450, type: 'earned' },
    { name: 'Sat', value: 100, type: 'earned' },
    { name: 'Sun', value: -200, type: 'spent' },
];

const Wallet = () => {
    const animatedBalance = useAnimateCounter(1250);

    const transactions = [
        { title: 'Sarah Chen - React Sync', amount: -50, date: 'Today, 2:30 PM', status: 'Completed', category: 'Learning' },
        { title: 'Concept Explanation Reward', amount: 450, date: 'Yesterday', status: 'Added', category: 'Teaching' },
        { title: 'Intro to Smart Contracts', amount: -75, date: 'Feb 20, 2026', status: 'Completed', category: 'Learning' },
        { title: 'David K. - CSS Concept Sync', amount: 300, date: 'Feb 18, 2026', status: 'Earned', category: 'Teaching' },
    ];

    return (
        <div className="relative min-h-screen">
            <AnimatedBackground />
            <Navbar />

            <main className="pt-28 pb-12 px-6 max-w-7xl mx-auto">
                <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-4xl font-display font-bold"
                        >
                            Knowledge Wallet
                        </motion.h1>
                        <p className="text-white/50 mt-1">Manage your ConceptSwap credits and Knowledge Exchange Units.</p>
                    </div>
                    <div className="flex gap-4">
                        <GlowButton variant="glass" size="sm" className="gap-2">
                            <History size={16} /> History
                        </GlowButton>
                        <GlowButton variant="purple" size="sm" className="gap-2">
                            <Sparkles size={16} /> Explain a Concept
                        </GlowButton>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Balance Card */}
                    <div className="lg:col-span-1 space-y-6">
                        <GlassCard className="p-8 bg-gradient-to-br from-primary-purple/10 via-background to-primary-blue/10 border-primary-purple/20" hover={false}>
                            <div className="flex items-center gap-3 mb-8 text-white/40">
                                <WalletIcon size={20} />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Knowledge Exchange Units</span>
                            </div>
                            <div className="flex items-baseline gap-2 mb-2">
                                <div className="text-6xl font-display font-bold text-white tracking-tighter">
                                    <motion.span>{animatedBalance}</motion.span>
                                </div>
                                <span className="text-primary-blue font-bold text-lg">CR</span>
                            </div>
                            <div className="text-sm text-white/30 mb-8 font-medium">Approx. 25 syncs available at Current Tier</div>

                            <div className="flex gap-4">
                                <GlowButton variant="purple" fullWidth size="sm" className="shadow-glow-purple">Deposit</GlowButton>
                                <GlowButton variant="glass" fullWidth size="sm">Send</GlowButton>
                            </div>
                        </GlassCard>

                        <GlassCard className="p-6 border-primary-teal/20" hover={true}>
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="font-bold flex items-center gap-2 text-sm">
                                    <Trophy size={18} className="text-primary-teal" /> Master Concept Guide
                                </h4>
                                <span className="text-[10px] font-black text-primary-teal bg-primary-teal/10 px-2 py-0.5 rounded-full uppercase tracking-widest">Lv. 4</span>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between text-xs font-bold px-1">
                                    <span className="text-white/40">Next Badge Progress</span>
                                    <span className="text-primary-teal">85%</span>
                                </div>
                                <div className="h-2 bg-white/5 rounded-full overflow-hidden mb-2 p-[2px]">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        whileInView={{ width: '85%' }}
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                        className="h-full bg-primary-teal rounded-full shadow-[0_0_15px_rgba(0,255,163,0.5)] relative"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20 animate-pulse" />
                                    </motion.div>
                                </div>
                                <p className="text-[10px] text-white/30 leading-relaxed font-medium">
                                    Complete <span className="text-white/60">3 more concept syncs</span> to unlock Tier 5 benefits.
                                </p>
                            </div>
                        </GlassCard>

                        <GlassCard className="p-5 flex items-center justify-between" hover={true}>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5 group-hover:border-primary-blue/30 transition-colors">
                                    <CreditCard className="text-primary-blue" size={20} />
                                </div>
                                <div>
                                    <div className="text-sm font-bold">Auto-Refill</div>
                                    <div className="text-[10px] text-white/20 font-black uppercase tracking-widest mt-0.5">Not Synchronized</div>
                                </div>
                            </div>
                            <GlowButton variant="glass" size="sm" className="px-4 py-2 text-[10px]">Sync Account</GlowButton>
                        </GlassCard>
                    </div>

                    {/* Visualization & History */}
                    <div className="lg:col-span-2 space-y-8">
                        <GlassCard className="p-8" hover={false}>
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-display font-bold flex items-center gap-3">
                                    <BarChart3 size={20} className="text-primary-blue" /> Knowledge Flow
                                </h3>
                                <div className="flex gap-2">
                                    {['7D', '30D', 'All'].map(t => (
                                        <button key={t} className={cn(
                                            "text-[10px] font-black px-3 py-1 rounded-lg transition-colors border",
                                            t === '7D' ? "bg-primary-blue/10 border-primary-blue/20 text-primary-blue" : "bg-white/5 border-transparent text-white/30 hover:bg-white/10"
                                        )}>{t}</button>
                                    ))}
                                </div>
                            </div>
                            <div className="h-[250px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} strokeOpacity={0.1} />
                                        <XAxis
                                            dataKey="name"
                                            stroke="#444"
                                            tick={{ fontSize: 10, fontWeight: 700 }}
                                            axisLine={false}
                                            tickLine={false}
                                        />
                                        <YAxis hide />
                                        <Tooltip
                                            cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                                            contentStyle={{
                                                backgroundColor: 'rgba(10,10,10,0.9)',
                                                border: '1px solid rgba(255,255,255,0.05)',
                                                borderRadius: '16px',
                                                backdropFilter: 'blur(10px)',
                                                fontSize: '12px'
                                            }}
                                        />
                                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                            {chartData.map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={entry.value > 0 ? '#00ffa3' : '#9d00ff'}
                                                    fillOpacity={0.6}
                                                />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </GlassCard>

                        <GlassCard className="p-8" hover={false}>
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-display font-bold flex items-center gap-3">
                                    <History size={20} className="text-primary-purple" /> History Log
                                </h3>
                                <GlowButton variant="glass" size="sm" className="text-[10px] py-2">Filter Log</GlowButton>
                            </div>
                            <div className="space-y-4">
                                {transactions.map((tx, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.01] border border-white/5 hover:bg-white/5 hover:border-white/10 transition-all cursor-pointer group"
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className={cn(
                                                "w-12 h-12 rounded-2xl flex items-center justify-center border",
                                                tx.amount > 0
                                                    ? "bg-primary-teal/5 border-primary-teal/10 text-primary-teal"
                                                    : "bg-primary-purple/5 border-primary-purple/10 text-primary-purple"
                                            )}>
                                                {tx.amount > 0 ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                                            </div>
                                            <div>
                                                <div className="font-bold text-sm tracking-tight">{tx.title}</div>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[10px] text-white/20 font-black uppercase tracking-widest">{tx.date}</span>
                                                    <span className="w-1 h-1 rounded-full bg-white/10" />
                                                    <span className="text-[10px] text-primary-blue font-bold uppercase tracking-widest opacity-60">{tx.category}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-8">
                                            <div className={cn(
                                                "text-xl font-display font-bold tracking-tighter",
                                                tx.amount > 0 ? "text-primary-teal" : "text-white/60"
                                            )}>
                                                {tx.amount > 0 ? `+${tx.amount}` : tx.amount}
                                            </div>
                                            <ChevronRight size={18} className="text-white/5 group-hover:text-white/40 transition-colors" />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </GlassCard>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Wallet;
