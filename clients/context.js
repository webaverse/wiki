import {DatabaseClient} from './database/database-client.js';
import {StorageClient} from './storage/storage-client.js';
import {AiClient} from './ai/ai-client.js';

export class Ctx {
  constructor() {
    this.databaseClient = new DatabaseClient();
    this.storageClient = new StorageClient();
    this.aiClient = new AiClient();
  }
}
// const ctx = new Ctx();
// export default ctx;