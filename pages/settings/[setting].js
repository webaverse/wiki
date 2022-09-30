import uuidByString from 'uuid-by-string';
import Markdown from 'marked-react';

import styles from '../../styles/Setting.module.css'
import {settingSeed} from '../../constants/seedprompts.js'
import {Ctx} from '../../context.js';
import {retrieveContent} from '../../retrieval/contentRetrieval.js';
import {cleanName} from '../../utils.js';

const Setting = ({
  title,
  content,
}) => {
  return (
    <div className={styles.setting}>
      <div className={styles.name}>{title}</div>
      <div className={styles.markdown}>
        <Markdown gfm baseURL="">{content}</Markdown>
      </div>
    </div>
  );
};
Setting.getInitialProps = async ctx => {
  const {req} = ctx;
  const match = req.url.match(/^\/settings\/([^\/]*)/);
  const category = 'settings';
  let name = match ? match[1] : '';
  name = decodeURIComponent(name);
  const content = await retrieveContent({category, name, settingSeed});
  return content;
};

export default Setting;
