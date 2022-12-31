import { useRef } from "react";
import { useRafLoop } from "react-use";

/** updates as close to every stepMs as possible, while hopefully preventing drift over time. */
export function useStep(update: (delta: number) => void, stepMs: number = 1 / 30): void {
    const lastTimeRef = useRef(0);
    const accumRef = useRef(0);

    useRafLoop(time => {
        if (lastTimeRef.current === 0) {
            lastTimeRef.current = time;
        }
        const delta = time - lastTimeRef.current;
        lastTimeRef.current = time;
        accumRef.current += delta;
        let updatesLeft = 10; // cap updates in this step to a reasonable maximum, without losing the accum

        while (accumRef.current >= stepMs && updatesLeft > 0) {
            update(stepMs);
            accumRef.current -= stepMs;
            updatesLeft--;
        }
    });
}
