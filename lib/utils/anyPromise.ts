const anyPromise = <T>(promises: Array<Promise<T>>): Promise<T> => {
  if (promises.length === 1) {
    return promises[0];
  }
  return Promise.all(
    promises.map(promise => {
      return promise.then(value => Promise.reject(value), error => Promise.resolve(error));
    })
  ).then(errors => Promise.reject(errors), value => Promise.resolve<T>(value));
};

export default anyPromise;
