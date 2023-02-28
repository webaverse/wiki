import {
  useState,
  useEffect,
  // useRef,
} from 'react';
import React from 'react';

import {
  getDatasetSpecs,
} from '../datasets/dataset-specs.js';
import ContentObject from './[contents]/[name].jsx';

import {Ctx} from "../clients/context.js";

// import {
//   WebaverseEngine,
// } from '../packages/engine/webaverse.js';
// import {
//   IoBusEventSource,
// } from './components/io-bus/IoBusEventSource.jsx';

import styles from '../styles/Index.module.css';
import { stripBasename } from '@remix-run/router';

// let loaded = false;

let loaded = false;
export const Index = () => {
  const [initialProps, setInitialProps] = useState(null);
  const [ctx, setCtx] = useState(() => new Ctx());
  const [results, setResults] = useState([]);
  const [type, setType] = useState('');
  const [types, setTypes] = useState([]);
  const [name, setName] = useState('');
  const [text, setText] = useState('');

  //

  globalThis.ctx = ctx;
  
  //

  const url = location.href;
  const pathname = location.pathname;
  const match = pathname.match(/^\/([^\/]+)\/([^\/]+)/);

  //

  useEffect(() => {
    let live = true;

    (async () => {
      const datasetSpecs = await getDatasetSpecs();
      if (!live) return;

      console.log('got dataset specs, need to set types', datasetSpecs);
      const types = datasetSpecs.map(spec => spec.type);
      setTypes(types);
      setType(types[0]);
    })();

    return () => {
      live = false;
    };
  }, []);

  useEffect(() => {
    if (!loaded) {
      loaded = true;

      // const ctx = new Ctx();
      // console.log('initialized context', ctx);

      console.log('got match', match, pathname);
      if (match) {
        (async () => {
          const newInitialProps = await ContentObject.getInitialProps({
            req: {
              url,
            },
          });
          // console.log('got props', newInitialProps);
          setInitialProps(newInitialProps);
        })();
      }
    }
  }, []);

  useEffect(() => {
    if (text) {
      let live = true;

      (async () => {
        const results = await ctx.databaseClient.search(type, text);
        if (!live) return;

        const payloads = results.map(p => p.payload);
        // console.log('got payloads', payloads);
        setResults(payloads);
        // console.log('got results', results);
      })();

      return () => {
        live = false;
      };
    } else {
      setResults([]);
    }
  }, [text]);

  return (
    <div className={styles.container}>
      {match ? (
        <div>
        </div>
      ) : (
        <div>
          <div className={styles.row}>
            <select className={styles.select} value={type} onChange={e => {
              setType(e.target.value);
            }}>
              {types.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <input type="text" value={name} placeholder="name" onChange={e => {
              setName(e.target.value);
            }} />
            <input type="button" value="Go" onClick={e => {
              console.log('click go', e);
            }} />
            <input type="button" value="List" onClick={e => {
              console.log('click list', e);
            }} />
            <input type="button" value="Spec" onClick={e => {
              console.log('click spec', e);
            }} />
          </div>
          <div className={styles.search}>
            <input type="text" className={styles.input} value={text} onChange={e => {
              setText(e.target.value);
            }} />
            <div className={styles.results}>
              {
                results.map((result, index) => {
                  const text = result.Description ?? result.Biography ?? '';
                  return (
                    <div className={styles.result} key={index} onClick={e => {
                      console.log('click result', result, e);
                    }}>{text}</div>
                  );
                })
              }
            </div>
          </div>
        </div>
      )}
    </div>
  );
};