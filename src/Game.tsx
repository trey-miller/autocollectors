import React, { useCallback, useMemo } from 'react';
import styles from './Game.module.scss';
import { IBlock, IBlocks, IGameState } from './game/State';
import { useDispatch, useSelector } from 'react-redux';
import { useStep } from './game/hooks/useStep';
import { decrement, decrementRandom } from './game/Actions';
import { createKey } from './game/util';


interface IBlockProps {
    block: IBlock;
    onClick?: () => void;
}

export function Game(): JSX.Element {
    const blocks = useSelector<IGameState, IBlocks>(state => state.blocks);
    const stuff = useSelector<IGameState, number>(state => state.stuff);
    const dispatch = useDispatch();

    useStep(delta => {
        dispatch(decrementRandom());
    }, 1000, 0);

    const onBlockClick = useCallback((block: IBlock) => {
        console.log('clicked block', block);
        dispatch(decrement(block));
    }, [blocks]);

    return (
        <div className={styles.root}>
            <p>Collected stuff: {stuff}</p>
            <div>
                {blocks.map((row, i) => (
                    <div className={styles.row} key={i}>
                        {row.map(block => (
                            <Block
                                key={createKey(block.x, block.y, blocks.length)}
                                block={block}
                                onClick={() => onBlockClick(block)}
                            />
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