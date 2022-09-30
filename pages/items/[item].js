import uuidByString from 'uuid-by-string';
import Markdown from 'marked-react';

import styles from '../../styles/Item.module.css'
import {itemSeed} from '../../constants/seedprompts.js'
import {Ctx} from '../../context.js';
import {retrieveContent} from '../../retrieval/contentRetrieval.js';
import {cleanName} from '../../utils.js';

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
  let name = match ? match[1] : '';
  name = decodeURIComponent(name);
  const content = await retrieveContent({category, name, itemSeed});
  return content;
};

export default Item;
