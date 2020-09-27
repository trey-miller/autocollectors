import React, { useCallback, useMemo } from 'react';
import styles from './Game.module.scss';
import { IBlock, IBlocks, IGameState } from './game/State';
import { useDispatch, useSelector } from 'react-redux';


interface IBlockProps {
    block: IBlock;
    onClick?: () => void;
}

export function Game(): JSX.Element {
    const blocks = useSelector<IGameState, IBlocks>(state => state.blocks);
    const dispatch = useDispatch();

    const onBlockClick = useCallback((block: IBlock) => {
        console.log('clicked block', block);
        dispatch({ type: 'DECREMENT', payload: block });
    }, [blocks]);

    return (
        <div className={styles.root}>
            Game root
            {blocks.map(col => (
                <div className={styles.row}>
                    {col.map(block => (
                        <Block block={block} onClick={() => onBlockClick(block)} />
                    ))}
                </div>
            ))}
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