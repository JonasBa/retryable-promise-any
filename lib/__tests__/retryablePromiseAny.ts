import retryablePromiseAny from '../retryablePromiseAny';
import { DEFAULT_RETRY_OPTIONS } from '../retryablePromiseAny';

const delayedResolve = (status: number, message: string, delay = 1000): Promise<unknown> => {
  if (status < 300) {
    return new Promise((resolve): void => {
      setTimeout(() => {
        resolve({ status, message });
      }, delay);
    });
  }
  return new Promise((_, reject): void => {
    setTimeout(() => {
      reject({ status, message });
    }, delay);
  });
};

describe('retryablePromiseAny', () => {
  describe('createPromise', () => {
    it('uses default options', async () => {
      const createPromise = jest.fn(() => Promise.resolve());
      await retryablePromiseAny(createPromise);

      expect(createPromise).toHaveBeenCalledWith({ ...DEFAULT_RETRY_OPTIONS, currentRetry: 0 });
    });

    it('increments currentRetry', async () => {
      const createPromise = jest
        .fn()
        .mockReturnValueOnce(delayedResolve(200, 'success', 3500))
        .mockReturnValueOnce(delayedResolve(408, 'dead', 1000))
        .mockReturnValueOnce(delayedResolve(200, 'last', 1000));

      await retryablePromiseAny(createPromise);

      expect(createPromise.mock.calls[0][0].currentRetry).toBe(0);
      expect(createPromise.mock.calls[1][0].currentRetry).toBe(1);
      expect(createPromise.mock.calls[2][0].currentRetry).toBe(2);
    });
  });

  it('waits for all to resolve', async () => {
    const createPromise = jest
      .fn()
      .mockReturnValueOnce(delayedResolve(408, 'Unauthorized', 200))
      .mockReturnValueOnce(delayedResolve(200, 'first success', 500));

    const data = await retryablePromiseAny(createPromise, {
      timeout: 500
    });

    expect(createPromise).toHaveBeenCalledTimes(2);
    expect(data).toEqual({ status: 200, message: 'first success' });
  });

  it('first request resolves in time', async () => {
    const createPromise = jest.fn().mockReturnValue(delayedResolve(200, 'first success', 100));

    const data = await retryablePromiseAny(createPromise, {
      timeout: 200
    });

    expect(createPromise).toHaveBeenCalledTimes(1);
    expect(data).toEqual({ status: 200, message: 'first success' });
  });

  it('first request errors and is not retryable', async () => {
    const createPromise = jest.fn().mockReturnValueOnce(delayedResolve(401, 'Unauthorized', 100));

    const data = await retryablePromiseAny(createPromise, {
      timeout: 500
    }).catch(e => e);

    expect(data).toEqual([{ message: 'Unauthorized', status: 401 }]);
    expect(createPromise).toHaveBeenCalledTimes(1);
  });

  it('first request errors and is retryable', async () => {
    const createPromise = jest
      .fn()
      .mockReturnValueOnce(delayedResolve(508, 'Unauthorized', 100))
      .mockReturnValueOnce(delayedResolve(200, 'Happy', 100))
      .mockReturnValueOnce(delayedResolve(200, 'Later Happy', 100));

    const data = await retryablePromiseAny(createPromise, {
      timeout: 500,
      shouldRetry: err => err.status === 508
    }).catch(e => e);

    expect(data).toEqual({ message: 'Happy', status: 200 });
    expect(createPromise).toHaveBeenCalledTimes(2);
  });

  it('all requests reject and status is always retryable', async () => {
    const createPromise = jest.fn().mockReturnValue(delayedResolve(408, 'dead', 150));

    const data = await retryablePromiseAny(createPromise, {
      timeout: 200
    }).catch(errors => errors);

    expect(data).toEqual([
      { status: 408, message: 'dead' },
      { status: 408, message: 'dead' },
      { status: 408, message: 'dead' },
      { status: 408, message: 'dead' }
    ]);
  });

  it('requests rejects and status is not retryable', async () => {
    const createPromise = jest.fn().mockReturnValue(delayedResolve(402, 'dead', 150));

    const errors = await retryablePromiseAny(createPromise, {
      timeout: 200
    }).catch(e => e);

    expect(createPromise).toHaveBeenCalledTimes(1);
    expect(errors).toEqual([{ status: 402, message: 'dead' }]);
  });

  it('first request is slow, but faster than retried one', async () => {
    const createPromise = jest
      .fn()
      .mockReturnValueOnce(delayedResolve(200, 'first resolve', 220))
      .mockReturnValueOnce(delayedResolve(200, 'second resolve', 320));

    const data = await retryablePromiseAny(createPromise, {
      maxRetryCount: 2,
      timeout: 200
    });

    expect(createPromise).toHaveBeenCalledTimes(2);
    expect(data).toEqual({ status: 200, message: 'first resolve' });
  });

  it('first request is slow, retried one is faster', async () => {
    const createPromise = jest
      .fn()
      .mockReturnValueOnce(delayedResolve(200, 'first resolve', 800))
      .mockReturnValueOnce(delayedResolve(200, 'second resolve', 100));

    const data = await retryablePromiseAny(createPromise, { timeout: 200 });
    expect(createPromise).toHaveBeenCalledTimes(2);
    expect(data).toEqual({ status: 200, message: 'second resolve' });
  });

  it('first request is slow, retried one times out', async () => {
    const createPromise = jest
      .fn()
      .mockReturnValueOnce(delayedResolve(200, 'first resolve', 250))
      .mockReturnValueOnce(delayedResolve(408, 'last reject', 50));

    const data = await retryablePromiseAny(createPromise, { timeout: 200, maxRetryCount: 2 }).catch(e => e);
    expect(createPromise).toHaveBeenCalledTimes(2);
    expect(data).toEqual({ status: 200, message: 'first resolve' });
  });

  it('retries if first one times out', async () => {
    const createPromise = jest
      .fn()
      .mockReturnValueOnce(delayedResolve(408, 'first reject', 100))
      .mockReturnValueOnce(delayedResolve(200, 'second resolve', 10));

    const data = await retryablePromiseAny(createPromise, { timeout: 200 });
    expect(data).toEqual({ status: 200, message: 'second resolve' });
    expect(createPromise).toHaveBeenCalledTimes(2);
  });
});
