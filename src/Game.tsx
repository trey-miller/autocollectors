import React, { ChangeEventHandler, useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { range } from 'lodash';
import styles from './Game.module.scss';
import { IBlock, IGameState, IPosition } from './game/State';
import { parseIntWithDefault } from './game/util';
import { useStep } from './game/hooks/useStep';
import { collect, collectRandom, resetGame } from './game/Actions';


export function Game(): JSX.Element {
    const blockRowCount = useSelector<IGameState, number>(state => state.blocks.length);
    return (
        <div className={styles.root}>
            <div className={styles.controls}>
                <Resetter defaultGridSize={blockRowCount} />
                <SpeedSelectorGameLoop />
            </div>
            <StuffDisplay />
            <div>
                {range(0, blockRowCount).map(y => (
                    <BlockRow key={y} y={y} />
                ))}
            </div>
            <SuccessDisplay />
        </div>
    );
}

function Resetter({ defaultGridSize }: { defaultGridSize: number }): JSX.Element {
    const dispatch = useDispatch();

    const [resetSize, setResetSize] = useState(defaultGridSize);
    const onResetSizeChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
        e => setResetSize(parseIntWithDefault(e.target.value, resetSize)), [resetSize]);

    const onResetClick = useCallback(() => dispatch(resetGame(resetSize)), [dispatch, resetSize]);
    return (
        <p>
            <span>Size</span>
            <input type="number" min={1} value={resetSize} onChange={onResetSizeChange} />
            <button onClick={onResetClick}>Reset</button>
        </p>
    );
}

function SpeedSelectorGameLoop(): JSX.Element {
    // TODO split out game loop from the speed selector, while moving speed to the store.
    const dispatch = useDispatch();
    const [speed, setSpeed] = useState(1);
    const onSpeedChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
        e => setSpeed(parseIntWithDefault(e.target.value, speed)), [speed]);

    const stepMs = useMemo(() => 1000 / speed, [speed]);
    useStep(() => dispatch(collectRandom()), stepMs);
    return (
        <p>
            <span>Speed</span>
            <input type="number" min={1} value={speed} onChange={onSpeedChange} />
            <span>&nbsp;ticks/sec</span>
        </p>
    );
}

function StuffDisplay(): JSX.Element {
    const stuff = useSelector<IGameState, number>(state => state.stuff);
    return (
        <p>Collected stuff: <strong>{stuff}</strong></p>
    );
}

function SuccessDisplay(): JSX.Element | null {
    const isDone = useSelector<IGameState, boolean>(state => state.collectibleBlocks.length === 0);
    if (isDone) {
        return (
            <p className={styles.success}>All stuff collected!</p>
        );
    }
    return null;
}

function BlockRow({ y }: { y: number }): JSX.Element {
    const rowSize = useSelector<IGameState, number>(state => state.blocks[y].length);
    return (
        <div className={styles.row}>
            {range(0, rowSize).map(x => (
                <Block key={x} x={x} y={y} />
            ))}
        </div>
    );
}

function Block({ x, y }: IPosition): JSX.Element {
    const block = useSelector<IGameState, IBlock>(state => state.blocks[y][x]);
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