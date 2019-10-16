import React from 'react';
import retryable from 'retryable-promise-any';

import SearchBar from '../components/SearchBar';
import Result from '../components/Result';
import NoResults from '../components/NoResults';
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

const SlowConnection: React.FC = () => {
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

    fetch(`http://localhost:3001/slow?howSlow=3000&query=${query}&nbHits=20`)
      .then(data => data.json())
      .then(data => {
        setNoRetryResults({ error: null, isLoading: false, results: data.results });
      });

    retryable(
      options => {
        const nbHits = Math.round(20 / (options.currentRetry + 1));
        if (options.currentRetry === 0) {
          return fetch(`http://localhost:3001/failure?howSlow=3000`).then(data => {
            if (!data.ok) throw data;
          });
        }

        return fetch(`http://localhost:3001/slow?howSlow=500&query=${query}&nbHits=${nbHits}`).then(data =>
          data.json()
        );
      },
      {
        timeout: 1000,
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
        <h1>When the network is slow</h1>
      </div>
      <div className="Search">
        <div className="Search_container">
          <SearchBar value={query} onChange={onChangeHandler} placeholder="I fetch 20 results and wait" />
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
          <SearchBar value={query} onChange={onChangeHandler} placeholder="I start with 20, then 10, 7..." />
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

export default SlowConnection;
