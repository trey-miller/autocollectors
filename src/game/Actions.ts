import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { IBlock, IGameState } from './State';


export interface IAction<TType = string, TPayload = undefined> extends Action<TType> {
    type: TType;
    payload: TPayload;
}

export const COLLECT = 'COLLECT';
export type CollectAction = IAction<typeof COLLECT, IBlock>;

export type ActionUnion = (
    | CollectAction
);

export type GameThunkAction = ThunkAction<unknown, IGameState, unknown, ActionUnion>;

export const collect = (block: IBlock): CollectAction => ({
    type: COLLECT,
    payload: block,
});

export const collectRandom = (): GameThunkAction => (dispatch, getState) => {
    const blocks = getState().blocks;
    const y = Math.floor(Math.random() * blocks.length);
    const x = Math.floor(Math.random() * blocks[y].length);
    dispatch(collect(blocks[y][x]));
};
