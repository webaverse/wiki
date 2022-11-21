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

// Reroll Content
export const fetchRerollContent = async (url, format) => {
    return await fetch(`${apiDataBase}${url}/reroll`)
        .then((res) => res.json())
        .then((data) => {
            return data;
        }); 
};

// Save Content
export const saveEditedContent = async (url, content) => {
    return await fetch(`${apiDataBase}${url}/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(content),
      })
};
