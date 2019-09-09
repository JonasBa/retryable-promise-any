const anyPromise = (promises: Array<Promise<any>>) => {
  if (promises.length === 1) {
    console.log("Returning first promise");
    return promises[0];
  }
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
    errors => {
      console.log("All errors:", errors);
      return Promise.reject(errors);
    },
    // If '.all' rejected, we've got the result we wanted.
    value => {
      console.log("All value:", value);
      return Promise.resolve(value);
    }
  );
};

export default anyPromise;
