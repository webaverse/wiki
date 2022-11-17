import { useState, useRef, useEffect } from "react";

import { panelSize, layer1Specs } from "../../generators/scene-generator.js";
import styles from "../../../styles/Storyboard3DRenderer.module.css";

//

import { promptKey } from "../../generators/scene-generator.js";
import CustomButton from "../custom-button/index.js";

//

const Panel3DCanvas = ({ panel }) => {
    const [renderer, setRenderer] = useState(null);

    const canvasRef = useRef();

    // track canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas && panel.getDimension() === 3) {
            const renderer = panel.createRenderer(canvas);
            setRenderer(renderer);

            return () => {
                renderer.destroy();
            };
        }
    }, [panel, canvasRef.current]);

    // listen for snapshot outmesh keys
    useEffect(() => {
        const keydown = (e) => {
            if (!e.repeat) {
                switch (e.key) {
                    case " ": {
                        e.preventDefault();
                        e.stopPropagation();

                        panel.outmesh(renderer);
                        break;
                    }
                }
            }
        };
        document.addEventListener("keydown", keydown);

        return () => {
            document.removeEventListener("keydown", keydown);
        };
    }, [panel, renderer]);

    return (
        <canvas
            className={styles.canvas}
            width={panelSize}
            height={panelSize}
            ref={canvasRef}
        />
    );
};

//

export const Storyboard3DRendererComponent = ({ panel }) => {
    const _getPrompt = () => panel.getData(promptKey) ?? "";
    const [prompt, setPrompt] = useState(_getPrompt);

    useEffect(() => {
        const onupdate = (e) => {
            setPrompt(_getPrompt());
        };
        panel.addEventListener("update", onupdate);

        setPrompt(_getPrompt());

        return () => {
            panel.removeEventListener("update", onupdate);
        };
    }, [panel]);

    return (
        <div className={styles.storyboard3DRenderer}>
            <div className={styles.header}>
                <input
                    type="text"
                    className={styles.input}
                    value={prompt}
                    placeholder="prompt"
                    onChange={(e) => {
                        setPrompt(e.target.value);
                        panel.setData(promptKey, e.target.value);
                    }}
                />
                <CustomButton
                    theme="dark"
                    icon="ai"
                    text="Recompile"
                    size={16}
                    className={styles.methodButton}
                    onClick={async (e) => {
                        await panel.compile();
                    }}
                />
            </div>
            <div className={styles.canvasWrap}>
                <Panel3DCanvas panel={panel} />
            </div>
            <div className={styles.infoBox}>
                <div className={styles.status}>
                  Status: Compiled
                </div>
                <p>Layers:</p>
                {layer1Specs.map(({ name, type }) => {
                    return (
                        <div className={styles.layer} key={name}>
                            {name}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
