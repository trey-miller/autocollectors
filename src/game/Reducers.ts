import { ActionUnion, COLLECT, RESET_GAME } from './Actions';
import { createDefaultState, IGameState } from './State';
import { set2dValue } from './util';


export function rootReducer(state: IGameState = createDefaultState(), action?: ActionUnion): IGameState {
    if (!action) {
        return state;
    }

    switch (action.type) {
        case COLLECT:
            const { x, y } = action.payload;
            const block = state.blocks[y][x];
            if (block.stuff <= 0) {
                return state;
            }
            const newBlock = { ...block, stuff: block.stuff - 1 };
            const isDepleted = newBlock.stuff <= 0;
            return {
                ...state,
                blocks: set2dValue(state.blocks, y, x, newBlock),
                collectibleBlocks: isDepleted
                    ? state.collectibleBlocks.filter(b => b.x !== x || b.y !== y)
                    : state.collectibleBlocks,
                stuff: state.stuff + 1,
            };
        case RESET_GAME:
            return createDefaultState();
        default:
            return state;
    }
}