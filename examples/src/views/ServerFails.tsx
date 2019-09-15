import React from 'react';
import SearchBar from '../components/SearchBar';

import retryable from 'retryable-promise-any';
import Result from '../components/Result';
import Error from '../components/Error';

import './ServerFails.scss';

export interface ResultState {
  error: { message: string; status: number } | null;
  isLoading: boolean;
  results: any[];
}

const DEFAULT_STATE: ResultState = {
  error: null,
  isLoading: false,
  results: []
};

const ServerFails: React.FC = () => {
  const [value, setValue] = React.useState('');

  const [noRetryResults, setNoRetryResults] = React.useState<ResultState>(DEFAULT_STATE);
  const [retryResults, setRetryResults] = React.useState<ResultState>(DEFAULT_STATE);

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    fetch('http://localhost:3001/failure?howSlow=500')
      .then(error => error.json())
      .then(data => {
        setNoRetryResults({ error: data, isLoading: false, results: [] });
      });

    const query = e.currentTarget.value;
    retryable(
      ({ currentRetry }) => {
        console.log(currentRetry);
        if (currentRetry === 0) {
          return fetch('http://localhost:3001/failure?howSlow=500').then(resp => {
            if (resp.ok) return resp;
            throw resp;
          }) as any;
        }
        return fetch(`http://localhost:3001/other-server?query=${query}`)
          .then(data => data.json())
          .then(data => {
            setRetryResults({
              error: null,
              isLoading: false,
              results: data.results
            });
            return data;
          });
      },
      {
        timeout: 1000,
        maxRetryCount: 3,
        shouldRetry: error => [503].includes(error.status)
      }
    );

    setValue(e.currentTarget.value);
  };

  return (
    <>
      <div className="Title">
        <h1>Querying a busy server</h1>
      </div>
      <div className="Search">
        <div className="Search_container">
          <SearchBar value={value} onChange={onChangeHandler} />
          {noRetryResults.error ? (
            <Error message={noRetryResults.error.message} />
          ) : (
            <div className="SearchResults">
              {noRetryResults.results.map(hit => (
                <Result key={hit.objectID} />
              ))}
            </div>
          )}
        </div>

        <div className="Search_container">
          <SearchBar value={value} onChange={onChangeHandler} />
          {retryResults.error ? (
            <Error message={retryResults.error.message} />
          ) : (
            <div className="SearchResults">
              {retryResults.results.map(hit => (
                <Result key={hit.objectID} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ServerFails;
