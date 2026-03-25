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
                            initial={{ opacity: 0, x: -25 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-4xl font-display font-bold text-white tracking-tight"
                        >
                            Ledger & <span className="text-indigo-500">Assets</span>
                        </motion.h1>
                        <p className="text-zinc-500 mt-2 font-medium">Manage your synchronized knowledge exchange units.</p>
                    </div>
                    <div className="flex gap-3">
                        <GlowButton variant="glass" size="sm" className="gap-2">
                            <History size={16} /> History
                        </GlowButton>
                        <GlowButton variant="purple" size="sm" className="gap-2">
                            <Sparkles size={16} /> New Exchange
                        </GlowButton>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Balance Card */}
                    <div className="lg:col-span-1 space-y-6">
                        <GlassCard className="p-8 bg-zinc-900 border-zinc-800" hover={false}>
                            <div className="flex items-center gap-3 mb-10 text-zinc-600">
                                <WalletIcon size={18} className="text-indigo-500" />
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Synchronization Assets</span>
                            </div>
                            <div className="flex items-baseline gap-2 mb-2">
                                <div className="text-6xl font-display font-bold text-white tracking-tighter">
                                    <motion.span>{animatedBalance}</motion.span>
                                </div>
                                <span className="text-indigo-500 font-bold font-mono text-lg">CR</span>
                            </div>
                            <div className="text-xs text-zinc-500 mb-10 font-bold uppercase tracking-widest">~25 protocol syncs available</div>

                            <div className="flex gap-3">
                                <GlowButton variant="purple" fullWidth size="sm">Deposit</GlowButton>
                                <GlowButton variant="glass" fullWidth size="sm">Transfer</GlowButton>
                            </div>
                        </GlassCard>

                        <GlassCard className="p-6 bg-zinc-900 border-zinc-800" hover={true}>
                            <div className="flex items-center justify-between mb-6">
                                <h4 className="font-bold flex items-center gap-2 text-[10px] uppercase tracking-widest text-zinc-400">
                                    <Trophy size={16} className="text-indigo-500" /> Guide Protocol
                                </h4>
                                <span className="text-[9px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 uppercase tracking-widest text-xs">Tier 04</span>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest px-1">
                                    <span className="text-zinc-600">Evolution Progress</span>
                                    <span className="text-indigo-400">85%</span>
                                </div>
                                <div className="h-1.5 bg-zinc-950 rounded-full overflow-hidden mb-2">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        whileInView={{ width: '85%' }}
                                        transition={{ duration: 1, ease: "easeOut" }}
                                        className="h-full bg-indigo-600 rounded-full shadow-[0_0_12px_rgba(79,70,229,0.4)]"
                                    />
                                </div>
                                <p className="text-[10px] text-zinc-600 leading-relaxed font-bold uppercase tracking-widest">
                                    3 protocol syncs remaining to <span className="text-zinc-400">Unlock Tier 05</span>.
                                </p>
                            </div>
                        </GlassCard>

                        <GlassCard className="p-5 flex items-center justify-between bg-zinc-900 border-zinc-800" hover={true}>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-zinc-950 rounded-lg flex items-center justify-center border border-zinc-800 group-hover:border-indigo-500/30 transition-colors">
                                    <CreditCard className="text-zinc-600" size={18} />
                                </div>
                                <div>
                                    <div className="text-[10px] font-bold uppercase tracking-widest text-white">Auto-Refill</div>
                                    <div className="text-[9px] text-zinc-600 font-bold uppercase tracking-[0.2em] mt-1">Inactive</div>
                                </div>
                            </div>
                            <GlowButton variant="glass" size="sm" className="px-4 py-2 text-[9px] font-bold uppercase tracking-widest">Configure</GlowButton>
                        </GlassCard>
                    </div>

                    {/* Visualization & History */}
                    <div className="lg:col-span-2 space-y-8">
                        <GlassCard className="p-8 bg-zinc-900 border-zinc-800" hover={false}>
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-lg font-display font-bold flex items-center gap-3 text-white uppercase tracking-tight">
                                    <BarChart3 size={20} className="text-indigo-500" /> Flow Analytics
                                </h3>
                                <div className="flex gap-2">
                                    {['7D', '30D', 'All'].map(t => (
                                        <button key={t} className={cn(
                                            "text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded border transition-all",
                                            t === '7D' ? "bg-indigo-600/10 border-indigo-500/50 text-indigo-400" : "bg-zinc-950 border-zinc-800 text-zinc-600 hover:text-white"
                                        )}>{t}</button>
                                    ))}
                                </div>
                            </div>
                            <div className="h-[250px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} strokeOpacity={0.2} />
                                        <XAxis
                                            dataKey="name"
                                            stroke="#52525b"
                                            tick={{ fontSize: 9, fontWeight: 700, fill: '#52525b' }}
                                            axisLine={false}
                                            tickLine={false}
                                        />
                                        <YAxis hide />
                                        <Tooltip
                                            cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                                            contentStyle={{
                                                backgroundColor: '#09090b',
                                                border: '1px solid #27272a',
                                                borderRadius: '8px',
                                                fontSize: '10px'
                                            }}
                                        />
                                        <Bar dataKey="value" radius={[2, 2, 0, 0]}>
                                            {chartData.map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={entry.value > 0 ? '#6366f1' : '#27272a'}
                                                    fillOpacity={0.8}
                                                />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </GlassCard>

                        <GlassCard className="p-8 bg-zinc-900 border-zinc-800" hover={false}>
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-lg font-display font-bold flex items-center gap-3 text-white uppercase tracking-tight">
                                    <History size={20} className="text-indigo-500" /> Transaction Log
                                </h3>
                                <GlowButton variant="glass" size="sm" className="text-[9px] py-2 font-bold uppercase tracking-widest">Filter</GlowButton>
                            </div>
                            <div className="space-y-3">
                                {transactions.map((tx, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="flex items-center justify-between p-5 rounded-xl bg-zinc-950 border border-zinc-900 hover:border-zinc-800 transition-all cursor-pointer group shadow-sm"
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className={cn(
                                                "w-10 h-10 rounded-lg flex items-center justify-center border",
                                                tx.amount > 0
                                                    ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-400"
                                                    : "bg-zinc-900 border-zinc-800 text-zinc-600"
                                            )}>
                                                {tx.amount > 0 ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                                            </div>
                                            <div>
                                                <div className="font-bold text-sm tracking-tight text-white uppercase">{tx.title}</div>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">{tx.date}</span>
                                                    <span className="w-1 h-1 rounded-full bg-zinc-800" />
                                                    <span className="text-[9px] text-indigo-500 font-bold uppercase tracking-widest opacity-80">{tx.category}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-8">
                                            <div className={cn(
                                                "text-lg font-display font-bold tracking-tighter",
                                                tx.amount > 0 ? "text-indigo-400" : "text-zinc-500"
                                            )}>
                                                {tx.amount > 0 ? `+${tx.amount}` : tx.amount}
                                            </div>
                                            <ChevronRight size={16} className="text-zinc-800 group-hover:text-zinc-600 transition-colors" />
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
