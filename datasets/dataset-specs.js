import {
  parseDatasetSpec,
  parseDatasetItems,
  formatTrainingItemCandidates,
  // getItemNameKey,
  // getItemDescriptionKey,
  // getItemAttributeKeys,
} from './dataset-parser.js';

let fs;

//

const fetchText = async (u, local) => {
  // dynamically load the fs module if we are processing local files in node
  if (!fs && local) {
    fs = await import('fs');
  }
  let res;

  if (local) {
    const data = fs.readFileSync(u);
    res = data.toString();
    console.log('res is', res)
    return res;
  } else {
    res = await fetch(u);
  }

  if (res.ok) {
    const text = await res.text();
    return text;
  } else {
    throw new Error(`fetch error ${res.status} ${res.statusText} ${u}`);
  }
};

//

const datasetSpecsBasePath = `https://webaverse.github.io/lore/datasets/specs/`;
const datasetDataBasePath = `https://webaverse.github.io/lore/datasets/data/`;
const mdSpecs = [
  {
    // type: 'character',
    url: 'characters.md',
  },
  {
    // type: 'setting',
    url: 'settings.md',
  },
  {
    // type: 'item',
    url: 'items.md',
  },
  {
    // type: 'cutscene',
    url: 'cutscenes.md',
  },
  {
    // type: 'chat',
    url: 'chats.md',
  },
  {
    // type: 'lore',
    url: 'lore.md',
  },
  {
    // type: 'battle-banter',
    url: 'battle-banters.md',
    // groupKey: 'Banters',
  },
  {
    // type: 'match',
    url: 'matches.md',
    // nameKey: 'Match string',
    // descriptionKey: 'Candidate assets',
  },
];
let datasetSpecUrls = mdSpecs.map(mdSpec => `${datasetSpecsBasePath}${mdSpec.url}`);
let datasetDataUrls = mdSpecs.map(mdSpec => `${datasetDataBasePath}${mdSpec.url}`);

//

let datasetSpecPromise = null;
export const getDatasetSpecs = (localPathOverride) => {

  if(localPathOverride){
    datasetSpecUrls = mdSpecs.map(mdSpec => `${localPathOverride}/specs/${mdSpec.url}`);
    datasetDataUrls = mdSpecs.map(mdSpec => `${localPathOverride}/data/${mdSpec.url}`);
  }

  if (!datasetSpecPromise) {
    datasetSpecPromise = (async () => {
      const datasetSpecs = await Promise.all(datasetSpecUrls.map(async datasetSpecUrl => {
        const mdText = await fetchText(datasetSpecUrl, !!localPathOverride);
        const datasetSpec = parseDatasetSpec(mdText);
        return datasetSpec;
      }));
      return datasetSpecs;
    })();
  }
  return datasetSpecPromise;
};

export const getTrainingItems = async (localPathOverride) => {
  const datasetSpecs = await getDatasetSpecs(localPathOverride);
  const itemsArray = await Promise.all(datasetDataUrls.map(async (datasetDataUrl, index) => {
    const mdText = await fetchText(datasetDataUrl, !!localPathOverride);
    const datasetSpec = datasetSpecs[index];
    let items = parseDatasetItems(mdText, datasetSpec);
    items = items.map(item => formatTrainingItemCandidates(item, datasetSpec)).flat();
    return items;
  }));
  return itemsArray.flat();
};