import { range } from 'lodash';

export interface IBlock {
    x: number;
    y: number;
    stuff: number;
}

export type IBlocks = IBlock[][];

export interface IGameState {
    /** Access y first, so block at (2,3) is blocks[3][2] */
    blocks: IBlock[][];
    stuff: number;
}


export const createDefaultState = (): IGameState => ({
    blocks: range(0, 20)
        .map(y => range(0, 20)
            .map(x => ({ x, y, stuff: 10 }))),
    stuff: 0,
});