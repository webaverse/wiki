import {generateImage} from './generate-image.js';
import {generateImageMass} from './generate-image.js';
const characterSettings = { 
    modelName: 'webaverse_characters',
    prefix: 'head to toe view of ',
    suffix: 'anime character concept art, fashion design, detailed face, trending on ArtStation',
};

export const generateCharacterImage = generateImage(characterSettings);
/*
export const generateCharacterGallery = generateImageMass({
  modelName: 'webaverse_characters',
  prefix: `full body portrait of`,
  suffix: `anime character design, trending on ArtStation`,
})
*/
