import retryablePromiseAny from '../retryablePromiseAny';

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
  afterEach(() => {
    jest.useRealTimers();
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
      timeout: 200
    }).catch(e => e);

    expect(data).toEqual([{ message: 'Unauthorized', status: 401 }]);
    expect(createPromise).toHaveBeenCalledTimes(1);
  });

  it('all requests reject and status is retryable', () => {
    const createPromise = jest.fn().mockReturnValue(delayedResolve(408, 'dead', 150));

    return retryablePromiseAny(createPromise, {
      timeout: 200
    }).catch(errors => {
      expect(errors).toEqual([
        { status: 408, message: 'dead' },
        { status: 408, message: 'dead' },
        { status: 408, message: 'dead' },
        { status: 408, message: 'dead' }
      ]);
    });
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
      retryCount: 2,
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

  it('first request is slow, retried one times out', () => {
    jest.useFakeTimers();
    const createPromise = jest
      .fn()
      .mockReturnValueOnce(delayedResolve(200, 'first resolve', 250))
      .mockReturnValueOnce(delayedResolve(408, 'last reject', 50));

    retryablePromiseAny(createPromise, { timeout: 200, retryCount: 2 }).then(data => {
      expect(createPromise).toHaveBeenCalledTimes(2);
      expect(data).toEqual({ status: 200, message: 'first resolve' });
    });

    jest.advanceTimersByTime(300);
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
