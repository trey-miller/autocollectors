import { range } from 'lodash';
import { TypedUseSelectorHook, useSelector } from 'react-redux';

export const useGameSelector: TypedUseSelectorHook<IGameState> = useSelector;

export interface IPosition {
    x: number;
    y: number;
}

export interface IBlock extends IPosition {
    stuff: number;
    reachable: boolean;
}

export type IBlocks = IBlock[][];

export interface IGameState {
    /** Access y first, so block at (2,3) is blocks[3][2] */
    blocks: IBlock[][];
    collectibleBlocks: IPosition[];
    stuff: number;
    speed: number;
}


export const createState = (width: number, height: number): IGameState => {
    const blocks = range(height)
        .map(y => range(width)
            .map(x => ({
                x,
                y,
                stuff: 10,
                reachable: y === 0 && x === 0,
            })));
    return {
        blocks,
        collectibleBlocks: [{ x: 0, y: 0 }],
        stuff: 0,
        speed: 1,
    };
};

const SIZE = 20;
export const createDefaultState = () => createState(SIZE, SIZE);
