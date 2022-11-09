import { Ctx } from "./clients/context";

export const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
export const capitalizeAllWords = (s) => {
    let words = s.split(/\s+/);
    words = words.map((word) => capitalize(word));
    return words.join(" ");
};
export const ensureUrl = async (url) => {
    const numRetries = 5;
    for (let i = 0; i < numRetries; i++) {
        const res = await fetch(url);
        if (res.ok) {
            return;
        } else {
            if (res.status === 408) {
                continue;
            } else {
                throw new Error(`invalid status code: ${res.status}`);
            }
        }
    }
};
export const cleanName = (name) => {
    name = name.replace(/_/g, " ");
    name = name.toLowerCase();
    name = capitalizeAllWords(name);
    return name;
};
export const isAllCaps = (name) => {
    return !/[A-Z]/.test(name) || /^(?:[A-Z]+)$/.test(name);
};

// Format Images
export const formatImages = async (md, type) => {
    md = md.replace(/\!\[([^\]]*?)\]\(([^\)]*?)\)/g, (all, title, url) => {
        const match = title.match(/^([\s\S]*?)(\|[\s\S]*?)?$/);
        if (match) {
            title = match[1].trim();
            url = match[2] ? match[2].trim() : title;
            if (url) {
                return `![${title}](/api/images/${type}s/${encodeURIComponent(
                    url
                )}.png)`;
            } else {
                return null;
            }
        } else {
            return all;
        }
    });
    return md;
};

// Format URLs
export const formatUrls = async (md) => {
    md = md.replace(
        /(\!?)\[([\s\S]+?)\]\(([\s\S]+?)\)/g,
        (all, q, title, url) => {
            if (q) {
                return all;
            }
            return `[${title}](${encodeURI(url)})`;
        }
    );
    return md;
};

// Format Sections

export const getSectionsContentArray = async (content, query) => {
    // Section Title Separator
    const sectionSeperator = "##";
    // Title & Description Separator by first ":" in the string
    const titleDescriptionSeperator = /:(.*)/s;

    const sections = [];
    const sectionsArray = content.split(sectionSeperator);
    await sectionsArray.map((section) => {
        if (section) {
            let sectionItem = {
                title: section.split(titleDescriptionSeperator)[0].trim(),
                content: section.split(titleDescriptionSeperator)[1].trim(),
            };
            sections.push(sectionItem);
        }
    });
    return sections;
};

// Format Chat ( Get Array )
export const getChatContentArray = async (content) => {

    // Count every new line after "## Chat:" as a new message/item.
    const regMessages = /\n(.*)\n/g;
    // Split name & message by the first ":" in the string.
    const regNameMessage = /:(.*)/s;
    // Match and split notifications by "######" in the string.
    const regNotifications = /######(.*)/s;
    //
    const chatArray = [];

    if (content) {
        let chatItemsArray = content.trim().split(regMessages);
        console.log("Chat Array: ", chatItemsArray);
        if (chatItemsArray) {
            let nextAuthor;
            let chatItem = {
                type: "",
                author: "",
                message: "",
            };
            await chatItemsArray.map((item, index) => {
                if (item) {
                    let author = item.split(regNameMessage)[0]?.trim();
                    let message = item.split(regNameMessage)[1]?.trim();
                    // Set next message author
                    nextAuthor = chatItemsArray[index + 1]
                        ?.split(regNameMessage)[0]
                        ?.trim();
                    // Check if the line is a notification 
                    let isNotification = item.match(regNotifications)
                        ? true
                        : false;
                    //
                    if (isNotification) {
                        chatItem.type = "Notification";
                        chatItem.author = "System";
                        let notification = item
                            .split(regNotifications)[1]
                            ?.trim();
                        chatItem.message = notification;
                    } else {
                        chatItem.type = "Message";
                        chatItem.author = author;
                        chatItem.message = message;
                    }
                    //
                    if (chatItem?.author && chatItem?.message) {
                        chatArray.push(chatItem);
                        // Clear chat item
                        chatItem = {
                            type: "",
                            author: "",
                            message: "",
                        };
                    }
                }
            });
        }
    }
    return chatArray;
};

// Fetch Gallery Images as an Array
export const getGalleryArray = async (content) => {
    const gallery = [];
    const imagesArray = content.match(/\!\[([^\]]*?)\]\(([^\)]*?)\)/g);
    if (imagesArray) {
        await imagesArray.map((image) => {
            const title = image.match(/(?<=\[).+?(?=\])/g)[0];
            const url = image.match(/(?<=\().+?(?=\))/g)[0];
            let galleryItem = {
                caption: title,
                url: url,
            };
            if (url) {
                gallery.push(galleryItem);
            }
        });
    }
    return gallery;
};
