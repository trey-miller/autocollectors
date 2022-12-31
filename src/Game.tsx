import React, { useCallback, useState } from "react";
import { useDispatch, useStore } from "react-redux";
import styles from "./Game.module.scss";
import { getBlock, getNearestCollectibleBlocks, GridType, IGameState, useGameSelector } from "./game/State";
import { useStep } from "./game/hooks/useStep";
import { collect, collectRandom, resetGame, setGridType, setSelectedPosition, setSpeed } from "./game/Actions";
import { CanvasGrid } from "./game/CanvasGrid";
import { DomGrid } from "./game/DomGrid";
import { randomElement } from "./game/util";

export function Game(): JSX.Element {
    const gridType = useGameSelector(s => s.gridType);
    return (
        <div className={styles.root}>
            <GameLoop />
            <div className={styles.controls}>
                <Resetter />
                <SpeedSelector />
                <GridTypeSelector />
            </div>
            <StuffDisplay />
            <SuccessDisplay />
            {gridType === GridType.Canvas ? <CanvasGrid /> : <DomGrid />}
        </div>
    );
}

function GameLoop(): null {
    const dispatch = useDispatch();
    const store = useStore<IGameState>();
    const speed = useGameSelector(state => state.speed);
    const stepMs = 1000 / speed;

    useStep(() => {
        let selectedPosition = store.getState().selectedPosition;
        if (selectedPosition) {
            const selectedBlock = selectedPosition && getBlock(store.getState(), selectedPosition);
            if (!selectedBlock?.stuff) {
                const collectibles = getNearestCollectibleBlocks(store.getState(), selectedPosition);
                const next = randomElement(collectibles);
                dispatch(setSelectedPosition(next ?? null));
            }
            selectedPosition = store.getState().selectedPosition;
            if (selectedPosition) {
                dispatch(collect(selectedPosition));
            }
        } else {
            dispatch(collectRandom());
        }
    }, stepMs);

    return null;
}

function Resetter(): JSX.Element {
    const defaultGridSize = useGameSelector(state => state.blocks.length);
    const dispatch = useDispatch();
    const [resetSize, setResetSize] = useState(defaultGridSize);
    const [disabled, setDisabled] = useState(false);
    const onChange = useCallback(({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
        const n = parseInt(value, 10);
        if (n > 0) {
            setResetSize(n);
        }
        setDisabled(isNaN(n) || n < 1);
    }, []);
    const onResetClick = useCallback(
        () => !disabled && dispatch(resetGame(resetSize)),
        [dispatch, disabled, resetSize],
    );
    return (
        <p>
            <span>Size</span>
            <input
                type="number"
                min={1}
                defaultValue={String(resetSize)}
                onChange={onChange}
                required
                pattern="[1-9][0-9]*"
            />
            <button disabled={disabled} onClick={onResetClick}>
                Reset
            </button>
        </p>
    );
}

function SpeedSelector(): JSX.Element {
    const dispatch = useDispatch();
    const speed = useGameSelector(state => state.speed);
    const onChange = useCallback(
        ({ target: { valueAsNumber } }: React.ChangeEvent<HTMLInputElement>) => {
            if (valueAsNumber > 0) {
                dispatch(setSpeed(valueAsNumber));
            }
        },
        [dispatch],
    );
    return (
        <p>
            <span>Speed</span>
            <input
                type="number"
                min={1}
                defaultValue={String(speed)}
                onChange={onChange}
                required
                pattern="[1-9][0-9]*"
            />
            <span>&nbsp;ticks/sec</span>
        </p>
    );
}

function GridTypeSelector(): JSX.Element {
    const gridType = useGameSelector(s => s.gridType);
    const dispatch = useDispatch();

    const onChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            dispatch(setGridType(e.target.value as GridType));
        },
        [dispatch],
    );

    return (
        <p>
            <span>Grid Render Type</span>
            <label>
                <input
                    type="radio"
                    name="grid-type"
                    value={GridType.Canvas}
                    checked={gridType === GridType.Canvas}
                    onChange={onChange}
                />
                Canvas
            </label>
            <label>
                <input
                    type="radio"
                    name="grid-type"
                    value={GridType.Dom}
                    checked={gridType === GridType.Dom}
                    onChange={onChange}
                />
                Dom
            </label>
        </p>
    );
}

function StuffDisplay(): JSX.Element {
    const stuff = useGameSelector(state => state.stuff);
    return (
        <p>
            Collected stuff: <strong>{stuff}</strong>
        </p>
    );
}

function SuccessDisplay(): JSX.Element | null {
    const isDone = useGameSelector(state => state.collectibleBlocks.length === 0);
    if (isDone) {
        return <p className={styles.success}>All stuff collected!</p>;
    }
    return null;
}
