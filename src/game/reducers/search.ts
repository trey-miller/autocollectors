import { IGameState, IPosition } from '../State';
import { set2dValue } from '../util';


function searchBlock(state: IGameState, y: number, x: number): IGameState {
    if (y < 0 || y >= state.blocks.length || x < 0 || x >= state.blocks.length) {
        return state;
    }
    const block = state.blocks[y][x];
    if (block.reachable) {
        return state;
    }
    return {
        ...state,
        blocks: set2dValue(state.blocks, y, x, { ...block, reachable: true }),
        collectibleBlocks: [...state.collectibleBlocks, { x, y }],
    };
}

export function searchReducer(state: IGameState, { x, y }: IPosition): IGameState {
    const block = state.blocks[y][x];
    if (block.stuff > 0) {
        return state;
    }
    state = searchBlock(state, y + 1, x);
    state = searchBlock(state, y - 1, x);
    state = searchBlock(state, y, x + 1);
    state = searchBlock(state, y, x - 1);
    return state;
}