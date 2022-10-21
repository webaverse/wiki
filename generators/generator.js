// import {stableDiffusionUrl} from '../../constants/endpoints.js';
import fetch from 'node-fetch';
import {
  gpt3Url,
  voiceUrl,
  stableDiffusionUrl,
  diffsoundUrl,
  motionDiffusionUrl,
  stableDreamfusionUrl,
  get3dUrl,
  musicGeneratorUrl,
  weaviateUrl,
  discoDiffusionUrl,
} from '../constants/endpoints-constants';

export const generateText = ({model}) => async ({x} = {}) => {
  const url = `${gpt3Url}/text?x=${x}` // mock endpoint
  await fetch(url)
    .then(res => {
      if (res.ok) {
        // TODO: return generated text
      } else {
        throw new Error(`invalid status: ${res.status}`);
      }
    })
    .catch(err => {
      throw new Error(`url error: ${err}`);
    })
}

export const generateVoice = () => async ({s, voice} = {}) => {
  return `${voiceUrl}/tts?s=${s}&voice=${voice}`
}

export const generateImage = ({
  modelName,
  prefix,
}) => async ({
  name,
  description,
} = {}) => {
  const s = `${prefix} ${description}`;
  const u = `${stableDiffusionUrl}/image?s=${encodeURIComponent(s)}&model=${modelName}`;
  const res = await fetch(u);
  if (res.ok) {
    const arrayBuffer = await res.arrayBuffer();
    if (arrayBuffer.byteLength > 0) {
      return arrayBuffer;
    } else {
      throw new Error(`generated empty image`);
    }
  } else {
    throw new Error(`invalid status: ${res.status}`);
  }
}

export const generateDiffSound = () => async ({s} = {}) => {
  return `${diffsoundUrl}/sound?s=${s}`
}

export const generateMotionDiffusion = ({model}) => async ({x} = {}) => {
  const url = `${motionDiffusionUrl}/motion?x=${x}` // mock endpoint
  await fetch(url)
    .then(res => {
      if (res.ok) {
        // TODO: return generated motion
      } else {
        throw new Error(`invalid status: ${res.status}`);
      }
    })
    .catch(err => {
      throw new Error(`url error: ${err}`);
    })
}

export const generateObjectOrConsumable = ({model}) => async ({x} = {}) => {
  const url = `${stableDreamfusionUrl}/object?x=${x}` // mock endpoint
  await fetch(url)
    .then(res => {
      if (res.ok) {
        // TODO: return generated object | consumable
      } else {
        throw new Error(`invalid status: ${res.status}`);
      }
    })
    .catch(err => {
      throw new Error(`url error: ${err}`);
    })
}

export const generateGet3DObject = ({model}) => async ({x} = {}) => {
  const url = `${get3dUrl}/object?x=${x}` // mock endpoint
  await fetch(url)
    .then(res => {
      if (res.ok) {
        // TODO: return generated object
      } else {
        throw new Error(`invalid status: ${res.status}`);
      }
    })
    .catch(err => {
      throw new Error(`url error: ${err}`);
    })
}

export const generateMusic = ({model}) => async ({x} = {}) => {
  const url = `${musicGeneratorUrl}/music?x=${x}` // mock endpoint
  await fetch(url)
    .then(res => {
      if (res.ok) {
        // TODO: return generated music
      } else {
        throw new Error(`invalid status: ${res.status}`);
      }
    })
    .catch(err => {
      throw new Error(`url error: ${err}`);
    })
}

export const generateWeaviateCharacter = ({model}) => async ({x} = {}) => {
  const url = `${weaviateUrl}/character?x=${x}` // mock endpoint
  await fetch(url)
    .then(res => {
      if (res.ok) {
        // TODO: return generated character ??
      } else {
        throw new Error(`invalid status: ${res.status}`);
      }
    })
    .catch(err => {
      throw new Error(`url error: ${err}`);
    })
}

export const generateSprite = ({model}) => async ({x} = {}) => {
  const url = `${discoDiffusionUrl}/sprite?x=${x}` // mock endpoint
  await fetch(url)
    .then(res => {
      if (res.ok) {
        // TODO: return generated sprite
      } else {
        throw new Error(`invalid status: ${res.status}`);
      }
    })
    .catch(err => {
      throw new Error(`url error: ${err}`);
    })
}
