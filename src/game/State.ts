import { range } from "lodash";
import { TypedUseSelectorHook, useSelector } from "react-redux";

export const useGameSelector: TypedUseSelectorHook<IGameState> = useSelector;

export interface IPosition {
    x: number;
    y: number;
}

export interface IBlock extends IPosition {
    /** log2 of the starting stuff; level 1 starts with 2^1=2 stuff, level 5 start swith 2^5=32 stuff */
    level: number;
    stuff: number;
    reachable: boolean;
}

export type IBlocks = IBlock[][];

export enum GridType {
    Canvas = "Canvas",
    Dom = "Dom",
}

export interface IGameState {
    /** Access y first, so block at (2,3) is blocks[3][2] */
    blocks: IBlock[][];
    collectibleBlocks: IPosition[];
    selectedPosition: IPosition | null;
    stuff: number;
    speed: number;
    gridType: GridType;
}

export const createState = (width: number, height: number): IGameState => {
    const blocks = range(height).map(y =>
        range(width).map(x => {
            const level = Math.round((10 * (x + y)) / (width + height));
            return {
                x,
                y,
                level,
                stuff: 2 ** level,
                reachable: y === 0 && x === 0,
            };
        }),
    );
    return {
        blocks,
        collectibleBlocks: [{ x: 0, y: 0 }],
        selectedPosition: null,
        stuff: 0,
        speed: 1,
        gridType: GridType.Canvas,
    };
};

const SIZE = 20;
export const createDefaultState = () => createState(SIZE, SIZE);

export const getBlock = (state: IGameState, { y, x }: IPosition): IBlock | null => {
    return state.blocks[y]?.[x] ?? null;
};

/** get the set of blocks that are the closest to the given position; can be the position itself if it is collectible */
export const getNearestCollectibleBlocks = (state: IGameState, { y, x }: IPosition): IPosition[] => {
    const items = state.collectibleBlocks.map(block => ({
        block,
        distance: Math.abs(block.y - y) + Math.abs(block.x - x),
    }));
    let nearestItems: typeof items = [];

    items.forEach(item => {
        if (nearestItems.length === 0 || nearestItems[0].distance === item.distance) {
            nearestItems.push(item);
        } else if (nearestItems[0].distance > item.distance) {
            nearestItems = [item];
        }
    });
    return nearestItems.map(n => n.block);
};
