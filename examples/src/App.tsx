import './App.css';
import React from 'react';
import RetryStrategy, { RetryStrategyOptions } from 'retryable-promise-any';

const SEARCH_KEY = '90ca3e16aa6c943e19903da80a0fed2d';
const APPLICATION_ID = 'D8CTF91GO7';

const delayResolve = (wait: number, value: any[]): Promise<any[]> =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve(value);
    }, wait);
  });

const delayReject = (wait: number, value: any[]): Promise<any[]> =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve(value);
    }, wait);
  });

const search = (query: string, options: RetryStrategyOptions): Promise<any[]> => {
  console.log(options);
  return delayResolve(1500, [{ name: 'jonas' }, { name: 'jonas2' }]);
};

const App: React.FC = () => {
  const [hits, setHits] = React.useState<any[]>([]);

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    RetryStrategy(options => {
      return search(e.currentTarget.value, options).then(data => setHits(data));
    });
  };

  return (
    <div className="App">
      <input onChange={onSearch} />
      {hits.map((hit: any) => hit.name)}
    </div>
  );
};

export default App;
