import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Rocket, Search, Wallet } from 'lucide-react';
import GlowButton from './GlowButton';
import { cn } from '../../utils/cn';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Explore Protocols', path: '/explore', icon: <Search size={18} /> },
        { name: 'Sync Scheduler', path: '/scheduler', icon: <Rocket size={18} /> },
        { name: 'Teach Mode', path: '/teach', icon: <Rocket size={18} /> },
        { name: 'Knowledge Assets', path: '/wallet', icon: <Wallet size={18} /> },
    ];

    return (
        <nav className={cn(
            "fixed top-0 w-full z-50 transition-all duration-500 px-6 py-4",
            scrolled ? "bg-zinc-950/80 backdrop-blur-md py-3 border-b border-zinc-800" : "bg-transparent"
        )}>
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center p-2 group-hover:bg-indigo-500 transition-colors">
                        <Rocket className="text-white" size={20} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-2xl font-display font-bold text-white tracking-tighter uppercase italic">
                            SkillTrader
                        </span>
                        <span className="text-[8px] uppercase tracking-[0.4em] text-zinc-500 font-bold -mt-0.5 whitespace-nowrap">Clarity over complexity</span>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={cn(
                                "flex items-center gap-2 text-sm font-semibold transition-colors nav-link",
                                location.pathname === link.path ? "text-white bg-zinc-800" : "text-zinc-400"
                            )}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <div className="h-6 w-[1px] bg-zinc-800 mx-2" />
                    <Link to="/auth">
                        <GlowButton variant="glass" size="sm">Log In</GlowButton>
                    </Link>
                    <Link to="/auth">
                        <GlowButton variant="purple" size="sm">Get Started</GlowButton>
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Nav */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-background/95 backdrop-blur-xl border-b border-white/10 overflow-hidden"
                    >
                        <div className="flex flex-col p-6 gap-6">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-4 text-lg text-white/70 hover:text-white"
                                >
                                    {link.icon}
                                    {link.name}
                                </Link>
                            ))}
                            <hr className="border-white/10" />
                            <Link to="/auth" onClick={() => setIsOpen(false)}>
                                <GlowButton variant="purple" fullWidth>Get Started</GlowButton>
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
