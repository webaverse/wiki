import {
  useState,
  useEffect,
  // useRef,
} from 'react';
import React from 'react';

import {
  useRouter,
} from '../src/utils/router.js';
import {
  getDatasetSpecs,
} from '../datasets/dataset-specs.js';
// import ContentObject from './[contents]/[name].jsx';

import {Ctx} from "../clients/context.js";

// import {
//   WebaverseEngine,
// } from '../packages/engine/webaverse.js';
// import {
//   IoBusEventSource,
// } from './components/io-bus/IoBusEventSource.jsx';

import styles from '../styles/Index.module.css';

// let loaded = false;

//

const ContentsPage = ({
  router,
  ctx,
  slugs,
}) => {
  const mode = slugs?.[0] ?? '';
  const tab = slugs?.[1] ?? '';
  const name = slugs?.[2] ?? '';

  return (
    <div className={styles.contents}>
      {mode} {tab} {name}
    </div>
  );
};
const ContentPage = ({
  router,
  ctx,
  slugs,
}) => {
  const mode = slugs?.[0] ?? '';
  const tab = slugs?.[1] ?? '';
  const name = slugs?.[2] ?? '';

  return (
    <div className={styles.content}>
      {mode} {tab} {name}
    </div>
  );
};

//

const SearchPage = ({
  router,
  ctx,
  slugs,
}) => {
  const [results, setResults] = useState([]);
  const [type, setType] = useState('');
  const [types, setTypes] = useState([]);
  const [nameValue, setNameValue] = useState('');
  const [text, setText] = useState('');

  // load types array
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

  // search logic
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

  const submit = () => {
    if (nameValue) {
      router.pushUrl(location.protocol + '//' + location.host + `/content/${type}/${nameValue}`);
    }
  };

  const mode = slugs?.[0] ?? '';
  const tab = slugs?.[1] ?? '';
  const name = slugs?.[2] ?? '';

  return (
    <div className={styles.search}>
      <div className={styles.row}>
        <select className={styles.select} value={type} onChange={e => {
          setType(e.target.value);
        }}>
          {types.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        <input type="text" value={nameValue} placeholder="name" onChange={e => {
          setNameValue(e.target.value);
        }} onKeyDown={e => {
          if (e.key === 'Enter') {
            e.preventDefault();
            e.stopPropagation();
            submit();
          }
        }} />
        <input type="button" value="Go" onClick={e => {
          console.log('click go', e);
          submit();
        }} />
        <input type="button" value="List" onClick={e => {
          console.log('click list', e);
          router.pushUrl(location.protocol + '//' + location.host + `/content/${type}`);
        }} />
        <input type="button" value="Spec" onClick={e => {
          console.log('click spec', e);
          router.pushUrl(location.protocol + '//' + location.host + `/specs/${type}/${name}`);
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
                  const {Name} = result;
                  router.pushUrl(location.protocol + '//' + location.host + `/specs/${type}/${Name}`);
                }}>{text}</div>
              );
            })
          }
        </div>
      </div>
    </div>
  );
}

//

export const Index = () => {
  // const [initialProps, setInitialProps] = useState(null);
  const [router, setRouter] = useState(() => useRouter());
  // const [tab, setTab] = useState(router.currentTab);
  const [slugs, setSlugs] = useState(router.currentSlugs);
  const [ctx, setCtx] = useState(() => new Ctx());

  //

  globalThis.ctx = ctx;
  
  //

  // router
  useEffect(() => {
    const slugschange = e => {
      const {
        slugs,
      } = e.data;
      console.log('slugs change', {slugs});
      setSlugs(slugs);
    };
    router.addEventListener('slugschange', slugschange);
    
    return () => {
      router.removeEventListener('slugschange', slugschange);
    };
  }, [router]);

  /* // load match
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
  }, []); */

  const mode = slugs?.[0] ?? '';
  const tab = slugs?.[1] ?? '';
  const name = slugs?.[2] ?? '';

  return (
    <div className={styles.container}>
      {(() => {
        switch (mode) {
          case '': {
            return (
              <SearchPage
                router={router}
                ctx={ctx}
                slugs={slugs}
              />
            );
          }
          case 'content': {
            switch (tab) {
              case 'character': {
                if (!name) {
                  return (
                    <ContentsPage
                      router={router}
                      ctx={ctx}
                      slugs={slugs}
                    />
                  );
                } else {
                  return (
                    <ContentPage
                      router={router}
                      ctx={ctx}
                      slugs={slugs}
                    />
                  );
                }
              }
              case 'setting': {
                if (!name) {
                  return (
                    <div className={styles.settings}>
                      Settings
                    </div>
                  );
                } else {
                  return (
                    <div className={styles.settings}>
                      Setting {name}
                    </div>
                  );
                }
              }
              default: {
                console.warn('unknown tab', tab);
                return null;
              }
            }
          }
          case 'specs': {
            return (
              <div className={styles.specs}>
                Specs for {tab}
              </div>
            );
          }
          default: {
            console.warn('unknown mode', mode);
            return null;
          }
        }
      })()}
    </div>
  );
};