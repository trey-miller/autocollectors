import { flatten } from "lodash";
import { createState } from "./State";
import { createKey, randomElement, set2dValue } from "./util";

describe("Utils work", () => {
    test("createKey creates all unique keys", () => {
        const state = createState(10, 10);
        const yMax = state.blocks.length;
        const keys = flatten(state.blocks).map(block => createKey(block.x, block.y, yMax));
        expect(keys.length).toEqual(new Set(keys).size);
    });
    test("set2dValue sets correct value", () => {
        const state = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
        ];
        const y = 2;
        const x = 1;
        const newState = set2dValue(state, y, x, 42);
        expect(newState[y][x]).toEqual(42);
        expect(newState.length).toEqual(state.length);
        expect(newState[y].length).toEqual(state.length);
    });

    test("randomElement", () => {
        const values = [0, 1, 2, 3, 4];
        const counts = [0, 0, 0, 0, 0];
        let undefinedCount = 0;
        for (let i = 0; i < 10000; i++) {
            const elem = randomElement(values);
            if (elem === undefined) {
                undefinedCount++;
            } else {
                counts[elem]++;
            }
        }
        expect(undefinedCount).toBe(0);
        expect(counts[0]).toBeGreaterThan(0);
        expect(counts[1]).toBeGreaterThan(0);
        expect(counts[2]).toBeGreaterThan(0);
        expect(counts[3]).toBeGreaterThan(0);
        expect(counts[4]).toBeGreaterThan(0);
    });
});
