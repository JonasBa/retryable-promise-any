import './App.css';
import React from 'react';
import retryable, { RetryCallbackOptions } from 'retryable-promise-any';

const delayResolve = (wait: number, value: any[]): Promise<any[]> =>
  new Promise(resolve => {
    setTimeout(() => {
      console.log(`resolve - ${wait}`);
      resolve(value);
    }, wait);
  });

const delayReject = (wait: number, value: any[]): Promise<any[]> =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(`reject - ${wait}`);
      reject(value);
    }, wait);
  });

const search = (query: string, options: RetryCallbackOptions): Promise<any[]> => {
  console.log(options.currentRetry);
  if (options.currentRetry === 0) {
    return delayResolve(1500, [{ name: 'jonas' }, { name: 'jonas2' }]);
  }
  return delayReject(0, { status: 408 } as any);
};

const App: React.FC = () => {
  const [hits, setHits] = React.useState<any[]>([]);

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.currentTarget.value;
    retryable(
      options => {
        return search(query, options).then(data => {
          setHits(data);
          return data;
        });
      },
      { timeout: 1000, maxRetryCount: 2 }
    );
  };

  console.log(hits);
  return (
    <div className="App">
      <input onChange={onSearch} />
      <div>{hits.map((hit: any) => hit.name)}</div>
    </div>
  );
};

export default App;
