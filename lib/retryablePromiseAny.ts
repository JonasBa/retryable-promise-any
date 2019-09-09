import anyPromise from './utils/anyPromise';

type RetryStrategyOptions = {
  timeout: number;
  retryCount: number;
  retryStatuses: number[];
};

type PartialRetryStrategyOptions = {
  [T in keyof RetryStrategyOptions]?: RetryStrategyOptions[T];
};

const DEFAULT_RETRY_OPTIONS = {
  retryCount: 4,
  retryStatuses: [408, 504],
  timeout: 500
};

const retryablePromiseAny = <T>(
  createPromise: (options: RetryStrategyOptions) => Promise<T>,
  options: PartialRetryStrategyOptions = DEFAULT_RETRY_OPTIONS
): Promise<T> => {
  const timeout = options.timeout || DEFAULT_RETRY_OPTIONS.timeout;
  const retryCount = options.retryCount || DEFAULT_RETRY_OPTIONS.retryCount;
  const retryStatuses = options.retryStatuses || DEFAULT_RETRY_OPTIONS.retryStatuses;

  const retry = (retryQueue: Array<Promise<T>>): Promise<T> => {
    const currentRetryCount = retryQueue.length + 1;

    if (currentRetryCount > retryCount) {
      console.log('Exceeded timeouts, return a race of what is left');
      return anyPromise(retryQueue);
    }

    return new Promise<T>((resolve, reject): void => {
      const promise = createPromise({ timeout, retryCount, retryStatuses });
      retryQueue.push(promise);

      const delay = currentRetryCount * timeout;
      console.log('New timeout is', delay);

      const timeoutID = setTimeout(() => {
        console.log('Retry because of timeout');
        resolve(retry(retryQueue));
      }, delay);

      promise.catch(error => {
        console.log('Caught in promise.catch', error.message, 'checking if we can retry');
        clearTimeout(timeoutID);
        console.log('Cleared timeout');

        if (retryStatuses.includes(error.status)) {
          console.log('Retry because of error', error.status);
          return resolve(retry(retryQueue));
        }

        console.log('Not retryable, rejecting');
        reject(error);
      });

      console.log('Race all promises');
      anyPromise<T>(retryQueue)
        .then(data => {
          console.log('Race resolved with', data);
          clearTimeout(timeoutID);
          resolve(data);
        })
        .catch(reasons => {
          console.log('Caught in anyRace');
          if (currentRetryCount === retryCount) {
            console.log('Any has exceeded retries');
            reject(reasons);
          }
          console.log('Return reasons', reasons);
          return reasons;
        });
    }).catch(e => {
      // Normalize to always return array of reasons
      // even if first request fails and is not retryable
      throw Array.isArray(e) ? e : [e];
    });
  };

  return retry([]);
};

export default retryablePromiseAny;
