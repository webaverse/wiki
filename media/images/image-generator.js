import {
    stableDiffusionUrl,
    stableDiffusionT2I,
} from "../../constants/endpoints-constants.js";

// seed args:
// character: [512, 512, 64, 128, 1, 256]
// backpack: [512, 512, 64, 128, 1, 256]
// sword: [512, 512, 32, 128, 1, 256]
// rifle: [512, 512, 128, 64, 1, 256]
// pistol: [512, 512, 64, 64, 1, 256]
// potion: [512, 512, 64, 64, 1, 256]
// chestArmor: [512, 512, 64, 128, 1, 256]
// legArmor: [512, 512, 64, 128, 1, 256]
// helmet: [512, 512, 64, 64, 1, 256]
// location: [512, 512, 64, 64, 1, 256]
// map: [512, 512, 64, 64, 1, 256]

export const generateImage =
    ({ modelName, suffix, seed }) =>
    async (description) => {
        if (!seed) {
            const prompt = `${description}, ${suffix}`;
            
            const response = await fetch(stableDiffusionT2I, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    data: [
                        // Prompt -> String
                        `${prompt}, ${suffix}`,
                        // Negative Prompt -> String
                        "",
                        // 
                        "None",
                        //
                        "None",
                        // Sampling Steps -> Number
                        20,
                        // Sampling Method -> String
                        "Euler a",
                        false,
                        false,
                        1,
                        1,
                        7,
                        -1,
                        -1,
                        0,
                        0,
                        0,
                        false,
                        // Height -> Number (PX)
                        512,
                        // Width -> Number (PX)
                        512,
                        false,
                        0.7,
                        0,
                        0,
                        "None",
                        false,
                        false,
                        false,
                        "hello world",
                        "Nothing",
                        "hello world",
                        "Nothing",
                        "hello world",
                        true,
                        false,
                        false,
                    ],
                }),
            })
                .then((r) => r.json())
                .then((r) => {
                    let name = r.data[0][0];
                    return name;
                });
            
            // This step will be removed when the response is received as an image right away
            // Work in progress.
            const file = await fetch(
                `https://stable-diffusion.webaverse.com/file=${response.name}`
            );

            if (file.ok) {
                const arrayBuffer = await file.arrayBuffer();
                if (arrayBuffer.byteLength > 0) {
                    return arrayBuffer;
                } else {
                    throw new Error(`generated empty image`);
                }
            } else {
                throw new Error(`invalid status: ${file.status}`);
            }
        } else {
            throw new Error(`seed based generation not implemented`);
        }
    };
