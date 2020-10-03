import React, { useCallback, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { range } from 'lodash';
import styles from './Game.module.scss';
import { IPosition, useGameSelector } from './game/State';
import { useStep } from './game/hooks/useStep';
import { collect, collectRandom, resetGame, setSpeed } from './game/Actions';


export function Game(): JSX.Element {
    const blockRowCount = useGameSelector(state => state.blocks.length);
    return (
        <div className={styles.root}>
            <GameLoop />
            <div className={styles.controls}>
                <Resetter defaultGridSize={blockRowCount} />
                <SpeedSelector />
            </div>
            <StuffDisplay />
            <div className={styles.grid}>
                {range(blockRowCount).map(y => (
                    <BlockRow key={y} y={y} />
                ))}
            </div>
            <SuccessDisplay />
        </div>
    );
}

function GameLoop(): null {
    const dispatch = useDispatch();
    const speed = useGameSelector(state => state.speed);
    const stepMs = useMemo(() => 1000 / speed, [speed]);
    useStep(() => dispatch(collectRandom()), stepMs);
    return null;
}

function Resetter({ defaultGridSize }: { defaultGridSize: number }): JSX.Element {
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
    const onResetClick = useCallback(() => !disabled && dispatch(resetGame(resetSize)), [dispatch, disabled, resetSize]);
    return (
        <p>
            <span>Size</span>
            <input type="number" min={1} defaultValue={String(defaultGridSize)} onChange={onChange} required pattern="[1-9][0-9]*" />
            <button disabled={disabled} onClick={onResetClick}>Reset</button>
        </p>
    );
}

function SpeedSelector(): JSX.Element {
    const dispatch = useDispatch();
    const speed = useGameSelector(state => state.speed);
    const onChange = useCallback(({ target: { valueAsNumber } }: React.ChangeEvent<HTMLInputElement>) => {
        if (valueAsNumber > 0) {
            dispatch(setSpeed(valueAsNumber));
        }
    }, [dispatch]);
    return (
        <p>
            <span>Speed</span>
            <input type="number" min={1} defaultValue={String(speed)} onChange={onChange} required pattern="[1-9][0-9]*" />
            <span>&nbsp;ticks/sec</span>
        </p>
    );
}

function StuffDisplay(): JSX.Element {
    const stuff = useGameSelector(state => state.stuff);
    return (
        <p>Collected stuff: <strong>{stuff}</strong></p>
    );
}

function SuccessDisplay(): JSX.Element | null {
    const isDone = useGameSelector(state => state.collectibleBlocks.length === 0);
    if (isDone) {
        return (
            <p className={styles.success}>All stuff collected!</p>
        );
    }
    return null;
}

function BlockRow({ y }: { y: number }): JSX.Element {
    const rowSize = useGameSelector(state => state.blocks[y].length);
    return (
        <div className={styles.row}>
            {range(rowSize).map(x => (
                <Block key={x} x={x} y={y} />
            ))}
        </div>
    );
}

function Block({ x, y }: IPosition): JSX.Element {
    const block = useGameSelector(state => state.blocks[y][x]);
    const dispatch = useDispatch();
    const onClick = useCallback(() => block.stuff > 0 && dispatch(collect(block)), [dispatch, block]);
    const size = useMemo(() => Math.floor(block.stuff * 100 / 10) + '%', [block.stuff]);

    return (
        <div className={`${styles.block} ${block.reachable ? styles.reachable : ''}`} onClick={onClick}>
            <div
                className={styles.blockColor}
                style={{ height: size, width: size }}
            />
        </div>
    );
}