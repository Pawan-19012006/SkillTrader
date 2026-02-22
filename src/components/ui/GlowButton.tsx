import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '../../utils/cn';

interface GlowButtonProps extends HTMLMotionProps<"button"> {
    variant?: 'purple' | 'blue' | 'teal' | 'glass';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
}

const GlowButton = ({
    children,
    variant = 'purple',
    size = 'md',
    fullWidth = false,
    className,
    ...props
}: GlowButtonProps) => {
    const variants = {
        purple: 'bg-primary-purple hover:glow-purple text-white shadow-glow-purple',
        blue: 'bg-primary-blue hover:glow-blue text-[#0a0a0c] shadow-glow-blue font-bold',
        teal: 'bg-primary-teal text-[#0a0a0c] font-bold shadow-[0_0_20px_rgba(0,255,163,0.3)]',
        glass: 'bg-white/5 border border-white/10 text-white hover:bg-white/10',
    };

    const sizes = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg',
    };

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
                "rounded-full font-semibold transition-all duration-300 flex items-center justify-center gap-2",
                variants[variant],
                sizes[size],
                fullWidth ? 'w-full' : '',
                className
            )}
            {...props}
        >
            {children}
        </motion.button>
    );
};

export default GlowButton;
