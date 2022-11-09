import React, { useState, useEffect, useContext } from "react";
import classnames from "classnames";
import styles from "./ChatBox.module.css";
import { formatImages, formatUrls, getChatContentArray } from "../../../utils";
import { MessageBox } from "./MessageBox";
import { testContent } from "./dataset";

export const ChatBox = (props) => {
    const { content, index, type } = props;
    const [chatArray, setChatArray] = useState([]);

    // FOR TESTING ONLY /////////////////////////////////////////////
    const [formatedChatContent, setFormatedChatContent] = useState();
    useEffect(() => {
        if (content) {
            // REMEMBER to replace "chatTestContent" with "content"
            formatImages(testContent, type).then((fiContent) => {
                formatUrls(fiContent).then((fuContent) => {
                    setFormatedChatContent(fuContent);
                });
            });
        }
    }, [content]);
    // ///////////////////////////////////////////////////////////////

    // REMEMBER to replace "formatedChatContent" with "content"
    useEffect(() => {
        if (formatedChatContent) {
            getChatContentArray(formatedChatContent).then(
                (chatArrayResponse) => {
                    if (chatArrayResponse) {
                        setChatArray(chatArrayResponse);
                    }
                }
            );
        }
    }, [formatedChatContent]);

    return (
        <div className={styles.chatWrap} key={index}>
            <div className={styles.chat}>
                <div className={styles.scrollChatContent}>
                    {chatArray &&
                        chatArray.map((chatItem, index) => {
                            let author = chatItem?.author;
                            let message = chatItem?.message;
                            let nextAuthor = chatArray[index + 1]?.author;
                            let prevAuthor = chatArray[index - 1]?.author;
                            let isLeft = true;
                            if (chatItem[index - 1]) {
                                isLeft =
                                    author !== prevAuthor && isLeft
                                        ? false
                                        : true;
                            }
                            return (
                                <div key={index}>
                                    {chatItem?.type === "Notification" && (
                                        <h4>{chatItem?.message}</h4>
                                    )}
                                    {chatItem?.type === "Message" && (
                                        <MessageBox
                                            author={author}
                                            message={message}
                                            nextAuthor={nextAuthor}
                                            prevAuthor={prevAuthor}
                                            isLeft={isLeft}
                                        />
                                    )}
                                </div>
                            );
                        })}
                </div>
            </div>
        </div>
    );
};
