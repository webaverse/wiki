import React, { useState, useEffect } from "react";
import classnames from "classnames";
import styles from "./ChatAvatar.module.css";
import { ImageLoader } from "../image-loader/ImageLoader";

export const ChatAvatar = (props) => {
    const { name, index, className, isLeft, hide } = props;
    const [characterContent, setCharacterContent] = useState();

    useEffect(() => {
        if (name) {
        }
    }, [name]);

    return (
        <div
            className={classnames(styles.chatAvatarWrap, className)}
            key={index}
        >
            {!hide && <div className={styles.test} />}
            {!hide && (
                <div className={styles.avatarImageWrap}>
                    <img
                        src={`/assets/avatar-frame-${
                            isLeft ? "left" : "right"
                        }.svg`}
                        className={styles.frame}
                    />
                    <div
                        className={classnames(
                            styles.mask,
                            !isLeft && styles.right
                        )}
                    >
                        <ImageLoader
                            url={`/api/images/character/${name}.png`}
                            className={styles.image}
                            rerollable={false}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};
