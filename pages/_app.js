import { createContext, useEffect, useState } from "react";
import { fetchContent } from "../src/utils/api";
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

    // Item Url
    const [url, setUrl] = useState(null);

    useEffect(() => {
        if (url) {
            fetchContent(url).then((res) => {
                console.log("FETCHED: ", res);
                setContent(res?.content);
                setEditableContent(res?.content);
                setTitle(res?.title);
                setType(res?.type);
            });
        }
    }, [url]);

    const rerollSection = (sectionName) => {

    };

    const rerollAllSections = () => {

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
    };
    return (
        <WikiContext.Provider value={contextValues}>
            <Component {...pageProps} />
        </WikiContext.Provider>
    );
}

export const WikiContext = createContext();
export default MyApp;
