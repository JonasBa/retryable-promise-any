import React from 'react';
import retryable from 'retryable-promise-any';

import SearchBar from '../components/SearchBar';
import NoResults from '../components/NoResults';
import Result from '../components/Result';
import Error from '../components/Error';
import Loader from '../components/Loader';

import './ServerFails.scss';

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
  const [query, setQuery] = React.useState('');
  const [noRetryResults, setNoRetryResults] = React.useState<ResultState>(DEFAULT_STATE);
  const [retryResults, setRetryResults] = React.useState<ResultState>(DEFAULT_STATE);

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.currentTarget.value);
  };

  React.useEffect(() => {
    if (!query) {
      setNoRetryResults(DEFAULT_STATE);
      setRetryResults(DEFAULT_STATE);
      return;
    }
    setNoRetryResults({ ...DEFAULT_STATE, isLoading: true });
    setRetryResults({ ...DEFAULT_STATE, isLoading: true });

    fetch('http://localhost:3001/failure?howSlow=500')
      .then(error => error.json())
      .then(error => {
        setNoRetryResults({ error, isLoading: false, results: [] });
      });

    retryable(
      options => {
        if (options.currentRetry === 0) {
          return fetch('http://localhost:3001/failure?howSlow=200').then(data => {
            if (!data.ok) throw data;
            return Promise.resolve(data);
          });
        }
        return fetch(`http://localhost:3001/other-server?query=${query}`).then(data => data.json());
      },
      {
        timeout: 500,
        shouldRetry: error => [503].includes(error.status)
      }
    ).then(data => {
      setRetryResults({
        error: null,
        isLoading: false,
        results: data.results
      });
      return data;
    });
  }, [query]);

  return (
    <>
      <div className="Title">
        <h1>Querying a struggling server 🤷🏻‍♂️</h1>
      </div>
      <div className="Search">
        <div className="Search_container">
          <SearchBar value={query} onChange={onChangeHandler} placeholder="I don't care if I fail" />
          {noRetryResults.results && !noRetryResults.results.length && !noRetryResults.error && <NoResults />}
          {noRetryResults.error && <Error message={noRetryResults.error.message} />}
          {noRetryResults.isLoading && <Loader />}
          {noRetryResults.results && (
            <div className="SearchResults">
              {(noRetryResults.results || []).map(hit => (
                <Result key={hit.objectID} />
              ))}
            </div>
          )}
        </div>

        <div className="Search_container">
          <SearchBar value={query} onChange={onChangeHandler} placeholder="I will retry on another server" />
          {retryResults.results && !retryResults.results.length && !retryResults.error && <NoResults />}
          {retryResults.error && <Error message={retryResults.error.message} />}
          {retryResults.isLoading && <Loader />}
          {retryResults.results && (
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
