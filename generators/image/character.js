import {generateImage} from './generate-image.js';

export const generateCharacterImage = generateImage({
  modelName: 'webaverse_characters',
  prefix: `full body portrait of`,
  suffix: `visually stunning, anime character design, trending on ArtStation`,
});
