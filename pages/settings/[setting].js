import uuidByString from 'uuid-by-string';
import Markdown from 'marked-react';

import styles from '../../styles/Setting.module.css'
import {settingSeed} from '../../constants/seedprompts.js'
import {Ctx} from '../../context.js';
import {retrieveContent} from '../../retrieval/contentRetrieval.js';
import {capitalize, capitalizeAllWords} from '../../utils.js';

const settingFormatting = description => {
    description = description.trim();
    const descriptionLines = description.split(/\n+/);
    if (descriptionLines.length >= 1) {
      descriptionLines[0] = capitalize(descriptionLines[0])
        .replace(/^[^a-zA-Z]+/, '')
        .replace(/[^a-zA-Z]+$/, '');
      descriptionLines[0] = capitalize(descriptionLines[0]);
      descriptionLines[1] = capitalize(descriptionLines[1]);
      return descriptionLines.join('\n');
    } else {
      return '';
    }
}

const pageFormat = ({name, description,}) => {
    const imgs = Array.from([1,2,3,4].map(i => { return `/api/settings/${name}/images/${i}.png`}));
    return `\
# ${name}
## ${description}
` + imgs.map(i => { return `![${name}](${encodeURI(i)})`; }).join('\n\n')
  + `
`;
}

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
  const seed = settingSeed;
  let name = match ? match[1] : '';
  name = decodeURIComponent(name);
  const content = await retrieveContent(settingFormatting)(pageFormat)({category, name, seed});
  return content;
};

export default Setting;
