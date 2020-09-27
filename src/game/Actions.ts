import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { IBlock, IGameState } from './State';


export interface IAction<TType = string, TPayload = undefined> extends Action<TType> {
    type: TType;
    payload: TPayload;
}

export const DECREMENT = 'DECREMENT';
export type DecrementAction = IAction<typeof DECREMENT, IBlock>;

export type ActionUnion = (
    | DecrementAction
);

export type GameThunkAction = ThunkAction<unknown, IGameState, unknown, ActionUnion>;

export const decrement = (block: IBlock): DecrementAction => ({
    type: DECREMENT,
    payload: block,
});

export const decrementRandom = (): GameThunkAction => (dispatch, getState) => {
    const blocks = getState().blocks;
    const y = Math.floor(Math.random() * blocks.length);
    const x = Math.floor(Math.random() * blocks[y].length);
    dispatch(decrement(blocks[y][x]));
};
