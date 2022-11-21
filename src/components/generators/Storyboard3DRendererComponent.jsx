import { useState, useRef, useEffect } from "react";
import classnames from "classnames";

import {
    panelSize,
    tools,
    layer1Specs,
    layer2Specs,
} from "../../generators/scene-generator.js";
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
                    case "1":
                    case "2":
                    case "3":
                    case "4":
                    case "5":
                    case "6":
                    case "7":
                    case "8":
                    case "9": {
                        const keyIndex = parseInt(e.key, 10) - 1;
                        renderer.setTool(tools[keyIndex] ?? tools[0]);
                        break;
                    }
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
    const [layer, setLayer] = useState(null);

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

    const layersArray = panel.getDataLayersMatchingSpecs([
        layer1Specs,
        layer2Specs,
    ]);
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
                <div className={styles.status}>Status: Compiled</div>
                <p>Layers:</p>
                {layersArray.map((layers, layerIndex) => {
                    if (layers) {
                        return (
                            <div className={styles.layers} key={layerIndex}>
                                {layers.map(({ key, type }) => {
                                    return (
                                        <div
                                            className={classnames(
                                                styles.layer,
                                                layer === key
                                                    ? styles.selected
                                                    : null
                                            )}
                                            onClick={(e) => {
                                                setLayer(
                                                    layer !== key ? key : null
                                                );
                                            }}
                                            key={key}
                                        >
                                            {key}
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    } else {
                        return null;
                    }
                })}
            </div>
        </div>
    );
};
