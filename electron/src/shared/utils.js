class Deferred {
  constructor() {
    const _this = this;
    this.promise = new Promise((res, rej) => {
      _this.resolve = res;
      _this.reject = rej;
    });
  }
  /* For IDE support */
  resolve() { }
  reject() { }
}

function allSettled(...promises) {
  const def = new Deferred();

  const result = {
    resolved: {},
    rejected: {},
  };
  const length = promises.length;
  let ended = 0;

  promises.forEach((promise, index) => {
    promise.then((...args) => {
      result.resolved[index] = args;
    }, (...args) => {
      result.rejected[index] = args;
    }).finally(() => {
      ended ++;
      if (ended === length) {
        def.resolve(result);
      }
    });
  });

  return def.promise;
}


module.exports = {
  Deferred,
  allSettled,
}