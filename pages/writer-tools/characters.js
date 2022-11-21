import React, { useState, useEffect, useContext } from "react";
import CustomButton from "../../src/components/custom-button";
import styles from "./WriterTools.module.css";

export const Character = (props) => {
    // States For saving dataset values
    // Do not change
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [charClass, setCharClass] = useState("");
    const [stats, setStats] = useState({
        atk: 0,
        def: 0,
        vit: 0,
        spr: 0,
        dex: 0,
        lck: 0,
    });
    const [alignment, setAlignment] = useState(""); 
    const [quotes, setQuotes] = useState([]);
    const [image, setImage] = useState();
    const [imageGallery, setImageGallery] = useState();
    const [has, setHas] = useState([]);
    const [abilities, setAbilities] = useState();
    const [limitBreak, setLimitBreak] = useState();
    const [biography, setBiography] = useState();
    const [appearance, setAppearance] = useState("");
    const [personality, setPersonality] = useState("");
    const [homespace, setHomespace] = useState("");
    const [relationships, setRelationships] = useState("");
    const [trivia, setTrivia] = useState([]);

    const [content, setContent] = useState();

    const [triggerChange, setTriggerChange] = useState(true);

    useEffect(() => {
      
    let formatedQuotes = '';
    for (const k in quotes) {
        const v = quotes[k];
        if (v) {
            formatedQuotes += `- ${v}\n`;
        }
    }

    let formatedHas = '';
    for (const k in has) {
        const v = has[k];
        if (v) {
            formatedHas += `- [${v}](/items/${v})\n`;
        }
    }

        const content = `
## Name:
${name}
## Description:
${description}
## Class:
${charClass}
## Stats:
ATK: ${stats?.atk}, DEF: ${stats?.def}, VIT: ${stats?.vit}, SPR: ${stats?.spr}, DEX: ${stats?.dex}, LCK: ${stats?.lck}
## Alignment:
${alignment}
## Quotes:
${formatedQuotes}
## Image:
${image}
## Image Gallery:
${imageGallery}
## Has:
${formatedHas}
## Abilities:
${abilities}
## Limit Break:
${limitBreak}
## Biography:
${biography}
## Appearance:
${appearance}
## Personality:
${personality}
## Homespace:
${homespace}
## Relationships:
${relationships}
## Trivia:
${trivia}
`;
        setContent(content);
        setTriggerChange(false);

        //console.log(content);
    }, [
        name,
        description,
        charClass,
        stats,
        alignment,
        quotes,
        image,
        imageGallery,
        has,
        abilities,
        limitBreak,
        biography,
        appearance,
        personality,
        homespace,
        relationships,
        trivia
    ]);

    const handleStatsChange = (e) => {
        setStats({
            ...stats,
            [e.target.id]: e.target.value,
        });
    };

    const hadleQuoteValueChange = (e) => {
        let index = e.target.id;
        const newQuotes = [...quotes];
        newQuotes[index] = e.target.value;
        setQuotes(newQuotes);
    };

    const addQuote = () => {
        const quote = "";
        setQuotes((current) => [...current, quote]);
    };

    const deleteQuote = (index) => {
        const newQuotes = quotes.filter((item, i) => i !== index);
        setQuotes(newQuotes);
    };


    const hadleHasValueChange = (e) => {
        let index = e.target.id;
        const newHas = [...has];
        newHas[index] = e.target.value;
        setHas(newHas);
    };

    const addHasItem = () => {
        const hasItem = "";
        setHas((current) => [...current, hasItem]);
    };

    const deleteHasItem = (index) => {
        const newHas = has.filter((item, i) => i !== index);
        setHas(newHas);
    };

    const [tab, setTab] = useState(1);

    return (
        <div>
            <h2 className={styles.tabs}>
                <span
                    onClick={() => setTab(1)}
                    className={tab === 1 && styles.active}
                >
                    Edit
                </span>
                <span
                    onClick={() => setTab(2)}
                    className={tab === 2 && styles.active}
                >
                    Preview
                </span>
                <span
                    onClick={() => setTab(3)}
                    className={tab === 3 && styles.active}
                >
                    Dataset
                </span>
            </h2>
            {tab === 1 && (
                <div className={styles.editContent}>
                    <h2>Name</h2>
                    <label>Character's full name:</label>
                    <input
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                    />
                    <h2>Description</h2>
                    <label>Paragraphs describing the character:</label>
                    <textarea
                        onChange={(e) => setDescription(e.target.value)}
                        value={description}
                    />
                    <h2> Class</h2>
                    <label>Character's class/job/role:</label>
                    <input
                        onChange={(e) => setCharClass(e.target.value)}
                        value={charClass}
                    />
                    <h2> Alignment</h2>
                    <label>
                        Dungeaon & Dragons style moral/ethical alignment, like
                        Chaotic Neutral:
                    </label>
                    <input
                        onChange={(e) => setAlignment(e.target.value)}
                        value={alignment}
                    />
                    <h2> Stats</h2>
                    <label>Character's stats:</label>
                    <div className={styles.statsFormWrap}>
                        <div>
                            <label>Attack:</label>
                            <input
                                type="number"
                                id="atk"
                                onChange={(e) => handleStatsChange(e)}
                                value={stats?.atk}
                            />
                        </div>
                        <div>
                            <label>Defense:</label>
                            <input
                                type="number"
                                id="def"
                                onChange={(e) => handleStatsChange(e)}
                                value={stats?.def}
                            />
                        </div>
                        <div>
                            <label>Vitality:</label>
                            <input
                                type="number"
                                id="vit"
                                onChange={(e) => handleStatsChange(e)}
                                value={stats?.vit}
                            />
                        </div>
                        <div>
                            <label>Sprint:</label>
                            <input
                                type="number"
                                id="spr"
                                onChange={(e) => handleStatsChange(e)}
                                value={stats?.spr}
                            />
                        </div>
                        <div>
                            <label>Dexterity:</label>
                            <input
                                type="number"
                                id="dex"
                                onChange={(e) => handleStatsChange(e)}
                                value={stats?.dex}
                            />
                        </div>
                        <div>
                            <label>Luck:</label>
                            <input
                                type="number"
                                id="lck"
                                onChange={(e) => handleStatsChange(e)}
                                value={stats?.lck}
                            />
                        </div>
                    </div>
                    <h2> Image</h2>
                    <label>Character's main image:</label>
                    <div className={styles.imageFormWrap}>
                        <div className={styles.imageTitle}>
                            <label>Title:</label>
                            <input
                                id="title"
                                onChange={(e) => handleStatsChange(e)}
                                value={image?.title}
                            />
                        </div>
                        <div className={styles.imageDesc}>
                            <label>Description:</label>
                            <input
                                id="description"
                                onChange={(e) => handleStatsChange(e)}
                                value={image?.description}
                            />
                        </div>
                    </div>
                    <h2> Image Gallery</h2>
                    <label>Character's image gallery:</label>
                    <div className={styles.imageFormWrap}>
                        <div className={styles.imageTitle}>
                            <label>Image 1 Title:</label>
                            <input
                                id="title"
                                onChange={(e) => handleStatsChange(e)}
                                value={image?.title}
                            />
                        </div>
                        <div className={styles.imageDesc}>
                            <label>Image 1 Description:</label>
                            <input
                                id="description"
                                onChange={(e) => handleStatsChange(e)}
                                value={image?.description}
                            />
                        </div>
                    </div>
                    <div className={styles.imageFormWrap}>
                        <div className={styles.imageTitle}>
                            <label>Image 2 Title:</label>
                            <input
                                id="title"
                                onChange={(e) => handleStatsChange(e)}
                                value={image?.title}
                            />
                        </div>
                        <div className={styles.imageDesc}>
                            <label>Image 2 Description:</label>
                            <input
                                id="description"
                                onChange={(e) => handleStatsChange(e)}
                                value={image?.description}
                            />
                        </div>
                    </div>
                    <div className={styles.imageFormWrap}>
                        <div className={styles.imageTitle}>
                            <label>Image 3 Title:</label>
                            <input
                                id="title"
                                onChange={(e) => handleStatsChange(e)}
                                value={image?.title}
                            />
                        </div>
                        <div className={styles.imageDesc}>
                            <label>Image 3 Description:</label>
                            <input
                                id="description"
                                onChange={(e) => handleStatsChange(e)}
                                value={image?.description}
                            />
                        </div>
                    </div>
                    <div className={styles.imageFormWrap}>
                        <div className={styles.imageTitle}>
                            <label>Image 4 Title:</label>
                            <input
                                id="title"
                                onChange={(e) => handleStatsChange(e)}
                                value={image?.title}
                            />
                        </div>
                        <div className={styles.imageDesc}>
                            <label>Image 4 Description:</label>
                            <input
                                id="description"
                                onChange={(e) => handleStatsChange(e)}
                                value={image?.description}
                            />
                        </div>
                    </div>
                    <h2> Quotes</h2>
                    <label>
                        List of important quotes the character has said:
                    </label>
                    <div className={styles.quoteList}>
                        <div>
                            {quotes &&
                                quotes.map((quote, index) => {
                                    return (
                                        <div
                                            className={styles.quoteFormItem}
                                            key={index}
                                        >
                                            <label>Quote from {name}:</label>
                                            <input
                                                onChange={(e) =>
                                                    hadleQuoteValueChange(e)
                                                }
                                                value={quote}
                                                id={index}
                                            />
                                            <CustomButton
                                                type="icon"
                                                theme="dark"
                                                icon="close"
                                                size={24}
                                                className={styles.remove}
                                                onClick={() =>
                                                    deleteQuote(index)
                                                }
                                            />
                                        </div>
                                    );
                                })}
                        </div>
                        <button onClick={() => addQuote()}>+ Add Quote</button>
                    </div>
                    <h2> Has</h2>
                    <label>Items the character has in their inventory:</label>
                    <p>- [Giga Sword](/items/Giga Sword)</p>
                    <div className={styles.quoteList}>
                        <div>
                            {has &&
                                has.map((item, index) => {
                                    return (
                                        <div
                                            className={styles.quoteFormItem}
                                            key={index}
                                        >
                                            <label>Has Item:</label>
                                            <input
                                                onChange={(e) =>
                                                    hadleHasValueChange(e)
                                                }
                                                value={item}
                                                id={index}
                                            />
                                            <CustomButton
                                                type="icon"
                                                theme="dark"
                                                icon="close"
                                                size={24}
                                                className={styles.remove}
                                                onClick={() =>
                                                    deleteHasItem(index)
                                                }
                                            />
                                        </div>
                                    );
                                })}
                        </div>
                        <button onClick={() => addHasItem()}>+ Add Item</button>
                    </div>
                    <h2> Abilities</h2>
                    <label>List of character's abilities:</label>
                    <p>- [Bro Shield](/abilities/Bro Shield)</p>
                    <h2> Limit Break</h2>
                    <label>Character's limit break ability:</label>
                    <textarea
                        onChange={(e) => setLimitBreak(e.target.value)}
                        value={limitBreak}
                    />
                    <h2> Biography</h2>
                    <label>Character's long-form biography:</label>
                    <textarea
                        onChange={(e) => setBiography(e.target.value)}
                        value={biography}
                    />
                    <h2> Appearance</h2>
                    <label>Visual description of the character:</label>
                    <textarea
                        onChange={(e) => setAppearance(e.target.value)}
                        value={appearance}
                    />
                    <h2> Personality</h2>
                    <label>Description of the character's personality:</label>
                    <textarea
                        onChange={(e) => setPersonality(e.target.value)}
                        value={personality}
                    />
                    <h2> Homespace</h2>
                    <label>Description where the character lives:</label>
                    <textarea
                        onChange={(e) => setHomespace(e.target.value)}
                        value={homespace}
                    />
                    <h2> Relationships</h2>
                    <label>
                        How this character relates to other characters:
                    </label>
                    <textarea
                        onChange={(e) => setRelationships(e.target.value)}
                        value={relationships}
                    />
                    <h2> Trivia</h2>
                    <label>Random trivia about the character:</label>
                    <p>- Buster's birthday is April 1st.</p>
                </div>
            )}
            {tab === 3 && (
                <div className={styles.rawView}>
                    <pre>{content}</pre>
                </div>
            )}
        </div>
    );
};
