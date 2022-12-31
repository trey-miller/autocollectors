import { ActionUnion, COLLECT, RESET_GAME, SEARCH, SET_GRID_TYPE, SET_SELECTED_POSITION, SET_SPEED } from "../Actions";
import { collectReducer } from "./collect";
import { searchReducer } from "./search";
import { createDefaultState, createState, IGameState } from "../State";

export function rootReducer(state: IGameState = createDefaultState(), action?: ActionUnion): IGameState {
    if (!action) {
        return state;
    }

    switch (action.type) {
        case COLLECT:
            return collectReducer(state, action.payload);
        case SEARCH:
            return searchReducer(state, action.payload);
        case RESET_GAME:
            const { size } = action.payload;
            return {
                ...createState(size, size),
                speed: state.speed,
                gridType: state.gridType,
            };
        case SET_SPEED:
            return {
                ...state,
                speed: action.payload,
            };
        case SET_GRID_TYPE:
            return {
                ...state,
                gridType: action.payload,
            };
        case SET_SELECTED_POSITION:
            return {
                ...state,
                selectedPosition: action.payload,
            };
        default:
            return state;
    }
}
