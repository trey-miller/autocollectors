import { collect } from './Actions';
import { rootReducer } from './Reducers';
import { createState } from './State';

describe('Collect action works', () => {
    test('Proper block\'s stuff is decremented.', () => {
        const state = createState(10, 10);
        const newState = rootReducer(state, collect(state.blocks[1][2]));
        expect(newState.blocks[1][2]).toEqual({ x: 2, y: 1, stuff: 9 });
    });
    test('Block stuff does not go below zero', () => {
        const x = 5;
        const y = 3;
        const state = createState(10, 10);
        state.blocks[y][x].stuff = 0;
        const newState = rootReducer(state, collect(state.blocks[y][x]));
        expect(newState.blocks[y][x].stuff).toEqual(0);
    });
    test('Reducer does not change number of rows or columns', () => {
        const state = createState(10, 10);
        const newState = rootReducer(state, collect(state.blocks[0][0]));
        expect(newState.blocks.length).toEqual(state.blocks.length);
        expect(newState.blocks[0].length).toEqual(state.blocks[0].length);
    });
    test('Reducer removes only depleted block from collectibleBlocks', () => {
        const x = 5;
        const y = 3;
        const state = createState(10, 10);
        state.blocks[y][x].stuff = 1;
        const newState = rootReducer(state, collect(state.blocks[y][x]));
        expect(newState.collectibleBlocks.some(b => b.x === x && b.y === y)).toEqual(false);
        expect(newState.collectibleBlocks.length).toEqual(state.collectibleBlocks.length - 1);
    });
});