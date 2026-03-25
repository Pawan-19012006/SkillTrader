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
        purple: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm',
        blue: 'bg-white text-zinc-950 hover:bg-zinc-200 shadow-sm font-bold',
        teal: 'bg-zinc-800 text-white border border-zinc-700 hover:bg-zinc-700',
        glass: 'bg-zinc-900 border border-zinc-800 text-zinc-100 hover:bg-zinc-800',
    };

    const sizes = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-2.5 text-sm',
        lg: 'px-8 py-3.5 text-base',
    };

    return (
        <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
                "rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2",
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
