import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { IGameState, IPosition } from './State';


export type GameAction<TType = string, TPayload = undefined> = TPayload extends undefined
    ? Action<TType>
    : { type: TType; payload: TPayload; };

export const COLLECT = 'COLLECT';
export type CollectAction = GameAction<typeof COLLECT, IPosition>;

export const RESET_GAME = 'RESET_GAME';
export type ResetGameAction = GameAction<typeof RESET_GAME>;

export type ActionUnion = (
    | CollectAction
    | ResetGameAction
);

export type GameThunkAction = ThunkAction<unknown, IGameState, unknown, ActionUnion>;

export const collect = (block: IPosition): CollectAction => ({
    type: COLLECT,
    payload: block,
});

export const collectRandom = (): GameThunkAction => (dispatch, getState) => {
    const collectibleBlocks = getState().collectibleBlocks;
    if (collectibleBlocks.length > 0) {
        const randomBlock = collectibleBlocks[Math.floor(Math.random() * collectibleBlocks.length)];
        dispatch(collect(randomBlock));
    }
};

export const resetGame = (): ResetGameAction => ({ type: RESET_GAME });