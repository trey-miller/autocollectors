import { IGameState, IPosition } from '../State';
import { set2dValue } from '../util';

export function collectReducer(state: IGameState, { x, y }: IPosition): IGameState {
    const oldBlock = state.blocks[y][x];
    if (oldBlock.stuff <= 0) {
        return state;
    }

    const newBlock = {
        ...oldBlock,
        stuff: oldBlock.stuff - 1,
        reachable: true,
    };
    const isDepleted = newBlock.stuff <= 0;
    return {
        ...state,
        blocks: set2dValue(state.blocks, y, x, newBlock),
        collectibleBlocks: isDepleted
            ? state.collectibleBlocks.filter(b => b.x !== x || b.y !== y)
            : !oldBlock.reachable
                ? [...state.collectibleBlocks, { x, y }]
                : state.collectibleBlocks,
        stuff: state.stuff + 1,
    };
}
