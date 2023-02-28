// new database client

import {
  getDatasetSpecs,
  getDatasetItems,
  getTrainingItems,
  getDatasetItemsForDatasetSpec,
} from '../../../engine/dataset-engine/dataset-specs.js';
import {
  Qdrant,
} from '../../../engine/clients/qdrant.js';

import getUuid from 'uuid-by-string';
const uuidV5Hash = s => getUuid(s, 5);

const embeddingDimensions = 1536;

export class DatabaseClient {
  constructor({
    aiClient,
  }) {
    this.aiClient = aiClient;

    if (!aiClient) {
      console.warn('ai client is required');
      debugger;
    }

    // globalThis.initDatabase = () => {
    //   this.init();
    // };
    
    // this.qdrant = new Qdrant('http://localhost:6333/');
    const databaseBaseUrl = location.protocol + '//' + location.host + '/api/qdrant/';
    this.qdrant = new Qdrant(databaseBaseUrl);
  }

  getByName(className, title) {
    // const id = this.getId(className, title);
    // return this.getItem(id);

    return this.getItem(className, title);
    // console.warn('not implemented');
    // debugger;
  }
  setByName(className, title, content) {
    // const id = this.getId(className, title);
    // this.setItem(id, content);
    this.setItem(className, title, content);
    // console.warn('not implemented');
    // debugger;
  }

  async init() {
    const {
      aiClient,
      qdrant,
    } = this;
    let datasetSpecs = await getDatasetSpecs();
    datasetSpecs = datasetSpecs.concat([
      {
        type: 'Content',
      },
      {
        type: 'IpfsData',
      },
    ]);

    // console.log('got dataset specs', datasetSpecs);
    // console.log('got dataset items', datasetItems);

    for (let i = 0; i < datasetSpecs.length; i++) {
      const datasetSpec = datasetSpecs[i];
      const {type} = datasetSpec;
      console.log('initializing', {type});

      const name = type;

      const schema = {
        "name": name,
        "vectors": {
          "size": embeddingDimensions,
          "distance": "Cosine",
        },
      };

      let delete_result = await qdrant.delete_collection(name);
      if (delete_result.err) {
        console.error(`ERROR:  Couldn't delete "${name}"!`);
        console.error(delete_result.err);
      } else {
        console.log(`Deleted "${name} successfully!"`);
        console.log(delete_result.response);
      }

      /// -------------------------------------------------------------------------
      /// Create the new collection with the name and schema

      let create_result = await qdrant.create_collection(name, schema);
      if (create_result.err) {
        console.error(`ERROR:  Couldn't create collection "${name}"!`);
        console.error(create_result.err);
      } else {
        console.log(`Success! Collection "${name} created!"`);
        console.log(create_result.response);
      }

      /// -------------------------------------------------------------------------
      /// Show the collection info as it exists in the Qdrant engine
      let collection_result = await qdrant.get_collection(name);
      if (collection_result.err) {
        console.error(`ERROR:  Couldn't access collection "${name}"!`);
        console.error(collection_result.err);
      } else {
        console.log(`Collection "${name} found!"`);
        console.log(collection_result.response);
      }

      let datasetItems = await getDatasetItemsForDatasetSpec(datasetSpec);
      datasetItems = datasetItems.slice(0, 8); // XXX
      console.log('create points from', datasetItems);

      // compute points
      const points = [];
      for (let i = 0; i < datasetItems.length; i++) {
        const item = datasetItems[i];
        const itemString = JSON.stringify(item);
        // const id = murmurhash3(itemString);
        const id = uuidV5Hash(itemString);
        const vector = await aiClient.embed(itemString);
        // console.log('embed vectors', vector);
        const point = {
          id,
          payload: item,
          vector,
        };
        // console.log('add point', point);
        points.push(point);
      }
      console.log('collected points', points);
      
      // const points = datasetItems.map(item => {
      //   return {
      //     // id: item.id,
      //     payload: item,
      //     vector: item.embedding,
      //   };
      // });
      if (points.length > 0) {
        let upload_points_result = await qdrant.upload_points(name, points);
        console.log('upload points', upload_points_result);
      }
    }
  }

  #getId(type, key) {
    const hashKey = `${type}:${key}`;
    const uuidHash = uuidV5Hash(hashKey);
    return uuidHash;
  }
  async search(type, query) {
    const k = 5;
    const ef = 128; // HNSW ef
    const filter = undefined;
    
    const vector = await this.aiClient.embed(query);
    // console.log('got search vector', vector);
    const opts = {
      vectors: true,
      payload: true,
    };
    const qdrantResponse = await this.qdrant.search_collection(type, vector, k, ef, filter, opts);
    // console.log('got response', qdrantResponse);
    const {
      response,
    } = qdrantResponse;
    const {
      result,
    } = response;
    return result;
  }
  async getItem(type, key) {
    const id = this.#getId(type, key);
    const points = await this.qdrant.retrieve_points(type, {
      ids: [
        id,
      ],
    });
    // console.log('got item', points);
    
    // debugger;
    
    return points;
  }
  async getItems(type, keys) {
    const ids = keys.map(key => this.#getId(type, key));
    const points = await this.qdrant.retrieve_points(type, {
      ids,
    });
    return points;
  }
  async setItem(type, key, value) {
    const id = this.#getId(type, key);
    const vector = await this.aiClient.embed(value);
    await this.qdrant.upload_points(type, [{
      id,
      payload: value,
      vector,
    }]);
    return id;
  }
  async deleteItem(type, id) {
    await this.qdrant.delete_points(type, [
      id,
    ]);
  }
  }