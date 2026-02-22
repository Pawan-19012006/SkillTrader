import { useEffect } from 'react';
import { useMotionValue, useSpring, useTransform } from 'framer-motion';

/**
 * useAnimateCounter hook
 * Animates a numeric value from its current state to a target value.
 */
export function useAnimateCounter(value: number, precision: number = 0) {
    const motionValue = useMotionValue(0);
    const springValue = useSpring(motionValue, {
        damping: 30,
        stiffness: 100,
    });

    useEffect(() => {
        motionValue.set(value);
    }, [value, motionValue]);

    return useTransform(springValue, (latest) => latest.toFixed(precision));
}
