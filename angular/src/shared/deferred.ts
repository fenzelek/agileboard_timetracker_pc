export default class Deferred<Type> {
  promise: Promise<Type>;
  resolve: (value: Type) => void;
  reject: (reason: any) => void;

  constructor() {
    const _this = this;
    this.promise = new Promise((res, rej) => {
      _this.resolve = res;
      _this.reject = rej;
    });
  }
}

interface AllSettledResult {
  resolved: {
    [index: number]: any[];
  };
  rejected: {
    [index: number]: any[];
  };
}
/**
 * @description Returns promise that resolves after all promises completed (resolved or rejected)
 * @returns Wrap for results maps. One map for resolved, one for rejected. Map key is an index of provided promise. Value is an array of promise result values.
 */
export function allSettled(...promises: Promise<any>[]): Promise<AllSettledResult> {
  const def = new Deferred<AllSettledResult>();

  const result: AllSettledResult = {
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
