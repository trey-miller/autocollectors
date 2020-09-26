import React, { useCallback, useMemo, useState } from 'react';
import { range } from 'lodash';
import styles from './Game.module.scss';


interface IBlockProps {
    id: string;
    stuff: number;
    onClick?: () => void;
}

function createInitialBlockProps(): IBlockProps[][] {
    return range(0, 20)
        .map(i => range(0, 20)
            .map(j => ({
                stuff: 10,
                id: `${i}_${j}`,
            } as IBlockProps)));
}

function decrementBlock(block: IBlockProps) {

    return block.stuff === 0 ? block : {
        ...block,
        stuff: block.stuff - 1,
    };
}

export function Game(): JSX.Element {
    const [blocks, setBlocks] = useState<IBlockProps[][]>(createInitialBlockProps());

    const onBlockClick = useCallback((id: string, block: IBlockProps) => {
        const blockSpots = id.split('_').map(n => parseInt(n));
        const [blockI, blockJ] = blockSpots;
        console.log(block);
        setBlocks([
            ...blocks.map((row, i) => i === blockI
                ? [
                    ...row.slice(0, blockJ),
                    decrementBlock(block),
                    ...row.slice(blockJ + 1)
                ]
                : row)
        ])
    }, [blocks]);

    return (
        <div className={styles.root}>
            Game root
            {blocks.map(row => (
                <div className={styles.row}>
                    {row.map(cell => (
                        <Block id={cell.id} stuff={cell.stuff} onClick={() => onBlockClick(cell.id, cell)} />
                    ))}
                </div>
            ))}
        </div>
    )
}

function Block({ stuff, onClick }: IBlockProps): JSX.Element {
    const size = useMemo(() => Math.floor(stuff * 100 / 10) + '%', [stuff]);
    return (
        <div className={styles.block} onClick={onClick}>
            <div
                className={styles.blockColor}
                style={{ height: size, width: size }}
            />
        </div>
    )
}