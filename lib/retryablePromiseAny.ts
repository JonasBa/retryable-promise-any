import anyPromise from './utils/anyPromise';

type RetryStrategyOptions = {
  timeout?: number;
  retryCount?: number;
  retryStatuses?: number[];
};

type RetryStrategyCallbackOptions = RetryStrategyOptions & { currentRetry: number };

export const DEFAULT_RETRY_OPTIONS = {
  retryCount: 4,
  retryStatuses: [408, 504],
  timeout: 500
};

const retryablePromiseAny = <T>(
  createPromise: (options: RetryStrategyCallbackOptions) => Promise<T>,
  options: RetryStrategyOptions = {}
): Promise<T> => {
  const timeout = options.timeout || DEFAULT_RETRY_OPTIONS.timeout;
  const retryCount = options.retryCount || DEFAULT_RETRY_OPTIONS.retryCount;
  const retryStatuses = options.retryStatuses || DEFAULT_RETRY_OPTIONS.retryStatuses;

  const retry = (pendingPromises: Array<Promise<T>>): Promise<T> => {
    const newRetryCount = pendingPromises.length + 1;

    if (newRetryCount > retryCount) {
      // Exceeded timeout count, return Promise.any
      return anyPromise(pendingPromises);
    }

    return new Promise<T>((resolve, reject): void => {
      const promise = createPromise({ timeout, retryCount, retryStatuses, currentRetry: pendingPromises.length });
      pendingPromises.push(promise);

      const timeoutID = setTimeout(() => {
        resolve(retry(pendingPromises));
      }, newRetryCount * timeout);

      promise.catch(error => {
        clearTimeout(timeoutID);

        if (retryStatuses.includes(error.status)) {
          return resolve(retry(pendingPromises));
        }

        reject(error);
      });

      anyPromise<T>(pendingPromises)
        .then(resolve)
        .catch(reasons => {
          if (newRetryCount === retryCount) {
            reject(reasons);
          }

          return reasons;
        })
        .finally(() => clearTimeout(timeoutID));
    }).catch(e => {
      // Normalize to always return array of reasons
      // even if first request fails and is not retryable
      throw Array.isArray(e) ? e : [e];
    });
  };

  return retry([]);
};

export default retryablePromiseAny;
