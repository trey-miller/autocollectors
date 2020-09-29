import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { IGameState, IPosition } from './State';


export type GameAction<TType = string, TPayload = undefined> = TPayload extends undefined
    ? Action<TType>
    : { type: TType; payload: TPayload; };

export const COLLECT = 'COLLECT';
export type CollectAction = GameAction<typeof COLLECT, IPosition>;

export const SEARCH = 'SEARCH';
export type SearchAction = GameAction<typeof SEARCH, IPosition>;

export const RESET_GAME = 'RESET_GAME';
export type ResetGameAction = GameAction<typeof RESET_GAME, { size: number }>;

export type ActionUnion = (
    | CollectAction
    | SearchAction
    | ResetGameAction
);

export type GameThunkAction = ThunkAction<unknown, IGameState, unknown, ActionUnion>;

export const collect = (pos: IPosition): GameThunkAction => (dispatch, getState) => {
    dispatch({ type: COLLECT, payload: pos });
    const collectedBlock = getState().blocks[pos.y][pos.x];
    if (collectedBlock.stuff === 0) {
        dispatch({ type: SEARCH, payload: collectedBlock });
    }
};

export const collectRandom = (): GameThunkAction => (dispatch, getState) => {
    const collectibleBlocks = getState().collectibleBlocks;
    if (collectibleBlocks.length > 0) {
        const randomBlock = collectibleBlocks[Math.floor(Math.random() * collectibleBlocks.length)];
        dispatch(collect(randomBlock));
    }
};

export const resetGame = (size: number): ResetGameAction => ({ type: RESET_GAME, payload: { size } });