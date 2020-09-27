import { ActionUnion } from './Actions';
import { createDefaultState, IGameState } from './State';


export function rootReducer(state: IGameState = createDefaultState(), action?: ActionUnion): IGameState {
    if (!action) {
        return state;
    }

    switch (action.type) {
        case 'DECREMENT':
            const block = action.payload;
            if (block.stuff <= 0) {
                return state;
            }
            return {
                ...state,
                blocks: [
                    ...state.blocks.map((column, y) => y === block.y
                        ? [
                            ...column.slice(0, block.x),
                            { ...block, stuff: block.stuff - 1 },
                            ...column.slice(block.x + 1),
                        ]
                        : column),
                ],
                stuff: state.stuff + 1,
            };
        default:
            return state;
    }
}