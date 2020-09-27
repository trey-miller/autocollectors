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

const SIZE = 12;

export const createDefaultState = (): IGameState => ({
    blocks: range(0, SIZE)
        .map(y => range(0, SIZE)
            .map(x => ({ x, y, stuff: 10 }))),
    stuff: 0,
});