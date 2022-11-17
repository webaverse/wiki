import { createContext, useEffect, useState } from "react";
import { fetchContent, fetchRerollContent, saveEditedContent } from "../src/utils/api";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
    const [type, setType] = useState(null);
    const [title, setTitle] = useState(null);
    // Initial content unchangable untill saved
    const [content, setContent] = useState();
    // Regenerated content for section reroll
    const [rerollContent, setRerollContent] = useState();
    // Editable and changed content for saving
    const [editableContent, setEditableContent] = useState();

    // Content Loading content state
    const [contentLoading, setContentLoading] = useState(true);

    // Item Url
    const [url, setUrl] = useState(null);

    // State for checking if the content was rerolled or edited.
    const [isContentEdited, setIsContentEdited] = useState(false);

    // Check if saving content is in progress
    const [saveInProgress, setSaveInProgress] = useState(false);

    // Origin URL
    const [ originUrl, setOriginUrl ] = useState();

    useEffect(() => {
        if (url) {
            setContentLoading(true);
            fetchContent(url).then((res) => {
                console.log("FETCHED: ", res);
                setContent(res?.content);
                setEditableContent(res?.content);
                setTitle(res?.title);
                setType(res?.type);
                setContentLoading(false);
                console.log(res?.type)
            });
            if (typeof window !== "undefined") {
                setOriginUrl(window.location.origin)
            }
        }
    }, [url]);

    useEffect(() => {
        if(content === editableContent) {
            setIsContentEdited(false);
        } else {
            setIsContentEdited(true);
        }
    }, [content, editableContent])

    const rerollSection = (sectionName) => {};

    const rerollAllSections = () => {
        if (url) {
            setContentLoading(true);
            fetchRerollContent(url).then((res) => {
                console.log("FETCHED REROLL: ", res);
                setEditableContent(res?.content);
                setTitle(res?.title);
                setType(res?.type);
                setContentLoading(false);
            });
        }
    };

    const saveContent = () => {
        if (content && url) {
            setSaveInProgress(true);
            saveEditedContent(url, editableContent).then((res) => {
                if(res) {
                    setSaveInProgress(false);
                    setContent(editableContent);
                }
            });
        }
    };

    const resetChanges = () => {
        if (content && editableContent) {
            setEditableContent(content);
        }
    };

    const contextValues = {
        type,
        setType,
        title,
        setTitle,
        content,
        setContent,
        editableContent,
        setEditableContent,
        rerollContent,
        setRerollContent,
        url,
        setUrl,
        contentLoading,
        rerollAllSections,
        saveContent,
        isContentEdited,
        saveInProgress,
        resetChanges,
        originUrl
    };
    return (
        <WikiContext.Provider value={contextValues}>
            <Component {...pageProps} />
        </WikiContext.Provider>
    );
}

export const WikiContext = createContext();
export default MyApp;
