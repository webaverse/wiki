import Head from "next/head";
import React from "react";

export const MetaTags = (props) => {
    const { title, description, image, url } = props;
    console.log(image);
    return (
        <Head>
            <title>{title}</title>
            <meta name="description" content={description} />

            <meta itemprop="name" content={title} />
            <meta itemprop="description" content={description} />
            <meta itemprop="image" content={image} />

            <meta
                property="og:url"
                content="https://wiki-auqusaig8-weba.vercel.app/characters/jacob"
            />
            <meta property="og:type" content="website" />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />

            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={image} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />
        </Head>
    );
};
