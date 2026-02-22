import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { cn } from '../../utils/cn';

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    hover?: boolean;
}

const GlassCard = ({ children, className, delay = 0, hover = true }: GlassCardProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current || !hover) return;

        const rect = ref.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;

        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay }}
            style={{
                rotateX: hover ? rotateX : 0,
                rotateY: hover ? rotateY : 0,
                transformStyle: "preserve-3d",
            }}
            whileHover={hover ? {
                zIndex: 10,
                transition: { duration: 0.3 }
            } : {}}
            className={cn(
                "glass-panel p-6 transition-colors duration-300 relative group",
                className
            )}
        >
            <div
                style={{ transform: "translateZ(50px)" }}
                className="relative z-10"
            >
                {children}
            </div>

            {/* Subtle Inner Glow on Hover */}
            {hover && (
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[inherit]">
                    <div className="absolute inset-[1px] rounded-[inherit] bg-gradient-to-br from-white/10 to-transparent" />
                </div>
            )}
        </motion.div>
    );
};

export default GlassCard;
