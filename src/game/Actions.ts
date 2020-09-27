import { IBlock } from './State';


export interface IAction<TPayload = undefined> {
    type: string;
    payload: TPayload;
}

export interface IDecrementAction extends IAction<IBlock> {
    type: 'DECREMENT';
}

export type ActionUnion = (
    | IDecrementAction
);