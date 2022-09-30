import Markdown from 'marked-react';
import uuidByString from 'uuid-by-string';
import {Ctx} from '../context.js';
import {cleanName} from '../utils.js';
import {capitalize, capitalizeAllWords} from '../utils.js';

export const retrieveDescription = async seed => {
  let description = '';
  const numTries = 5;
  const c = new Ctx();
  for (let i = 0; i < numTries; i++) {
    description = await c.aiClient.generate(seed, '\n\n');
    description = description.trim();
    const descriptionLines = description.split(/\n+/);
    if (descriptionLines.length >= 3) {
      descriptionLines[0] = capitalize(descriptionLines[0])
        .replace(/^[^a-zA-Z]+/, '')
        .replace(/[^a-zA-Z]+$/, '');
      descriptionLines[0] = capitalizeAllWords(descriptionLines[0]);
      descriptionLines[1] = capitalize(descriptionLines[1]);
      description = descriptionLines.join('\n');
      break;
    } else {
      description = '';
    }
  }
  if (!description) {
    throw new Error('too many retries');
  }
  return description;
};

export const retrieveContent = async ({
  category,
  name,
  seed,
}) => {
  name = cleanName(name);
  const pr = `${seed}
# ${name}
##`;
  const title = `${category}/${name}`;
  const id = uuidByString(title);
  const c = new Ctx();
  const query = await c.databaseClient.getByName('Content', title);
  let page = '';
  if(query) {
    const {content} = query;
    return {
      id,
      title,
      content,
    };
  } else {
    const description = await retrieveDescription(pr);
//    const image_map = { "main": desc };
//    const images = image_map.to_string();
    const imgUrl = `/api/${category}/${name}/images/main.png`;
    const content = `\
# ${name}
## ${description}
![](${encodeURI(imgUrl)})
`;
    await c.databaseClient.setByName('Content', title, content);
    return {
      id,
      title,
      content,
    };
  }
};
