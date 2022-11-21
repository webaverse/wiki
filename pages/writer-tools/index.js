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
import { Character } from "./characters";

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
        originUrl
    } = useContext(WikiContext);

    
    return (
        <SkeletonTheme baseColor="#203544" highlightColor="#264051">
            <div className={styles.character}>
                <img
                    src={"/assets/logo.svg"}
                    className={styles.logo}
                    alt="Webaverse Wiki"
                />

                <div className={styles.contentWrap}>
                    <Character />
                </div>
            </div>
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
