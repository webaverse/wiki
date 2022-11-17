import { useState, useEffect } from "react";
import styles from "../../../styles/StoryboardGenerator.module.css";
import { prompts } from "../../constants/prompts.js";
import CustomButton from "../custom-button";

//

export const StoryboardGeneratorComponent = ({ storyboard, panel }) => {
    const [prompt, setPrompt] = useState(prompts.world);

    // drag and drop
    const dragover = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };
    const drop = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!panel.isBusy()) {
            const files = e.dataTransfer.files;
            const file = files[0];
            if (file) {
                await panel.setFile(file);
            }
        }
    };

    return (
        <div
            className={styles.storyboardGenerator}
            onDragOver={dragover}
            onDrop={drop}
        >
            <input
                type="text"
                className={styles.input}
                value={prompt}
                onChange={(e) => {
                    setPrompt(e.target.value);
                }}
                placeholder={prompts.character}
            />
            <CustomButton
                theme="dark"
                icon="image"
                text="Generate Image"
                size={16}
                className={styles.methodButton}
                onClick={async () => {
                    await panel.setFromPrompt(prompt);
                }}
            />
            <div className={styles.uploadWrap}>
                    <div className={styles.uploadOptions}>
                        <h3>Drag and Drop</h3>
                        <p>or</p>
                        <a className={styles.fileUpload}>
                            <input
                                type="file"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        (async () => {
                                            await panel.setFile(file);
                                        })();
                                    }
                                    e.target.value = null;
                                }}
                            />
                            Upload File
                        </a>
                    </div>
                </div>
        </div>
    );
};
