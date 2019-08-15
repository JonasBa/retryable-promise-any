const anyPromise = (promises: Array<Promise<any>>) => {
  return Promise.all(
    promises.map(promise => {
      // If a request fails, count that as a resolution so it will keep
      // waiting for other possible successes. If a request succeeds,
      // treat it as a rejection so Promise.all immediately bails out.
      return promise.then(
        value => Promise.reject(value),
        error => Promise.resolve(error)
      );
    })
  ).then(
    // If '.all' resolved, we've just got an array of errors.
    errors => Promise.reject(errors),
    // If '.all' rejected, we've got the result we wanted.
    value => Promise.resolve(value)
  );
};

export default anyPromise;
