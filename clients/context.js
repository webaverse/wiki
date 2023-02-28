import {DatabaseClient} from './database/database-client.js';
import {StorageClient} from './storage/storage-client.js';
import {AiClient} from './ai/ai-client.js';
import {
  OPENAI_API_KEY,
  OPENAI_ACCESS_TOKEN,
} from '../src/constants/auth.js';

//

export class Ctx {
  constructor() {
    const apiKey = OPENAI_API_KEY;
    const accessToken = OPENAI_ACCESS_TOKEN;
    this.aiClient = new AiClient({
      apiKey,
      accessToken,
    });

    this.databaseClient = new DatabaseClient({
      aiClient: this.aiClient, // for embeddings
    });
    this.storageClient = new StorageClient();
  }
}

export const saveContent = async (content) => {
  const c = new DatabaseClient();
  const query = await c.getByName("Content", "character/Killer");
  return query;
}
// const ctx = new Ctx();
// export default ctx;