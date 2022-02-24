import {
  asBoolean,
  asInteger,
  asString,
  falseValue,
  trueValue,
  Value,
  VMFunction,
  VMScope,
  wrapFunc,
} from "cumlisp";

// converts a value to the lisp true and false values based on its JS truthiness
export const CONV_TO_BOOL = (x: Value) =>
  asBoolean(x) ? trueValue : falseValue;

// attempts to convert a value to a float
export const asFloat = (x: Value) => {
  try {
    return asInteger(x);
  } catch (e) {
    return parseFloat(x.toString());
  }
};

// like wrapFunc but doesnt require returning a promise
// we can just make our function async, but we do sync stuff so much in this lib
// that its easier to just wrap it
export const wrapSync = (
  name: string,
  argCount: number,
  func: (args: Value[], scope: VMScope) => Value
) =>
  wrapFunc(name, argCount, (args, scope) => Promise.resolve(func(args, scope)));

// wraps a function to spread the first argument into the original
// useful when passing lisp arguments directly into a JS function
export const spread =
  <T, R>(func: (...args: T[]) => R) =>
  (args: T[]) =>
    func(...args);

const asPromise = (v: Value): Promise<Value> => {
  if (v instanceof Promise) return v;
  throw new Error(`Value of kind ${v.constructor} is not a promise`);
};

// attempts to get the value as a function
export function asFunc(v: Value, scope?: VMScope): VMFunction {
  // @ts-expect-error theres no way for us to know this is a vm func, but if this is being passed
  // a function that isnt a vm func you are using this function very wrong
  if (typeof v === "function") return v;

  if (scope) {
    let fName;
    try {
      fName = asString(v);
    } catch {
      throw new Error(
        `Value of kind ${v.constructor} not a function and not a string`
      );
    }
    const f = scope.getFunction(fName);
    if (f) return f;

    throw new Error(`Function with name ${fName} does not exist in that scope`);
  }

  throw new Error(`Value of kind ${v.constructor} not convertible to function`);
}

const wrappedPromiseSymbol = Symbol("STOOLS_LISP_PROMISE");
export type WrappedPromise<T> = { [wrappedPromiseSymbol]: Promise<T> };

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