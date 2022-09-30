import uuidByString from 'uuid-by-string';
// import {File} from 'web3.storage';
import Markdown from 'marked-react';

import styles from '../../styles/Character.module.css'
import {characterSeed} from '../../constants/seedprompts.js'
import {Ctx} from '../../context.js';
import {cleanName} from '../../utils.js';
// import {generateCharacterImage} from '../../generators/image/character.js';
import {capitalize, capitalizeAllWords} from '../../utils.js';

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
  let name = match ? match[1] : '';
  name = decodeURIComponent(name);
  name = cleanName(name);

  const c = new Ctx();
  const title = `characters/${name}`;
  const id = uuidByString(title);
  const query = await c.databaseClient.getByName('Content', title);
  if (query) {
    const {content} = query;
    return {
      id,
      title,
      content,
      alt,
    };
  } else {
    const prompt = characterSeed + `
# ${name}
##`;

    let bio = '';
    let alt = '';
    const numTries = 5;
    for (let i = 0; i < numTries; i++) {
      bio = await c.aiClient.generate(prompt, '\n\n');
      bio = bio.trim();
      let bioLines = bio.split(/\n+/);
      if (bioLines.length >= 3) {
        alt = bioLines.pop();
        bioLines[0] = bioLines[0]
          .replace(/^[^a-zA-Z]+/, '')
          .replace(/[^a-zA-Z]+$/, '');
        bioLines[0] = capitalizeAllWords(bioLines[0]);
        bioLines[1] = capitalize(bioLines[1]);
        bio = bioLines.join('\n');
        break;
      } else {
        bio = '';
      }
    }
    if (!bio) {
      throw new Error('too many retries');
    }

    // const imgArrayBuffer = await generateCharacterImage({
    //   name,
    //   description: bio,
    // });
    // const file = new File([imgArrayBuffer], `${name}.png`);
    // const hash = await c.storageClient.uploadFile(file);
    const imgUrl = `/api/characters/${name}/images/main.png`;
    // const imgUrl = c.storageClient.getUrl(hash, file.name);
    // await ensureUrl(imgUrl);

    const content = `\
# ${name}
## ${bio}
![](${encodeURI(imgUrl)})
`;

    await c.databaseClient.setByName('Content', title, content, alt);
    return {
      id,
      title,
      content,
      alt,
    };
  }
};

export default Character;
