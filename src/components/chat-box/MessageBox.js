import React, { useEffect, useRef, useState } from "react";
import classnames from "classnames";
//import styles from "./ChatBox.module.css";
import styles from "./MessageBox.module.css";
import { ChatAvatar } from "./ChatAvatar";
import Markdown from "marked-react";
// import { getAverageRGB } from "../../../utils";

export const MessageBox = (props) => {
    const { author, message, nextAuthor, prevAuthor, index, isLeft } = props;
    const createdAt = new Date();
    const time = createdAt.getHours() + ":" + createdAt.getMinutes();
    // Check if the next or previous messages have the same author/user
    const isNxtMsgFrmSameAuthor = nextAuthor === author;
    const isPrvMsgFrmSameAuthor = prevAuthor === author;
    // Check if the message is an image
    console.log("Message: ", isNxtMsgFrmSameAuthor, isPrvMsgFrmSameAuthor);
    const isImageMessage = message?.match(/\!\[([^\]]*?)\]\(([^\)]*?)\)/g);

    return (
        <div
            className={classnames(
                styles.messageBoxWrap,
                isNxtMsgFrmSameAuthor && styles.sameAuthor
                //!isLeft && prevAuthor && styles["rightAlign"]
            )}
            key={index}
        >
            <ChatAvatar
                isLeft={true}
                name={author}
                hide={!isPrvMsgFrmSameAuthor ? false : true}
            />
            <div className={styles.messageContentWrap}>
                {!isPrvMsgFrmSameAuthor && (
                    <div
                        className={classnames(
                            styles.infoWrap,
                            isNxtMsgFrmSameAuthor
                        )}
                    >
                        <div className={styles.time}>
                            {author}
                            <span>{time} PM</span>
                        </div>
                    </div>
                )}
                <div
                    className={classnames(
                        styles.messageContent,
                        isImageMessage && styles.isImage,
                        isPrvMsgFrmSameAuthor && styles.noFold
                    )}
                >
                    <Markdown gfm openLinksInNewTab={false}>
                        {message}
                    </Markdown>
                </div>
            </div>
        </div>
    );
};
