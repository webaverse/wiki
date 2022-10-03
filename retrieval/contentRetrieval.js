import Markdown from 'marked-react';
import uuidByString from 'uuid-by-string';
import {Ctx} from '../context.js';
import {cleanName} from '../utils.js';

export const retrieveDescription = formatter => async seed => {
  let description = '';
  const numTries = 5;
  const c = new Ctx();
  for (let i = 0; i < numTries; i++) {
    description = await c.aiClient.generate(seed, '\n\n');
    description = formatter(description);
    if(!!description)
      break;
  }
  if (!description) {
    throw new Error('too many retries');
  }
  return description;
};

export const retrieveContent = contentFormatter => pageFormatter => async ({
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
    const description = await retrieveDescription(contentFormatter)(pr);
//    const image_map = { "main": desc };
//    const images = image_map.to_string();
    const content = pageFormatter({name, description});
    await c.databaseClient.setByName('Content', title, content);
    return {
      id,
      title,
      content,
    };
  }
};
