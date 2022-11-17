// import * as THREE from 'three';
import { useState, useRef, useEffect } from "react";
import classnames from "classnames";
import { prompts } from "../../constants/prompts.js";
import { CharacterGenerator } from "../../generators/character-generator.js";
import { mod } from "../../../utils.js";

import styles from "../../../styles/Gen.module.css";
import CustomButton from "../custom-button/index.js";
import { PlaceholderImg } from "../placeholders/PlaceholderImg.jsx";
import CharacterBox from "./CharacterBox.jsx";

//

const characterGenerator = new CharacterGenerator();

//

const vqaQueries = [
    `is this birds eye view?`,
    `is the viewer looking up at the sky?`,
    `is the viewer looking up at the ceiling?`,
    `how many feet tall is the viewer?`,
];

//

const numImages = 4;
const CharacterGeneratorComponent = () => {
    const [prompt, setPrompt] = useState(prompts.character);
    const [bodyIndex, setBodyIndex] = useState(0);
    const [step, setStep] = useState(1);
    const [busy, setBusy] = useState(false);

    const canvasRef = useRef();
    const loaderRef = useRef();

    const [characters, setCharacters] = useState([]);

    const _moveBody = (delta) => {
        const nextBodyIndex = mod(bodyIndex + delta, numImages);
        setBodyIndex(nextBodyIndex);
    };

    const Loader = () => {
        return (
            <div className={styles.generatingCharacter} ref={loaderRef}>
                <div className={styles.loaderWrap}>
                    Generating Character
                    <PlaceholderImg className={classnames(styles.loader)} />
                </div>
            </div>
        );
    };

    const generateCharacter = async () => {
        setBusy(true);
        try {
            const charCanvas = await characterGenerator.generate(
                prompt
                //canvasRef.current
            );
            // Adds the generated canvas to "characters" array
            setCharacters((current) => [...current, charCanvas]);
            setStep(2);
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className={styles.generator}>
            <input
                type="text"
                className={styles.input}
                value={prompt}
                onChange={(e) => {
                    setPrompt(e.target.value);
                }}
                placeholder={prompts.character}
                disabled={busy}
            />
            <CustomButton
                theme="dark"
                icon="ai"
                text="Generate"
                size={16}
                className={styles.methodButton}
                onClick={() => generateCharacter()}
            />
            <div className={styles.characterCreator}>
                <div className={styles.canvasWrap} ref={canvasRef}>
                    {busy && <Loader />}
                    {characters &&
                        characters.reverse().map((character, i) => {
                            return (
                                <CharacterBox
                                    key={i}
                                    charCanvas={character}
                                    leftArrowClick={() => _moveBody(-1)}
                                    rightArrowClick={() => _moveBody(1)}
                                    showArrows={step === 2 ? true : false}
                                />
                            );
                        })}
                </div>
            </div>
        </div>
    );
};
export default CharacterGeneratorComponent;
