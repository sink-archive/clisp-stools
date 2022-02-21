import { asInteger, falseValue, Value, VM, VMFunction, wrapFunc } from "cumlisp";
import { asFunc, spread, wrapSync } from "../utils";

const wrappedPromiseSymbol = Symbol("STOOLS_LISP_PROMISE");
type WrappedPromise<T> = { [wrappedPromiseSymbol]: Promise<T> };

export const wrapPromise = <T>(promise: Promise<T>): WrappedPromise<T> => ({
  [wrappedPromiseSymbol]: promise,
});
export const unwrapPromise = <T>(promise: WrappedPromise<T>): Promise<T> =>
  promise[wrappedPromiseSymbol];

export const asUnwrappedPromise = (v: Value): Promise<any> => {
  // @ts-expect-error
  if (typeof v === "object" && v[wrappedPromiseSymbol] instanceof Promise)
    // @ts-expect-error
    return v[wrappedPromiseSymbol];
  throw new Error(`Value of kind ${v.constructor} is not a promise`);
};

const arrayPromiseFuncs: Record<
  string,
  (proms: Promise<any>[]) => Promise<any>
> = {
  "promise-all": Promise.all,
  "promise-allSettled": Promise.allSettled,
  "promise-any": Promise.any,
  "promise-reject": Promise.reject,
};

const singlePromiseFuncs: Record<string, (prom: Promise<any>) => Promise<any>> =
  {
    "promise-reject": Promise.reject,
    "promise-resolve": Promise.resolve,
  };

export default (vm: VM) => {
  const funcs: Record<string, VMFunction> = {};

  // add JS promise functions
  for (const key in arrayPromiseFuncs)
    funcs[key] = wrapSync(key, -1, (promises: WrappedPromise<any>[]) =>
      wrapPromise(arrayPromiseFuncs[key](promises.map(unwrapPromise)))
    );

  for (const key in singlePromiseFuncs)
    funcs[key] = wrapSync(
      key,
      -1,
      spread((promise: WrappedPromise<any>) =>
        wrapPromise(singlePromiseFuncs[key](unwrapPromise(promise)))
      )
    );

  vm.install({
    ...funcs,
    "promise-then": wrapFunc(
      "promise-then",
      2,
      async ([promise, callback], scope) =>
        wrapPromise(
          asUnwrappedPromise(promise).then((v) =>
            asFunc(callback, scope)(["", v], scope)
          )
        )
    ),
    "promise-catch": wrapFunc(
      "promise-catch",
      2,
      async ([promise, callback], scope) =>
        wrapPromise(
          asUnwrappedPromise(promise).catch((v) =>
            asFunc(callback, scope)(["", v], scope)
          )
        )
    ),
    "promise-finally": wrapFunc(
      "promise-finally",
      2,
      async ([promise, callback], scope) =>
        wrapPromise(
          asUnwrappedPromise(promise).finally(() =>
            asFunc(callback, scope)([""], scope)
          )
        )
    ),
    await: wrapFunc("await", 1, async ([val]) => await asUnwrappedPromise(val)),

    "promise-delay": wrapSync("promise-delay", 1, ([duration]) =>
      wrapPromise(
        new Promise((res) => {
          setTimeout(() => res(falseValue), asInteger(duration));
        })
      )
    ),
  });
};
