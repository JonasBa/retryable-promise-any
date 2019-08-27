import "./App.css";
import React from "react";
import RetryStrategy, { RetryStrategyOptions } from "../../lib/index";

const SEARCH_KEY = "90ca3e16aa6c943e19903da80a0fed2d";
const APPLICATION_ID = "D8CTF91GO7";

const delayResolve = (wait: number, value: any[]) =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve(value);
    }, wait);
  });

const delayReject = (wait: number, value: any[]) =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve(value);
    }, wait);
  });

const search = (query: string, options: RetryStrategyOptions) => {
  console.log(query, options);
  return delayResolve(1000, [{ name: "Jonas" }, { name: "Marcele" }]);
};

const App: React.FC = () => {
  const [hits, setHits] = React.useState();

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    RetryStrategy(options => search(e.currentTarget.value, options)).then(
      data => {
        console.log(data);
        setHits(data);
      }
    );
  };

  return (
    <div className="App">
      <input onChange={onSearch} />
      {hits.map((hit: any) => hit.name)}
    </div>
  );
};

export default App;
