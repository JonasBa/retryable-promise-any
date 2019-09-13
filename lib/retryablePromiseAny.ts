import anyPromise from './utils/anyPromise';

export type RetryOptions = {
  timeout?: number;
  maxRetryCount?: number;
  shouldRetry?: (error: Response) => boolean;
  computeTimeout?: (currentRetry: number) => number;
};

export type RetryCallbackOptions = RetryOptions & { currentRetry: number };

export const DEFAULT_RETRY_OPTIONS = {
  timeout: 500,
  maxRetryCount: 4,
  shouldRetry: (error: Response): boolean => [408, 504].includes(error.status)
};

const retryablePromiseAny = <T>(
  createPromise: (options: RetryCallbackOptions) => Promise<T>,
  options: RetryOptions = {}
): Promise<T> => {
  const timeout = options.timeout || DEFAULT_RETRY_OPTIONS.timeout;
  const maxRetryCount = options.maxRetryCount || DEFAULT_RETRY_OPTIONS.maxRetryCount;
  const shouldRetry = options.shouldRetry || DEFAULT_RETRY_OPTIONS.shouldRetry;

  const retry = (pendingPromises: Array<Promise<T>>): Promise<T> => {
    const newRetryCount = pendingPromises.length + 1;

    if (newRetryCount > maxRetryCount) {
      // Exceeded timeout count, return Promise.any
      return anyPromise(pendingPromises);
    }

    return new Promise<T>((resolve, reject): void => {
      const promise = createPromise({ timeout, maxRetryCount, shouldRetry, currentRetry: pendingPromises.length });
      pendingPromises.push(promise);

      const timeoutID = setTimeout(() => {
        resolve(retry(pendingPromises));
      }, newRetryCount * timeout);

      promise.catch(error => {
        clearTimeout(timeoutID);
        const shouldRetryRequest = shouldRetry(error);

        if (shouldRetryRequest) {
          resolve(retry(pendingPromises));
        }

        if (!shouldRetryRequest) {
          reject(error);
        }

        return error;
      });

      anyPromise<T>(pendingPromises)
        .then(resolve)
        .catch(reasons => {
          if (newRetryCount === maxRetryCount) {
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
