import { useState, useEffect, useRef } from "react";
import classnames from "classnames";

import { PlaceholderImg } from "../placeholders/PlaceholderImg.jsx";
import { ArrayBufferRenderer } from "../renderers/ArrayBufferRenderer.jsx";
import { zbencode, zbdecode } from "../../utils/encoding.mjs";
import { downloadFile } from "../../utils/http-utils.js";
import styles from "../../../styles/Storyboard.module.css";

//

import { mainImageKey } from "../../generators/scene-generator.js";
import CustomButton from "../custom-button/index.js";
const textDecoder = new TextDecoder();

//

const StoryboardPanel = ({ storyboard, panel, selected, onClick }) => {
    const _getBusy = () => (panel ? panel.isBusy() : false);
    const _getBusyMessage = () => (panel ? panel.getBusyMessage() : "");
    const _getImage = () => panel.getData(mainImageKey);
    const [busy, setBusy] = useState(_getBusy);
    const [busyMessage, setBusyMessage] = useState(_getBusyMessage);
    const [image, setImage] = useState(_getImage);

    // image handling
    useEffect(() => {
        if (panel) {
            const onbusyupdate = (e) => {
                setBusy(_getBusy());
                setBusyMessage(_getBusyMessage());
            };
            panel.addEventListener("busyupdate", onbusyupdate);
            const onupdate = (e) => {
                setImage(_getImage());
            };
            panel.addEventListener("update", onupdate);

            setBusy(_getBusy());
            setBusyMessage(_getBusyMessage());
            setImage(_getImage());

            return () => {
                panel.removeEventListener("busyupdate", onbusyupdate);
                panel.removeEventListener("update", onupdate);
            };
        }
    }, [panel, busy, image]);

    // drag and drop
    const dragover = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };
    const drop = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const files = e.dataTransfer.files;
        const file = files[0];
        if (file) {
            await panel.setFile(file);
        }
    };

    return (
        <div
            className={classnames(
                styles.panel,
                selected ? styles.selected : null,
                busy ? styles.busy : null
            )}
            onClick={onClick}
            onDragOver={dragover}
            onDrop={drop}
        >
            {(() => {
                if (busy) {
                    return (
                        <PlaceholderImg
                            className={classnames(styles.img, styles.icon)}
                        />
                    );
                } else {
                    return null;
                }
            })()}
            {(() => {
                if (image) {
                    return (
                        <ArrayBufferRenderer
                            srcObject={image}
                            className={classnames(styles.img, styles.preview)}
                        />
                    );
                } else if (!busy) {
                    return (
                        <div className={styles.placeholder}>
                            <img
                                src="/assets/icons/image.svg"
                                className={classnames(styles.img, styles.icon)}
                            />
                        </div>
                    );
                }
            })()}
        </div>
    );
};

//

const StoryboardPanelPlaceholder = ({ onClick }) => {
    return (
        <div className={styles.noPanelsText} onClick={onClick}>
            Create a new panel
            <br /> to start.
        </div>
    );
};

//

export const StoryboardComponent = ({
    storyboard,
    panel,
    panels,
    onPanelSelect,
    onPanelsLoad,
}) => {
    const dragover = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };
    const drop = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const files = e.dataTransfer.files;
        const file = files[0];
        if (file) {
            const panel = await storyboard.addPanelFromFile(file);
            onPanelSelect(panel);
        }
    };

    const fileRef = useRef();

    return (
        <div className={styles.storyboard} onDragOver={dragover} onDrop={drop}>
            <div className={styles.buttons}>
                <CustomButton
                    type="icon"
                    theme="dark"
                    icon="download"
                    size={36}
                    className={styles.button}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();

                        const panelDatas = panels.map((panel) =>
                            panel.getDatas()
                        );
                        const arrayBuffer = zbencode(panelDatas);
                        const blob = new Blob(["WVSB", arrayBuffer], {
                            type: "application/octet-stream",
                        });
                        downloadFile(blob, "storyboard.wvs");
                    }}
                />
                <CustomButton
                    type="icon"
                    theme="dark"
                    icon="upload"
                    className={styles.button}
                    size={36}
                    onClick={() => fileRef.current.click()}
                />
                <CustomButton
                    type="icon"
                    theme="dark"
                    icon="plus"
                    size={36}
                    className={styles.button}
                    onClick={(e) => {
                        const panel = storyboard.addPanel();
                        onPanelSelect(panel);
                    }}
                />
                <input
                    type="file"
                    ref={fileRef}
                    style={{visibility: "hidden"}}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                          (async () => {
                              const panel =
                                  await storyboard.addPanelFromFile(
                                      file
                                  );
                              onPanelSelect(panel);
                          })();
                      }
                      e.target.value = null;
                  }}
                />
            </div>
            {panels.map((p, i) => (
                <StoryboardPanel
                    storyboard={storyboard}
                    panel={p}
                    selected={p === panel}
                    onClick={(e) => {
                        onPanelSelect(p);
                    }}
                    key={p.id}
                />
            ))}
            {panels && panels.length === 0 && (
                <StoryboardPanelPlaceholder
                    onClick={(e) => {
                        const panel = storyboard.addPanel();
                        onPanelSelect(panel);
                    }}
                />
            )}
        </div>
    );
};
