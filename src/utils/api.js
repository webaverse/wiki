// Endpints
const apiDataBase = "/api/data";

// Fetch Content
export const fetchContent = async (url, format) => {
    return await fetch(`${apiDataBase}${url}`)
        .then((res) => res.json())
        .then((data) => {
            return data;
        });
};
