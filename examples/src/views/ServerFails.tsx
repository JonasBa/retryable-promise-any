import React from 'react';
import SearchBar from '../components/SearchBar';

import retryable from 'retryable-promise-any';

interface ResultState {
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
    fetch('http://localhost:3001/failure')
      .then(error => error.json())
      .then(data => {
        setNoRetryResults({ error: data, isLoading: false, results: [] });
      });

    retryable(
      ({ currentRetry }) => {
        if (currentRetry === 0) {
          return fetch('http://localhost:3001/failure').then(resp => {
            if (resp.ok) return resp;
            throw resp;
          }) as any;
        }
        return fetch('http://localhost:3001/other-server')
          .then(data => data.json())
          .then(data => {
            setRetryResults({
              error: null,
              isLoading: false,
              results: data.results
            });
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
    <div className="Search">
      <SearchBar value={value} onChange={onChangeHandler} />
      <div className="SearchResults">
        {noRetryResults.error ? noRetryResults.error.message : noRetryResults.results.map(hit => hit.name)}
      </div>

      <SearchBar value={value} onChange={onChangeHandler} />
      <div className="SearchResults">{retryResults.results.map(hit => hit.name)}</div>
    </div>
  );
};

export default ServerFails;
