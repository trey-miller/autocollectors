import React, { useCallback, useMemo } from 'react';
import styles from './Game.module.scss';
import { IBlock, IBlocks, IGameState, IPosition } from './game/State';
import { useDispatch, useSelector } from 'react-redux';
import { useStep } from './game/hooks/useStep';
import { collect, collectRandom, resetGame } from './game/Actions';
import { createKey } from './game/util';


interface IBlockProps {
    block: IBlock;
}

export function Game(): JSX.Element {
    const blocks = useSelector<IGameState, IBlocks>(state => state.blocks);
    const stuff = useSelector<IGameState, number>(state => state.stuff);
    const collectibleBlocks = useSelector<IGameState, IPosition[]>(state => state.collectibleBlocks);
    const dispatch = useDispatch();
    const onResetClick = useCallback(() => dispatch(resetGame()), [dispatch]);

    useStep(delta => {
        dispatch(collectRandom());
    }, 1000, 0);

    return (
        <div className={styles.root}>
            <button onClick={onResetClick}>RESET</button>
            <p>Collected stuff: {stuff}</p>
            {collectibleBlocks.length === 0 && (
                <p className={styles.success}>
                    All stuff collected!
                </p>
            )}
            <div>
                {blocks.map((row, i) => (
                    <div className={styles.row} key={i}>
                        {row.map(block => (
                            <Block
                                key={createKey(block.x, block.y, blocks.length)}
                                block={block}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

function Block({ block }: IBlockProps): JSX.Element {
    const dispatch = useDispatch();
    const onClick = useCallback(() => block.stuff > 0 && dispatch(collect(block)), [dispatch, block]);
    const size = useMemo(() => Math.floor(block.stuff * 100 / 10) + '%', [block.stuff]);
    return (
        <div className={styles.block} onClick={onClick}>
            <div
                className={styles.blockColor}
                style={{ height: size, width: size }}
            />
        </div>
    );
}