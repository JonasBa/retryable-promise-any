const anyPromise = <T>(promises: Array<Promise<T>>): Promise<T> => {
  if (promises.length === 1) {
    return promises[0];
  }
  return Promise.all(
    promises.map(promise => {
      return promise.then(value => Promise.reject(value), error => Promise.resolve(error));
    })
  ).then(
    errors => {
      console.log('All errors:', errors);
      return Promise.reject(errors);
    },
    value => {
      console.log('All value:', value);
      return Promise.resolve(value);
    }
  );
};

export default anyPromise;
