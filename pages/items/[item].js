import uuidByString from 'uuid-by-string';
import Markdown from 'marked-react';

import styles from '../../styles/Item.module.css'
import {itemSeed} from '../../constants/seedprompts.js'
import {Ctx} from '../../context.js';
import {retrieveContent} from '../../retrieval/contentRetrieval.js';
import {capitalize, capitalizeAllWords} from '../../utils.js';

const itemFormatting = description => {
    description = description.trim();
    const descriptionLines = description.split(/\n+/);
    if (descriptionLines.length >= 1) {
      descriptionLines[0] = capitalize(descriptionLines[0])
        .replace(/^[^a-zA-Z]+/, '')
        .replace(/[^a-zA-Z]+$/, '');
      descriptionLines[0] = capitalize(descriptionLines[0]);
      return descriptionLines.join('\n');
    } else {
      return '';
    }
}

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
  const category = 'items';
  const seed = itemSeed;
  let name = match ? match[1] : '';
  name = decodeURIComponent(name);
  const content = await retrieveContent(itemFormatting)({category, name, seed});
  return content;
};

export default Item;
