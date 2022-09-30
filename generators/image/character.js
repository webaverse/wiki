import {generateImage} from './generate-image.js';
import {generateImageMass} from './generate-image.js';

export const generateCharacterImage = generateImage({
  modelName: 'webaverse_characters',
  prefix: `full body portrait of`,
  suffix: `anime character design, trending on ArtStation`,
});

export const generateCharacterGallery = generateImageMass({
  modelName: 'webaverse_characters',
  prefix: `full body portrait of`,
  suffix: `anime character design, trending on ArtStation`,
})
