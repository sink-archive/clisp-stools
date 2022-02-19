import { asInteger, trueValue, Value, VM, VMFunction, VMScope, wrapFunc } from "cumlisp";
import { asFunc, asPromise, spread, wrapSync } from "../utils";

const promiseFuncs: Record<string, [number, (x: any) => Promise<any>]> = {
    "promise-all": [-1, Promise.all],
    "promise-allSettled": [-1, Promise.allSettled],
    "promise-any": [-1, Promise.any],
    "promise-race": [-1, Promise.race],
    "promise-reject": [1, spread(Promise.reject)],
    "promise-resolve": [1, spread(Promise.resolve)],
};

export default (vm: VM) => {
    const funcs: Record<string, VMFunction> = {};

    // add JS promise functions
    for (const key in promiseFuncs)
        funcs[key] = wrapSync(key, promiseFuncs[key][0], promiseFuncs[key][1]);

    vm.install({
        ...funcs,
        "promise-then": wrapFunc(
            "promise-then",
            2,
            async ([promise, callback], scope) =>
                asPromise(promise).then((v) =>
                    asFunc(callback /*, scope */)([v], scope)
                )
        ),
        "promise-catch": wrapFunc(
            "promise-catch",
            2,
            async ([promise, callback], scope) =>
                asPromise(promise).catch((v) =>
                    asFunc(callback /*, scope */)([v], scope)
                )
        ),
        "promise-finally": wrapFunc(
            "promise-finally",
            2,
            async ([promise, callback], scope) =>
                asPromise(promise).finally(() =>
                    asFunc(callback /*, scope */)([], scope)
                )
        ),
        await: wrapFunc("await", 1, async ([val]) => await val),

        "promise-delay": wrapSync(
            "promise-delay",
            1,
            ([duration]) =>
                new Promise((res) => {
                    setTimeout(() => res(trueValue), asInteger(duration));
                })
        ),
    });
};
