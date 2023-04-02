// import {model} from '../../constants/model-constants.js';
// import {
//   ChatGPTClient,
// } from '../../../engine/ai/chat/chatgpt.js';

//

function makeGenerateFn({
  apiKey,
}) {
  async function query(params = {}) {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(apiKey),
      },
      body: JSON.stringify(params),
    };
    try {
      const response = await fetch(
        "https://api.openai.com/v1/completions",
        requestOptions
      );
      if (response.status !== 200) {
        console.log(response.statusText);
        console.log(response.status);
        console.log(await response.text());
        return "";
      }

      const data = await response.json();
      // console.log("choices:", data.choices);
      return data.choices[0]?.text;
    } catch (e) {
      console.log(e);
      return "returning from error";
    }
  }
  async function openaiRequest(prompt, stop/*, needsRepetition*/) {
    return await query({
      // model: 'text-davinci-002',
      model,
      prompt,
      stop,
      // top_p: 1,
      // frequency_penalty: needsRepetition ? 0.1 : 0.4,
      // presence_penalty: needsRepetition ? 0.1 : 0.4,
      // temperature: 0.85,
      max_tokens: 256,
      best_of: 1,
    });
  }
  
  return async (prompt, stop/*, needsRepetition = true*/) => {
    return await openaiRequest(prompt, stop/*, needsRepetition*/);
  };
}
export function makeEmbedFn({
  apiKey,
}) {
  async function embed(input) {
    const embeddingModel = `text-embedding-ada-002`;
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: "Bearer " + String(apiKey),
      },
      body: JSON.stringify({
        input,
        model: embeddingModel,
      }),
    };
    try {
      const response = await fetch(
        // 'https://api.openai.com/v1/embeddings',
        '/api/ai/embeddings',
        requestOptions
      );
      if (response.status !== 200) {
        // console.log(response.statusText);
        // console.log(response.status);
        console.log(await response.text());
        throw new Error("OpenAI API Error: " + response.status + " " + response.statusText);
      }

      const data = await response.json();
      return data?.data?.[0].embedding;
    } catch (e) {
      console.warn('OpenAI API Error', e);
      // return "returning from error";
      throw e;
    }
  }
  return embed;
}
function makeCreateChatFn({
  accessToken,
}) {
  return new ChatGPTClient({
    accessToken,
  });
}

// export class AiClient {
//   constructor({
//     apiKey,
//     accessToken,
//   }) {
//     this.generate = makeGenerateFn({
//       apiKey,
//     });
//     this.embed = makeEmbedFn({
//       apiKey,
//     });
//     this.createChat = makeCreateChatFn({
//       accessToken,
//     });
//   }
// };





























/* import {
  model,
} from '../constants/model-constants.js';
import GPT3Tokenizer from 'gpt3-tokenizer';
// import {OPENAI_API_KEY} from '../../src/constants/auth.js';

export function makeGenerateFn() {
  async function generate(params = {}) {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Authorization: 'Bearer ' + String(OPENAI_API_KEY),
      },
      body: JSON.stringify(params),
    };
    try {
      const response = await fetch(
        // 'https://api.openai.com/v1/completions',
        '/api/ai/completions',
        requestOptions
      );
      if (response.status !== 200) {
        // console.log(response.statusText);
        // console.log(response.status);
        console.log(await response.text());
        throw new Error("OpenAI API Error: " + response.status + " " + response.statusText);
      }

      const data = await response.json();
      // console.log("choices:", data);
      const {choices} = data;
      if (choices.length !== params.n) {
        throw new Error('ai api error: ' + choices.length + ' choices returned, expected ' + params.n);
      }
      if (choices.length === 0) {
        throw new Error('ai api error: no choices returned');
      } else if (choices.length === 1) {
        return choices[0].text;
      } else {
        return choices.map(c => c.text);
      }
    } catch (e) {
      console.warn('OpenAI API Error', e);
      // return "returning from error";
      throw e;
    }
  }
  async function openaiRequest(prompt, stop, opts) {
    const {
      max_tokens = 256,
      n = 1,
    } = opts ?? {};
    return await generate({
      model,
      prompt,
      stop,
      // top_p: 1,
      // frequency_penalty: needsRepetition ? 0.1 : 0.4,
      // presence_penalty: needsRepetition ? 0.1 : 0.4,
      // temperature: 0.85,
      max_tokens,
      n,
      // best_of: 1,
    });
  }
  return openaiRequest;
}
export function makeEmbedFn() {
  async function embed(input) {
    const embeddingModel = `text-embedding-ada-002`;
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Authorization: "Bearer " + String(OPENAI_API_KEY),
      },
      body: JSON.stringify({
        input,
        model: embeddingModel,
      }),
    };
    try {
      const response = await fetch(
        // 'https://api.openai.com/v1/embeddings',
        '/api/ai/embeddings',
        requestOptions
      );
      if (response.status !== 200) {
        // console.log(response.statusText);
        // console.log(response.status);
        console.log(await response.text());
        throw new Error("OpenAI API Error: " + response.status + " " + response.statusText);
      }

      const data = await response.json();
      return data?.data?.[0].embedding;
    } catch (e) {
      console.warn('OpenAI API Error', e);
      // return "returning from error";
      throw e;
    }
  }
  return embed;
}
const makeTokenizeFn = () => {
  const tokenizer = new GPT3Tokenizer({
    type: 'gpt3',
  });
  function tokenize(s) {
    const encoded = tokenizer.encode(s);
    return encoded.text;
  }
  return tokenize;
};

export class AiClient {
  constructor() {
    this.generate = makeGenerateFn();
    this.embed = makeEmbedFn();
    this.tokenize = makeTokenizeFn();
  }
}; */