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

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

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
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay }}
            style={{
                rotateX: hover ? rotateX : 0,
                rotateY: hover ? rotateY : 0,
                transformStyle: "preserve-3d",
            }}
            whileHover={hover ? {
                y: -4,
                scale: 1.01,
                transition: { duration: 0.2 }
            } : {}}
            className={cn(
                "surface-panel p-6 relative group bg-zinc-900 border-zinc-800",
                className
            )}
        >
            <div
                style={{ transform: "translateZ(20px)" }}
                className="relative z-10"
            >
                {children}
            </div>
        </motion.div>
    );
};

export default GlassCard;
