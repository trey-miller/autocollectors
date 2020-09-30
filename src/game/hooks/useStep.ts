import { useMemo, useRef } from 'react';
import { useRafLoop } from 'react-use';


/** updates as close to every stepMs as possible, while hopefully preventing drift over time. */
export function useStep(update: (delta: number) => void, stepMs: number = (1 / 30)): void {
    const lastTimeRef = useRef(0);
    const accumRef = useRef(0);
    const maxAccum = useMemo(() => stepMs * 10, [stepMs]);

    useRafLoop(time => {
        if (lastTimeRef.current === 0) {
            lastTimeRef.current = time;
        }
        const delta = time - lastTimeRef.current;
        lastTimeRef.current = time;
        accumRef.current += delta;
        if (accumRef.current > maxAccum) {
            accumRef.current = maxAccum;
        }
        while (accumRef.current >= stepMs) {
            update(stepMs);
            accumRef.current -= stepMs;
        }
    });
}