import { decrement } from './Actions';
import { rootReducer } from './Reducers';
import { createDefaultState } from './State';

describe('Decrement works', () => {
    test('Proper block is decremented.', () => {
        const state = createDefaultState();
        const newState = rootReducer(state, decrement(state.blocks[1][2]));
        expect(newState.blocks[1][2]).toEqual({ x: 2, y: 1, stuff: 9 });
    });
    test('Block stuff does not go below zero', () => {
        const x = 5;
        const y = 3;
        const state = createDefaultState();
        state.blocks[y][x].stuff = 0;
        const newState = rootReducer(state, decrement(state.blocks[y][x]));
        expect(newState.blocks[y][x].stuff).toEqual(0);
    });
    test('Reducer does not change number of rows or columns', () => {
        const state = createDefaultState();
        const newState = rootReducer(state, decrement(state.blocks[0][0]));
        expect(newState.blocks.length).toEqual(state.blocks.length);
        expect(newState.blocks[0].length).toEqual(state.blocks[0].length);
    });
});