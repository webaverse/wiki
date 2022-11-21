import { useState, useRef, useEffect } from "react";
import classnames from "classnames";
import styles from "../../../styles/Gen.module.css";
import CustomButton from "../custom-button";

const CharacterBox = (props) => {
    const { charCanvas, leftArrowClick, rightArrowClick } = props;

    const canvasRef = useRef();

    useEffect(() => {
        if (charCanvas) {
            canvasRef.current.appendChild(charCanvas);
        }
    }, [charCanvas]);

    return (
        <div className={styles.characterBox}>
            <CustomButton
                type="icon"
                theme="light"
                icon="arrowLeft"
                className={styles.leftArrow}
                size={32}
                onClick={async () => {
                    leftArrowClick();
                }}
            />
            <div ref={canvasRef}></div>
            <CustomButton
                type="icon"
                theme="light"
                icon="arrowRight"
                className={styles.rightArrow}
                size={32}
                onClick={async () => {
                    rightArrowClick();
                }}
            />
        </div>
    );
};

export default CharacterBox;
