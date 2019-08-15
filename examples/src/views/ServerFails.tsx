import React from 'react';
import SearchBar from '../components/SearchBar';

import retryable from 'retryable-promise-any';
import Result from '../components/Result';
import Error from '../components/Error';

import './ServerFails.scss';
import NoResults from '../components/NoResults';

export interface ResultState {
  error: { message: string; status: number } | null;
  isLoading: boolean;
  results: any[] | null;
}

const DEFAULT_STATE: ResultState = {
  error: null,
  isLoading: false,
  results: null
};

const ServerFails: React.FC = () => {
  const [value, setValue] = React.useState('');

  const [noRetryResults, setNoRetryResults] = React.useState<ResultState>(DEFAULT_STATE);
  const [retryResults, setRetryResults] = React.useState<ResultState>(DEFAULT_STATE);

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    fetch('http://localhost:3001/failure?howSlow=500')
      .then(error => error.json())
      .then(error => {
        setNoRetryResults({ error, isLoading: false, results: [] });
      });

    const query = e.currentTarget.value;

    retryable(
      options => {
        if (options.currentRetry === 0) {
          return fetch('http://localhost:3001/failure?howSlow=200').then(data => {
            if (!data.ok) return Promise.reject(data);
            return Promise.resolve(data);
          });
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
        timeout: 500,
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
          {noRetryResults.results && !noRetryResults.results.length && !noRetryResults.error && <NoResults />}
          {noRetryResults.error ? (
            <Error message={noRetryResults.error.message} />
          ) : (
            <div className="SearchResults">
              {(noRetryResults.results || []).map(hit => (
                <Result key={hit.objectID} />
              ))}
            </div>
          )}
        </div>

        <div className="Search_container">
          <SearchBar value={value} onChange={onChangeHandler} />
          {retryResults.results && !retryResults.results.length && !retryResults.error && <NoResults />}
          {retryResults.error ? (
            <Error message={retryResults.error.message} />
          ) : (
            <div className="SearchResults">
              {(retryResults.results || []).map(hit => (
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
