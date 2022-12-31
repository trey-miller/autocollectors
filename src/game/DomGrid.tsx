import { range } from "lodash";
import React, { useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import styles from "../Game.module.scss";
import { setSelectedPosition } from "./Actions";
import { IPosition, useGameSelector } from "./State";

export function DomGrid(): JSX.Element {
    const blockRowCount = useGameSelector(state => state.blocks.length);
    const yRange = useMemo(() => range(blockRowCount), [blockRowCount]);
    return (
        <div className={styles.grid}>
            {yRange.map(y => (
                <BlockRow key={y} y={y} />
            ))}
        </div>
    );
}

function BlockRow({ y }: { y: number }): JSX.Element {
    const rowSize = useGameSelector(state => state.blocks[y].length);
    const xRange = useMemo(() => range(rowSize), [rowSize]);
    return (
        <div className={styles.row}>
            {xRange.map(x => (
                <Block key={x} x={x} y={y} />
            ))}
        </div>
    );
}

function Block({ x, y }: IPosition): JSX.Element {
    const block = useGameSelector(state => state.blocks[y][x]);
    const dispatch = useDispatch();
    const onClick = useCallback(() => block.stuff > 0 && dispatch(setSelectedPosition(block)), [dispatch, block]);
    const size = useMemo(() => Math.floor((block.stuff * 100) / 10) + "%", [block.stuff]);

    return (
        <div className={`${styles.block} ${block.reachable ? styles.reachable : ""}`} onClick={onClick}>
            <div className={styles.blockColor} style={{ height: size, width: size }} />
        </div>
    );
}
