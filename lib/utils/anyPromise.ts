const anyPromise = <T>(promises: Array<Promise<T>>): Promise<T> => {
  return Promise.all(
    promises.map(promise => {
      return promise.then(value => Promise.reject(value), error => Promise.resolve(error));
    })
  ).then(errors => Promise.reject(errors), value => Promise.resolve<T>(value));
};

export default anyPromise;
