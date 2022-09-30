import {stableDiffusionUrl} from '../../constants/endpoints.js';
/*const AdmZip = require("adm-zip");

  export const generateImageMass = ({
  modelName,
  prefix,
  suffix,
  n,
}) => async ({
  name,
  description,
} = {}) => {
  const s = `${prefix} ${description} ${suffix}`;
  const u = `${stableDiffusionUrl}/image_mass?s=${s}&model=${modelName}&n_samples=${n}`;
  const res = await fetch(u);
  if(res.ok) {
    const zip = new AdmZip(res);
    for (entry in zip.getEntries()) {
      console.log(entry.to_string());
      yield zip.readFile(entry);
    }
  } else {
    throw new Error(`invalid status: ${res.status}`);
  }
};
*/
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
