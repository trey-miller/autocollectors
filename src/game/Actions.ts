import { Action } from "redux";
import { ThunkAction } from "redux-thunk";
import { GridType, IGameState, IPosition } from "./State";

export type GameAction<TType = string, TPayload = undefined> = TPayload extends undefined
    ? Action<TType>
    : { type: TType; payload: TPayload };

export const COLLECT = "COLLECT";
export type CollectAction = GameAction<typeof COLLECT, IPosition>;

export const SEARCH = "SEARCH";
export type SearchAction = GameAction<typeof SEARCH, IPosition>;

export const RESET_GAME = "RESET_GAME";
export type ResetGameAction = GameAction<typeof RESET_GAME, { size: number }>;

export const SET_SPEED = "SET_SPEED";
export type SetSpeedAction = GameAction<typeof SET_SPEED, number>;

export const SET_GRID_TYPE = "SET_GRID_TYPE";
export type SetGridTypeAction = GameAction<typeof SET_GRID_TYPE, GridType>;

export const SET_SELECTED_POSITION = "SET_SELECTED_POSITION";
export type SetSelectedPositionAction = GameAction<typeof SET_SELECTED_POSITION, IPosition | null>;

export type ActionUnion =
    | CollectAction
    | SearchAction
    | ResetGameAction
    | SetSpeedAction
    | SetGridTypeAction
    | SetSelectedPositionAction;

export type GameThunkAction = ThunkAction<unknown, IGameState, unknown, ActionUnion>;

export const collect =
    (pos: IPosition): GameThunkAction =>
    (dispatch, getState) => {
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

export const setSelectedPosition = (position: IPosition | null): SetSelectedPositionAction => ({
    type: SET_SELECTED_POSITION,
    payload: position,
});

export const resetGame = (size: number): ResetGameAction => ({ type: RESET_GAME, payload: { size } });

export const setSpeed = (speed: number): SetSpeedAction => ({ type: SET_SPEED, payload: speed });

export const setGridType = (gridType: GridType): SetGridTypeAction => ({ type: SET_GRID_TYPE, payload: gridType });
