import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useStore } from "react-redux";
import { useRafLoop, useWindowSize } from "react-use";
import styles from "../Game.module.scss";
import { setSelectedPosition } from "./Actions";
import { IGameState } from "./State";

export function CanvasGrid(): JSX.Element {
    const dispatch = useDispatch();
    const store = useStore<IGameState>();
    const ref = useRef<HTMLCanvasElement>(null);

    const wsize = useWindowSize();
    const [canvasSize, setCanvasSize] = useState(wsize);

    useEffect(() => {
        if (ref.current != null) {
            const dpi = window.devicePixelRatio;
            setCanvasSize({
                width: ref.current.offsetWidth * dpi,
                height: ref.current.offsetHeight * dpi,
            });
        }
    }, [wsize.width, wsize.height]);

    useRafLoop(() => {
        if (ref.current == null) {
            return;
        }
        const ctx = ref.current.getContext("2d");
        if (ctx == null) {
            return;
        }

        ctx.clearRect(0, 0, ref.current.width, ref.current.height);
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, ref.current.width, ref.current.height);

        const blocks = store.getState().blocks;
        const blockHeight = ref.current.height / blocks.length;

        for (let i = 0; i < blocks.length; i++) {
            const blockWidth = ref.current.width / blocks[i].length;

            for (let j = 0; j < blocks[i].length; j++) {
                const block = blocks[j][i];
                const y = j * blockWidth;
                const x = i * blockHeight;

                if (block.stuff > 0) {
                    const stuffRatio = block.stuff / 10;
                    const drawWidth = stuffRatio * blockWidth;
                    const drawHeight = stuffRatio * blockHeight;
                    const drawX = x + (blockWidth - drawWidth) / 2;
                    const drawY = y + (blockHeight - drawHeight) / 2;

                    ctx.fillStyle = block.reachable ? "#421" : "#222";
                    ctx.fillRect(drawX, drawY, drawWidth, drawHeight);
                }

                ctx.fillStyle = "black";
                ctx.lineWidth = 1;
                ctx.strokeRect(x, y, blockWidth, blockHeight);
            }
        }
    });

    const onClick = useCallback(
        (e: React.MouseEvent<HTMLCanvasElement>) => {
            const rect = ref.current?.getBoundingClientRect();
            if (rect == null) {
                return;
            }
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            const blocks = store.getState().blocks;
            const y = Math.floor((mouseY * blocks.length) / rect.height);
            if (y >= blocks.length) {
                return;
            }
            const x = Math.floor((mouseX * blocks[y].length) / rect.height);
            if (x >= blocks[y].length) {
                return;
            }
            dispatch(setSelectedPosition({ y, x }));
        },
        [dispatch, store],
    );

    return (
        <div className={styles.gridCanvasContainer}>
            <canvas
                className={styles.gridCanvas}
                width={canvasSize.width}
                height={canvasSize.height}
                ref={ref}
                onClick={onClick}
            />
        </div>
    );
}
