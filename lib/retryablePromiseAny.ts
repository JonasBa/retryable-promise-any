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
  let cancelAllPending = false;

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

      const onError = (error: Response): Response => {
        clearTimeout(timeoutID);
        const shouldRetryRequest = shouldRetry(error);

        if (shouldRetryRequest && !cancelAllPending) {
          resolve(retry(pendingPromises));
        }

        if (!shouldRetryRequest && !cancelAllPending) {
          reject(error);
        }

        return error;
      };

      promise.catch(onError);

      anyPromise<T>(pendingPromises)
        .then(data => {
          cancelAllPending = true;
          clearTimeout(timeoutID);
          resolve(data);
        })
        .catch(reasons => {
          if (newRetryCount === maxRetryCount) {
            reject(reasons);
          }

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
