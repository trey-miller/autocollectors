import { flatten } from 'lodash';
import { createState } from './State';
import { createKey, set2dValue } from './util';


describe('Utils work', () => {
    test('createKey creates all unique keys', () => {
        const state = createState(10, 10);
        const yMax = state.blocks.length;
        const keys = flatten(state.blocks).map(block => createKey(block.x, block.y, yMax));
        expect(keys.length).toEqual(new Set(keys).size);
    });
    test('set2dValue sets correct value', () => {
        const state = [[0, 1, 2], [3, 4, 5], [6, 7, 8]];
        const y = 2;
        const x = 1;
        const newState = set2dValue(state, y, x, 42);
        expect(newState[y][x]).toEqual(42);
        expect(newState.length).toEqual(state.length);
        expect(newState[y].length).toEqual(state.length);
    });
});
