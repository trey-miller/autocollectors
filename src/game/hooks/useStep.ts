import { useMemo, useRef } from 'react';
import { useInterval } from 'react-use';


/** updates as close to every stepMs as possible, while hopefully preventing drift over time. */
export function useStep(update: (delta: number) => void, stepMs: number = (1 / 30), intervalMs = 42): void {
    const lastTimeRef = useRef(Date.now());
    const accumRef = useRef(0);
    const maxAccum = useMemo(() => stepMs * 5, [stepMs]);

    useInterval(() => {
        const now = Date.now();
        const delta = now - lastTimeRef.current;
        lastTimeRef.current = now;
        accumRef.current += delta;
        if (accumRef.current > maxAccum) {
            accumRef.current = maxAccum;
        }
        while (accumRef.current >= stepMs) {
            update(stepMs);
            accumRef.current -= stepMs;
        }
    }, intervalMs);
}