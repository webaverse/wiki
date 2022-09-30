import uuidByString from 'uuid-by-string';
// import {File} from 'web3.storage';
import Markdown from 'marked-react';

import styles from '../../styles/Character.module.css'
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
    const prompt = `\
Describe 50 anime characters, with a bio and a one sentence physical description on separate lines.

# Vae Martis
## Battle Goddess
A goddess who seems to seek out conflict and intervene for her own amusement. She has an otherworldly beauty that inspires awe and terror in those who gaze upon her face. Her black blade can cut through anything. She was born mortal and had an incredibly hard life, working as a spy and then a mercenary before ascending to godhood and leaving her native plane, filled with her characteristic insatiable bloodlust and sadism
A stunningly beautiful albino battle goddess with a white pixie haircut wielding a black knife

# Spencer Portens
## Neural Hacker
A genius hacker who could get into anything, but computer security was so bad that he got bored of hacking computers, and decided to hack brains. Though brain-hacking is a creepy thing to do to a person, he tries to be somewhat ethical, only hacking people he considers evil or who need something in their brain fixed. Despite his line of work, he seems to have a lot of friends, and though some people find his cocky attitude grating, not many real enemies
A scruffy hacker with a big smirk on his face, wearing futuristic goggles

# Nel Nibcord
## Wild Witch
A chaotic witch from the strange lands in the north, and considered one of the foremost experts in weather manipulating magic. She came from a small village that was utterly destroyed by a blizzard, and went into a mad fugue state when everyone she knew died for a few years, isolating herself completely to develop her craft. She loves animals and they will often completely capture her attention when she sees them, even mid-sentence
A witch with wild red hair and dark circles under her eyes wearing a colorful top and a hat with bunny ears

# David
## Menace
The last survivor of the upstairs rabbits, David has an indominable spirit and a deep love of novelty, hoping to try every single kind of food, even if she has to steal it. She considers the whole world her domain, and bristles at attempts to keep her out of places. She plays with cats more than other rabbits, and is not above biting people she's upset with, or who are in her way
A mischevious black rabbit with one lop ear standing on her hind legs

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
