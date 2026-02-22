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
        { name: 'Explore', path: '/explore', icon: <Search size={18} /> },
        { name: 'Scheduler', path: '/scheduler', icon: <Rocket size={18} /> },
        { name: 'Wallet', path: '/wallet', icon: <Wallet size={18} /> },
    ];

    return (
        <nav className={cn(
            "fixed top-0 w-full z-50 transition-all duration-500 px-6 py-4",
            scrolled ? "bg-background/80 backdrop-blur-md py-3 border-b border-white/10" : "bg-transparent"
        )}>
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-purple to-primary-blue rounded-xl flex items-center justify-center p-2 group-hover:scale-110 transition-transform">
                        <Rocket className="text-[#0a0a0c]" />
                    </div>
                    <span className="text-2xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                        SkillSwap
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={cn(
                                "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary-blue",
                                location.pathname === link.path ? "text-primary-blue" : "text-white/70"
                            )}
                        >
                            {link.icon}
                            {link.name}
                        </Link>
                    ))}
                    <div className="h-6 w-[1px] bg-white/10 mx-2" />
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
