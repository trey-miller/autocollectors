import React, { useCallback, useMemo, useRef } from 'react';
import styles from './Game.module.scss';
import { IBlock, IBlocks, IGameState } from './game/State';
import { useDispatch, useSelector } from 'react-redux';
import { useStep } from './game/hooks/useStep';


interface IBlockProps {
    block: IBlock;
    onClick?: () => void;
}

export function Game(): JSX.Element {
    const blocks = useSelector<IGameState, IBlocks>(state => state.blocks);
    const stuff = useSelector<IGameState, number>(state => state.stuff);
    const dispatch = useDispatch();
    const updated = useRef({ total: 0, totalMs: 0, lastTime: 0, off: 0, offAverage: 0 });

    useStep(delta => {
        const y = Math.floor(Math.random() * blocks.length);
        const x = Math.floor(Math.random() * blocks[0].length);
        dispatch({ type: 'DECREMENT', payload: blocks[y][x] });

        // debug logging for sanity (delete the below some day)
        const now = Date.now();
        updated.current.total++;
        updated.current.totalMs += now - (updated.current.lastTime || now - delta);
        updated.current.lastTime = now;
        updated.current.off = updated.current.total * 1000 / updated.current.totalMs;
        console.log('auto decrementing block at ', x, y, 'delta: ', delta, 'time: ', now, updated.current);

    }, 1000, 0);

    const onBlockClick = useCallback((block: IBlock) => {
        console.log('clicked block', block);
        dispatch({ type: 'DECREMENT', payload: block });
    }, [blocks]);

    return (
        <div className={styles.root}>
            <p>Collected stuff: {stuff}</p>
            <div>
                {blocks.map(row => (
                    <div className={styles.row}>
                        {row.map(block => (
                            <Block block={block} onClick={() => onBlockClick(block)} />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

function Block({ block: { stuff }, onClick }: IBlockProps): JSX.Element {
    const size = useMemo(() => Math.floor(stuff * 100 / 10) + '%', [stuff]);
    return (
        <div className={styles.block} onClick={onClick}>
            <div
                className={styles.blockColor}
                style={{ height: size, width: size }}
            />
        </div>
    );
}