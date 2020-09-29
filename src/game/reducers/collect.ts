import { IGameState, IPosition } from '../State';
import { set2dValue } from '../util';

export function collectReducer(state: IGameState, { x, y }: IPosition): IGameState {
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
}
