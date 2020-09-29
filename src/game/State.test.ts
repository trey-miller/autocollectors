import { createState } from './State';


describe('Create default state', () => {
    test('Blocks have proper x and y values', () => {
        const state = createState(10, 10);
        expect(state.blocks[2][3].x).toEqual(3);
        expect(state.blocks[2][3].y).toEqual(2);
    });
});