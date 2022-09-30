import uuidByString from 'uuid-by-string';
import Markdown from 'marked-react';

import styles from '../../styles/Character.module.css'
import {characterSeed} from '../../constants/seedprompts.js'
import {Ctx} from '../../context.js';
import {retrieveContent} from '../../retrieval/contentRetrieval.js';
import {cleanName} from '../../utils.js';

const Character = ({
  title,
  content,
}) => {
  return (
    <div className={styles.character}>
      <div className={styles.name}>{title}</div>
      <div className={styles.markdown}>
        <Markdown gfm baseURL="">{content}</Markdown>
      </div>
    </div>
  );
};
Character.getInitialProps = async ctx => {
  const {req} = ctx;
  const match = req.url.match(/^\/characters\/([^\/]*)/);
  const category = 'characters';
  const seed = characterSeed;
  let name = match ? match[1] : '';
  name = decodeURIComponent(name);
  const content = await retrieveContent({category, name, seed});
  return content;
};

export default Character;
