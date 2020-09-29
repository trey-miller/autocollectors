import { flatten, range } from 'lodash';

export interface IPosition {
    x: number;
    y: number;
}

export interface IBlock extends IPosition {
    stuff: number;
}

export type IBlocks = IBlock[][];

export interface IGameState {
    /** Access y first, so block at (2,3) is blocks[3][2] */
    blocks: IBlock[][];
    collectibleBlocks: IPosition[];
    stuff: number;
}


export const createState = (width: number, height: number): IGameState => {
    const blocks = range(0, height)
        .map(y => range(0, width)
            .map(x => ({ x, y, stuff: 10 })));
    return {
        blocks,
        collectibleBlocks: flatten(blocks).map(b => ({ x: b.x, y: b.y })),
        stuff: 0,
    };
};

const SIZE = 3;
export const createDefaultState = () => createState(SIZE, SIZE);
