import uuidByString from 'uuid-by-string';
import Markdown from 'marked-react';

import styles from '../../styles/Character.module.css'
import {characterSeed} from '../../constants/seedprompts.js'
import {Ctx} from '../../context.js';
import {retrieveContent} from '../../retrieval/contentRetrieval.js';
import {capitalize, capitalizeAllWords} from '../../utils.js';

const characterFormatting = description => {
    description = description.trim();
    const descriptionLines = description.split(/\n+/);
    if (descriptionLines.length >= 3) {
      descriptionLines[0] = capitalize(descriptionLines[0])
        .replace(/^[^a-zA-Z]+/, '')
        .replace(/[^a-zA-Z]+$/, '');
      descriptionLines[0] = capitalizeAllWords(descriptionLines[0]);
      descriptionLines[1] = capitalize(descriptionLines[1]);
      return descriptionLines.join('\n');
    } else {
      return '';
    }
}

const pageFormat = ({name, description,}) => {
    const imgs = Array.from([1,2,3,4].map(i => { return `/api/characters/${name}/images/${i}.png`}));
    let lines = description.split(/\n+/);
    const alt = lines.pop();
    description = lines.join('\n');
    return `\
# ${name}
## ${description}
` + imgs.map(i => { return `![${alt}](${encodeURI(i)})`; }).join('\n\n')
  + `
`;
}

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
  const content = await retrieveContent(characterFormatting)(pageFormat)({category, name, seed});
  return content;
};

export default Character;
