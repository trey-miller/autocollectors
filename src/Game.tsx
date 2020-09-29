import React, { ChangeEventHandler, useCallback, useMemo, useState } from 'react';
import styles from './Game.module.scss';
import { IBlock, IBlocks, IGameState, IPosition } from './game/State';
import { useDispatch, useSelector } from 'react-redux';
import { useStep } from './game/hooks/useStep';
import { collect, collectRandom, resetGame } from './game/Actions';


interface IBlockProps {
    block: IBlock;
}

const intervalMs = 1000 / 30;

export function Game(): JSX.Element {
    const blocks = useSelector<IGameState, IBlocks>(state => state.blocks);
    const stuff = useSelector<IGameState, number>(state => state.stuff);
    const collectibleBlocks = useSelector<IGameState, IPosition[]>(state => state.collectibleBlocks);
    const dispatch = useDispatch();

    const [resetSize, setResetSize] = useState(blocks.length);
    const onResetSizeChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
        e => setResetSize(parseInt(e.target.value, 10)), []);

    const onResetClick = useCallback(() => dispatch(resetGame(resetSize)), [dispatch, resetSize]);

    const [speed, setSpeed] = useState(1);
    const onSpeedChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
        e => setSpeed(parseInt(e.target.value, 10)), []);

    useStep(() => {
        dispatch(collectRandom());
    }, 1000 / speed, intervalMs);

    return (
        <div className={styles.root}>
            <div className={styles.controls}>
                <p>
                    <button onClick={onResetClick}>Reset</button>
                    <input type="number" min={1} value={resetSize} onChange={onResetSizeChange} />
                </p>
                <p>
                    <span>Speed</span>
                    <input type="number" min={1} value={speed} onChange={onSpeedChange} />
                </p>
            </div>
            <p>Collected stuff: <strong>{stuff}</strong></p>
            <div>
                {blocks.map((row, i) => (
                    <div className={styles.row} key={i}>
                        {row.map(block => (
                            <Block
                                key={block.x}
                                block={block}
                            />
                        ))}
                    </div>
                ))}
            </div>
            {collectibleBlocks.length === 0 && (
                <p className={styles.success}>
                    All stuff collected!
                </p>
            )}
        </div>
    );
}

function Block({ block }: IBlockProps): JSX.Element {
    const dispatch = useDispatch();
    const onClick = useCallback(() => block.stuff > 0 && dispatch(collect(block)), [dispatch, block]);
    const size = useMemo(() => Math.floor(block.stuff * 100 / 10) + '%', [block.stuff]);
    
    return (
        <div className={`${styles.block} ${block.reachable && styles.reachable}`} onClick={onClick}>
            <div
                className={styles.blockColor}
                style={{ height: size, width: size }}
            />
        </div>
    );
}