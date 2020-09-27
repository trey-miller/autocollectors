import { flatten } from 'lodash';
import { createDefaultState } from './State';
import { createKey } from './util';


describe('Utils work', () => {
    test('createKey creates all unique keys', () => {
        const state = createDefaultState();
        const yMax = state.blocks.length;
        const keys = flatten(state.blocks).map(block => createKey(block.x, block.y, yMax));
        expect(keys.length).toEqual(new Set(keys).size);
    });
});
