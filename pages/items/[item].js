import uuidByString from 'uuid-by-string';
import Markdown from 'marked-react';

import styles from '../../styles/Item.module.css'
import {itemSeed} from '../../constants/seedprompts.js'
import {Ctx} from '../../context.js';
import {cleanName} from '../../utils.js';
import {capitalize, capitalizeAllWords} from '../../utils.js';

const Item = ({
  title,
  content,
}) => {
  return (
    <div className={styles.item}>
      <div className={styles.name}>{title}</div>
      <div className={styles.markdown}>
        <Markdown gfm baseURL="">{content}</Markdown>
      </div>
    </div>
  );
};
Item.getInitialProps = async ctx => {
  const {req} = ctx;
  const match = req.url.match(/^\/items\/([^\/]*)/);
  let name = match ? match[1] : '';
  name = decodeURIComponent(name);
  name = cleanName(name);

  const c = new Ctx();
  const title = `items/${name}`;
  const id = uuidByString(title);
  const query = await c.databaseClient.getByName('Content', title);
  if (query) {
    const {content} = query;
    return {
      id,
      title,
      content,
    };
  } else {
    const prompt = itemSeed + `
# ${name}
##`;

  let description = '';
  const numTries = 5;
  for (let i = 0; i < numTries; i++) {
    description = await c.aiClient.generate(prompt, '\n\n');
    description = description.trim();
    const descriptionLines = description.split(/\n+/);
    if (descriptionLines.length >= 1) {
      descriptionLines[0] = capitalize(descriptionLines[0]);
      description = descriptionLines.join('\n');
      break;
    } else {
      description = '';
    }
  }
  if (!description) {
    throw new Error('too many retries');
  }

    const imgUrl = `/api/items/${name}/images/main.png`;

    const content = `\
# ${name}
${description}
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

export default Item;
