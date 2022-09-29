import {stableDiffusionUrl} from '../../constants/endpoints.js';

export const generateImage = ({
  modelName,
  prefix,
  suffix,
}) => async ({
  name,
  description,
} = {}) => {
  const s = `${prefix} ${description} ${suffix}`;
  const u = `${stableDiffusionUrl}/image?s=${s}&model=${modelName}`;
  const res = await fetch(u);
  if (res.ok) {
    const arrayBuffer = await res.arrayBuffer();
    return arrayBuffer;
  } else {
    throw new Error(`invalid status: ${res.status}`);
  }
};
