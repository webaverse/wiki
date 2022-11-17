import uuidByString from "uuid-by-string";
import Head from "next/head";

import styles from "../../styles/ContentObject.module.css";
import { Ctx } from "../../clients/context.js";
import {
    cleanName,
    formatImages,
    formatUrls,
    getGalleryArray,
    getSectionsContentArray,
} from "../../utils.js";
import { generateItem } from "../../datasets/dataset-generator.js";
import { formatItemText } from "../../datasets/dataset-parser.js";
import { getDatasetSpecs } from "../../datasets/dataset-specs.js";
import React, { useContext, useState } from "react";
import { UserBox } from "../../src/components/user-box/UserBox";
import { EditSource } from "../../src/components/edit-source";
import {
    LeftSection,
    RightSection,
} from "../../src/components/content-sections";
import { MiniMap } from "../../src/components/mini-map/MiniMap";
import { ImageLoader } from "../../src/components/image-loader/ImageLoader";
import { MetaTags } from "../../src/components/meta-tags/MetaTags";
import { fetchContent } from "../../src/utils/api";
import { WikiContext } from "../_app";

import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { LeftSkeleton } from "../../src/components/content-sections/LeftSkeleton";
import { RightSkeleton } from "../../src/components/content-sections/RightSkeleton";
import CustomButton from "../../src/components/custom-button";

//

const rightColumn = [
    "Alignment",
    "Price",
    "Stats",
    "Properties",
    "Has",
    "Abilities",
    "Limit Break",
    "Biome",
    "Items",
    "Mobs",
];

const hideSections = ["Name", "Class", "Image"];

//

const ContentObject = ({ url }) => {
    const [itemName, setItemName] = useState("");
    const [itemClass, setItemClass] = useState("");
    const [featuredImage, setFeaturedImage] = useState("");
    const [description, setDecription] = useState("");
    const [gallery, setGallery] = useState([]);

    const [sections, setSections] = useState([]);
    const [editSource, setEditSource] = useState(false);
    const [formatedContent, setFormatedContent] = useState();

    const [data, setData] = useState();
    const [loading, setLoading] = useState();

    const {
        setUrl,
        content,
        type,
        contentLoading,
        rerollAllSections,
        saveContent,
        editableContent,
        isContentEdited,
        saveInProgress,
        resetChanges,
    } = useContext(WikiContext);

    React.useEffect(() => {
        setUrl(url);
    }, [url]);

    React.useEffect(() => {
        setLoading(contentLoading);
    }, [contentLoading]);

    React.useEffect(() => {
        if (editableContent && type) {
            formatImages(editableContent, type).then((fiContent) => {
                formatUrls(fiContent).then((fuContent) => {
                    setFormatedContent(fuContent);
                });
            });
        }
    }, [editableContent]);

    React.useEffect(() => {
        if (formatedContent) {
            getSectionsContentArray(formatedContent).then(
                (sectionsArrayResponse) => {
                    setSections(sectionsArrayResponse);
                    setItemName(
                        sectionsArrayResponse?.filter(
                            (item) => item.title === "Name"
                        )[0]?.content
                    );
                    setItemClass(
                        sectionsArrayResponse?.filter(
                            (item) => item.title === "Class"
                        )[0]?.content
                    );
                }
            );
            getGalleryArray(formatedContent).then((galleryArrayResponse) => {
                if (galleryArrayResponse) {
                    setGallery(galleryArrayResponse);
                }
            });
        }
    }, [formatedContent]);

    React.useEffect(() => {
        if (sections && sections.length > 0) {
            const imageContent = sections.filter(
                (item) => item.title.toLowerCase() === "image"
            )[0]?.content;
            if (imageContent) {
                const match = imageContent.match(/(?<=\().+?(?=\))/g);
                console.log(match);
                if (match) {
                    setFeaturedImage(
                            `${window.location.origin}${encodeURIComponent(`${match[0]}.png`)}`
                     
                    );
                } else {
                    setFeaturedImage(
                            `${window.location.origin}/api/images/${type}s/${encodeURIComponent(imageContent)}.png`
                     
                    );
                }
            } else {
                if (gallery) {
                    let randIndex = Math.floor(Math.random() * gallery.length);
                    setFeaturedImage(gallery[randIndex]?.url);
                }
            }
        }
    }, [sections]);

    const editContentSource = () => {
        setEditSource(true);
    };

    const backToPage = () => {
        setEditSource(false);
    };

    const editSection = async (content) => {};

    //if (loading) return <p>Loading...</p>;
    //if (!data) return <p>No profile data</p>;

    return (
        <SkeletonTheme baseColor="#203544" highlightColor="#264051">
            <div className={styles.character}>
                <MetaTags
                    title={`${itemName} ${itemClass && `- ${itemClass}`}`}
                    description={description}
                    image={featuredImage}
                />
                <UserBox />
                <img
                    src={"/assets/logo.svg"}
                    className={styles.logo}
                    alt="Webaverse Wiki"
                />

                <div className={styles.contentWrap}>
                    <div className={styles.name}>
                        <span className={styles.type}>
                            {loading ? <Skeleton width={100} /> : `${type}s`}
                        </span>
                        <h1>
                            {loading ? <Skeleton width={"50%"} /> : itemName}
                        </h1>
                        {!editSource ? (
                            <div className={styles.sourceActions}>
                                <div
                                    className={styles.edit}
                                    onClick={editContentSource}
                                >
                                    <img
                                        src={"/assets/edit-source-lock.svg"}
                                        className={styles.icon}
                                    />
                                    Edit Source
                                </div>
                                <div
                                    className={styles.edit}
                                    onClick={rerollAllSections}
                                >
                                    <img
                                        src={"/assets/refresh.svg"}
                                        className={styles.icon}
                                    />
                                    Reroll Content
                                </div>
                            </div>
                        ) : (
                            <div className={styles.sourceActions}>
                                <div
                                    className={styles.back}
                                    onClick={backToPage}
                                >
                                    <img
                                        src={"/assets/arrowBack.svg"}
                                        className={styles.iconBack}
                                    />
                                    Back to Page
                                </div>
                                <button className={styles.button}>Save</button>
                            </div>
                        )}
                    </div>
                    {!editSource ? (
                        <React.Fragment>
                            <div className={styles.rightContent}>
                                {type !== "chat" && (
                                    <>
                                        <div className={styles.title}>
                                            {loading ? (
                                                <Skeleton width={100} />
                                            ) : (
                                                itemName
                                            )}
                                        </div>
                                        {itemClass && (
                                            <div className={styles.subtitle}>
                                                {itemClass}
                                            </div>
                                        )}
                                        {loading ? (
                                            <Skeleton
                                                height={220}
                                                style={{ marginBottom: "8px" }}
                                            />
                                        ) : (
                                            <div
                                                className={
                                                    styles.previewImageWrap
                                                }
                                            >
                                                <img
                                                    src={
                                                        "/assets/image-frame.svg"
                                                    }
                                                    className={styles.frame}
                                                />
                                                <div className={styles.mask}>
                                                    <ImageLoader
                                                        url={featuredImage}
                                                        className={styles.image}
                                                        rerollable={true}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                                {loading ? (
                                    <RightSkeleton />
                                ) : (
                                    <div>
                                        {sections &&
                                            sections.map((section, i) => {
                                                if (
                                                    rightColumn.includes(
                                                        section.title
                                                    )
                                                )
                                                    return (
                                                        <RightSection
                                                            title={
                                                                section.title
                                                            }
                                                            content={
                                                                section.content
                                                            }
                                                            type={type}
                                                            index={i}
                                                            loading={loading}
                                                            key={i}
                                                        />
                                                    );
                                            })}
                                        <MiniMap coordinates={""} />
                                    </div>
                                )}
                            </div>
                            <div className={styles.leftContent}>
                                {loading ? (
                                    <LeftSkeleton />
                                ) : (
                                    <div className={styles.markdown}>
                                        {sections &&
                                            sections.map((section, i) => {
                                                if (
                                                    !rightColumn.includes(
                                                        section.title
                                                    ) &&
                                                    !hideSections.includes(
                                                        section.title
                                                    )
                                                ) {
                                                    return (
                                                        <LeftSection
                                                            title={
                                                                section.title
                                                            }
                                                            content={
                                                                section.content
                                                            }
                                                            editSection={
                                                                editSection
                                                            }
                                                            gallery={gallery}
                                                            type={type}
                                                            index={i}
                                                            key={i}
                                                        />
                                                    );
                                                }
                                            })}
                                    </div>
                                )}
                            </div>
                        </React.Fragment>
                    ) : (
                        <EditSource content={content} />
                    )}
                </div>
            </div>
            {isContentEdited && (
                <div className={styles.saveEditedContentWrap}>
                    <CustomButton
                        theme="dark"
                        icon="check"
                        text={saveInProgress ? "Saving..." : "Save Changes"}
                        size={14}
                        className={styles.methodButton}
                        onClick={() => !saveInProgress && saveContent()}
                    />
                    <CustomButton
                        theme="dark"
                        icon="close"
                        text="Cancel"
                        size={14}
                        disabled={saveInProgress ? true : false}
                        className={styles.methodButton}
                        onClick={() => !saveInProgress && resetChanges()}
                    />
                </div>
            )}
        </SkeletonTheme>
    );
};

ContentObject.getInitialProps = async (ctx) => {
    const { req } = ctx;
    const url = req.url;
    return {
        url,
    };
};

export default ContentObject;
